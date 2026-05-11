# Implementation Plan: Mandate Strict JSON Output Validation

## Context

Agents generate JSON artifacts (triage decisions, containment recommendations, remediation status) that subsequent cells depend on. Malformed outputs (missing fields, wrong types, invalid enums) cause silent failures downstream or unpredictable agent hallucination loops. This plan introduces mandatory schema validation for every agentic cell output.

---

## Feature Overview

**Objective:** Intercept all agent cell outputs, validate against Pydantic schemas, and enforce retry loops until the output conforms or max retries exhausted.

**Scope:**

- Define JSON schemas for each cell type (evidence triage, containment decision, remediation status)
- Validation wrapper in all 4 playbook generators
- Automatic retry with explicit error feedback to agents
- Audit logging of validation failures

**Success Criteria:**

- All agent outputs validated before use
- Failed validations trigger agent retry (max 3 attempts)
- 100% of generated notebooks have schema definitions in metadata
- Validation failures logged to incident timeline

---

## Implementation Details

### 1. Schema Definition Layer: `src/runtime/json_output_schemas.py`

```python
REDACTED
```

Classes:

- `JSONSchemaRegistry`: Static registry mapping cell IDs to Pydantic schema classes
  - `get_schema_for_cell(cell_id: str) -> type`
  - `schema_definitions() -> Dict[str, type]`
- `OutputValidator`: Validates agent outputs against schemas
  - `validate(cell_id: str, raw_output: str) -> Tuple[bool, Optional[str]]` (returns success, error_msg)
  - `coerce_to_schema(output_str: str, schema_class: type) -> Tuple[bool, Dict]` (attempts JSON parsing + type coercion)
  - `audit_validation_failure(cell_id: str, raw_output: str, error: str, retry_count: int)`

---

### 2. Validation Wrapper: `src/runtime/cell_output_validator.py`

```python
REDACTED
```

---

### 3. Generator Integration

**SigmaNotebookV2.py:**

- Store schema registry in notebook metadata: `nb.metadata['cell_schemas'] = JSONSchemaRegistry.schema_definitions()`
- Wrap each agent call in Cell 3, 4, 5 with `CellOutputValidator.validate_and_retry()`
- Pass `self.incident_state` through validation wrapper
- Log all validation failures to `self.incident_state['_validation_failures']`

**SigmaNotebook.py:**

- Add schema definitions to bootstrap cell
- Inject validation wrapper code into agent invocation cells
- Store validation failure log in output cell

**MarimoNotebook.py:**

- Add `@reactive` cell that validates input parameters before agent execution
- Use `marimo.ui.form` to display validation errors in reactive notebook

**CacaoSidecar.py:**

- Add `schema_validation_config` to playbook definition with required field lists
- Generate CACAO JSON with `execution_constraints` containing schema URIs
- Store failure thresholds in `execution_config.validation_retries`

---

### 4. Schema Embedding in Generated Notebooks

Each generated notebook includes:

- Top-level metadata: `nb.metadata['cell_schemas']` containing all schema definitions
- In Cell 0 (Setup): Import `OutputValidator` and schema classes
- In each agentic cell (3, 4, 5): Wrap agent call with validation wrapper
- In Cell 7 (Postmortem): Display validation failure timeline

**Example Cell 3 integration:**

```python
REDACTED
```

---

### 5. Validation Audit Logging

`OutputValidator.audit_validation_failure()` creates entries in:

- `incident_state['_validation_failures']` (array of failed attempts)
- Slack notification to #soc-automation with cell ID, error, retry count
- Incident ticket (Jira) with validation history attached
- SIEM event: `security.event.validation_failure` with schema_name, error_type

**Format:**

```json
{
  "timestamp": "2023-04-26T14:30:00Z",
  "cell_id": "cell_3_triage",
  "error_type": "missing_field",
  "missing_field": "risk_score",
  "retry_count": 1,
  "raw_output_preview": "{\"alert_id\": \"...\", \"verdict\": \"true_positive\"}"
}
```

---

## Integration Points Summary

| Generator       | Cell                       | Integration Method             | Schema Type         |
| --------------- | -------------------------- | ------------------------------ | ------------------- |
| SigmaNotebookV2 | 3 (Evidence Triage)        | `validate_and_retry()` wrapper | EvidenceTriage      |
| SigmaNotebookV2 | 4 (Containment)            | `validate_and_retry()` wrapper | ContainmentDecision |
| SigmaNotebookV2 | 5 (Remediation)            | `validate_and_retry()` wrapper | RemediationStatus   |
| SigmaNotebook   | Evidence Cell              | Code injection + wrapper       | EvidenceTriage      |
| SigmaNotebook   | Containment Cell           | Code injection + wrapper       | ContainmentDecision |
| MarimoNotebook  | @reactive validation cells | Reactive decorator             | All schemas         |
| CacaoSidecar    | execution_config           | schema_validation_config block | CACAO JSON          |

---

## Testing Strategy

Unit tests (15+ tests):

- Valid JSON passes validation
- Missing required field raises error
- Wrong type (string instead of int) raises error
- Retry counter increments correctly
- Max retries triggers escalation
- Valid but incomplete output (has required fields) passes
- Audit logging writes correct entries
- Schema registry lookup by cell_id works
- Error message generation is human-readable
- Concurrent validations don't interfere

Integration tests:

- Full agent → validation → next cell flow
- Retry loop with error feedback to agent
- Validation failure creates incident ticket
- Slack notification sent on nth failure

---

## Success Metrics

1. **Coverage:** 100% of agent cell outputs validated
2. **Retry Success Rate:** >85% of validation failures resolved within 3 retries
3. **Audit Trail:** Every validation event logged to incident timeline
4. **Performance:** Validation + first agent call completes in <5 seconds median
5. **UX:** Operators see clear "Schema Validation Failed" message with actionable error details

---

## Risks & Mitigations

| Risk                                                     | Mitigation                                                |
| -------------------------------------------------------- | --------------------------------------------------------- |
| Agent enters infinite retry loop                         | Max retries = 3, then escalate to human                   |
| Schema too strict, valid but unexpected outputs rejected | Validate on real incident data, add union types as needed |
| Validation wrapper adds latency                          | Cache schema definitions, use fast JSON parsing           |
| Human forgets to fix schema when adding new fields       | Tests enforce schema definitions for all cells            |
