# Specification: Query Translation Engine (Multi-SIEM)

**Version**: 0.3.0  
**Status**: Pending Implementation  
**Owner**: Gemini Flash  
**Date**: 2023-04-27

---

## Problem Statement

Current query_standardization maps field names across SIEMs (Splunk `src` ↔ Elastic `source.ip`), but doesn't translate Sigma detection logic into vendor-specific query syntax.

### Gap

- Sigma rule: `selection: process_creation | process_name: cmd.exe AND parent_image: explorer.exe`
- Splunk query needed: `process=cmd.exe parent_process=explorer.exe`
- Elastic query needed: `process.name: "cmd.exe" AND process.parent.executable: "explorer.exe"`
- Current state: Only field mapping, not syntax translation

### Current State

- `query_standardization.py` maps field aliases
- Sigma → Splunk, Elastic, Datadog requires manual translation
- No automated syntax conversion

### Target State

- Auto-parse Sigma detection logic
- Generate vendor-specific queries (Splunk SPL, Elastic KQL, Datadog, Sumo Logic)
- Both human-readable and executable formats
- Support complex operators (AND, OR, NOT, LIKE, REGEX, IN, comparisons)

---

## Goals

1. **Eliminate manual query translation** for SOC analysts
2. **Support all major SIEMs** (Splunk, Elastic, Datadog, Sumo Logic)
3. **Maintain high fidelity** (translated queries match Sigma intent)
4. **Generate readable queries** for analyst review and modification
5. **Enable cross-SIEM playbooks** (same Sigma rule, any SIEM)

---

## Functional Requirements

### R1: Sigma Detection Logic Parser

**Files**: `src/runtime/sigma_parser.py` (NEW)

```python
REDACTED
```

**Requirements**:

- R1.1: Parse Sigma detection section (selections, condition)
- R1.2: Support common operators (EQ, NEQ, CONTAINS, REGEX, IN, comparisons)
- R1.3: Standardize field names using NamedFieldRegistry
- R1.4: Handle list values (IN operator)

### R2: Vendor Query Translators

**Files**: `src/runtime/query_translator.py` (NEW)

```python
REDACTED
```

**Requirements**:

- R2.1: Support Splunk, Elastic, Datadog, Sumo Logic
- R2.2: Field mapping for each platform
- R2.3: Operator translation (EQ, NEQ, CONTAINS, REGEX, IN)
- R2.4: Return human-readable queries (analyzable, editable)

### R3: SigmaNotebookV2 Integration

**Files**: `src/generate/SigmaNotebookV2.py` (modify `_add_cell_2_preconditions()`)

```python
REDACTED
```

**Requirements**:

- R3.1: Cell 2 translates Sigma rule to all SIEM platforms
- R3.2: Queries displayed for analyst review
- R3.3: Queries available for evidence_collection cell

---

## Test Specifications

### Unit Tests (30+)

**File**: `tests/test_query_translator.py`

```python
REDACTED
```

**Coverage Target**: >= 80%

---

## Success Criteria

- [ ] Sigma parser handles selections, conditions, operators
- [ ] 4 vendor translators implemented (Splunk, Elastic, Datadog, Sumo Logic)
- [ ] Field mapping for each platform
- [ ] SigmaNotebookV2 Cell 2 generates translated queries
- [ ] 30+ unit tests with 10+ real Sigma rules tested
- [ ] Human-readable query output (not garbled)
- [ ] Analyst can copy-paste queries directly into SIEM

---

## Acceptance Checklist

- [ ] Code review passed
- [ ] All tests passing
- [ ] Type checking passed
- [ ] Manual test with 10+ real Sigma rules
- [ ] Generated queries verified in actual SIEM platforms
- [ ] Feature doc created (`docs/guides/query-translation-guide.md`)
