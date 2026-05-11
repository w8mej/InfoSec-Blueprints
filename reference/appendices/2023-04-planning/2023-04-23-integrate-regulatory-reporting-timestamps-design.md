# Specification: Integrate Regulatory Reporting Timestamps

## Problem Statement

Data protection regulations (GDPR, HIPAA, CCPA, NY-SHIELD) require organizations to report breaches within strict timeframes—**starting from the moment of breach awareness**, not detection.

**The challenge:** Determining the exact moment of awareness is legally critical:

- **GDPR 72-hour rule**: Must report within 72 hours of awareness, not of discovery
- **HIPAA 60-day rule**: From knowledge of unauthorized access
- **CCPA 45-day rule**: From discovery of breach
- **NY-SHIELD ~3 days**: Most expedient time (vague intentionally)

**The problem:**

- Awareness timing is ambiguous if not explicitly captured
- Spreadsheets, email threads, or verbal discussions lack defensibility
- Operators may forget to log the exact timestamp
- No audit trail proving when the organization knew about the breach
- Regulatory audits challenge: "How do you know that's when you became aware?"

**Impact:**

- Fines (GDPR: €10-20M or 2-4% revenue; HIPAA: $100-$1.5M per violation)
- Loss of public trust and litigation exposure
- Non-compliance findings in regulatory audits
- Inability to defend reporting timeline

---

## Goals

1. **Automatic capture** of breach awareness moment (no operator intervention needed)
2. **Legally defensible timestamp** recorded immutably
3. **Regulatory deadline calculation** (72h, 60d, 45d, etc.)
4. **Compliance team notification** (automatic alerts to legal)
5. **Incident management integration** (ticket with deadline metadata)
6. **Audit trail** (permanent record of awareness timing)

---

## Functional Requirements

### R1: Breach Awareness Event Capture

**R1.1 — Timing Definition**
Breach awareness = **moment when the organization has confirmed a True Positive incident** (through human HITL approval or agent verdict with high confidence).

- **Not**: Alert creation (discovery)
- **Not**: Human review start
- **Is**: Moment of confirmation/awareness

**R1.2 — Event Data Captured**

```json
{
  "event_id": "INC-2026-0451",
  "event_type": "true_positive",
  "awareness_timestamp": "2023-04-25T14:30:05Z",
  "discovery_timestamp": "2023-04-25T14:15:00Z",
  "time_to_confirmation": "00:15:05",
  "confirming_agent": "claude-3-sonnet-20240229",
  "evidence_summary": "Malware hash (SHA256: 8f2d...) matches APT28 TTP in threat intel DB",
  "regulation_applicable": "GDPR",
  "reporting_deadline": "2023-04-28T14:30:05Z",
  "jurisdiction": "EU"
}
```

**R1.3 — Regulation Mapping by Jurisdiction**

| Jurisdiction | Regulation | Window   | Notes                         |
| ------------ | ---------- | -------- | ----------------------------- |
| EU           | GDPR       | 72 hours | Strictest, most common        |
| US-CA        | CA-CCPA    | 45 days  | California only               |
| US-HIPAA     | HIPAA      | 60 days  | Healthcare providers          |
| US-NY        | NY-SHIELD  | ~3 days  | "Most expedient time" (vague) |
| Default      | Default    | 30 days  | Conservative fallback         |

**R1.4 — Timestamp Format & Precision**

- Format: ISO 8601 UTC (e.g., `2023-04-25T14:30:05.123456Z`)
- Precision: Microsecond level (fraud detection if tampered)
- Always UTC (no timezone ambiguity)
- Immutable once captured (stored in notebook metadata)

---

### R2: Regulatory Deadline Calculation

**R2.1 — Deadline Logic**

```
awareness_timestamp = 2023-04-25T14:30:05Z
jurisdiction = "EU" → GDPR → 72 hours
reporting_deadline = awareness_timestamp + 72 hours = 2023-04-28T14:30:05Z
```

**R2.2 — Business Day Considerations**

- Deadlines apply **calendar days** (not business days)
- Weekends/holidays DO count toward the deadline
- No extension for weekends (GDPR is explicit: 72 hours = 72 hours)

**R2.3 — Multiple Jurisdictions**
If organization operates in multiple jurisdictions:

- Calculate deadline for each applicable regulation
- Use the **most restrictive (earliest) deadline** as the reporting deadline
- Log all applicable regulations

Example:

```
Incident affects:
- EU customers → GDPR (72 hours)
- California customers → CCPA (45 days)
→ Use GDPR deadline (72 hours is stricter)
→ But note: CCPA also applicable, report under both regulations
```

---

### R3: Non-Agentic Cell Implementation

**R3.1 — Deterministic, Hardcoded Logic**

- **Not** left to agent discretion
- **Not** subject to LLM hallucination
- **Is** a hardcoded, deterministic cell (Cell 6)
- Executes **immediately** upon verdict

**R3.2 — Execution Timing**

- Cell 5: Agent/human makes verdict decision
- **Cell 6 (NEW): Regulatory timestamp capture** (before any containment actions)
- Cell 7+: Remediation/containment actions

Rationale: Timestamp captured **before** any actions taken, proving organization knew about breach **before** starting response.

---

### R4: Incident Management Integration

**R4.1 — Ticket Creation**
On true_positive verdict, automatically create Jira/ServiceNow ticket with:

- Title: `BREACH AWARENESS: {incident_id}`
- Severity: Critical
- Custom fields:
  - `Regulation`: GDPR / HIPAA / CCPA / NY-SHIELD
  - `Awareness_Timestamp`: ISO 8601 UTC
  - `Reporting_Deadline`: ISO 8601 UTC
  - `Hours_Remaining`: Countdown to deadline
  - `Jurisdiction`: Organization location/data subjects

**R4.2 — Linked to Incident**

- Link to original incident ticket (if exists)
- Tag with `breach-awareness` label
- Set reporter to `SentinelMesh-Automation`
- Assignee: `Legal-Compliance-Team`

**R4.3 — Ticket Updates**

- Every 24h, update `Hours_Remaining` field
- When deadline approaches (48h, 24h, 12h) → escalate to on-call
- At deadline time → trigger PagerDuty critical incident (if overdue)

---

### R5: Compliance Team Notification

**R5.1 — Notification Channels**

On `true_positive` verdict:

1. **Slack**: `#legal-compliance` channel

   ```
   🚨 BREACH AWARENESS EVENT
   Event: INC-2026-0451
   Timestamp: 2023-04-25T14:30:05Z
   Regulation: GDPR
   Deadline: 2023-04-28T14:30:05Z
   Hours to report: 71.5h
   Action: Initiate breach notification process
   ```

2. **Email**: legal@, compliance@, ciso@ distribution list
   - Subject: `[URGENT] Breach Awareness Event {incident_id}`
   - Includes deadline countdown

3. **PagerDuty**: High-priority incident if applicable
   - Assignee: `Legal-Compliance` on-call
   - Urgency: High
   - Escalation policy: 30min → VP Legal, 1h → General Counsel

**R5.2 — Notification Conditions**

- **Send if**: event_type = "true_positive"
- **Don't send if**: event_type = "false_positive" or "benign"

---

### R6: Audit Logging

**R6.1 — Event Persistence**

Log recorded in 3 places:

1. **Notebook metadata** (`nb.metadata['breach_awareness_event']`)
2. **Audit log file** (`/var/log/SentinelMeshs/breach-awareness.jsonl`)
3. **Incident ticket** (Jira comment)

**R6.2 — Log Format (JSONL)**

```json
{
  "event_id": "INC-2026-0451",
  "event_type": "true_positive",
  "awareness_timestamp": "2023-04-25T14:30:05Z",
  "reporting_deadline": "2023-04-28T14:30:05Z",
  "regulation": "GDPR",
  "jurisdiction": "EU"
}
```

**R6.3 — Retention**

- Audit logs: Keep for minimum 7 years (per regulation)
- Notebook metadata: Keep until incident resolved + 90 days

---

## Non-Functional Requirements

### NF1: Performance

| Operation             | Target             |
| --------------------- | ------------------ |
| Timestamp capture     | <1ms               |
| Deadline calculation  | <5ms               |
| Ticket creation       | <2 seconds         |
| Notification dispatch | <5 seconds (async) |

### NF2: Accuracy & Reliability

- **Timestamp precision**: Microsecond accuracy (to prevent disputes)
- **Deadline calculation**: 100% correct (no off-by-one errors)
- **Notification delivery**: 99.9% success rate (retry on failure)
- **Audit trail**: Complete (no dropped events)

### NF3: Compliance

- **Immutability**: Timestamps cannot be edited after capture (notebook is immutable)
- **Non-repudiation**: Timestamp includes confirming agent name
- **Defensibility**: Timestamp captured before any actions taken
- **Auditability**: Complete audit trail for regulatory review

---

## Example Walkthrough

### Scenario: EU Customer Data Breach (GDPR)

**Timeline:**

- **2023-04-25T14:15:00Z** — Alert triggered (suspicious file deletion + encryption)
- **2023-04-25T14:20:00Z** — Operator starts playbook, reviews evidence
- **2023-04-25T14:30:00Z** — Agent analysis completes, recommends: `true_positive` (87% confidence)
- **2023-04-25T14:30:05Z** — ✅ **BREACH AWARENESS** (verdict confirmed)
  - Cell 6 executes automatically
  - Timestamp captured: `2023-04-25T14:30:05Z`
  - Regulation: GDPR (EU jurisdiction)
  - Deadline calculated: `2023-04-28T14:30:05Z` (72 hours later)

**Automation triggers:**

- Jira ticket created: `INCIDENT-INC-2026-0451: BREACH AWARENESS`
  - Severity: Critical
  - Deadline: `2023-04-28T14:30:05Z`
  - Assigned to: Legal-Compliance team
- Slack notification sent to `#legal-compliance`:

  ```
  🚨 BREACH AWARENESS EVENT
  Awareness: 2023-04-25T14:30:05Z
  Deadline: 2023-04-28T14:30:05Z (71.5 hours remaining)
  Action: Notify EU customers, supervisory authority by deadline
  ```

- Email sent to legal@, compliance@, ciso@
- Audit log entry written

**Operator actions (Cell 7+):**

- Operator continues to Cell 7 (containment)
- Isolated affected systems
- Collected forensic evidence
- Started customer notification process (by 2023-04-28)

---

## Test Specifications

### Unit Tests

1. **test_breach_awareness_event_creation** — Event initialized correctly
2. **test_breach_awareness_event_serialization** — Serializes to dict/JSON
3. **test_calculate_deadline_gdpr** — 72h deadline correct
4. **test_calculate_deadline_hipaa** — 60d deadline correct
5. **test_calculate_deadline_ccpa** — 45d deadline correct
6. **test_calculate_deadline_ny_shield** — ~3d deadline
7. **test_jurisdiction_to_regulation_mapping** — All mappings correct
8. **test_time_to_confirmation_calculation** — Duration between discovery and awareness
9. **test_timestamp_format_iso8601** — Timestamps in correct format
10. **test_timestamp_immutability** — Cannot modify timestamp after creation

### Integration Tests

11. **test_ticket_creation_on_true_positive** — Jira ticket created
12. **test_ticket_has_deadline_metadata** — Ticket includes deadline fields
13. **test_notification_slack_sent** — Slack notification dispatched
14. **test_notification_email_sent** — Email notification dispatched
15. **test_notification_not_sent_on_false_positive** — No notification for non-breach verdicts
16. **test_audit_log_entry_created** — JSONL log entry written
17. **test_audit_log_searchable** — Can query audit log by incident_id
18. **test_multiple_jurisdictions** — Correct deadline for multiple regulatory domains

### Scenario Tests

19. **test_gdpr_72hour_deadline** — Real GDPR workflow
20. **test_hipaa_60day_deadline** — Real HIPAA workflow

---

## Edge Cases & Handling

| Edge Case                        | Handling                                          |
| -------------------------------- | ------------------------------------------------- |
| False positive verdict           | No timestamp captured, no notification sent       |
| Benign verdict                   | No timestamp captured, no notification sent       |
| Multiple jurisdictions (EU + CA) | Calculate deadline for each, use earliest         |
| Missing jurisdiction             | Default to most restrictive (GDPR 72h)            |
| Ticket system unavailable        | Retry with exponential backoff, log to audit file |
| Notification delivery failure    | Retry up to 3 times, escalate if all fail         |
| Deadline in the past             | Flag as ERROR, alert CISO immediately             |
| Invalid verdict type             | Reject with clear error message                   |

---

## Success Criteria

✅ Timestamp captured automatically at moment of true_positive verdict
✅ No operator intervention required (fully automated)
✅ Deadline calculated correctly for all regulations
✅ Jira/ServiceNow ticket created with deadline metadata
✅ Legal/compliance teams notified via Slack, email, PagerDuty
✅ Complete audit trail (no events lost)
✅ Audit log queryable and immutable
✅ All 20+ tests passing
✅ <10 seconds total latency (timestamp to notification)
✅ 100% accuracy in deadline calculation

---

## Regulatory References

- **GDPR Article 33**: Notification to authorities "without undue delay and, where feasible, not later than 72 hours"
- **HIPAA Breach Notification Rule**: "Expedient and without unreasonable delay"
- **CCPA Section 1798.150**: Notice without unreasonable delay, but specific timeline tied to discovery
- **NY-SHIELD**: "Most expedient time possible" (vague)
