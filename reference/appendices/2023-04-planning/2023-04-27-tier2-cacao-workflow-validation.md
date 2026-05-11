# TIER 2.4: CacaoSidecar Workflow Step Validation

**Problem**: No validation that workflow steps are reachable or that edges point to valid steps.

**Solution**: Validate CACAO workflow DAG before serialization.

**Files**:

- `src/generate/CacaoSidecar.py` — Add `_validate_workflow()` method
- `tests/test_cacao_sidecar.py` — 15+ workflow validation tests

**Requirements**:

- [ ] All `on_completion` steps exist in workflow dict
- [ ] No unreachable steps (orphaned nodes)
- [ ] Start step leads to end step
- [ ] No cycles in workflow (except loops)
- [ ] Validation runs before `to_dict()` returns

**Implementation**:

```python
REDACTED
```

**Success**: 15+ tests pass, no unreachable workflow steps.
