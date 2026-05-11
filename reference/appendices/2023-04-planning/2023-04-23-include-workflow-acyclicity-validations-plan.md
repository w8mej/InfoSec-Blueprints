# Implementation Plan: Workflow Acyclicity Validations

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook, CacaoSidecar  
**Applies to:** All notebook types + CACAO  
**Priority:** CRITICAL (autonomous agent safety - prevent infinite loops)

## Overview

Implement static graph-based validation to ensure all playbook execution paths are Directed Acyclic Graphs (DAGs) with no cycles. This prevents agent runaway loops and guarantees deterministic termination. Cycles are detected at generation time, blocking deployment of cyclic playbooks.

---

## 1. Runtime Module: `workflow_acyclicity.py`

### Location

`src/runtime/workflow_acyclicity.py` (new file)

### Classes & Methods

#### `ExecutionNode` (dataclass)

```python
REDACTED
```

#### `ExecutionEdge` (dataclass)

```python
REDACTED
```

#### `WorkflowGraph` (class)

Represents playbook execution flow as a directed graph.

```python
REDACTED
```

#### `WorkflowValidator` (class)

Validates playbook structure at generation time.

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2 (Jupyter V2)

**Location of changes:** `src/generate/SigmaNotebookV2.py`

1. **In `__init__` method:**
   - Validate workflow acyclicity early
   - Fail fast if cycles detected

2. **In `_build` method (at start):**
   - Call `WorkflowValidator.validate_playbook(self.iap)`
   - Catch `AcyclicValidationException` and re-raise with generator context

### SigmaNotebook (Jupyter V1)

**Location of changes:** `src/generate/SigmaNotebook.py`

1. **In initialization:**
   - Run acyclicity check before generating template
   - Halt if cycles found

### MarimoNotebook (Reactive DAG)

**Location of changes:** `src/generate/MarimoNotebook.py`

1. **In `generate_python()` method:**
   - Extract Marimo cell dependency graph
   - Validate against cycles before rendering

### CacaoSidecar (Declarative)

**Location of changes:** `src/generate/CacaoSidecar.py`

1. **In `to_dict()` method:**
   - Validate CACAO workflow structure
   - Check for cycles in step transitions

---

## 3. Build Pipeline Integration

Add validation step to `Makefile` or build script:

```makefile
playbooks/validate-acyclicity:
	@python -c "from src.generate.workflow_acyclicity import WorkflowValidator; \
	             from src.IncidentActionPlan import IncidentActionPlanModel; \
	             for iap in load_all_playbooks(): \
	               WorkflowValidator.validate_playbook(iap)"

playbooks/generate: playbooks/validate-acyclicity
	$(PYTHON) -m src.generate.generate_all_playbooks
```

---

## 4. Test Cases

Create `tests/test_workflow_acyclicity.py` with:

- **Test `ExecutionNode` and `ExecutionEdge`** (2 tests)
  - Test dataclass initialization
  - Test edge creation

- **Test `WorkflowGraph`** (10 tests)
  - `test_add_node` — node added to graph
  - `test_add_edge` — edge added correctly
  - `test_adjacency_list_updated` — adjacency structure correct
  - `test_is_acyclic_true` — DAG returns True
  - `test_is_acyclic_false` — cyclic graph returns False
  - `test_find_cycles_simple` — finds single cycle
  - `test_find_cycles_multiple` — finds multiple cycles
  - `test_topological_sort_success` — returns valid sort for DAG
  - `test_topological_sort_raises_on_cycle` — raises error for cyclic graph
  - `test_validate_comprehensive` — full validation output

- **Test `WorkflowValidator`** (4 tests)
  - `test_build_graph_from_iap` — extracts graph from playbook
  - `test_validate_playbook_success` — passes for acyclic playbook
  - `test_validate_playbook_fails_on_cycle` — raises exception for cycle
  - `test_exception_contains_cycle_details` — error message includes cycle path

- **Integration tests** (4 tests)
  - `test_v2_playbook_acyclicity` — SigmaNotebookV2 validates
  - `test_v1_playbook_acyclicity` — SigmaNotebook validates
  - `test_marimo_playbook_acyclicity` — MarimoNotebook validates
  - `test_cacao_playbook_acyclicity` — CacaoSidecar validates

**Total:** ~20 tests

---

## 5. Success Criteria

- ✅ All 20+ tests pass
- ✅ Cycles detected at generation time (before deployment)
- ✅ Specific cycle paths reported in error message
- ✅ DAG validation enforced in build pipeline
- ✅ No cyclic playbooks can be generated
- ✅ Topological sort available for execution planning
- ✅ Terminal nodes identified
