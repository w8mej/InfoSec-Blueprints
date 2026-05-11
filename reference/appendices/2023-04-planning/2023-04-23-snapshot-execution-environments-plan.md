# Implementation Plan: Snapshot Execution Environments

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook, CacaoSidecar  
**Applies to:** All playbook types  
**Priority:** HIGH (Forensic integrity, reproducibility, audit trail)

## Overview

Capture a complete snapshot of the execution environment at playbook generation and runtime to enable forensic reproducibility, audit trail completeness, and detection of environment-specific logic flaws. Every playbook embeds Python version, OS kernel info, container image SHA-256, and dependency hash. At execution time, if the environment differs from generation time, operators are warned. Optionally archive immutable container images to cold storage to guarantee old playbooks remain executable.

---

## 1. Runtime Module: `execution_environment_snapshot.py`

### Location

`src/runtime/execution_environment_snapshot.py` (new file)

### Classes & Methods

#### `EnvironmentSnapshot` (dataclass)

```python
REDACTED
```

#### `SnapshotCapture` (class)

```python
REDACTED
```

#### `SnapshotFormatter` (class)

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2 (Jupyter V2)

**Location of changes:** `src/generate/SigmaNotebookV2.py`

1. **In `__init__` method:**
   - Call `SnapshotCapture.capture()` and store as `self.generation_snapshot`

2. **In `_build()` method (very first):**
   - Add snapshot cell as Cell 0: `SnapshotCapture.generate_snapshot_cell_code()`

3. **In notebook metadata:**
   - Embed snapshot via `SnapshotFormatter.to_notebook_metadata(self.generation_snapshot)`

### SigmaNotebook (Jupyter V1)

**Location of changes:** `src/generate/SigmaNotebook.py`

1. **In initialization:**
   - Generate snapshot via `SnapshotCapture.capture()`

2. **In bootstrap cell:**
   - Add snapshot code at top

### MarimoNotebook

**Location of changes:** `src/generate/MarimoNotebook.py`

1. **In imports/setup cell:**
   - Add snapshot code

### CacaoSidecar

**Location of changes:** `src/generate/CacaoSidecar.py`

1. **In `to_dict()` method:**
   - Add `execution_environment` field via `SnapshotFormatter.to_cacao_metadata()`

---

## 3. Archive Integration (Optional)

### Container Image Archival

When a new container environment is encountered:

```python
REDACTED
```

---

## 4. Test Cases

Create `tests/test_execution_environment_snapshot.py` with 16+ tests:

- **Test EnvironmentSnapshot** (2 tests)
  - Initialization
  - Serialization

- **Test SnapshotCapture** (8 tests)
  - Capture Python version
  - Capture OS kernel
  - Capture architecture
  - Docker detection (if running in Docker)
  - K8s detection (if running in K8s)
  - Package hash computation
  - Generate snapshot cell code
  - Handle missing pip gracefully

- **Test SnapshotFormatter** (4 tests)
  - Format for notebook metadata
  - Format for CACAO metadata
  - Compare identical snapshots
  - Compare different snapshots

- **Integration tests** (2 tests)
  - V2 playbook includes snapshot cell
  - CACAO sidecar includes environment field

**Total:** ~16 tests

---

## 5. Success Criteria

- ✅ Snapshot captured at generation time
- ✅ Snapshot captured at execution time
- ✅ All environment fields populated (Python, OS, container, packages)
- ✅ Snapshot cell code generated correctly
- ✅ Snapshots embedded in all playbook types
- ✅ Comparison logic detects environment changes
- ✅ Container detection works (Docker, K8s, bare metal)
- ✅ All 16+ tests passing
- ✅ Zero performance impact on playbook generation
