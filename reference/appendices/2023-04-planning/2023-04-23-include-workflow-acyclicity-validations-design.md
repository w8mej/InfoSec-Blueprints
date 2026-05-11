# Specification: Workflow Acyclicity Validations

## Overview

Autonomous agents can enter infinite loops if playbook logic contains cycles. This specification mandates static graph-based validation of all playbook execution paths to ensure they form Directed Acyclic Graphs (DAGs). Cycles are detected at generation time, preventing deployment of invalid playbooks.

---

## 1. Graph Data Structures

### ExecutionNode (Dataclass)

Represents a step/cell in the execution flow.

```json
{
  "node_id": "cell_3",
  "node_type": "cell",
  "label": "Evidence Capture",
  "is_terminal": false
}
```

#### Fields

| Field         | Type | Required | Description                                                |
| ------------- | ---- | -------- | ---------------------------------------------------------- |
| `node_id`     | str  | ✅       | Unique identifier ("cell_1", "step_triage")                |
| `node_type`   | str  | ✅       | Type: "cell", "step", "workflow_start", "workflow_end"     |
| `label`       | str  | ✅       | Human-readable name for debugging                          |
| `is_terminal` | bool | ✅       | True if this is an exit point (Complete, Escalate, Reject) |

### ExecutionEdge (Dataclass)

Represents a transition from one step to another.

```json
{
  "source_id": "cell_3",
  "target_id": "cell_4",
  "edge_type": "sequential",
  "condition": "if not dry_run"
}
```

#### Fields

| Field       | Type | Required | Description                                 |
| ----------- | ---- | -------- | ------------------------------------------- |
| `source_id` | str  | ✅       | From node ID                                |
| `target_id` | str  | ✅       | To node ID                                  |
| `edge_type` | str  | ✅       | "sequential", "conditional", "loop_back"    |
| `condition` | str  | ❌       | Optional condition (e.g., "if gate_passed") |

---

## 2. Runtime Module Implementation

### Module Structure

```
src/runtime/workflow_acyclicity.py

Classes:
- ExecutionNode (dataclass)
- ExecutionEdge (dataclass)
- WorkflowGraph (instance methods)
- WorkflowValidator (static methods)
- AcyclicValidationException (custom exception)
```

### WorkflowGraph (Instance Methods)

```python
REDACTED
```

### WorkflowValidator (Static Methods)

```python
REDACTED
```

---

## 3. Integration Examples

### SigmaNotebookV2 Integration

**Location:** `src/generate/SigmaNotebookV2.py`, `__init__` method

```python
REDACTED
```

### CacaoSidecar Integration

**Location:** `src/generate/CacaoSidecar.py`, `to_dict()` method

```python
REDACTED
```

---

## 4. Example: Cycle Detection

### Example 1: Simple Cycle

```python
REDACTED
```

### Example 2: Valid DAG with Terminal

```python
REDACTED
```

---

## 5. Build Pipeline Integration

### Makefile Example

```makefile
.PHONY: validate-acyclicity generate-playbooks

validate-acyclicity:
	@echo "🔍 Validating playbook workflow acyclicity..."
	@python -m src.validation.acyclicity_check --all-playbooks
	@echo "✅ All playbooks passed acyclicity validation"

generate-playbooks: validate-acyclicity
	@echo "📝 Generating playbooks..."
	@python -m src.generate.generate_all_playbooks

# Example usage:
# make validate-acyclicity    # Check without generating
# make generate-playbooks      # Validate + generate
```

---

## 6. Query Examples

### Check Workflow Validity

```python
REDACTED
```

---

## 7. Testing Reference

Create `tests/test_workflow_acyclicity.py` with 20+ tests:

**Unit Tests (14 tests)**

- Graph construction (2)
- Cycle detection: simple, multiple, self-loop (5)
- Acyclicity check (2)
- Topological sort (2)
- Terminal node identification (2)
- Validation results (1)

**Integration Tests (6 tests)**

- Full DAG validation
- Playbook extraction from IAP models
- Exception handling
- Multiple playbook types
- Error message formatting
