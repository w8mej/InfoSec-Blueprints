# Implementation Plan: Integrate Regulatory Reporting Timestamps

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1)  
**Applies to:** Playbooks with incident verdicts (True Positive, False Positive, Benign)  
**Priority:** CRITICAL (Compliance, legal defensibility, data protection regulations)

## Overview

Regulations like GDPR (72 hours), HIPAA (60 days), and state privacy laws mandate strict breach reporting windows starting from the moment of "Breach Awareness"—when the organization first learns of a data breach. The exact timing of this awareness event is legally critical. This feature injects non-agentic, hardcoded cells that capture the precise moment an incident transitions from "Suspected" to "True Positive" (confirmed breach). The timestamp is immediately logged, sent to the incident management system (Jira, ServiceNow), and optionally triggers high-priority alerts to legal and compliance teams to start the reporting countdown. This removes human ambiguity and provides legally defensible proof of awareness timing.

---

## 1. Runtime Module: `regulatory_timestamp_logger.py`

### Location

`src/runtime/regulatory_timestamp_logger.py` (new file)

### Classes & Methods

#### `BreachAwarenessEvent` (dataclass)

```python
REDACTED
```

#### `RegulatoryTimestampLogger` (class)

```python
REDACTED
```

#### `ComplianceNotificationManager` (class)

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2

**Cell 6 (New Cell: Regulatory Timestamp Injection)**

```python
REDACTED
```

### SigmaNotebook (Jupyter V1)

**Template Injection:**
Similar cell injection after verdict determination cell.

### MarimoNotebook

MarimoNotebook is reactive; timestamp cell triggers automatically after verdict is confirmed.

### CacaoSidecar

CACAO metadata includes breach awareness timestamp field.

---

## 3. Test Cases

Create `tests/test_regulatory_timestamp_logger.py` with 16+ tests:

**Unit Tests (6):**

- test_breach_awareness_event_initialization
- test_breach_awareness_event_serialization
- test_calculate_reporting_deadline_gdpr
- test_calculate_reporting_deadline_hipaa
- test_select_regulation_by_jurisdiction
- test_time_to_confirmation_calculation

**Logger Tests (6):**

- test_log_breach_awareness_true_positive
- test_log_breach_awareness_with_custom_jurisdiction
- test_log_breach_awareness_validates_timestamps
- test_write_to_incident_management_jira
- test_write_to_incident_management_servicenow
- test_write_creates_ticket_with_deadline

**Notification Tests (4):**

- test_notify_legal_compliance_slack
- test_notify_legal_compliance_email
- test_notify_legal_compliance_pagerduty
- test_notification_only_on_true_positive

**Total:** ~16 tests

---

## 4. Success Criteria

- ✅ Breach awareness timestamp captured at precise moment of verdict
- ✅ Timestamp immutable and logged to audit trail
- ✅ Regulatory window calculated correctly for all regulations (GDPR, HIPAA, CCPA, etc.)
- ✅ Reporting deadline calculated and displayed prominently
- ✅ Incident management ticket created with deadline metadata
- ✅ Legal/compliance teams notified via Slack, email, and/or PagerDuty
- ✅ Timestamp is deterministic and non-agentic (hardcoded)
- ✅ All 16+ tests passing
- ✅ Zero timing errors (<100ms overhead)
