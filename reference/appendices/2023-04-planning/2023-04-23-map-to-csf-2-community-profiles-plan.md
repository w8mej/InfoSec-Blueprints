# Implementation Plan: Map to CSF 2.0 Community Profiles

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook, CacaoSidecar  
**Applies to:** All playbook types  
**Priority:** MEDIUM (Risk management, compliance reporting, strategic coverage visibility)

## Overview

Map every playbook to NIST Cybersecurity Framework 2.0 identifiers to enable risk assessment, compliance gap analysis, and strategic coverage reporting. Each playbook is tagged with CSF 2.0 functions and categories that align with its detection and response logic, enabling downstream reporting on coverage vs. execution across organizational assets.

---

## 1. Runtime Module: `csf_2_0_mapper.py`

### Location

`src/runtime/csf_2_0_mapper.py` (new file)

### Classes & Methods

#### `CSFIdentifier` (dataclass)

```python
REDACTED
```

#### `CSF20FrameworkRegistry` (static class)

Contains the complete CSF 2.0 taxonomy mapping.

```python
REDACTED
```

#### `CSFPlaybookMapper` (class)

Maps a playbook to CSF identifiers.

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2 (Jupyter V2)

**Location of changes:** `src/generate/SigmaNotebookV2.py`

1. **In `__init__` method:**
   - Call `CSFPlaybookMapper.map_playbook(self.iap)` and store as `self.csf_mapping`

2. **In notebook metadata:**
   - Embed `csf_mapping` in notebook-level metadata

### SigmaNotebook (Jupyter V1)

**Location of changes:** `src/generate/SigmaNotebook.py`

1. **In initialization:**
   - Generate CSF mapping and store in instance

2. **In metadata:**
   - Include CSF data in notebook metadata

### MarimoNotebook (Reactive DAG)

**Location of changes:** `src/generate/MarimoNotebook.py`

1. **In `__init__`:**
   - Generate and store CSF mapping

### CacaoSidecar (Declarative)

**Location of changes:** `src/generate/CacaoSidecar.py`

1. **In `to_dict()` method:**
   - Add `csf_2_0_mapping` field to CACAO structure with functions, categories, subcategories

---

## 3. Reporting Integration

### Analytics Module

**Location:** `src/generate/generate_analytics.py` (extend existing)

```python
REDACTED
```

---

## 4. Test Cases

Create `tests/test_csf_2_0_mapper.py` with:

- **Test CSFIdentifier** (2 tests)
  - Test initialization
  - Test serialization

- **Test CSF20FrameworkRegistry** (6 tests)
  - Test taxonomy retrieval
  - Test Sigma tag mapping
  - Test playbook type mapping
  - Test comprehensive registry completeness
  - Test edge cases (unknown tags)
  - Test mapping consistency

- **Test CSFPlaybookMapper** (5 tests)
  - Map playbook to CSF
  - Verify coverage counts
  - Test with different playbook types
  - Test with different Sigma tags
  - Test edge cases (empty tags)

- **Integration tests** (4 tests)
  - V2 playbook includes CSF mapping
  - V1 playbook includes CSF mapping
  - Marimo playbook includes CSF mapping
  - CACAO sidecar includes CSF mapping

**Total:** ~17 tests

---

## 5. Success Criteria

- ✅ CSF 2.0 taxonomy fully mapped in registry
- ✅ Sigma rule tags linked to CSF subcategories
- ✅ Playbook types linked to CSF functions
- ✅ Every playbook exports CSF mapping
- ✅ Coverage aggregation report working
- ✅ All 17+ tests passing
- ✅ No performance regression in playbook generation
