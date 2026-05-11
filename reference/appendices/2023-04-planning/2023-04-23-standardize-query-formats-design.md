# Specification: Standardize Query Formats

## Problem Statement

Agents generate SIEM queries without constraints, causing operational havoc:

**Examples of bad agent queries:**

- `index=main | stats count by user` (unbounded, 30+ day lookback, 10M+ events)
- `sourcetype=windows_security` (no time bounds, all accounts)
- `earliest=0 latest=now | search error` (full history, vague)

**Consequences:**

- SIEM database timeouts (queries take 15+ minutes)
- Memory exhaustion on SIEM nodes (crash)
- Network saturation (pulling GB of data)
- Operator frustration: "The query hung again"
- Incident response delays (waiting for SIEM to recover)

**Current state:**

- No validation of queries before execution
- Agents don't know query limits (no feedback loop)
- Each SOC has different SIEM query languages (Splunk, KQL, Elasticsearch)
- Manual approval gates slow automation

**Impact:**

- 20-30% of incident response time wasted on slow/failed queries
- Reduced trust in automated query generation
- Manual query validation required (defeats automation)

---

## Goals

1. **Bounded queries** — Explicit time bounds (max 30-90 days)
2. **Consistent syntax** — All agents use same query format
3. **Performance** — Queries complete in <5 seconds
4. **Auditability** — Every query logged and reviewable
5. **Agent learning** — Feedback loop teaches agents better queries

---

## Functional Requirements

### R1: Standardized Query Format

**R1.1 — Universal Template**

All SIEM queries must follow:

```
[Action] [field] in [log_type] where [time_bounds] AND [filter_conditions]
```

Components:

- **Action**: `search`, `count`, `top`, `stats`, `group_by`
- **field**: Field name (e.g., `user`, `src_ip`, `hostname`, `hash`)
- **log_type**: Log source (e.g., `windows_security`, `proxy_logs`, `network_traffic`)
- **time_bounds**: `earliest=YYYYMMDD latest=YYYYMMDD` or duration like `earliest=-7d latest=now`
- **filter_conditions**: Key=value filters (e.g., `action=login status=success`)

**R1.2 — SIEM-Specific Translation**

Map universal format to SIEM languages:

**Splunk:**

```
index=main sourcetype=windows_security earliest=-7d latest=now
| search user=admin action=login
| stats count by status
```

**Elasticsearch/ELK:**

```
GET /logs/_search
{
  "query": {
    "bool": {
      "must": [
        {"term": {"log_type": "windows_security"}},
        {"term": {"user": "admin"}},
        {"range": {"@timestamp": {"gte": "now-7d", "lte": "now"}}}
      ]
    }
  },
  "aggs": {"by_status": {"terms": {"field": "status.keyword"}}}
}
```

**Microsoft KQL (Azure Sentinel):**

```
SecurityEvent
| where TimeGenerated >= ago(7d)
| where Account == "admin"
| where EventID == 4624
| summarize count() by EventType
```

**R1.3 — Syntax Validation Rules**

Every query must:

- ✅ Have explicit `earliest` and `latest` bounds
- ✅ Have max lookback of 90 days (configurable)
- ✅ Include at least one filter condition (no full table scans)
- ✅ Use lowercase field names (standardization)
- ✅ Escape special characters properly
- ❌ Cannot use wildcard-only searches (`*` alone)
- ❌ Cannot omit time bounds
- ❌ Cannot query full year of data unless justified

---

### R2: Query Validation Engine

**R2.1 — Static Analysis**

Before execution, validate:

1. **Syntax validation** — Is it well-formed?
2. **Bound checking** — Are time bounds present and reasonable?
3. **Complexity analysis** — Will this timeout? (heuristic scoring)
4. **Field existence** — Does the field exist in this log type?
5. **Permission check** — Can the user query this data?

**R2.2 — Complexity Scoring**

Estimate query complexity (0-100 scale):

| Factor            | Impact        | Example                                        |
| ----------------- | ------------- | ---------------------------------------------- |
| Time span         | +30           | 90-day lookback vs 7-day (higher = more risky) |
| Number of filters | +5 per filter | More filters = faster (narrows data)           |
| Aggregation type  | +20           | `stats` (heavy) vs `search` (light)            |
| Field cardinality | +10           | High-cardinality field (user) vs low (status)  |
| **Total**         | **Max 100**   | >80 = slow/risky, warn agent                   |

Example:

- 30-day lookback (10) + 2 filters (-10) + stats aggregation (20) + high-cardinality field (10) = **30** (safe)
- 90-day lookback (30) + 0 filters (0) + stats aggregation (20) + high-cardinality field (10) = **60** (caution)

**R2.3 — Feedback to Agent**

If query is flagged as risky:

```
Query validation WARNING:

Query complexity score: 72/100 (risky)

Issues:
- Time span is 90 days (recommended: <30 days)
- No filter conditions (querying all events, slow)
- Aggregation: group_by user (high cardinality)

Suggestion:
Add filters to narrow data: AND status=success AND action=login
Reduce time span: 7 days instead of 90

Please rewrite query with these constraints.
```

---

### R3: Agent Constraints

**R3.1 — System Prompt Directive**

Add to agent system prompt:

```
QUERY FORMAT REQUIREMENTS
═════════════════════════════════════════════════════════════════════════════

ALL queries must follow this format:
[Action] [field] in [log_type] where earliest=-XdY latest=now AND [conditions]

MANDATORY CONSTRAINTS:
1. Always include time bounds (earliest and latest)
2. Max lookback: 30 days (CRITICAL—queries >30d will timeout)
3. Add at least one filter condition (never query all events)
4. Use exact field names (request from user if unsure)
5. Keep field cardinality in mind (user is high cardinality)

EXAMPLES:

✓ GOOD:
"search user in windows_security where earliest=-7d latest=now
  AND (action=login OR action=unlock) AND status=failure"

✗ BAD (unbounded):
"search all events in security logs"

✗ BAD (too much data):
"search logs where earliest=-90d latest=now | count user"

✗ BAD (no filters):
"index=main | stats count"
```

**R3.2 — Tool Schema with Examples**

Provide tool schema with examples of valid queries:

```json
{
  "tool": "query_siem",
  "parameters": {
    "action": {
      "type": "enum",
      "values": ["search", "count", "stats", "top", "group_by"],
      "example": "search"
    },
    "field": {
      "type": "string",
      "examples": ["user", "src_ip", "hostname", "hash"],
      "description": "Field to search or aggregate"
    },
    "log_type": {
      "type": "string",
      "examples": ["windows_security", "proxy_logs", "endpoint_detection"],
      "description": "Log source name"
    },
    "earliest": {
      "type": "string",
      "pattern": "^-\\d+[dhm]$|^\\d{8}$",
      "examples": ["-7d", "-24h", "20260418"],
      "description": "Earliest time (relative or YYYYMMDD)"
    },
    "latest": {
      "type": "string",
      "pattern": "^now$|^\\d{8}$",
      "examples": ["now", "20260425"],
      "description": "Latest time (must be 'now' or YYYYMMDD)"
    },
    "filters": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": { "type": "string" },
          "operator": { "enum": ["=", "!=", ">", "<", "in", "contains"] },
          "value": { "type": ["string", "number"] }
        }
      },
      "minItems": 1,
      "description": "At least one filter condition (required)"
    }
  }
}
```

---

### R4: Validation & Retry Loop

**R4.1 — Validation Pipeline**

```
Agent generates query
  ↓
Validator.validate_query()
  ├─ Syntax check
  ├─ Bound check
  ├─ Complexity score
  └─ Field existence
  ↓
If VALID → Execute query
If INVALID → Reject + provide feedback → Agent retries
If RISKY (complexity >80) → Warn + suggest improvements
```

**R4.2 — Retry Mechanism**

```python
REDACTED
```

---

### R5: Audit Logging

**R5.1 — Query Logging**

Log every query to `/var/log/SentinelMeshs/queries.jsonl`:

```json
{
  "timestamp": "2023-04-25T14:30:00Z",
  "agent_model": "claude-3-sonnet",
  "query": "search user in windows_security where earliest=-7d latest=now AND action=login",
  "siem_platform": "splunk",
  "execution_time_ms": 1245,
  "result_count": 1523,
  "complexity_score": 35,
  "validated": true,
  "incident_id": "INC-2026-0451"
}
```

**R5.2 — Query Performance Tracking**

Track metrics:

- Execution time (target: <5 seconds)
- Result count
- Timeout rate (target: <1%)
- Validation pass rate (target: >95%)

---

## Non-Functional Requirements

### NF1: Performance

| Metric             | Target              |
| ------------------ | ------------------- |
| Query execution    | <5 seconds (median) |
| Validation latency | <50ms               |
| Timeout rate       | <1%                 |
| Agent retry rate   | <5%                 |

### NF2: Coverage

- **Splunk**: 100% of queries validated
- **Elasticsearch**: 100% of queries validated
- **Azure Sentinel KQL**: 100% of queries validated

### NF3: User Experience

- Clear error messages when query is invalid
- Agent automatically retries with feedback
- Operators see query execution time
- Audit trail shows all attempted queries

---

## Example Walkthrough

### Scenario: Find Failed Logins for User

**Agent needs to:**
Find all failed logins for admin account in last 7 days

**Agent generates (attempt 1 - INVALID):**

```
search user=admin in windows_security | stats count by status
```

❌ **Error**: Missing time bounds (earliest/latest)

**Feedback to agent:**

```
Query validation FAILED:
- Missing required field: 'earliest' (time bound)
- Missing required field: 'latest' (time bound)

Valid format: [Action] [field] in [log_type] where earliest=-XdY latest=now

Please rewrite with explicit time bounds.
```

**Agent regenerates (attempt 2 - VALID):**

```
search user in windows_security where earliest=-7d latest=now
AND user=admin AND status=failure AND action=login
```

✅ **Valid**: Passes all validation checks

- Time bounds: ✅ -7 days
- At least 1 filter: ✅ 3 filters (user, status, action)
- Complexity score: 28/100 (safe)

**Execution:**

- Query runs in 1.2 seconds
- Returns 42 failed login events
- Logged to audit trail

---

## Test Specifications

### Unit Tests

1. **test_format_validation_valid_query** — Well-formed query passes
2. **test_format_validation_missing_bounds** — Rejects query without earliest/latest
3. **test_format_validation_missing_filters** — Rejects query with no conditions
4. **test_format_validation_excessive_lookback** — Rejects 180-day lookback
5. **test_complexity_scoring** — Complexity score calculated correctly
6. **test_complexity_scoring_high_cardinality** — High-cardinality fields flagged
7. **test_syntax_validation_splunk** — Splunk syntax validated
8. **test_syntax_validation_kql** — KQL syntax validated
9. **test_field_existence_check** — Field exists in log type
10. **test_field_existence_check_invalid** — Invalid field rejected

### Integration Tests

11. **test*query_execution*<5s** — Query completes within SLA
12. **test_query_audit_logging** — Query logged to audit trail
13. **test_agent_retry_on_invalid** — Agent retries with feedback
14. **test_agent_success_after_retry** — Agent succeeds after feedback
15. **test_timeout_detection** — Long-running query detected and cancelled
16. **test_siem_connection_error** — Graceful fallback on SIEM unavailable

### Scenario Tests

17. **test_failed_logins_query** — Find failed logins for user
18. **test_malware_hash_search** — Search for malware hash in logs
19. **test_network_traffic_query** — Find traffic from suspicious IP

---

## Edge Cases & Handling

| Edge Case                                 | Handling                                  |
| ----------------------------------------- | ----------------------------------------- |
| Agent queries non-existent log type       | Reject, suggest valid log types           |
| Requested field doesn't exist in log type | Reject, suggest valid fields              |
| Time bounds are in future                 | Reject, explain must be past or present   |
| Earliest is after latest                  | Reject, swap or clarify                   |
| Query matches zero events                 | Return empty result (valid)               |
| SIEM returns timeout                      | Escalate: suggest narrower filters        |
| SIEM connection down                      | Return error, use fallback data source    |
| Agent generates identical query 3x        | Escalate to human for manual intervention |

---

## Success Criteria

✅ 100% of agent queries include time bounds
✅ 100% of queries have at least one filter condition
✅ Median query execution <5 seconds
✅ <1% timeout rate
✅ >95% validation pass rate on first attempt
✅ Complete audit trail of all queries
✅ All 18+ tests passing
✅ Agent learning: Retry rate improves over time

---

## SIEM-Specific Guidance

**Splunk:**

- Use `earliest=-7d latest=now` format
- Avoid `index=*` (query all indexes)
- Always specify `sourcetype` or narrowing field

**Elasticsearch:**

- Use ISO 8601 timestamps for time range
- Set size limits in query (avoid unbounded hits)
- Use bool queries for multi-condition filters

**Azure Sentinel KQL:**

- Time range must be in `TimeGenerated` field
- Use `ago()` function for relative time
- Summarize operations count result size limits
