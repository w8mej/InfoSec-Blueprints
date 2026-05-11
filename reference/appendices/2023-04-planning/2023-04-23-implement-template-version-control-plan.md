# Implementation Plan: Template Version Control

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook, CacaoSidecar  
**Applies to:** All notebook types + CACAO  
**Priority:** HIGH (prevent runbook rot & stale logic execution)

## Overview

Implement automated template versioning and freshness validation to prevent execution of outdated playbooks. Every playbook is stamped with generation metadata (timestamp, Git commit, version). At runtime, templates older than 90 days are rejected, forcing automatic regeneration from the latest logic before execution proceeds.

---

## 1. Runtime Module: `template_version_control.py`

### Location

`src/runtime/template_version_control.py` (new file)

### Classes & Methods

#### `TemplateMetadata` (dataclass)

```python
REDACTED
```

#### `TemplateValidator` (class)

Validates template freshness at runtime.

```python
REDACTED
```

#### `TemplateMetadataGenerator` (class)

Creates metadata at generation time.

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2 (Jupyter V2)

**Location of changes:** `src/generate/SigmaNotebookV2.py`

1. **In `__init__` method:**
   - Call `TemplateMetadataGenerator.generate()` and store as `self.template_metadata`

2. **In `_build` method (first cell):**
   - Add validation cell as Cell 0 using `TemplateValidator.generate_validation_code()`
   - Ensure it runs before any other cells

3. **In notebook metadata:**
   - Embed `template_metadata.to_json()` in notebook-level metadata

### SigmaNotebook (Jupyter V1)

**Location of changes:** `src/generate/SigmaNotebook.py`

1. **In initialization:**
   - Generate template metadata
   - Inject validation code into first cell

2. **In template rendering:**
   - Include metadata in notebook metadata section

### MarimoNotebook (Reactive DAG)

**Location of changes:** `src/generate/MarimoNotebook.py`

1. **In `generate_python()` method:**
   - Generate metadata
   - Add validation cell before other cells

### CacaoSidecar (Declarative)

**Location of changes:** `src/generate/CacaoSidecar.py`

1. **In `to_dict()` method:**
   - Add `template_metadata` field to CACAO structure
   - Include all version information

---

## 3. Orchestrator Integration

**Location:** SOAR/orchestration layer (external to this codebase)

```python
REDACTED
```

---

## 4. Test Cases

Create `tests/test_template_version_control.py` with:

- **Test `TemplateMetadata`** (3 tests)
  - Test initialization with valid data
  - Test `age_days()` calculation
  - Test `.to_json()` serialization

- **Test `TemplateValidator`** (6 tests)
  - `test_validate_fresh_template` — passes if age ≤ max_age
  - `test_validate_expired_template` — raises exception if age > max_age
  - `test_expiration_threshold` — exact boundary condition
  - `test_exception_message` — includes metadata details
  - `test_validation_results_dict` — correct structure
  - `test_age_calculation_accuracy` — days calculated correctly

- **Test `TemplateMetadataGenerator`** (5 tests)
  - `test_capture_git_info` — retrieves commit hash/date/branch
  - `test_capture_git_info_no_repo` — handles missing .git gracefully
  - `test_generate_metadata` — creates valid TemplateMetadata
  - `test_metadata_includes_timestamp` — current time captured
  - `test_generate_validation_code` — produces valid Python

- **Integration tests** (6 tests)
  - `test_v2_metadata_in_notebook` — metadata in notebook metadata
  - `test_v1_validation_cell_first` — validation cell is Cell 0
  - `test_marimo_validation_before_app_cells` — validation runs first
  - `test_cacao_metadata_field` — CACAO structure includes metadata
  - `test_validation_code_executable` — generated code runs without errors
  - `test_exception_caught_by_orchestrator` — exception propagates correctly

**Total:** ~20 tests

---

## 5. Success Criteria

- ✅ All 20+ tests pass
- ✅ Every playbook stamped with generation metadata
- ✅ Git commit hash and timestamp captured
- ✅ Freshness validation enforced in first cell
- ✅ Templates >90 days old rejected at runtime
- ✅ Exception message includes regeneration instructions
- ✅ Orchestrator can catch and handle exception
- ✅ Automatic regeneration + retry workflow supported
