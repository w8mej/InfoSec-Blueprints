# Implementation Plan: Sign Executions via Detached JWS

## Context

Incident response notebooks are legal artifacts. Operators and forensic teams must be able to cryptographically verify that:

1. Cell content has not been tampered with since execution
2. Execution order is preserved (timestamp proof)
3. No cells have been inserted, deleted, or reordered
4. Each cell's output matches what was originally captured

This plan implements per-cell cryptographic signing using detached JWS (JSON Web Signature) format, with HMAC-SHA256 (stdlib-compatible) signing, stored immutably in notebook metadata.

---

## Feature Overview

**Objective:** Every executed cell is cryptographically signed with a tamper-evident signature that survives notebook export, archival, and forensic analysis.

**Scope:**

- Capture cell execution state (source code, output, timestamp)
- Compute hash of execution payload
- Sign hash with HMAC-SHA256 using notebook-local key
- Store detached JWS in cell metadata
- Verify signatures on notebook load/export
- Support all 4 generator types

**Success Criteria:**

- 100% of executed cells have JWS signatures
- Signatures verify correctly after notebook save/load
- Tampering detection within <10ms
- No performance impact on cell execution
- Signature storage adds <5KB per cell

---

## Implementation Details

### 1. Runtime Module: `src/runtime/execution_signer.py`

```python
REDACTED
```

---

### 2. Integration Points

**SigmaNotebookV2.py** (Cell 6 - Evidentiary Signing):

- Call `ExecutionSigner.generate_signing_cell_code()` for each executed cell
- Inject signing code after cell 3 (evidence), 4 (containment), 5 (remediation)
- Store JWS in notebook metadata

**SigmaNotebook.py** (postmortem cell):

- Add signing code at end of playbook
- Iterate through executed cells, sign each

**MarimoNotebook.py** (closeout cell):

- Reactive dependency: sign cell execution on completion
- Update metadata reactively as cells execute

**CacaoSidecar.py**:

- Add `execution_signature_config` block with:
  - `alg: HS256`
  - `storage: notebook_metadata`
  - `per_cell: true`

---

### 3. Key Management

**Development/Testing:**

- Use notebook session ID as HMAC key (deterministic, no KMS required)
- Store in `SentinelMesh_SIGNING_KEY` environment variable if needed

**Production:**

- Integrate with AWS KMS or HashiCorp Vault for key rotation
- Environment variable fallback for flexibility

**Key Rotation:**

- Old signatures remain valid (key embedded in metadata)
- New cells signed with rotated key
- Verification uses appropriate key based on timestamp

---

## Testing Strategy

Unit tests (15+):

- `test_compute_payload_hash_deterministic()` — Same input = same hash
- `test_compute_payload_hash_json_ordering()` — Sort keys for consistency
- `test_b64url_encoding()` — Proper base64url format
- `test_b64url_no_padding()` — No "=" padding
- `test_sign_produces_valid_jws()` — JWS format correct
- `test_sign_detached_format()` — ".." in middle (detached)
- `test_verify_valid_signature()` — Verifies correct sig
- `test_verify_invalid_signature()` — Rejects bad sig
- `test_verify_tampering_detection()` — Detects modified payload
- `test_verify_timing_safe()` — Constant-time comparison
- `test_derive_signing_key()` — Key derivation works
- `test_signing_cell_code_generation()` — Code compiles
- `test_format_metadata_entry()` — Storage format correct
- `test_notebook_integrity_check()` — Full verification
- `test_signature_with_special_characters()` — Handles unicode

Integration tests (10+):

- `test_v2_cell_6_signs_execution()` — V2 generator signs
- `test_v1_postmortem_signs_cells()` — V1 signs at end
- `test_marimo_reactive_signing()` — Marimo signs on completion
- `test_cacao_signature_config()` — CACAO schema validated
- `test_notebook_save_preserves_signatures()` — Save/load cycle
- `test_notebook_export_includes_signatures()` — PDF/HTML export
- `test_signature_verification_after_export()` — Still verifiable
- `test_key_rotation_old_sigs_valid()` — Backward compatibility
- `test_tampering_detection_output_change()` — Detects output modification
- `test_tampering_detection_source_change()` — Detects code modification

---

## Success Metrics

1. **Coverage:** 100% of executed cells signed
2. **Verification:** All signatures verify correctly
3. **Performance:** <10ms signing overhead per cell
4. **Storage:** <1KB per signature
5. **Tamper detection:** 100% detection accuracy
6. **Forensic validity:** Signatures survive export/archival

---

## Risks & Mitigations

| Risk                                 | Mitigation                                      |
| ------------------------------------ | ----------------------------------------------- |
| Lost signing key breaks verification | Store key securely in KMS; support key rotation |
| Performance impact on notebook       | <10ms overhead; lazy signing if needed          |
| Large notebooks = large metadata     | Compress signatures; external ledger option     |
| Signature collision attacks          | Use HMAC-SHA256 (collision resistant)           |
