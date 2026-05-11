# Specification: Mandate Strict JSON Output Validation

## Problem Statement

Agents in SigmaNotebookV2 generate JSON outputs (triage verdicts, containment decisions, remediation status) that are consumed by subsequent cells without validation. Common failure modes:

- **Missing fields**: Agent returns `{"verdict": "true_positive"}` but cell expects `{"verdict": "...", "confidence": "...", "risk_score": ...}`
- **Wrong types**: Agent returns `"risk_score": "0.85"` (string) but code calls `float(obj['risk_score'])` → TypeError
- **Invalid enum values**: Agent returns `{"verdict": "maybe"}` but only `true_positive|false_positive|benign` are valid
- **Hallucination loops**: Agent retries without constraint, eventually succeeds with nonsense data like `{"verdict": "unknown", "risk_score": 99999}`

**Impact:**

- Downstream cells receive corrupted state, make wrong decisions
- Agent retry loops waste compute without improving quality
- Silent failures downstream make debugging difficult
- Operators don't know if failures are data quality or logic errors

---

## Goals

1. **Prevent malformed data** from entering the shared execution state
2. **Immediate visibility** into validation failures via audit logging
3. **Automatic agent self-correction** through explicit error feedback
4. **Max bounded retries** (default 3) to prevent infinite loops
5. **Production-ready notebooks** with embedded schemas and validation code

---

## Functional Requirements

### R1: Schema Definition and Registry

**R1.1 — Pydantic-Based Schemas**

- Each agentic cell has a corresponding Pydantic dataclass defining its output shape
- Examples:
  - **EvidenceTriage** (Cell 3): `alert_id`, `verdict` (enum), `confidence` (enum), `risk_score` (0.0-1.0)
  - **ContainmentDecision** (Cell 4): `containment_type`, `affected_assets` (list), `reversibility`, `required_approval` (bool)
  - **RemediationStatus** (Cell 5): `action_id`, `status` (enum), `evidence_collected` (list of dicts), `failure_reason` (optional)

**R1.2 — Global Registry**

- `JSONSchemaRegistry` maps cell IDs to Pydantic classes
- Accessible at runtime: `JSONSchemaRegistry.get_schema_for_cell("cell_3_triage")` → `EvidenceTriage`
- All schemas exported to notebook metadata for persistence

**R1.3 — Enum Constraints**

- Decision verdicts: `true_positive | false_positive | benign | requires_investigation`
- Containment types: `isolate | quarantine | terminate | monitor`
- Status values: `pending | in_progress | completed | failed | rolled_back`
- Confidence levels: `high | medium | low`

---

### R2: Runtime Validation

**R2.1 — Validation on Agent Output**

- After agent cell completes, before next cell starts, validate raw output:
  1. Parse as JSON
  2. Validate required fields exist
  3. Validate types match schema
  4. Validate enum values are in allowed set
  5. If all pass → return parsed dict, continue to next cell
  6. If any fail → extract error details → prepare retry

**R2.2 — Error Details**

- **Missing field**: "Field 'risk_score' is required but missing"
- **Wrong type**: "Field 'confidence' should be string enum (high|medium|low), got int"
- **Invalid enum**: "Field 'verdict' must be one of [true_positive, false_positive, benign], got 'unknown'"
- **Parsing error**: "Output is not valid JSON: expected ':' at line 2 column 5"

**R2.3 — Validation Performance**

- Median validation latency: <50ms (using pydantic.parse_obj_as)
- Cache schema definitions in module memory (one-time load)
- No external API calls during validation

---

### R3: Automatic Retry with Error Feedback

**R3.1 — Retry Loop**

```
Attempt 1: Call agent → Validate → If valid, return
          If invalid → Extract error message
Attempt 2: Call agent again with error feedback in prompt → Validate → If valid, return
          If invalid → Extract error message
Attempt 3: Call agent with error feedback → Validate → If valid, return
          If invalid → Raise ValidationError, escalate to human
```

**R3.2 — Explicit Error Feedback Prompt**
Agent sees on retry:

```
Your previous response did not conform to the required JSON schema.

Validation errors:
- Field 'risk_score' is required but missing
- Field 'confidence' should be string enum (high|medium|low), got int

Please respond with ONLY valid JSON matching this structure:
{EvidenceTriage schema definition}

Example valid response:
{
  "alert_id": "alert_123",
  "verdict": "true_positive",
  "confidence": "high",
  "risk_score": 0.92,
  "reasoning": "...",
  "next_action": "..."
}
```

**R3.3 — Retry Configuration**

- Default max retries: 3
- Backoff between retries: 2 seconds (optional exponential backoff)
- Configurable per cell: `SigmaNotebookV2(max_retries_triage=3, max_retries_containment=2)`

---

### R4: Validation Failure Audit Logging

**R4.1 — Failure Event Logging**
Each validation failure creates an entry in `incident_state['_validation_failures']`:

```json
{
  "timestamp": "2023-04-26T14:30:00Z",
  "cell_id": "cell_3_triage",
  "attempt": 1,
  "error_type": "missing_field",
  "error_message": "Field 'risk_score' is required but missing",
  "raw_output_preview": "{ \"alert_id\": \"alert_123\", \"verdict\": \"true_positive\" }",
  "resolved_on_attempt": 2
}
```

**R4.2 — Destinations**

- In-notebook: `incident_state['_validation_failures']` array
- Slack notification: `#soc-automation` channel (on max retries failure or nth retry)
- Incident ticket: Jira ticket attachment with full validation history
- SIEM event: `security.event.validation_failure` with schema_name, cell_id, error_count

**R4.3 — Retention**

- Notebook-embedded history survives notebook close/reopen
- Jira ticket maintains permanent audit trail
- SIEM events searchable for trend analysis

---

### R5: Generator Integration

**R5.1 — SigmaNotebookV2.py**

- Cell 0 (Setup): Import `OutputValidator`, schema classes, configure max retries
- Cell 3 (Evidence Triage): Wrap GRR agent call with `validate_and_retry()`, store schema in metadata
- Cell 4 (Containment): Same validation wrapper, ContainmentDecision schema
- Cell 5 (Remediation): Same validation wrapper, RemediationStatus schema
- Cell 7 (Postmortem): Display validation failure timeline + agent feedback history

**R5.2 — SigmaNotebook.py (Jupyter V1)**

- Bootstrap cell: Define schemas and import validator
- Agent injection cells: Wrap agent invocation with validation code block
- Output display: Show schema and validation count in cell output

**R5.3 — MarimoNotebook.py (Reactive)**

- Pre-agent cell: `@reactive` cell that validates input parameters
- Reactive validation: Validation failures trigger marimo alert
- DAG constraint: Agent cell is blocked until prior cell output validates

**R5.4 — CacaoSidecar.py (Declarative)**

- Add `schema_validation_config` field to CACAO playbook:
  ```json
  {
    "schema_validation_config": {
      "enabled": true,
      "schemas": [
        { "step_id": "step_3_triage", "schema_uri": "...", "max_retries": 3 },
        {
          "step_id": "step_4_containment",
          "schema_uri": "...",
          "max_retries": 2
        }
      ],
      "failure_handling": "escalate_to_human"
    }
  }
  ```

---

## Non-Functional Requirements

### NF1: Performance

| Metric                                | Target       | Rationale                    |
| ------------------------------------- | ------------ | ---------------------------- |
| Validation latency (single output)    | <50ms        | Non-blocking validation      |
| Retry cycle time (agent + validation) | <5s (median) | Keep operators engaged       |
| Schema registry load time             | <100ms       | One-time at notebook startup |

### NF2: Maintainability

- Schemas defined once in `src/runtime/json_output_schemas.py`
- Reused across all 4 generator types
- Tests verify schema definitions match generator expectations
- Documentation auto-generated from schema docstrings

### NF3: Observability

- All validation events logged (success + failure)
- Validation metrics exported: `validation_success_rate`, `mean_retries_per_cell`, `max_retry_escalations`
- Accessible via incident timeline: "3 validation failures on Cell 3, all resolved by attempt 2"

---

## Example Walkthrough

### Scenario: False Positive Triage Verdict

**Cell 3 Execution:**

1. Agent output (attempt 1): `{"alert_id": "123", "verdict": "true_positive"}` (missing required fields)
2. Validation fails: Missing `confidence`, `risk_score`, `reasoning`, `next_action`
3. Error feedback sent to agent
4. Agent output (attempt 2): `{"alert_id": "123", "verdict": "true_positive", "confidence": "high", "risk_score": 0.88, "reasoning": "...", "next_action": "escalate_to_soc"}`
5. Validation passes
6. Log entry: `{"timestamp": "...", "cell_id": "cell_3_triage", "attempt": 1, "error_type": "missing_fields", "resolved_on_attempt": 2}`
7. Proceed to Cell 4

**Cell 7 Output (Postmortem):**

```
📋 Validation History:
Cell 3 (Evidence Triage): 1 failure, resolved on retry 1 ✓
Cell 4 (Containment): 0 failures ✓
Cell 5 (Remediation): 0 failures ✓
```

---

## Test Specifications

### Unit Tests (src/runtime/)

1. **test_schemas.py**
   - `test_evidence_triage_valid()` — EvidenceTriage with all required fields passes
   - `test_evidence_triage_missing_field()` — Missing risk_score fails with clear message
   - `test_evidence_triage_wrong_type()` — risk_score="0.9" (str) fails
   - `test_containment_decision_enum()` — Invalid containment_type fails
   - `test_remediation_status_datetime()` — Invalid ISO 8601 timestamp fails

2. **test_output_validator.py**
   - `test_validate_pass()` — Valid JSON passes validation
   - `test_validate_fail_missing_field()` — Missing required field fails
   - `test_validate_fail_wrong_type()` — Type mismatch fails
   - `test_validate_json_parse_error()` — Malformed JSON fails with parse error
   - `test_retry_loop_success_on_2nd()` — Agent fails attempt 1, succeeds attempt 2
   - `test_retry_loop_exhausted()` — Max retries exceeded raises ValidationError
   - `test_error_feedback_message()` — Retry prompt includes schema and examples
   - `test_audit_logging()` — Failure logged to incident_state['_validation_failures']
   - `test_performance_<50ms()` — Single validation completes in <50ms

### Integration Tests (tests/)

3. **test_sigmanotebookv2_validation.py**
   - `test_cell_3_validation()` — Cell 3 agent output validated against EvidenceTriage
   - `test_cell_4_validation()` — Cell 4 agent output validated against ContainmentDecision
   - `test_cell_5_validation()` — Cell 5 agent output validated against RemediationStatus
   - `test_notebook_includes_schemas()` — Generated notebook has all schemas in metadata
   - `test_validation_failure_creates_incident_ticket()` — Jira ticket created on max retries

4. **test_marimo_validation.py**
   - `test_reactive_validation()` — Marimo reactive cell validates before agent runs
   - `test_validation_blocks_downstream()` — Invalid output blocks downstream cells

5. **test_cacao_sidecar_validation.py**
   - `test_cacao_schema_config()` — CACAO playbook includes schema_validation_config
   - `test_cacao_step_schema_matching()` — Each step has corresponding schema

---

## Edge Cases & Handling

| Edge Case                                              | Handling                                                                     |
| ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Agent returns empty JSON `{}`                          | Validation fails: missing all required fields, retry with full schema prompt |
| Agent returns non-JSON (e.g., markdown)                | Validation fails: parse error, retry with explicit "respond with JSON only"  |
| Agent hallucinates valid structure but nonsense values | Enum validation catches invalid enum values, retry                           |
| Risk score outside 0.0-1.0 range                       | Type validation catches out-of-range, retry                                  |
| Retry always produces same invalid output              | Max retries exhausted after 3 attempts, escalate to human                    |
| Unicode in string fields                               | Valid, preserved in JSON                                                     |

---

## Success Criteria

✅ All agent cell outputs validated before use
✅ 80%+ of validation failures resolved within 2 retries
✅ 100% audit trail for all validation events
✅ <50ms validation latency per output
✅ Clear, actionable error messages guide agent self-correction
✅ Operators see validation status in postmortem cell
