# Specification: Signed Timestamp Proofs (Chainable Audit Trail)

**Version**: 0.3.0  
**Status**: Pending Implementation  
**Owner**: Gemini Flash  
**Date**: 2023-04-27

---

## Problem Statement

Current cell checksums are independent—no proof of ordering or causality between cells. An attacker could:

- Reorder cells (change sequence of evidence collection → containment)
- Splice cells from different incidents
- Claim events happened in wrong sequence

### Current State

- Each cell has SHA256 checksum
- No chain linking cells together
- No proof of temporal ordering

### Target State

- Each cell signature includes hash of previous cell's signature
- Chain is tamper-evident (breaking any link detects tampering)
- Timeline is reconstructable from chain
- Proof format works with both HMAC and KMS signatures

---

## Goals

1. **Create cryptographic proof** of event ordering
2. **Detect cell reordering** (proof chain breaks if cells moved)
3. **Enable forensic analysis** via chain traversal
4. **Immutable audit trail** (no modifications without detection)
5. **Support compliance requirements** (SEC, HIPAA, SOX)

---

## Functional Requirements

### R1: Signed Timestamp Proof Generation

**Files**: `src/runtime/signed_timestamps.py` (NEW)

```python
REDACTED
```

**Requirements**:

- R1.1: Each proof links to previous proof's hash
- R1.2: Chain breaks if any cell is modified or reordered
- R1.3: Validation detects tampering and reports location
- R1.4: Timeline export for forensic analysis

### R2: SigmaNotebookV2 Integration

**Files**: `src/generate/SigmaNotebookV2.py` (modify `_add_cell_6_evidentiary_signing()`)

Extend Cell 6 with timestamp chain:

```python
REDACTED
```

**Requirements**:

- R2.1: Cell 6 creates proof chain for all critical cells
- R2.2: Chain validation checks for tampering
- R2.3: Audit report displayed in cell output
- R2.4: Timeline exported to notebook metadata

### R3: Manual Verification Tool

**Files**: `src/scripts/verify_timestamp_chain.py` (NEW)

```python
REDACTED
```

**Requirements**:

- R3.1: Standalone verification of exported notebooks
- R3.2: Reports chain validity and timeline
- R3.3: Exit code 0 (valid) or 1 (invalid)

---

## Test Specifications

### Unit Tests (25+)

**File**: `tests/test_signed_timestamps.py`

```python
REDACTED
```

**Coverage Target**: >= 80%

---

## Success Criteria

- [ ] SignedTimestampProof dataclass defined
- [ ] ProofChain class with linking, validation, tampering detection
- [ ] SigmaNotebookV2 Cell 6 creates proof chain
- [ ] Standalone verification script created
- [ ] 25+ unit tests, >= 80% coverage
- [ ] Audit report generation working

---

## Acceptance Checklist

- [ ] Code review passed
- [ ] All tests passing
- [ ] Manual test: create proof chain, verify it validates
- [ ] Manual test: tamper with notebook, verify detection
- [ ] Feature doc created (`docs/guides/timestamp-proofs.md`)
