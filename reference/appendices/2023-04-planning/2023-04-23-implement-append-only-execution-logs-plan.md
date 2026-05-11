# Implementation Plan: Append-Only Execution Logs

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook, CacaoSidecar  
**Applies to:** All notebook types  
**Priority:** HIGH (forensic compliance & audit trail)

## Overview

Implement append-only, immutable execution logs for every notebook cell execution. These logs provide forensic integrity, audit trails, and enable historical agent performance analysis via queryable data lakes.

---

## 1. Runtime Module: `execution_telemetry.py`

### Location

`src/runtime/execution_telemetry.py` (new file)

### Classes & Methods

#### `ExecutionEventLog` (dataclass)

```python
REDACTED
```

#### `ExecutionTelemetryLogger` (class)

Responsible for capturing and emitting execution events.

```python
REDACTED
```

#### `TelemetryStreamWriter` (class)

Responsible for streaming logs to AWS Kinesis or local file sink.

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2 (Jupyter V2, cell-based)

**Location of changes:** `src/generate/SigmaNotebookV2.py`

1. **In `__init__` method (line ~60):**
   - Instantiate `ExecutionTelemetryLogger` with notebook version "v2"
   - Store as `self.telemetry_logger`

2. **In `_build` method (line ~70):**
   - Add cell that initializes telemetry after the environment snapshot cell:
     ```python
     REDACTED
```

3. **New method `_add_telemetry_initialization_cell` (after `_add_cell_env_snapshot`):**
   - Create a code cell that:
     - Imports `ExecutionTelemetryLogger` and `TelemetryStreamWriter`
     - Instantiates logger for the notebook session
     - Sets up the stream writer (file sink by default)
     - Stores both in global variables for all cells to access

4. **In each cell generation method** (e.g., `_add_cell_2_preconditions`, `_add_cell_3_evidence_collection`, etc.):
   - Add telemetry calls at start: `telemetry_logger.log_cell_started(cell_id, cell_type, params)`
   - Wrap cell execution with try/except
   - On success: `telemetry_logger.log_cell_completed(cell_id, output, duration_ms, model_config)`
   - On failure: `telemetry_logger.log_cell_failed(cell_id, error_msg, duration_ms)`

5. **In `_add_cell_6_evidentiary_signing` (line ~580):**
   - Before JWS signing, emit all telemetry logs:
     ```python
     REDACTED
```

### SigmaNotebook (Jupyter V1, template-driven)

**Location of changes:** `src/generate/SigmaNotebook.py`

1. **In `_inject_bootstrap_cell` method (line ~345):**
   - Add telemetry initialization code to the bootstrap cell:
     ```python
     REDACTED
```

2. **In `_inject_grr_code` (line ~415):**
   - Wrap the GRR flow dispatch in telemetry:
     ```python
     REDACTED
```

3. **In `_inject_gao_containment_code` (line ~460):**
   - Wrap containment dispatch:
     ```python
     REDACTED
```

4. **In `_inject_postmortem_code` (line ~545):**
   - At the end, emit all telemetry:
     ```python
     REDACTED
```

### MarimoNotebook (Reactive DAG)

**Location of changes:** `src/generate/MarimoNotebook.py`

1. **In the header cell** (`generate_python` method, line ~125):
   - Add imports:
     ```python
     REDACTED
```

2. **After context cell (new cell after `context`):**
   - Create a telemetry initialization cell:
     ```python
     REDACTED
```

3. **In `evidence_capture` cell:**
   - Add telemetry calls:
     ```python
     REDACTED
```

4. **In `closeout` cell:**
   - Emit logs:
     ```python
     REDACTED
```

### CacaoSidecar (Declarative)

**Location of changes:** `src/generate/CacaoSidecar.py`

1. **In `to_dict` method (line ~100):**
   - Add telemetry configuration to the CACAO structure:
     ```python
     REDACTED
```

---

## 3. Test Cases

Create `tests/test_execution_telemetry.py` with:

- **Test `ExecutionEventLog` serialization** (2 tests)
  - Test `.to_json_lines()` output is valid JSON
  - Test all fields are present

- **Test `ExecutionTelemetryLogger`** (8 tests)
  - `test_log_cell_started` — event is created with "started" status
  - `test_log_tool_call` — tool call is appended to the matching event
  - `test_log_cell_completed` — status changes to "completed", hash computed
  - `test_log_cell_failed` — status changes to "failed", error message stored
  - `test_emit_logs` — returns list of JSON Lines
  - `test_multiple_cells` — logs from multiple cells don't interfere
  - `test_tool_calls_order` — tool calls are recorded in order
  - `test_concurrent_cells` — handles overlapping cell execution (future)

- **Test `TelemetryStreamWriter`** (5 tests)
  - `test_write_event_file` — event is appended to file
  - `test_write_batch_file` — batch events are written
  - `test_file_path_creation` — directory is created if missing
  - `test_append_mode` — file is appended, not overwritten
  - `test_invalid_sink_type` — raises error for unknown sink

- **Integration tests** (4 tests)
  - `test_full_workflow_v2` — SigmaNotebookV2 integration end-to-end
  - `test_full_workflow_v1` — SigmaNotebook integration end-to-end
  - `test_marimo_integration` — MarimoNotebook cell telemetry
  - `test_logs_queryable_as_jsonl` — emitted logs can be loaded via `jsonlines` library

**Total:** ~25 tests

---

## 4. AWS Integration (Optional, for production)

### S3 Bucket with Object Lock

```bash
aws s3api create-bucket \
  --bucket aso-execution-logs-${ENVIRONMENT} \
  --region us-east-1

aws s3api put-object-lock-configuration \
  --bucket aso-execution-logs-${ENVIRONMENT} \
  --object-lock-configuration ObjectLockEnabled=Enabled,Rule={DefaultRetention={Mode=GOVERNANCE,Days=2555}}
```

### AWS Glue Crawler

```python
REDACTED
```

### Athena Query Example

```sql
SELECT
  incident_id,
  cell_id,
  execution_status,
  duration_ms,
  timestamp
FROM execution_telemetry_logs
WHERE incident_id = 'INC-2023-04-25-001'
ORDER BY timestamp ASC;
```

---

## 5. Success Criteria

- ✅ All 25+ tests pass
- ✅ Every cell execution in all notebook types emits a telemetry event
- ✅ Events are persisted locally (file sink) or to AWS (Kinesis/S3)
- ✅ JSON Lines format is queryable by `jsonlines` library
- ✅ Logs include cell ID, timestamp, tool calls, duration, status
- ✅ No performance regression (<5% overhead per cell)
- ✅ CacaoSidecar exports telemetry config in CACAO schema
