# Specification: Suppress Redundant Alerts (Deduplication)

## Overview

When a single intrusion triggers multiple alerts (e.g., WMI execution, PowerShell command, file write, network connection), the orchestrator consolidates them into a single playbook execution instead of spawning redundant playbooks. An active playbook registry tracks investigations by entity (host, IP, user) and rule; subsequent alerts targeting the same entity are injected into the running playbook as additional context rather than spawning new executions. This prevents alert fatigue, reduces compute costs, and enables agents to correlate related artifacts within a single investigation.

---

## 1. Deduplication Logic

### Entity Extraction

Extract the primary entity from alert and Sigma tags:

```python
REDACTED
```

### Deduplication Key

```
Key format: active_playbook:{entity_type}:{entity_value}:{sigma_rule}

Examples:
  active_playbook:ip:192.168.1.45:t1047-wmi-execution
  active_playbook:hostname:WORKSTATION-01:t1059-command-line
  active_playbook:user:admin@corp:t1021-lateral-movement
```

### Temporal Window

```
DEFAULT: 4 hours (14400 seconds)

When does deduplication expire?
- Initial alert: 2023-04-25 14:00:00Z
- Alert received: 2023-04-25 17:55:00Z ✓ (3h 55m < 4h) → deduplicated
- Alert received: 2023-04-25 18:05:00Z ✗ (4h 5m > 4h) → new playbook
```

---

## 2. Decision Tree

```
New alert arrives
  ↓
Extract entity from alert
  ↓
  Is entity extraction successful?
  ├─ NO → Spawn new playbook
  └─ YES ↓
      Is alert type deduplicable?
      ├─ NO (phishing, file) → Spawn new playbook
      └─ YES ↓
          Is playbook already active for this entity?
          ├─ NO → Spawn new playbook, register in cache
          └─ YES ↓
              Within 4-hour window?
              ├─ NO (expired) → Spawn new playbook, reregister
              └─ YES ↓
                  Append alert to running playbook
                  Notify agent: "NEW ALERTS APPENDED (1)"
                  Return deduplicated response
```

---

## 3. Active Playbook Registry

### Cache Structure

```json
{
  "active_playbook:ip:192.168.1.45:t1047-wmi": {
    "playbook_id": "pb-2026-0451-a1b2c3",
    "registered_at": "2023-04-25T14:00:00Z",
    "alerts": [
      {
        "appended_at": "2023-04-25T14:00:00Z",
        "payload": {...initial_alert...}
      },
      {
        "appended_at": "2023-04-25T14:05:00Z",
        "payload": {...appended_alert_1...}
      },
      {
        "appended_at": "2023-04-25T14:15:00Z",
        "payload": {...appended_alert_2...}
      }
    ]
  }
}
```

### TTL Expiration

- **Default TTL:** 4 hours (14400 seconds)
- **Cache backend:** Redis with native TTL or ExpiringDict
- **Cleanup:** Automatic on expiration
- **Manual removal:** On playbook completion

---

## 4. Alert Injection

### Mechanism

When a new alert is routed to an active playbook:

1. **Append to cache:** Add alert to `alerts` array
2. **Trigger event:** Send "NEW_ALERT_APPENDED" event to running notebook
3. **Notify agent:** Print "📌 NEW ALERTS APPENDED (N)" in output
4. **Return:** HTTP 202 Accepted (async handling)

### Webhook/Event Channel

```python
REDACTED
```

### Notebook Processing

```python
REDACTED
```

---

## 5. Agent Awareness

### System Prompt Addition

```
DYNAMIC ALERT CONTEXT
═══════════════════════════════════════════════════════════════════════════

Your investigation may be updated with new alerts during execution if they
target the same primary entity as your initial alert.

When you see "📌 NEW ALERTS APPENDED (N)", review the new alerts for:
1. Temporal proximity (occurred near initial alert?)
2. Related TTPs (same attack chain?)
3. Expanded scope (affecting more systems?)

If appended alerts are relevant:
  → Incorporate findings into your investigation
  → Update initial assessment
  → Expand scope if necessary

If appended alerts are unrelated:
  → Note the distinction
  → Focus on original investigation
  → Flag for separate investigation

Examples of related alerts:
  ✓ Initial: WMI execution on Host A
    Appended: PowerShell command on Host A (same host, likely related)

  ✓ Initial: Lateral movement from Host A to Host B
    Appended: Failed login attempts on Host B (credential spraying, related)

  ✗ Initial: Ransomware on Host A
    Appended: Phishing email unrelated to Host A (separate incident)
```

---

## 6. Integration Points

### Orchestrator

```python
REDACTED
```

### SigmaNotebookV2

**Cell 3: Evidence Collection**

```python
REDACTED
```

---

## 7. Example: Alert Storm

### Scenario: Ransomware Intrusion

**T0: 14:00:00** - Initial alert arrives

```
Alert 1: WMI execution on WORKSTATION-01
Playbook: "pb-2026-0451-a1b2c3" spawned
Registry: active_playbook:hostname:WORKSTATION-01:t1047
```

**T0+5m: 14:05:00** - Second alert arrives (same host)

```
Alert 2: PowerShell execution on WORKSTATION-01
Dedup check: Match found! Append to pb-2026-0451-a1b2c3
Notebook: Receives "NEW ALERT APPENDED (1)"
Agent: Updates investigation with PowerShell context
```

**T0+15m: 14:15:00** - Third alert arrives (same host)

```
Alert 3: File modification on WORKSTATION-01
Dedup check: Match found! Append to pb-2026-0451-a1b2c3
Notebook: Receives "NEW ALERT APPENDED (2)"
Agent: Correlates file change with execution sequence
```

**T0+25m: 14:25:00** - Fourth alert arrives (different host)

```
Alert 4: Lateral movement to SERVER-02
Dedup check: No match (different entity)
Playbook: NEW playbook spawned for SERVER-02
Result: Two concurrent playbooks investigating related incidents
```

**Result:**

- Without dedup: 4 playbooks running, 4× compute cost, alert fatigue
- With dedup: 2 playbooks, correlated investigation, clearer incident picture

---

## 8. Benefits

### Operational

- Fewer playbooks to manage
- Reduced alert fatigue
- Faster MTTR (consolidated context)

### Technical

- Lower compute costs (~75% reduction for alert storms)
- Reduced SIEM query load
- Fewer concurrent notebook executions

### Investigative

- Agents see full context of related alerts
- Better correlation of attack sequences
- More accurate playbook decisions

---

## 9. Configuration

### Tuning Parameters

```json
{
  "deduplication": {
    "enabled": true,
    "ttl_seconds": 14400, // 4 hours
    "deduplicable_patterns": [
      "process_execution",
      "network_connection",
      "lateral_movement",
      "privilege_escalation"
    ],
    "non_deduplicable_patterns": [
      "phishing",
      "suspicious_file",
      "external_threat"
    ],
    "cache_backend": "redis",
    "redis_host": "cache.internal",
    "redis_port": 6379
  }
}
```

---

## 10. Testing Reference

Create `tests/test_alert_deduplication.py` with 18+ tests:

**Core (8 tests)**

- Entity extraction
- Dedup key generation
- Registry operations
- TTL handling

**Deduplication (6 tests)**

- Route to active playbook
- Spawn new on no match
- Prevent duplicate registration
- Append alert to active
- Expire after 4 hours

**Integration (4 tests)**

- Alert appended to notebook
- Agent sees appended context
- Multiple concurrent playbooks
- Cross-entity handling
