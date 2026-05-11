# Implementation Plan: Dry-Run Mode

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook, CacaoSidecar  
**Applies to:** All notebook types (though CacaoSidecar is declarative, dry-run schema is exported)  
**Priority:** CRITICAL (blast radius validation & HITL safety)

## Overview

Implement mandatory dry-run mode for all state-mutating actions. Before an agent requests human approval for a destructive action (firewall block, process kill, AD disable, etc.), it must first execute the action in dry-run mode, parse the blast radius output, and present empirical evidence to the human. This prevents catastrophic accidents by forcing empirical data-driven approval workflows.

---

## 1. Runtime Module: `dry_run_wrapper.py`

### Location

`src/runtime/dry_run_wrapper.py` (new file)

### Classes & Methods

#### `DryRunMode` (enum)

```python
REDACTED
```

#### `BlastRadius` (dataclass)

```python
REDACTED
```

#### `DryRunExecutor` (class)

Orchestrates dry-run execution flow.

```python
REDACTED
```

#### `ToolSchemaExtension` (class)

Modifies tool schemas to require dry-run parameter.

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2 (Jupyter V2)

**Location of changes:** `src/generate/SigmaNotebookV2.py`

1. **In `__init__` method:**
   - Instantiate `DryRunExecutor` for state-mutating tools

2. **In runtime imports:**
   - Add `DryRunExecutor`, `BlastRadius`, `ToolSchemaExtension`

3. **In `_add_cell_5_state_mutation()` method (containment dispatch):**
   - Call `ToolSchemaExtension.inject_dry_run_parameter()` on tool schemas
   - Inject dry-run enforcement prompt into system prompt
   - Wrap containment action in executor:
     ```python
     REDACTED
```

### SigmaNotebook (Jupyter V1)

**Location of changes:** `src/generate/SigmaNotebook.py`

1. **In bootstrap cell:**
   - Instantiate `DryRunExecutor` and tool schema extension
   - Inject dry-run enforcement prompt

2. **In containment injection method:**
   - Wrap containment dispatch in dry-run → approval → live execution pattern
   - Parse and display blast radius before HITL widget

### MarimoNotebook (Reactive DAG)

**Location of changes:** `src/generate/MarimoNotebook.py`

1. **In header cell:**
   - Import `DryRunExecutor`, `BlastRadius`, `ToolSchemaExtension`

2. **In mutation cell:**
   - Add dry-run flag to tool calls
   - Display blast radius before approval button
   - Only execute live on approval

### CacaoSidecar (Declarative)

**Location of changes:** `src/generate/CacaoSidecar.py`

1. **In `to_dict()` method:**
   - Add `dry_run_mode_enabled` field to `execution_constraints`
   - Include tool schema extensions with dry_run parameters

---

## 3. Test Cases

Create `tests/test_dry_run_wrapper.py` with:

- **Test `BlastRadius` serialization** (2 tests)
  - Test `.to_json()` output is valid JSON
  - Test validation rejects negative/invalid values

- **Test `DryRunExecutor`** (8 tests)
  - `test_execute_dry_run_success` — returns BlastRadius
  - `test_execute_dry_run_parse_output` — parses tool output correctly
  - `test_execute_live_after_approval` — executes live after dry-run
  - `test_blast_radius_parsing` — extracts metrics from output
  - `test_approval_prompt_generation` — creates human-readable text
  - `test_should_proceed_logic` — gates on approval and impact
  - `test_tool_schema_injection` — adds dry_run parameter
  - `test_enforcement_prompt_injection` — system prompt includes dry-run protocol

- **Integration tests** (4 tests)
  - `test_full_workflow_v2` — SigmaNotebookV2 dry-run → approval → live
  - `test_full_workflow_v1` — SigmaNotebook integration
  - `test_marimo_integration` — MarimoNotebook reactive dry-run
  - `test_cacao_schema_dry_run` — CACAO export includes dry-run config

**Total:** ~14 tests

---

## 4. Success Criteria

- ✅ All 14+ tests pass
- ✅ Every mutating action requires dry-run before approval
- ✅ Blast radius accurately extracted and displayed
- ✅ Agent prompted to run dry-run first (system prompt injection)
- ✅ Human sees empirical data before approving destruction
- ✅ Tool schemas extended with `dry_run: bool` parameter
- ✅ CacaoSidecar exports dry-run configuration
- ✅ No false positives in dry-run execution
