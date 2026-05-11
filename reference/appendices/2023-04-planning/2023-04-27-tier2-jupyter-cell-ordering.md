# TIER 2.3: Jupyter V1 SigmaNotebook Cell Ordering

**Problem**: Injected cells sometimes inserted in wrong order, breaking execution.

**Solution**: Enforce strict cell insertion order.

**Files**:

- `src/generate/SigmaNotebook.py` — Add cell insertion index validation
- `tests/test_sigma_notebook.py` — 10+ cell ordering tests

**Requirements**:

- [ ] Bootstrap cell (imports, logger) always first
- [ ] Preconditions before evidence collection
- [ ] Containment before postmortem
- [ ] Checksum of entire notebook matches expected fingerprint
- [ ] Integration test with 10 real Sigma rules

**Test Cases**:

```python
REDACTED
```

**Success**: All 626+ tests pass, manual verification with 10 Sigma rules.
