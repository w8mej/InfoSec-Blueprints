# Implementation Plan: STIX 2.1 COA Extensions

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook, CacaoSidecar  
**Applies to:** All playbook types  
**Priority:** HIGH (TIP integration & threat intelligence standardization)

## Overview

Implement STIX 2.1 Course of Action (COA) export for every playbook, enabling integration with Threat Intelligence Platforms (TIPs) like MISP, OpenCTI, and others. Each playbook is converted into a STIX COA object linked to MITRE ATT&CK techniques, allowing automated sharing of response strategies across organizations.

---

## 1. Runtime Module: `stix_coa_generator.py`

### Location

`src/runtime/stix_coa_generator.py` (new file)

### Classes & Methods

#### `STIXCourseOfAction` (dataclass)

```python
REDACTED
```

#### `STIXRelationship` (dataclass)

```python
REDACTED
```

#### `STIXBundle` (dataclass)

```python
REDACTED
```

#### `COAGenerator` (class)

Transforms playbooks into STIX COA objects.

```python
REDACTED
```

#### `STIXExporter` (class)

Handles STIX export and file operations.

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2 (Jupyter V2)

**Location of changes:** `src/generate/SigmaNotebookV2.py`

1. **In `save()` method:**
   - After saving .ipynb, also export STIX bundle
   - Call `STIXExporter.export_to_file(self.iap, stix_path)`

### SigmaNotebook (Jupyter V1)

**Location of changes:** `src/generate/SigmaNotebook.py`

1. **In `save()` method:**
   - Export STIX alongside .ipynb

### MarimoNotebook (Reactive DAG)

**Location of changes:** `src/generate/MarimoNotebook.py`

1. **In `save()` method:**
   - Export STIX alongside .marimo.py

### CacaoSidecar (Declarative)

**Location of changes:** `src/generate/CacaoSidecar.py`

1. **In `save()` method:**
   - Export STIX alongside .cacao.json
   - Include STIX bundle metadata in CACAO structure

---

## 3. Test Cases

Create `tests/test_stix_coa_generator.py` with:

- **Test `STIXCourseOfAction`** (2 tests)
  - Test initialization and field validation
  - Test `.to_dict()` serialization

- **Test `STIXRelationship`** (2 tests)
  - Test initialization
  - Test `.to_dict()` serialization

- **Test `STIXBundle`** (2 tests)
  - Test bundle creation
  - Test JSON serialization

- **Test `COAGenerator`** (8 tests)
  - `test_extract_mitre_techniques` — parses Sigma tags correctly
  - `test_generate_course_of_action` — creates valid COA object
  - `test_coa_includes_severity` — severity mapped correctly
  - `test_coa_includes_playbook_type` — type extracted from IAP
  - `test_generate_relationships` — creates relationship objects
  - `test_relationships_link_to_mitre` — relationship targets correct MITRE technique
  - `test_generate_bundle` — complete bundle created
  - `test_bundle_includes_coa_and_relationships` — all objects present

- **Test `STIXExporter`** (4 tests)
  - `test_export_to_file` — writes valid JSON file
  - `test_export_creates_directory` — creates path if missing
  - `test_export_with_playbook` — exports both playbook and STIX
  - `test_stix_json_valid` — output validates against STIX schema

- **Integration tests** (4 tests)
  - `test_v2_playbook_exports_stix` — SigmaNotebookV2 integration
  - `test_v1_playbook_exports_stix` — SigmaNotebook integration
  - `test_marimo_playbook_exports_stix` — MarimoNotebook integration
  - `test_cacao_playbook_exports_stix` — CacaoSidecar integration

**Total:** ~22 tests

---

## 4. Success Criteria

- ✅ All 22+ tests pass
- ✅ Every playbook exports valid STIX 2.1 COA bundle
- ✅ MITRE ATT&CK techniques linked via relationships
- ✅ STIX files alongside playbook artifacts (.ipynb, .cacao.json, .marimo.py)
- ✅ COA objects include playbook metadata (title, description, severity)
- ✅ Relationships correctly reference STIX technique IDs
- ✅ STIX bundles importable into MISP/OpenCTI
- ✅ No performance regression in playbook generation
