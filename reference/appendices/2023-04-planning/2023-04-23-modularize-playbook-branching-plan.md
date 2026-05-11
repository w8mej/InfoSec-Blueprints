# Implementation Plan: Modularize Playbook Branching

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook  
**Applies to:** Multi-step incident playbooks with probabilistic branching (containment, eradication, recovery)  
**Priority:** HIGH (Maintainability, scalability, agent navigation)

## Overview

Monolithic playbooks with massive if/else trees become unmaintainable, brittle, and impossible for agents to navigate. This feature enables modular, DAG-orchestrated playbooks where a parent "router" notebook dynamically links to smaller "atomic" notebooks based on probabilistic agent decisions. Each atomic notebook is fully self-contained, independently executable, and stateless given correct input context. This reduces cognitive load on both humans and agents, improves testability, and enables parallel execution paths.

---

## 1. Runtime Module: `playbook_branching_orchestrator.py`

### Location

`src/runtime/playbook_branching_orchestrator.py` (new file)

### Classes & Methods

#### `PlaybookBranch` (dataclass)

```python
REDACTED
```

#### `BranchingDecision` (dataclass)

```python
REDACTED
```

#### `PlaybookOrchestrator` (class)

```python
REDACTED
```

#### `PlaybookStateSchema` (class)

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2 (Jupyter V2)

**Location:** Cell 4 (branching router) — NEW CELL replacing branching logic

```python
REDACTED
```

### SigmaNotebook (Jupyter V1)

**Location:** Template injection in branching cell

Similar pattern, with state management through cell output variables.

### MarimoNotebook

**Location:** Router cell in reactive DAG

Marimo's reactive scheduling ensures dependencies are satisfied before atomic notebooks execute.

### CacaoSidecar

**Location:** `workflow` array with `steps` as atomic sub-workflows

Maps branches to CACAO step objects with state passing via `target` and `step_variables`.

---

## 3. Atomic Notebook Template

### Structure: `templates/atomic/Containment_Isolate_Endpoint.ipynb`

**Cell 0 (Bootstrap):**

```python
REDACTED
```

**Cell 1-3 (Containment Logic):**
Execute isolation steps independently using incident_state.

**Cell 4 (Output State):**

```python
REDACTED
```

---

## 4. Test Cases

Create `tests/test_playbook_branching_orchestrator.py` with 20+ tests:

- **Test PlaybookBranch** (2 tests)
  - Initialization and serialization
  - Precondition/postcondition validation

- **Test PlaybookOrchestrator** (8 tests)
  - Route decision with valid agent selection
  - Route decision with invalid branch ID (raises ValueError)
  - Validate preconditions met before execution
  - Validate preconditions missing (raises ValueError)
  - Execute branch with papermill
  - Execute branch fallback (nbconvert)
  - Timeout handling on long-running notebook
  - Get orchestration summary

- **Test PlaybookStateSchema** (6 tests)
  - Validate valid incident_state
  - Validate missing required field (raises ValueError)
  - Validate optional field type mismatch (raises TypeError)
  - Merge parent and child state without conflict
  - Merge parent and child with child overwrite
  - Validate merged state after merge

- **Test BranchingDecision** (2 tests)
  - Initialization with all fields
  - Serialization to dict

- **Integration tests** (2 tests)
  - Full flow: orchestrate → decide → execute → merge → continue
  - DAG traversal: multiple sequential branches with state threading

**Total:** ~20 tests

---

## 5. Success Criteria

- ✅ Orchestrator routes decisions without executing monolithic if/else
- ✅ State schema enforced between parent and child notebooks
- ✅ Atomic notebooks independently executable with correct input state
- ✅ Papermill execution with state parameter passing working
- ✅ Fallback nbconvert execution available on systems without papermill
- ✅ Branching decisions logged with confidence, reasoning, alternatives
- ✅ DAG validation prevents cycles and invalid transitions
- ✅ All 20+ tests passing
- ✅ <2sec overhead per branch routing decision
