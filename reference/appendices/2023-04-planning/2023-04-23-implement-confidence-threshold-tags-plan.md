# Implementation Plan: Confidence Threshold Tags

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook, CacaoSidecar  
**Applies to:** All notebook types  
**Priority:** HIGH (automation safety & alert fidelity gating)

## Overview

Implement confidence threshold tagging to enforce statistical fidelity gates on agent autonomy. Every playbook must declare a `required_confidence` threshold (e.g., 85%). If an incoming alert's confidence score falls below this threshold, the playbook must downgrade to manual HITL approval regardless of other automation rules.

---

## 1. Runtime Module: `confidence_threshold.py`

### Location

`src/runtime/confidence_threshold.py` (new file)

### Classes & Methods

#### `ConfidenceTag` (dataclass)

```python
REDACTED
```

#### `ConfidenceThresholdValidator` (class)

Validates alert confidence against playbook requirements.

```python
REDACTED
```

#### `ConfidenceThresholdConfig` (class)

Manages playbook-level confidence requirements.

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2 (Jupyter V2, cell-based)

**Location of changes:** `src/generate/SigmaNotebookV2.py`

1. **In `__init__` method:**
   - Store threshold from `self.iap._required_confidence` (already exists in schema)

2. **In `_build` method (after preconditions cell):**
   - Call new method: `self._add_confidence_threshold_gate_cell()`

3. **New method `_add_confidence_threshold_gate_cell`:**
   - Generate cell that:
     - Imports `ConfidenceThresholdValidator`, `ConfidenceThresholdConfig`
     - Creates gate check using validator
     - Sets `REQUIRE_HITL = True` if below threshold
     - Displays warning with actual vs. required confidence percentages

4. **In `_add_cell_2_preconditions`:**
   - Add gate check code at top of cell
   - Display confidence threshold status inline

5. **In notebook metadata:**
   - Store `required_confidence` in cell metadata
   - Store computed `is_gate_passed` flag

### SigmaNotebook (Jupyter V1, template-driven)

**Location of changes:** `src/generate/SigmaNotebook.py`

1. **In `_inject_bootstrap_cell` method:**
   - Add confidence threshold config:
     ```python
     REDACTED
```

2. **In preconditions validation section:**
   - Display confidence gate result
   - If below threshold, show prominent warning

3. **In final metadata export:**
   - Include `confidence_config.to_metadata_dict()`

### MarimoNotebook (Reactive DAG)

**Location of changes:** `src/generate/MarimoNotebook.py`

1. **In params cell:**
   - Add `alert_confidence` slider (0-100) with default from IAP

2. **In preconditions cell:**
   - Add `ConfidenceThresholdConfig` parameter
   - Add gate check:
     ```python
     REDACTED
```

3. **In human_gate cell:**
   - Modify gate condition to also check confidence:
     ```python
     REDACTED
```

### CacaoSidecar (Declarative)

**Location of changes:** `src/generate/CacaoSidecar.py`

1. **In `to_dict` method:**
   - Add to `execution_constraints`:
     ```python
     REDACTED
```

---

## 3. Test Cases

Create `tests/test_confidence_threshold.py` with:

- **Test `ConfidenceTag` serialization** (2 tests)
  - Test `.to_json()` output is valid JSON
  - Test all fields are present and types correct

- **Test `ConfidenceThresholdValidator`** (8 tests)
  - `test_validate_threshold_range_valid` — accepts 0-100
  - `test_validate_threshold_range_invalid` — rejects <0 or >100
  - `test_validate_alert_confidence_valid` — accepts 0-100
  - `test_validate_alert_confidence_invalid` — rejects <0 or >100
  - `test_check_confidence_gate_above_threshold` — gate passes, is_above_threshold=True
  - `test_check_confidence_gate_below_threshold` — gate fails, downgrade_action="halt"
  - `test_check_confidence_gate_exact_threshold` — alert at threshold exactly passes
  - `test_generate_gate_check_code` — generates valid Python code block

- **Test `ConfidenceThresholdConfig`** (6 tests)
  - `test_init` — initializes with valid threshold
  - `test_set_alert_confidence` — updates confidence value
  - `test_set_alert_confidence_invalid` — rejects out-of-range
  - `test_is_gate_passed_true` — returns True when >= threshold
  - `test_is_gate_passed_false` — returns False when < threshold
  - `test_to_metadata_dict` — exports correct metadata structure

- **Integration tests** (4 tests)
  - `test_full_workflow_v2` — SigmaNotebookV2 integration end-to-end
  - `test_full_workflow_v1` — SigmaNotebook integration
  - `test_marimo_integration` — MarimoNotebook confidence gating
  - `test_cacao_confidence_schema` — CACAO sidecar schema export

**Total:** ~20 tests

---

## 4. Success Criteria

- ✅ All 20+ tests pass
- ✅ Every notebook type enforces confidence threshold gate
- ✅ Gate failure (alert below threshold) forces REQUIRE_HITL = True
- ✅ Gate success (alert meets threshold) allows autonomous execution
- ✅ Confidence metadata stored in notebook execution log
- ✅ No performance regression (<1% overhead)
- ✅ CacaoSidecar exports confidence_gating config
- ✅ Alert confidence slider in MarimoNotebook (0-100)
