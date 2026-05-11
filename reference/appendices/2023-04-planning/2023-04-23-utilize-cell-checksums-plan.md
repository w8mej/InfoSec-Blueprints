# Implementation Plan: Utilize Cell Checksums for Integrity Verification

## Context

Jupyter notebooks are JSON files stored on disk. An attacker or misconfigured automation could:

- Manually edit cell source code on the execution server
- Inject malicious code into cells (e.g., exfiltrate incident data, disable containment)
- Replace agent logic with prompt-injection payloads
- Bypass audit logging by modifying cells silently

This plan introduces cryptographic checksums for all cells at build time, enabling runtime integrity verification before execution.

---

## Feature Overview

**Objective:** Compute SHA-256 checksums for every cell's source code at notebook generation time, store in notebook metadata, and verify at runtime to detect tampering.

**Scope:**

- Cell checksum calculation at build time (SigmaNotebookV2.py, SigmaNotebook.py, etc.)
- Checksum storage in notebook metadata: `nb.metadata['cell_integrity']`
- Runtime verification before cell execution (IPython pre_execute hook)
- Tampering detection alerts to SIEM and incident management

**Success Criteria:**

- All generated notebooks have cell checksums in metadata
- Runtime verification detects any cell source modification
- Tampering triggers security alert and execution halt
- Checksums cover code cells and Markdown cells
- Performance: <100ms for full notebook verification

---

## Implementation Details

### 1. Checksum Computation Layer: `src/runtime/cell_integrity.py`

```python
REDACTED
```

---

### 2. Runtime Verification Layer: `src/runtime/cell_integrity_verifier.py`

```python
REDACTED
```

---

### 3. IPython Hook Registration: `src/runtime/ipython_hooks.py`

```python
REDACTED
```

---

### 4. Generator Integration

**SigmaNotebookV2.py:**

- In `build()` method, after all cells are added:
  ```python
  REDACTED
```
- In Cell 0 (Setup), add:
  ```python
  REDACTED
```

**SigmaNotebook.py:**

- Same checksum computation in `write()` method
- Register hook in bootstrap cell

**MarimoNotebook.py:**

- Checksum computation at `write()` time
- Hook registration in initial @reactive cell
- Marimo handles pre-execution hooks via built-in lifecycle

**CacaoSidecar.py:**

- Add `integrity_config` to CACAO playbook:
  ```json
  {
    "integrity_config": {
      "algorithm": "sha256",
      "cell_checksums": { "step_id": "hash", ... },
      "verification_required": true,
      "tampering_action": "halt_and_alert"
    }
  }
  ```

---

### 5. Checksum Metadata Storage Format

**In Notebook Metadata:**

```json
{
  "cell_integrity": {
    "cell_0_setup": {
      "sha256": "a1b2c3d4...",
      "length": 1245,
      "type": "code",
      "computed_at": "2023-04-26T14:30:00Z"
    },
    "cell_1_overview": {
      "sha256": "e5f6g7h8...",
      "length": 892,
      "type": "markdown",
      "computed_at": "2023-04-26T14:30:00Z"
    },
    ...
  }
}
```

**In CACAO Playbook:**

```json
{
  "integrity_config": {
    "algorithm": "sha256",
    "cell_checksums": {
      "step_1": "a1b2c3d4e5f6g7h8i9j0...",
      "step_2": "k1l2m3n4o5p6q7r8s9t0...",
      ...
    },
    "verification_required": true,
    "tampering_action": "halt_and_alert"
  }
}
```

---

## Integration Points Summary

| Generator       | Location       | Integration Method                        |
| --------------- | -------------- | ----------------------------------------- |
| SigmaNotebookV2 | `build()`      | Compute checksums, store in metadata      |
| SigmaNotebook   | `write()`      | Compute checksums, store in metadata      |
| MarimoNotebook  | `write()`      | Compute checksums, store in cell metadata |
| CacaoSidecar    | `to_dict()`    | Add integrity_config block                |
| All             | Cell 0 (Setup) | Register IPython pre_execute hook         |

---

## Testing Strategy

Unit tests (18+ tests):

- `test_compute_cell_hash_deterministic()` — Same source → same hash
- `test_compute_cell_hash_normalized_line_endings()` — \r\n and \n produce same hash
- `test_compute_cell_hash_unicode()` — Unicode characters hashed correctly
- `test_compute_notebook_checksums()` — All cells in notebook checksummed
- `test_verify_notebook_integrity_pass()` — Notebook with unchanged cells passes
- `test_verify_notebook_integrity_fail_one_cell()` — One modified cell detected
- `test_verify_notebook_integrity_fail_multiple_cells()` — Multiple modifications detected
- `test_missing_checksum_in_metadata()` — Notebook without checksums allowed (warning)
- `test_dynamic_cell_addition()` — Dynamically added cells don't fail verification
- `test_tampering_alert_message()` — Alert includes tampered cell list
- `test_siem_event_creation()` — SIEM event has correct structure
- `test_performance_full_verification()` — 100-cell notebook verified in <100ms

Integration tests:

- `test_notebook_generated_with_checksums()` — Generated notebook has cell_integrity metadata
- `test_execution_hook_registered()` — IPython hook registered at startup
- `test_tampering_halts_execution()` — Modified cell prevents notebook run
- `test_forensic_details_preserved()` — Tampered cell details logged to incident state

---

## Success Metrics

1. **Coverage:** 100% of code + markdown cells have checksums
2. **Detection:** Any single-byte modification detected within <100ms
3. **False Positives:** 0 (no legitimate notebook changes trigger false alerts)
4. **Alert Response:** Tampering alert reaches SOC within 5 seconds
5. **Forensics:** All tampered cells logged to incident timeline with before/after hashes

---

## Risks & Mitigations

| Risk                                                 | Mitigation                                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Notebook legitimately modified between build and run | Operator can regenerate with latest build; version control tracks approved changes |
| Checksum computation/verification adds latency       | Cache checksums, verify only once at startup, <100ms target                        |
| Attacker modifies both source AND metadata checksums | Notebooks versioned in git; any metadata change is audited                         |
| Hash collision (extremely unlikely)                  | SHA-256 has 2^256 possible outputs; collision probability is negligible            |
