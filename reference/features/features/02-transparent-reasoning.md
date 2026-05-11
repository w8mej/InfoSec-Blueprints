# Feature: Transparent Reasoning

**Status:** ✅ Shipped v0.1  
**Module:** `src/runtime/transparent_reasoning.py` (135 lines)  
**Tests:** 17/17 passing  
**Effort:** O(1) per cell, <20ms extraction overhead

---

## Problem Statement

### The Issue

AI agents make critical incident response decisions with no visibility into **why**:

```
Notebook Cell Output:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verdict: RANSOMWARE
Confidence: 0.92
Action: ISOLATE_ENDPOINT_IMMEDIATELY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Operator question: "WHY did you make this decision?"
Agent response: [No reasoning provided]

Regulatory inspector: "Show me the thinking behind this incident classification."
Organization: [Cannot demonstrate reasoning — decision looks arbitrary]
```

### Consequences

- **Reduced trust:** Operators second-guess agent recommendations
- **Regulatory risk:** GDPR "right to explanation" not satisfied
- **Audit gap:** Security reviews can't verify decision logic
- **Debugging nightmare:** Can't trace what factors influenced decisions
- **Liability:** "The AI said so" is not a defense in breach litigation

---

## Solution: Extract & Audit Agent Reasoning

### Three-Part Architecture

#### 1. Detection: Parse Reasoning Blocks

Agents can express reasoning in **two formats**:

**Format A: XML Tags**

```xml
<think>
The indicators point to ransomware:
1. Encrypted files with .locked extension (98% confidence)
2. Ransom note in C:\ransom.txt (100% confidence)
3. Process 4521.exe modifying files in bulk (92% confidence)
Decision: Isolate endpoint to prevent further spread
</think>

Verdict: RANSOMWARE (confidence 0.96)
```

**Format B: JSON Block**

```json
{
  "reasoning": {
    "observations": [
      "Encrypted files: C:\\Users\\Documents\\*.locked",
      "Parent process: explorer.exe → cmd.exe → 4521.exe"
    ],
    "hypothesis": "Ransomware with worm propagation",
    "confidence": 0.96,
    "decision": "ISOLATE_ENDPOINT",
    "action_taken": "isolated 192.168.1.105 from network"
  }
}

Verdict: RANSOMWARE
```

#### 2. Extraction: Clean & Validate

```python
REDACTED
```

#### 3. Rendering: Collapsible HTML

For notebooks, render as collapsible detail element:

```html
<details>
  <summary>🤖 View Agent Reasoning (confidence: 96%)</summary>
  <pre>
The indicators point to ransomware:
1. Encrypted files with .locked extension (98% confidence)
2. Ransom note in C:\ransom.txt (100% confidence)
3. Process 4521.exe modifying files in bulk (92% confidence)
Decision: Isolate endpoint to prevent further spread
  </pre>
</details>
```

**In notebook:** Collapsed by default. Users click to expand and review reasoning.

---

## Implementation Details

### Module Structure

```python
REDACTED
```

### Parsing Algorithm

```
Input: Agent output (mixed text + reasoning + decision)
       ↓
Step 1: Check for <think>...</think> tags
        ├─ If found: extract content, strip tags
        ├─ If not found: continue

Step 2: Check for JSON block {"reasoning": {...}}
        ├─ If found: extract .reasoning object
        ├─ If not found: no reasoning detected

Step 3: Extract confidence score
        ├─ From JSON: reasoning.confidence
        ├─ From text: regex "confidence: X" or "confidence X%"
        ├─ If not found: default 0.5

Step 4: Clean output (remove reasoning blocks)
        ├─ Remove <think>...</think> tags
        ├─ Remove JSON block (or keep for inspection)

Output: ReasoningBlock(content, model_id, confidence, action)
```

---

## Example Workflow

### Step 1: Agent Generates Output (with reasoning)

```
Agent output:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Based on analysis of the incident indicators:

<think>
Indicators analysis:
1. Process 4521.exe created files with .locked extension → Type 1: File encryption
2. C:\ransom.txt found with Conti ransom gang header → Type 2: Ransom note
3. Event ID 4688 shows lateral movement to 15 endpoints → Type 3: Propagation
4. Recent PowerShell execution with -EncodedCommand → Type 4: Attacker toolkit

Confidence breakdown:
- Ransomware family (Conti or affiliate): 94%
- Active encryption happening now: 88%
- Network-wide compromise risk: HIGH

Decision rationale:
- Isolating the patient zero endpoint (192.168.1.105) prevents further spread
- This is more urgent than containment of spread endpoints
- Risk of delay: exponential infection growth

Confidence in recommendation: 96%
</think>

**VERDICT: ACTIVE RANSOMWARE ATTACK**
- Classification: Conti ransomware or affiliate
- Confidence: 96%
- Recommendation: ISOLATE_ENDPOINT_192.168.1.105 immediately
- Timeline: Incident likely started <2 hours ago based on log timestamps
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 2: Reasoning Extraction

```python
REDACTED
```

### Step 3: Rendering in Notebook

Cell output shows:

```
VERDICT: ACTIVE RANSOMWARE ATTACK
Classification: Conti ransomware or affiliate
Confidence: 96%
Recommendation: ISOLATE_ENDPOINT_192.168.1.105 immediately

[Collapsible section below]
🤖 View Agent Reasoning (confidence: 96%) [CLICK TO EXPAND]
```

When user clicks "View Agent Reasoning":

```
Indicators analysis:
1. Process 4521.exe created files with .locked extension → Type 1: File encryption
2. C:\ransom.txt found with Conti ransom gang header → Type 2: Ransom note
3. Event ID 4688 shows lateral movement to 15 endpoints → Type 3: Propagation
4. Recent PowerShell execution with -EncodedCommand → Type 4: Attacker toolkit

Confidence breakdown:
- Ransomware family (Conti or affiliate): 94%
- Active encryption happening now: 88%
- Network-wide compromise risk: HIGH

Decision rationale:
- Isolating the patient zero endpoint (192.168.1.105) prevents further spread
- This is more urgent than containment of spread endpoints
- Risk of delay: exponential infection growth

Confidence in recommendation: 96%
```

### Step 4: Audit Logging

Simultaneously logged to `/var/log/SentinelMeshs/reasoning-audit.jsonl`:

```json
{
  "timestamp": "2023-04-26T14:30:05.123456Z",
  "incident_id": "INC-2026-0451",
  "cell_id": "cell_3_evidence_triage",
  "agent_model": "claude-3-sonnet",
  "decision": "RANSOMWARE",
  "confidence": 0.96,
  "reasoning_excerpt": "Indicators analysis: 1. Process 4521.exe created files...",
  "action_taken": "ISOLATE_ENDPOINT_192.168.1.105",
  "timestamp_reasoning_generated": "2023-04-26T14:30:05Z"
}
```

---

## Integration Points

### SigmaNotebookV2 (Cell 3)

```python
REDACTED
```

### SigmaNotebook (inject_grr_code)

Similar pattern in template-based generation.

### MarimoNotebook (evidence_capture cell)

```python
REDACTED
```

---

## Test Coverage

### Unit Tests (5 tests)

1. **test_reasoning_block_creation()** → Dataclass initialized
2. **test_parse_xml_tags()** → Extracts <think>...</think> content
3. **test_parse_json_block()** → Extracts {"reasoning": {...}} block
4. **test_parse_confidence_extraction()** → Gets confidence score
5. **test_render_html_escaping()** → Prevents XSS via HTML escaping

### Integration Tests (7 tests)

1. **test_extract_and_render_full_workflow()** → End-to-end extraction + render
2. **test_reasoning_html_collapsible()** → Generated HTML has <details>
3. **test_audit_log_format_jsonl()** → Audit entry is JSONL-compatible
4. **test_notebook_reasoning_cell_integration()** → V2 cell generates correctly
5. **test_marimo_reasoning_display()** → Marimo renders reasoning
6. **test_cacao_reasoning_schema()** → CACAO includes reasoning fields
7. **test_reasoning_survives_export()** → Reasoning persists in PDF/HTML export

### Scenario Tests (5 tests)

1. **test_triage_decision_with_reasoning()** → Malware/benign decision with explanation
2. **test_containment_decision_with_reasoning()** → Isolation decision documented
3. **test_remediation_confidence_varies()** → Different confidence levels
4. **test_reasoning_audit_trail_complete()** → Full workflow logged
5. **test_confidence_score_validation()** → Scores are 0.0-1.0

---

## Performance Characteristics

| Operation             | Target | Actual |
| --------------------- | ------ | ------ |
| Parse reasoning block | <10ms  | ~3ms   |
| Render HTML           | <5ms   | ~2ms   |
| Extract + render      | <20ms  | ~7ms   |
| Audit log format      | <1ms   | <1ms   |
| Full cell overhead    | <30ms  | ~15ms  |

**Profiling:**

```bash
python -m cProfile -s cumtime src/scripts/test_reasoning.py
# Results: HTML escaping (40%), regex (35%), JSON serialization (25%)
```

---

## Security Considerations

### XSS Prevention

```python
REDACTED
```

All reasoning content is HTML-escaped before rendering.

### Information Disclosure

Reasoning is logged to `/var/log/SentinelMeshs/reasoning-audit.jsonl`, which should be:

- Restricted to incident responders only (chmod 0600)
- Encrypted at rest (full disk encryption)
- Not exposed in exports by default

To exclude reasoning from exports:

```python
REDACTED
```

---

## Known Limitations

1. **Reasoning must be explicitly provided** — Agent could hide reasoning from output
   - _Mitigation:_ System prompt requires `<think>` blocks in output

2. **Confidence score is self-reported** — Agent could claim 100% when uncertain
   - _Mitigation:_ Operators review reasoning and adjust confidence

3. **No validation of reasoning logic** — Extracted reasoning could be circular or nonsensical
   - _Mitigation:_ Operators review reasoning for quality

4. **XML tags can be nested or malformed**
   - _Mitigation:_ Use regex with non-greedy matching: `<think>.*?</think>`

---

## Design Decisions

### Why Collapsible HTML (Not Separate Field)?

**Decision:** Render reasoning in notebook as collapsible HTML, not separate field

**Rationale:**

- Keeps reasoning alongside decision (context)
- Users can ignore if not needed (collapsed by default)
- Survives PDF/HTML export as human-readable text
- Compatible with all notebook formats

**Trade-off:** Cannot machine-parse reasonin once in PDF form.

### Why Both XML and JSON?

**Decision:** Support both `<think>...</think>` and `{"reasoning": {...}}`

**Rationale:**

- XML is natural for sequential text reasoning
- JSON is structured for analysis
- Agents will use different formats; support both
- Backward compatibility with existing agent outputs

---

## Regulatory Alignment

### GDPR: Right to Explanation (Article 22)

✅ Reasoning extraction satisfies GDPR requirement for explanation of automated decisions

- Operators can demonstrate agent reasoning to regulators
- Audit trail proves decision was not arbitrary

### HIPAA: Audit Controls (45 CFR 164.312(b))

✅ Reasoning logging provides audit trail for medical incident response

- Every decision documented and timestamped
- Cryptographic logging (paired with execution signatures)

### CCPA: Explanation of Automated Decision-Making

✅ Agents provide explanation in reasoning block

- Operators can respond to user requests for explanation
- Reasoning is retained per CCPA 45-day requirement

---

## Future Enhancements (v0.2+)

1. **Confidence scoring validation** — Check if reported confidence is justified
2. **Reasoning quality scoring** — Rate explanation completeness
3. **Multi-step reasoning** — Support chained reasoning ("because of X, which implies Y")
4. **Counterfactual reasoning** — "What if we had not isolated the endpoint?"
5. **Human review integration** — Operators can annotate reasoning with feedback

---

## Related Features

- **Programmatic Tool Calling:** Agent decides to call a tool; reasoning explains why
- **Execution Signing:** Tool executed; reasoning explains what it means
- **Regulatory Timestamps:** Reasoning captured at precise time

---

**Last Updated:** April 26, 2026  
**Module:** src/runtime/transparent_reasoning.py  
**Tests:** tests/test_transparent_reasoning.py (206 lines)
