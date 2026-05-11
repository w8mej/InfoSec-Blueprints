# Specification: Sign Executions via Detached JWS

## Problem Statement

Incident response playbooks generate legal artifacts used in:

- Breach notifications to regulators
- Litigation discovery
- Forensic audits
- Post-mortems

But executed notebooks are mutable:

- Operator can edit cell output after execution
- Cells can be reordered, deleted, or inserted
- No proof of execution order or timing
- Forensic teams cannot verify authenticity

**Consequences:**

- Regulator skepticism: "How do we know you didn't modify this?"
- Legal liability: edited notebooks become inadmissible evidence
- Breach notification defense weakened: "Timeline is suspicious"
- No forensic chain of custody for incident response

**Current state:**

- Notebooks saved as JSON (mutable by anyone)
- No execution signatures
- No timestamp proof
- No tampering detection

**Impact:**

- Reduced legal defensibility of incident response
- Potential regulatory findings: "execution logs not authentic"
- Breach notification delays due to verification uncertainty

---

## Goals

1. **Cryptographic proof** of cell execution (not editing)
2. **Tamper detection** — Modification is detectable post-hoc
3. **Timeline preservation** — Execution order provable via timestamps
4. **Forensic auditability** — Incident response chain of custody clear
5. **Regulatory compliance** — Signatures survive breach notification and litigation

---

## Functional Requirements

### R1: Cell Execution Signing

**R1.1 — Signing Payload**

Each executed cell produces an immutable signature of:

```json
{
  "cell_id": "cell_3_evidence_triage",
  "timestamp": "2023-04-25T14:30:05.123456Z",
  "source_hash": "sha256:8f2d9c1a...",
  "output_hash": "sha256:abc123...",
  "context_hash": "sha256:def456...",
  "execution_duration_ms": 1240
}
```

Components:

- **cell_id**: Unique, immutable identifier (set at generation time)
- **timestamp**: ISO 8601 UTC (microsecond precision) when execution completed
- **source_hash**: SHA-256 of cell source code (proves code that ran)
- **output_hash**: SHA-256 of cell output (proves result)
- **context_hash**: SHA-256 of notebook variables at execution time (proves state)
- **execution_duration_ms**: How long cell took (metadata, not cryptographic)

**R1.2 — Detached JWS Format**

Signature stored separately from payload (RFC 7515 detached mode):

```
header..signature

header = base64url(
  {
    "alg": "HS256",
    "typ": "JWS",
    "format_version": "1",
    "jti": "uuid"
  }
)

signature = base64url(
  HMAC-SHA256(
    "{header}.{payload_hash}",
    signing_key
  )
)
```

Benefits:

- Payload not duplicated (signatures are small)
- Payload can be retrieved from cell output directly
- Signature can be stored in notebook metadata
- Forensically similar to "detached signature" in document signing

**R1.3 — Algorithm Choice**

Algorithm: **HMAC-SHA256** (not RSA-PSS PS256)

- Rationale:
  - RSA-PSS requires HSM/KMS integration (complex, adds dependency)
  - HMAC-SHA256 uses only stdlib (hashlib, hmac)
  - Matches existing jwt_inspection_tools.py patterns
  - Sufficient for incident response (not cryptographic currency)
- Key: Derived from notebook session ID + optional KMS rotation

---

### R2: Tamper Detection

**R2.1 — Verification Algorithm**

```
On load or export:
  For each signed cell:
    1. Extract JWS from metadata
    2. Compute current source_hash from cell code
    3. Compute current output_hash from cell output
    4. Compute current context_hash from notebook state
    5. Create verification payload with current hashes
    6. Recompute HMAC using signing key
    7. Compare computed signature to stored signature

    If match → Cell authentic
    If mismatch → Cell tampered ⚠️ ALERT
```

**R2.2 — Tampering Scenarios Detected**

| Scenario                | Detection                                                         |
| ----------------------- | ----------------------------------------------------------------- |
| Cell output edited      | ❌ output_hash mismatch                                           |
| Cell source code edited | ❌ source_hash mismatch                                           |
| Cell variables modified | ❌ context_hash mismatch                                          |
| Cell order changed      | ❌ cell_id mismatch in sequence                                   |
| Cell deleted            | ❌ missing signature in expected position                         |
| Cell inserted           | ❌ unexpected signature in sequence                               |
| Cell timestamp forged   | ✅ Detected if signature regenerated (timestamp immutable in sig) |

**R2.3 — Non-Repudiation**

Each signature embeds:

- Unique JTI (JWT ID) preventing replay
- Timestamp (immutable once signed)
- Session ID (notebook identity)

Cannot claim:

- "I didn't sign this cell" (signature ties to session)
- "Cell signature is from earlier version" (JTI/timestamp proof)
- "Timing is wrong" (timestamp in payload)

---

### R3: Storage and Persistence

**R3.1 — Notebook Metadata Storage**

JWS stored in `.ipynb` metadata, per-cell:

```json
{
  "cells": [
    {
      "cell_type": "code",
      "id": "cell_3_evidence_triage",
      "metadata": {
        "execution_signature": {
          "jws": "eyJ...hc..signature...",
          "payload_hash": "abc123...",
          "timestamp": "2023-04-25T14:30:05Z",
          "format_version": "1",
          "algorithm": "HS256"
        }
      }
    }
  ]
}
```

**R3.2 — External Ledger (Optional)**

For enhanced security, signatures logged to immutable ledger:

```
/var/log/SentinelMeshs/execution-signatures.jsonl

{"cell_id": "cell_3", "jws": "...", "timestamp": "...", "notebook_id": "..."}
```

Benefits:

- Signatures survive if notebook is lost
- Ledger can be signed independently
- Easier to audit across notebooks

---

### R4: Forensic Auditability

**R4.1 — Chain of Custody**

Signatures prove:

1. **Authenticity** — Cell executed by authorized notebook runtime
2. **Integrity** — Output hasn't been modified post-execution
3. **Timeline** — Exact execution timestamp (microsecond precision)
4. **Completeness** — Missing signatures = cells added after original run
5. **Sequence** — Cell order preserved (via cell_id sequence verification)

**R4.2 — Breach Notification Defensibility**

In breach notification, organization can claim:

> "Incident response timeline is cryptographically verified. Each cell's execution is signed with HMAC-SHA256, proving no modification post-execution. Signatures are stored in notebook metadata and verified at export time. Verification report is available for regulator review."

**R4.3 — Litigation Discovery**

Signed notebooks can be submitted as evidence:

- No need to prove chain of custody verbally
- Cryptographic proof of authenticity is objective
- Signatures survive cross-examination

---

### R5: Implementation Across Generators

**R5.1 — SigmaNotebookV2**

Cell 6 (Evidentiary Signing):

- Call `ExecutionSigner.generate_signing_cell_code()` for cells 3-5
- Inject signing code that runs after each cell completes
- Store JWS in cell metadata immediately

Example cell 6:

```python
REDACTED
```

**R5.2 — SigmaNotebook (V1)**

Postmortem cell:

- After all cells executed, iterate and sign each
- Store signatures in notebook metadata
- Save notebook with signatures embedded

**R5.3 — MarimoNotebook**

Closeout cell (reactive):

- On notebook completion, sign all cells
- Store signatures in marimo metadata
- Support export with signatures intact

**R5.4 — CacaoSidecar**

Schema addition:

```json
{
  "execution_signature_config": {
    "enabled": true,
    "algorithm": "HS256",
    "storage": "notebook_metadata",
    "per_cell": true,
    "key_source": "notebook_session"
  }
}
```

---

## Non-Functional Requirements

### NF1: Performance

| Operation                    | Target           |
| ---------------------------- | ---------------- |
| Sign one cell                | <10ms            |
| Verify all cells in notebook | <100ms           |
| Signature storage            | <1KB per cell    |
| Hash computation             | <5ms per payload |

### NF2: Reliability

- Zero signature corruption (use verified serialization)
- Signatures survive notebook save/load cycles
- Signatures survive format conversions (Jupyter → HTML → PDF)
- Backward compatibility: old notebooks work with new verifier

### NF3: Forensic Properties

- Timestamps immutable (microsecond precision)
- Signatures non-reversible (HMAC one-way)
- Session ID tied to execution environment
- Replay attacks prevented (unique JTI per signature)

---

## Example Walkthrough

### Scenario: Evidence Triage

**Cell 3 executes at 2023-04-25T14:30:05.123456Z:**

```python
REDACTED
```

**Payload created:**

```json
{
  "cell_id": "cell_3_evidence_triage",
  "timestamp": "2023-04-25T14:30:05.123456Z",
  "source_hash": "sha256:8f2d9c1a",
  "output_hash": "sha256:abc123",
  "context_hash": "sha256:def456",
  "execution_duration_ms": 1240
}
```

**Signature generated:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9..xB3ZyxEQ
```

**Stored in notebook metadata:**

```json
{
  "metadata": {
    "execution_signature": {
      "jws": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9..xB3ZyxEQ",
      "payload_hash": "abc123...",
      "timestamp": "2023-04-25T14:30:05.123456Z",
      "algorithm": "HS256"
    }
  }
}
```

**Later: Forensic verification**

Investigator loads notebook, runs verification:

```python
REDACTED
```

If cell output had been edited after execution:

```python
REDACTED
```

---

## Test Specifications

### Unit Tests (28+)

1. **test_execution_payload_creation()** — Dataclass initialized
2. **test_execution_payload_to_dict()** — Serialization works
3. **test_compute_payload_hash_deterministic()** — Same input = same hash
4. **test_compute_payload_hash_ordering()** — JSON key order deterministic
5. **test_compute_payload_hash_special_chars()** — Unicode handled
6. **test_b64url_encoding_standard()** — RFC 7515 compliant
7. **test_b64url_no_padding()** — No "=" padding
8. **test_b64url_padding_removed()** — Strips any padding
9. **test_b64url_decode_with_missing_padding()** — Handles decode
10. **test_sign_produces_jws_format()** — "..signature" format
11. **test_sign_detached_format_empty_middle()** — ".." in middle
12. **test_sign_header_includes_alg()** — Header has "HS256"
13. **test_sign_header_includes_jti()** — Unique JTI per signature
14. **test_sign_with_provided_key()** — Uses provided key
15. **test_sign_with_derived_key()** — Derives key if not provided
16. **test_verify_valid_signature_returns_true()** — Validates correct sig
17. **test_verify_invalid_signature_returns_false()** — Rejects bad sig
18. **test_verify_tampering_detection_payload_change()** — Detects any change
19. **test_verify_timing_safe_comparison()** — Constant-time verify
20. **test_verify_malformed_jws_returns_false()** — Handles bad input
21. **test_verify_missing_parts_returns_false()** — Detects format error
22. **test_derive_signing_key_from_session()** — Key from notebook session
23. **test_derive_signing_key_fallback()** — Fallback if no kernel
24. **test_format_metadata_entry_structure()** — Correct dict structure
25. **test_format_metadata_entry_timestamp()** — Includes timestamp
26. **test_format_metadata_entry_algorithm()** — Algorithm field present
27. **test_signing_cell_code_generation()** — Code compiles
28. **test_signing_cell_code_has_import()** — Imports ExecutionSigner

### Integration Tests (15+)

29. **test_notebook_cell_signature_storage()** — Signature in metadata
30. **test_notebook_cell_signature_persistence()** — Survives save/load
31. **test_notebook_verify_all_cells_valid()** — Bulk verification
32. **test_notebook_detect_output_tampering()** — Catches output edit
33. **test_notebook_detect_source_tampering()** — Catches code edit
34. **test_notebook_detect_context_tampering()** — Catches state change
35. **test_notebook_detect_missing_signature()** — Catches deleted cell
36. **test_notebook_detect_inserted_cell()** — Catches added cell
37. **test_v2_generator_adds_signing_cell()** — V2 includes Cell 6
38. **test_v2_generator_signs_cells_3_4_5()** — V2 signs evidence cells
39. **test_v1_generator_postmortem_signing()** — V1 signs at end
40. **test_marimo_generator_reactive_signing()** — Marimo signs on complete
41. **test_cacao_schema_signature_config()** — CACAO schema valid
42. **test_notebook_export_preserves_signatures()** — Export keeps sigs
43. **test_signature_verification_after_export()** — Sigs still valid

### Scenario Tests (8+)

44. **test_evidence_triage_workflow_signatures()** — Full triage signing
45. **test_containment_workflow_signatures()** — Containment cell signing
46. **test_remediation_workflow_signatures()** — Remediation cell signing
47. **test_multi_hour_incident_timeline()** — Multiple cells over time
48. **test_signature_timeline_proof()** — Order provable via timestamps
49. **test_forensic_audit_scenario()** — Investigator verification
50. **test_breach_notification_timestamp_proof()** — Regulatory scenario
51. **test_litigation_discovery_admissibility()** — Legal scenario

---

## Edge Cases & Handling

| Edge Case                        | Handling                                             |
| -------------------------------- | ---------------------------------------------------- |
| Cell with no output              | Use empty string, hash anyway                        |
| Very large output (MB)           | Still hash completely (SHA-256 efficient)            |
| Output contains binary data      | Convert to string representation first               |
| Notebook variable is a function  | Skip in context hash (not serializable)              |
| Multiple executions of same cell | Each gets unique JTI                                 |
| Signature key is lost            | Verification fails gracefully, reports "key missing" |
| Notebook edited outside Jupyter  | Verification detects tampering                       |
| Signature JTI collision          | UUID collision extremely unlikely                    |
| Timestamp clock skew             | Use ISO 8601 UTC (no timezone ambiguity)             |
| Export to PDF loses metadata     | Include signature JSON as cell output                |

---

## Success Criteria

✅ 100% of executed cells have JWS signatures
✅ Signatures stored in cell metadata immutably
✅ Tamper detection catches any output modification
✅ Timeline preserved via timestamps (microsecond precision)
✅ Forensic verification succeeds on unmodified notebooks
✅ Verification fails clearly on tampered notebooks
✅ All 4 generator types support signing equally
✅ <10ms signing overhead per cell
✅ Signatures survive notebook save/load/export
✅ All 51+ tests passing
✅ Regulatory-grade audit trail for incident response
