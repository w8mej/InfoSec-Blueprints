# Specification: Append-Only Execution Logs

**Status:** READY FOR IMPLEMENTATION  
**Version:** 2.0  
**Last Updated:** 2023-04-25

---

## Executive Summary

Every notebook cell execution must emit a structured, immutable log event. These logs form an audit trail for forensic analysis, compliance reporting, and agent performance review. Logs are written append-only to local files (dev) or AWS S3 with Object Lock (WORM mode) for production compliance.

---

## 1. Event Schema

### ExecutionEventLog (JSON Schema)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Execution Event Log",
  "type": "object",
  "required": [
    "event_id",
    "timestamp",
    "notebook_version",
    "cell_id",
    "incident_id",
    "agent_model_version",
    "cell_type",
    "execution_status",
    "output_hash"
  ],
  "properties": {
    "event_id": {
      "type": "string",
      "description": "UUID v4 unique identifier for this event",
      "pattern": "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
    },
    "timestamp": {
      "type": "string",
      "description": "ISO 8601 UTC timestamp of event",
      "format": "date-time",
      "example": "2023-04-25T14:30:45.123456Z"
    },
    "notebook_version": {
      "type": "string",
      "enum": ["v2", "v1", "marimo", "cacao"],
      "description": "Type of playbook generator"
    },
    "cell_id": {
      "type": "string",
      "description": "Unique identifier for the cell within the notebook",
      "example": "cell_3_evidence_collection"
    },
    "incident_id": {
      "type": "string",
      "description": "Incident or alert ID from incident context",
      "example": "INC-2023-04-25-001"
    },
    "agent_model_version": {
      "type": "string",
      "description": "LLM model used (for reproducibility)",
      "example": "claude-3-5-sonnet-20241022"
    },
    "cell_type": {
      "type": "string",
      "enum": [
        "preconditions",
        "evidence_capture",
        "state_mutation",
        "containment",
        "closeout",
        "other"
      ],
      "description": "Semantic category of cell"
    },
    "execution_status": {
      "type": "string",
      "enum": ["started", "completed", "failed"],
      "description": "Status of cell execution"
    },
    "input_parameters": {
      "type": "object",
      "description": "Resolved parameters passed to the cell",
      "example": {
        "target_hostname": "host-prod-01",
        "target_ip": "10.0.1.50"
      }
    },
    "tool_calls": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Tool names invoked during this cell",
      "example": ["grr_rapid_response", "crowdstrike_rtr"]
    },
    "duration_ms": {
      "type": "integer",
      "minimum": 0,
      "description": "Execution time in milliseconds"
    },
    "output_hash": {
      "type": "string",
      "description": "SHA-256 hash of cell output (hex encoded)",
      "pattern": "^[a-f0-9]{64}$",
      "example": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6"
    },
    "model_config": {
      "type": "object",
      "description": "LLM parameters used (temperature, max_tokens, etc.)",
      "example": {
        "temperature": 0.7,
        "max_tokens": 4096,
        "top_p": 0.95
      }
    },
    "environment_hash": {
      "type": "string",
      "description": "Hash of Python version + OS + pip freeze for reproducibility",
      "pattern": "^[a-f0-9]{64}$"
    },
    "error_message": {
      "type": ["string", "null"],
      "description": "Error details if execution_status == 'failed'"
    }
  }
}
```

### Example Event (JSON Lines format, one per line)

```json
{
  "event_id": "a1b2c3d4-e5f6-4789-ab01-23456789abcd",
  "timestamp": "2023-04-25T14:30:45.123456Z",
  "notebook_version": "v2",
  "cell_id": "cell_3_evidence_collection",
  "incident_id": "INC-2023-04-25-001",
  "agent_model_version": "claude-3-5-sonnet-20241022",
  "cell_type": "evidence_capture",
  "execution_status": "completed",
  "input_parameters": {
    "target_hostname": "host-prod-01",
    "target_ip": "10.0.1.50"
  },
  "tool_calls": ["grr_rapid_response"],
  "duration_ms": 2500,
  "output_hash": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
  "model_config": { "temperature": 0.7 },
  "environment_hash": "deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
  "error_message": null
}
```

---

## 2. Runtime Module: `src/runtime/execution_telemetry.py`

### Module Dependencies

```python
REDACTED
```

### Key Classes

#### `ExecutionEventLog` Dataclass

```python
REDACTED
```

#### `ExecutionTelemetryLogger` Class

```python
REDACTED
```

#### `TelemetryStreamWriter` Class

```python
REDACTED
```

---

## 3. Integration Points: Code Examples

### SigmaNotebookV2 (Jupyter V2)

**In `src/generate/SigmaNotebookV2.py`, method `_add_cell_env_snapshot`:**

Add after environment snapshot capture:

```python
REDACTED
```

**Then in each cell method**, wrap with telemetry calls:

```python
REDACTED
```

**In `_add_cell_6_evidentiary_signing`**, emit logs before signing:

```python
REDACTED
```

### SigmaNotebook (Jupyter V1)

**In `_inject_bootstrap_cell`:**

```python
REDACTED
```

### MarimoNotebook (Reactive DAG)

**After context cell:**

```python
REDACTED
```

**In evidence_capture cell:**

```python
REDACTED
```

### CacaoSidecar (Declarative)

**In `to_dict` method:**

```python
REDACTED
```

---

## 4. Query Examples

### Local File Query (Python)

```python
REDACTED
```

### AWS Athena Query (SQL)

```sql
-- All events for an incident, ordered by timestamp
SELECT
  event_id,
  cell_id,
  cell_type,
  execution_status,
  duration_ms,
  tool_calls,
  timestamp
FROM execution_telemetry_logs
WHERE incident_id = 'INC-2023-04-25-001'
ORDER BY timestamp ASC;

-- Failed cells and their errors
SELECT
  cell_id,
  error_message,
  timestamp
FROM execution_telemetry_logs
WHERE execution_status = 'failed'
  AND incident_id = 'INC-2023-04-25-001';

-- Tool usage statistics
SELECT
  DISTINCT tool_name,
  COUNT(*) as invocation_count
FROM execution_telemetry_logs
CROSS JOIN UNNEST(tool_calls) AS t(tool_name)
WHERE timestamp > date_format(now() - INTERVAL '7' day, '%Y-%m-%dT%H:%i:%sZ')
GROUP BY tool_name
ORDER BY invocation_count DESC;
```

---

## 5. Environment Variables

| Variable                | Default                          | Purpose                              |
| ----------------------- | -------------------------------- | ------------------------------------ |
| `TELEMETRY_SINK_TYPE`   | `"file"`                         | Log sink: "file", "kinesis", or "s3" |
| `TELEMETRY_LOG_PATH`    | `/tmp/execution_telemetry.jsonl` | File path (for file sink)            |
| `TELEMETRY_BUCKET`      | (none)                           | S3 bucket name (for S3 sink)         |
| `TELEMETRY_STREAM_NAME` | `aso-execution-logs`             | Kinesis stream (for Kinesis sink)    |
| `LLM_MODEL_VERSION`     | `claude-opus-4-7`                | Model version for reproducibility    |

---

## 6. Compliance & Audit

### GDPR Compliance

- Logs do not contain user PII (only incident IDs, hostnames)
- Include mechanism to redact sensitive data before export

### Retention Policy

- File sink: configurable (default 90 days)
- S3 with Object Lock: GOVERNANCE mode, min. 7 years

### Immutability Guarantee

- File sink: append-only, no overwrite
- S3: Object Lock prevents deletion or modification
- Kinesis: writes to immutable S3 backend via Firehose

---

## 7. Testing

See corresponding plan for test cases and coverage requirements.
