# Specification: Implement Confidence Threshold Tags

## Overview

Confidence Threshold Tags enforce statistical fidelity gates on autonomous agent execution. Every playbook declares a `required_confidence` threshold (0-100%). When an alert's confidence score falls below this threshold, automation is gated — forcing manual HITL approval to proceed. This prevents premature execution on low-fidelity alerts.

---

## 1. Event Schema

### ConfidenceTag (Dataclass)

Represents a single confidence gate evaluation.

```json
{
  "threshold_percent": 85,
  "alert_confidence": 78,
  "fidelity_model_id": "siem_sigma_v1",
  "is_above_threshold": false,
  "downgrade_action": "require_escalation",
  "reason_text": "Alert confidence 78% below required threshold 85%; manual analyst review required"
}
```

#### Fields

| Field                | Type | Required | Description                                                                      |
| -------------------- | ---- | -------- | -------------------------------------------------------------------------------- |
| `threshold_percent`  | int  | ✅       | Required confidence for automation (0-100)                                       |
| `alert_confidence`   | int  | ✅       | Actual alert confidence from SIEM (0-100)                                        |
| `fidelity_model_id`  | str  | ✅       | Detection model identifier ("siem_sigma_v1", "ml_classifier_v2", "custom")       |
| `is_above_threshold` | bool | ✅       | Computed: alert_confidence >= threshold_percent                                  |
| `downgrade_action`   | str  | ✅       | Action on gate failure: "proceed", "require_escalation", "halt", "manual_review" |
| `reason_text`        | str  | ✅       | Human-readable explanation for gate decision                                     |

### Example Gate Evaluation

```json
{
  "threshold_percent": 85,
  "alert_confidence": 92,
  "fidelity_model_id": "siem_sigma_v1",
  "is_above_threshold": true,
  "downgrade_action": "proceed",
  "reason_text": "Alert confidence meets or exceeds required threshold; autonomous execution approved"
}
```

---

## 2. Runtime Module Implementation

### Module Structure

```
src/runtime/confidence_threshold.py

Classes:
- ConfidenceTag (dataclass)
- ConfidenceThresholdValidator (static methods)
- ConfidenceThresholdConfig (instance methods)
```

### ConfidenceTag (Dataclass)

```python
REDACTED
```

### ConfidenceThresholdValidator (Static Methods)

```python
REDACTED
```

### ConfidenceThresholdConfig (Instance Methods)

```python
REDACTED
```

---

## 3. Integration Code Examples

### SigmaNotebookV2 Integration

**Location:** `src/generate/SigmaNotebookV2.py`, Cell 2 (Preconditions)

```python
REDACTED
```

### SigmaNotebook Integration

**Location:** `src/generate/SigmaNotebook.py`, Bootstrap cell

```python
REDACTED
```

### MarimoNotebook Integration

**Location:** `src/generate/MarimoNotebook.py`

**Params cell (updated):**

```python
REDACTED
```

**Preconditions cell (updated):**

```python
REDACTED
```

**Human gate cell (updated):**

```python
REDACTED
```

### CacaoSidecar Integration

**Location:** `src/generate/CacaoSidecar.py`, `to_dict()` method

```python
REDACTED
```

---

## 4. Query Examples

### Local Analysis (Python)

```python
REDACTED
```

### Athena Query Examples

```sql
-- Find all incidents where confidence gate was triggered
SELECT
  incident_id,
  threshold_percent,
  alert_confidence,
  downgrade_action,
  timestamp
FROM confidence_threshold_logs
WHERE is_above_threshold = false
ORDER BY timestamp DESC;

-- Confidence distribution across incidents
SELECT
  threshold_percent,
  COUNT(*) as count,
  AVG(alert_confidence) as avg_alert_confidence,
  MIN(alert_confidence) as min_confidence,
  MAX(alert_confidence) as max_confidence
FROM confidence_threshold_logs
GROUP BY threshold_percent
ORDER BY threshold_percent DESC;

-- High-risk playbooks (low required confidence)
SELECT
  playbook_id,
  playbook_name,
  threshold_percent,
  COUNT(CASE WHEN is_above_threshold = false THEN 1 END) as gate_failures,
  ROUND(100.0 * COUNT(CASE WHEN is_above_threshold = false THEN 1 END) / COUNT(*), 2) as failure_rate_percent
FROM confidence_threshold_logs
GROUP BY playbook_id, playbook_name, threshold_percent
HAVING COUNT(CASE WHEN is_above_threshold = false THEN 1 END) > 0
ORDER BY failure_rate_percent DESC;
```

---

## 5. Environment Variables

| Variable                         | Default         | Purpose                                                                |
| -------------------------------- | --------------- | ---------------------------------------------------------------------- |
| `REQUIRED_CONFIDENCE_THRESHOLD`  | 85              | Default threshold if not specified in IAP                              |
| `CONFIDENCE_FIDELITY_MODEL`      | "siem_sigma_v1" | Detection model identifier for audit trail                             |
| `CONFIDENCE_GATE_FAILURE_ACTION` | "halt"          | Action on gate failure: halt, require_escalation, require_human_review |
| `ALERT_CONFIDENCE_SOURCE`        | "sigma_rule"    | Where alert confidence comes from (sigma_rule, ml_classifier, manual)  |

---

## 6. Compliance & Audit

### Forensic Requirements

- Every confidence gate decision is logged with timestamp, threshold, alert confidence, and action taken
- Gate tags are immutable and part of the execution audit trail
- Failures force manual approval, creating audit trail of human decision-making

### Regulatory Alignment

- **SOC 2**: Demonstrates control over automated decisions based on statistical confidence
- **NIST CSF**: Implements "Detect" function requirement for detection confidence validation
- **Internal Control**: Prevents automation on low-fidelity alerts, reducing false positives

### Retention Policy

- Confidence threshold logs retained for 2555 days (7 years) for regulatory compliance
- Stored in append-only format (JSON Lines) to prevent tampering
- Accessible via Athena for historical analysis

---

## 7. Testing Reference

Create `tests/test_confidence_threshold.py` with 20+ tests:

**Unit Tests (14 tests)**

- ConfidenceTag serialization and validation (3)
- ConfidenceThresholdValidator range checks (5)
- ConfidenceThresholdValidator gate logic (4)
- Code generation (2)

**Integration Tests (6 tests)**

- SigmaNotebookV2 cell generation with gate
- SigmaNotebook bootstrap integration
- MarimoNotebook reactive gate
- CACAO schema export
- Gate forcing REQUIRE_HITL on failure
- Gate allowing auto-approval on success

All tests use `@pytest.mark.unit` and `@pytest.mark.integration` for categorization.
