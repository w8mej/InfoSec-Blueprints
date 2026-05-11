# TIER 2.2: MarimoNotebook Reactive DAG Update

**Version**: 0.3.0  
**Status**: Pending Implementation  
**Owner**: Gemini Flash  
**Date**: 2023-04-27

---

## Problem Statement

MarimoNotebook generates reactive cells with `mo.reactive()`, but doesn't properly define dependencies when:

- Named field standardization changes → downstream cells should re-execute
- JSON validation errors occur → retry logic should trigger
- Compliance timestamps change → report should regenerate

Currently, Marimo cells are static (not truly reactive on upstream changes).

---

## Functional Requirements

### R1: Define Reactive Dependencies

**Files**: `src/generate/MarimoNotebook.py` (modify `generate_python()`)

```python
REDACTED
```

**Requirements**:

- R1.1: Mark cells as reactive (`@mo.reactive`)
- R1.2: Define explicit dependencies between cells
- R1.3: Evidence cell re-runs if fields change
- R1.4: Report cell re-runs if timestamp config changes

### R2: Test Marimo Reactivity

**Files**: `tests/test_marimo_notebook.py` (add 10+ tests)

```python
REDACTED
```

---

## Success Criteria

- [ ] Marimo cells have `@mo.reactive` decorators
- [ ] Dependencies explicitly defined
- [ ] 10+ tests verifying reactivity
- [ ] Manual test: change field, verify downstream re-execution
