# Implementation Plan: Require Named Field Standardization

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook, CacaoSidecar  
**Applies to:** All playbook types  
**Priority:** HIGH (SIEM integration, orchestrator compatibility, data validation)

## Overview

Normalize input field names across all playbooks to enable seamless SIEM integration and orchestrator compatibility. Every playbook declares its required input fields using a standard schema (e.g., `src_ip`, `dest_ip`, `user_principal_name`). The orchestrator maps SIEM-specific field names (Splunk `src`, CrowdStrike `LocalAddressIP4`, Sentinel `SourceIP`) to these standardized names before playbook execution. Validation enforces all required fields are populated, with clear error messages guiding SIEM operators on how to map their data.

---

## 1. Runtime Module: `named_field_registry.py`

### Location

`src/runtime/named_field_registry.py` (new file)

### Classes & Methods

#### `FieldMapping` (dataclass)

```python
REDACTED
```

#### `NamedFieldRegistry` (static class)

Complete mapping of standard fields to aliases and SIEM-specific names.

```python
REDACTED
```

#### `FieldStandardizationValidator` (class)

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2 (Jupyter V2)

**Location of changes:** `src/generate/SigmaNotebookV2.py`

1. **In `__init__` method:**
   - Extract required fields from IAP metadata
   - Store as `self.required_fields`

2. **In `_add_cell_2_preconditions()` method:**
   - Add validation code block: `FieldStandardizationValidator.generate_validation_code(self.required_fields)`
   - This cell MUST run before any other cells

3. **In notebook metadata:**
   - Embed list of required fields for orchestrator reference

### SigmaNotebook (Jupyter V1)

**Location of changes:** `src/generate/SigmaNotebook.py`

1. **In `_inject_bootstrap_cell()` method:**
   - Generate and inject field validation code
   - Include mapping reference for orchestrator

### MarimoNotebook

**Location of changes:** `src/generate/MarimoNotebook.py`

1. **In `generate_python()` method:**
   - Add validation section in params/preconditions cell

### CacaoSidecar

**Location of changes:** `src/generate/CacaoSidecar.py`

1. **In `to_dict()` method:**
   - Add `named_fields_schema` block with required fields
   - Include aliases for orchestrator SIEM mapping

---

## 3. Orchestrator Integration

### Pseudo-Code

```python
REDACTED
```

---

## 4. Test Cases

Create `tests/test_named_field_registry.py` with 20+ tests:

- **Test FieldMapping** (2 tests)
  - Initialization
  - Serialization

- **Test NamedFieldRegistry** (10 tests)
  - Get standard fields list
  - Resolve Splunk field names
  - Resolve CrowdStrike field names
  - Resolve Sentinel field names
  - Resolve unknown fields (returns None)
  - Case-insensitive alias matching
  - Validate required fields present
  - Validate required fields non-null
  - Validate regex patterns
  - Handle empty context

- **Test FieldStandardizationValidator** (6 tests)
  - Generate validation code
  - Code is syntactically valid Python
  - Validation code checks required fields
  - Generate SIEM mapping code
  - Mapping code handles examples
  - Validation code includes help text

- **Integration tests** (4 tests)
  - V2 playbook includes validation cell
  - V1 playbook includes validation
  - Marimo playbook validation
  - CACAO sidecar schema inclusion

**Total:** ~22 tests

---

## 5. Success Criteria

- ✅ Standard field registry defined with 8+ core fields
- ✅ SIEM aliases mapped for Splunk, CrowdStrike, Sentinel, generic systems
- ✅ All playbooks declare required fields
- ✅ Validation cells generated with clear error messages
- ✅ Orchestrator can map SIEM payloads to standard names
- ✅ Playbook execution fails fast on missing fields
- ✅ All 22+ tests passing
- ✅ Zero manual mapping required by SOC operators
