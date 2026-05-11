# Implementation Plan: Suppress Redundant Alerts (Deduplication)

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook  
**Applies to:** Notebooks only (not CACAO)  
**Priority:** MEDIUM (Alert fatigue reduction, investigation efficiency, cost optimization)

## Overview

When multiple alerts for the same entity (host, user, IP) arrive within a short window, consolidate them into a single playbook execution with all alert payloads appended dynamically. This prevents duplicate playbook runs, reduces alert fatigue, and allows agents to correlate related alerts within a single investigation context. An active playbook registry (backed by Redis or similar) tracks running investigations; new alerts targeting the same entity are injected into the running playbook rather than spawning a separate execution.

---

## 1. Runtime Module: `alert_deduplication.py`

### Location

`src/runtime/alert_deduplication.py` (new file)

### Classes & Methods

#### `AlertDeduplicationKey` (dataclass)

```python
REDACTED
```

#### `ActivePlaybookRegistry` (class)

Tracks running playbook executions.

```python
REDACTED
```

#### `AlertDeduplicator` (class)

```python
REDACTED
```

---

## 2. Orchestrator Integration

### Pre-execution Check

```python
REDACTED
```

---

## 3. Notebook Integration

### Alert Injection Mechanism

```python
REDACTED
```

### System Prompt Injection

```
DYNAMIC ALERT CONTEXT:
You are investigating an incident. New alerts may be appended to your context
during your investigation if they target the same entity as your initial alert.

When this happens:
1. You'll be notified: "NEW ALERTS APPENDED (N)"
2. Review each appended alert for relevance to your investigation
3. Expand your investigation scope if warranted
4. Update your findings with new correlations

Treat appended alerts as related artifacts of the same intrusion attempt.
```

---

## 4. Test Cases

Create `tests/test_alert_deduplication.py` with 18+ tests:

- **Test AlertDeduplicationKey** (2 tests)
  - Key generation
  - Entity ID extraction

- **Test ActivePlaybookRegistry** (8 tests)
  - Register playbook
  - Get active playbook
  - Duplicate registration prevented
  - Append alert to active playbook
  - TTL expiration
  - Deregister playbook
  - Handle non-existent playbook
  - Concurrent access

- **Test AlertDeduplicator** (6 tests)
  - Extract entity from tags/payload
  - Determine deduplication eligibility
  - Route new alert to active playbook
  - Spawn new playbook if no match
  - Multiple entities in alert
  - Complex sigma rules

- **Integration tests** (2 tests)
  - Alert injected into running notebook
  - Multiple alerts appended and processed

**Total:** ~18 tests

---

## 5. Cache Backend Selection

### Option 1: Redis (Recommended for distributed systems)

```python
REDACTED
```

**Pros:** Distributed, persistent, TTL native
**Cons:** Additional dependency, requires Redis deployment

### Option 2: In-Memory Cache (Single-host or testing)

```python
REDACTED
```

**Pros:** No external dependency, fast
**Cons:** Single-host only, lost on restart

### Option 3: PostgreSQL (Existing infrastructure)

```python
REDACTED
```

---

## 6. Deduplication Rules

### Always Deduplicate

- Multiple alerts on same IP within 4 hours
- Multiple alerts on same hostname within 4 hours
- Multiple alerts on same user within 4 hours

### Never Deduplicate

- Different entity types (IP + user) → separate playbooks
- Different Sigma rules (WMI vs. PowerShell) → separate playbooks
- > 4 hours elapsed → new playbook (original TTL expired)

### Conditional

- Phishing alerts → deduplicate if same link/sender
- File integrity → deduplicate if same host
- VPN/network → deduplicate if same IP/subnet

---

## 7. Success Criteria

- ✅ Active playbook registry operational
- ✅ Entity extraction from Sigma tags working
- ✅ Alert deduplication logic implemented
- ✅ Alert injection into running playbooks working
- ✅ System prompt guides agent on appended alerts
- ✅ TTL-based cleanup working
- ✅ All 18+ tests passing
- ✅ <50ms latency for dedup check
