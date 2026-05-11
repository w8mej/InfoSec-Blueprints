# Specification: Utilize Cell Checksums for Integrity Verification

## Problem Statement

Jupyter notebooks are stored as JSON files on disk. During incident response, a notebook might be executed on a server where an attacker or misconfigured process has access:

- **Attacker edits Cell 5 (Remediation)** to exfiltrate evidence before containment
- **Misconfigured automation** modifies Cell 4 (Containment) to skip critical steps
- **Insider threat** injects credential harvest into Cell 3 (Triage)

These modifications are **silent** — no audit trail, no execution logs, no SIEM visibility. The notebook logic executes as modified without detection.

**Impact:**

- Attackers hide malicious code inside "trusted" playbook cells
- Evidence gets exfiltrated before HITL approval
- Containment actions are silently disabled
- Incident response automation becomes an attack vector

---

## Goals

1. **Detect tampering**: Any modification to cell source code is detected before execution
2. **Cryptographic integrity**: Use SHA-256 (industry standard) for integrity verification
3. **Runtime verification**: Check checksums at execution time, before any cell runs
4. **Forensic trail**: Record tampered cells, hashes, timestamps for investigation
5. **Security alerts**: Tampering immediately alerts SOC and halts execution

---

## Functional Requirements

### R1: Checksum Generation at Build Time

**R1.1 — Cell-Level Hashing**

- Every code cell has a SHA-256 checksum computed from its source code
- Every markdown cell has a checksum computed (audit trail, cell IDs, instructions)
- Output cells are NOT checksummed (they change during execution)
- Raw source code is hashed, including whitespace/indentation (changes = tampering)

**R1.2 — Normalization**

- Line endings normalized to `\n` before hashing (Windows `\r\n` vs Unix `\n` must produce same hash)
- Source code encoded as UTF-8 before hashing
- No preprocessing (no stripping comments, no reformatting)

**R1.3 — Metadata Storage**
Checksums stored in notebook metadata:

```json
{
  "cell_integrity": {
    "cell_0_setup": {
      "sha256": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...",
      "length": 2341,
      "type": "code",
      "computed_at": "2023-04-26T14:30:00Z"
    },
    "cell_1_title": {
      "sha256": "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7...",
      "length": 156,
      "type": "markdown",
      "computed_at": "2023-04-26T14:30:00Z"
    }
  }
}
```

**R1.4 — CACAO Representation**
For CACAO playbooks, checksums embedded in playbook JSON:

```json
{
  "integrity_config": {
    "algorithm": "sha256",
    "verification_required": true,
    "cell_checksums": {
      "step_1_initialization": "a1b2c3d4e5f6...",
      "step_2_evidence_collection": "b2c3d4e5f6g7...",
      "step_3_triage": "c3d4e5f6g7h8..."
    },
    "tampering_action": "halt_and_alert"
  }
}
```

---

### R2: Runtime Verification

**R2.1 — Verification Timing**

- Triggered at notebook startup (Cell 0 / initialization)
- Runs on every execution (not cached)
- Before any other cell logic executes
- Blocks execution if tampering detected

**R2.2 — Verification Algorithm**

```
For each stored checksum in nb.metadata['cell_integrity']:
  1. Load cell from notebook by cell_id
  2. Compute SHA-256 of current source code
  3. Compare to stored SHA-256
  4. If match → cell OK, continue
  5. If mismatch → cell TAMPERED, add to tampered_cells list

If tampered_cells is empty:
  Verification PASSED, proceed to execution

If tampered_cells is not empty:
  Verification FAILED
  1. Create IntegrityError exception
  2. Log tampered cell details to incident_state
  3. Send SIEM security event
  4. Create Jira ticket with forensic details
  5. Send Slack alert to #security-alerts
  6. Raise exception, halt all execution
```

**R2.3 — Checksum Mismatch Scenarios**

| Change                       | Detection                                 |
| ---------------------------- | ----------------------------------------- |
| Modify code logic            | ✅ Detected (source hash changes)         |
| Change indentation           | ✅ Detected (whitespace included in hash) |
| Change comments              | ✅ Detected (comments are source code)    |
| Add/remove blank lines       | ✅ Detected (line count changes)          |
| Change variable names        | ✅ Detected (source changes)              |
| Add print statements         | ✅ Detected (source changes)              |
| Modify Markdown instructions | ✅ Detected (Markdown cells checksummed)  |

---

### R3: Forensic Logging

**R3.1 — Tampering Event Record**
On checksum mismatch, log to `incident_state['_tampered_cells']`:

```json
{
  "cell_id": "cell_3_triage",
  "cell_type": "code",
  "detected_at": "2023-04-26T14:30:05Z",
  "stored_hash": "a1b2c3d4e5f6...",
  "current_hash": "x9y8z7w6v5u4...",
  "source_length_stored": 2341,
  "source_length_current": 2450,
  "hash_algorithm": "sha256"
}
```

**R3.2 — SIEM Event**
Post to security monitoring:

```json
{
  "event_type": "security.event.playbook_tampering_detected",
  "timestamp": "2023-04-26T14:30:05Z",
  "notebook_name": "SigmaNotebookV2_incident_12345.ipynb",
  "notebook_path": "/notebooks/incident_12345/...",
  "tampered_cell_count": 1,
  "tampered_cells": ["cell_3_triage"],
  "incident_id": "incident_12345",
  "detection_method": "cell_checksum_verification",
  "severity": "critical"
}
```

**R3.3 — Incident Ticket**
Create Jira ticket with:

- Title: "SECURITY: Playbook Tampering Detected"
- Priority: Critical
- Labels: `playbook-integrity`, `security-incident`
- Description: Tampered cell list, forensic hashes, detection timestamp
- Attachment: Full JSON dump of tampered cell records

**R3.4 — Slack Notification**
Post to `#security-alerts`:

```
🚨 **PLAYBOOK TAMPERING DETECTED**
Notebook: SigmaNotebookV2_incident_12345.ipynb
Incident: incident_12345
Tampered cells: cell_3_triage
Detection time: 2023-04-26T14:30:05Z
Status: EXECUTION HALTED

Please investigate immediately. Jira ticket: JIRA-999
```

---

### R4: Notebook Generator Integration

**R4.1 — SigmaNotebookV2.py**

- After all cells are added to `self.nb` (end of `build()` method):

  ```python
  REDACTED
```

- In Cell 0 (Setup):

  ```python
  REDACTED
```

**R4.2 — SigmaNotebook.py**

- Same checksum computation in `write()` method
- Bootstrap cell includes verification code
- Verification executes at startup

**R4.3 — MarimoNotebook.py**

- Checksum computation at `write()` time
- Verification in initial @reactive cell
- Marimo lifecycle hooks trigger verification before user interaction

**R4.4 — CacaoSidecar.py**

- Add `integrity_config` block to playbook JSON
- Include all step checksums
- Set `verification_required: true`
- `tampering_action: "halt_and_alert"`

---

### R5: Performance & Scalability

**R5.1 — Performance Targets**

| Operation                                     | Target               | Rationale                                       |
| --------------------------------------------- | -------------------- | ----------------------------------------------- |
| Checksum computation (1 cell, 2KB)            | <1ms                 | One-time at build                               |
| Checksum computation (full 100-cell notebook) | <50ms                | Parallelizable, acceptable at build time        |
| Verification (1 cell match)                   | <1ms                 | Fast hash comparison                            |
| Verification (full 100-cell notebook)         | <100ms               | Single-threaded acceptable, <5s overall startup |
| Hash storage overhead                         | <5% of notebook size | Metadata storage negligible                     |

**R5.2 — Optimization**

- Cache computed hashes in memory during verification (don't recompute)
- Verify only once at startup (not per-cell execution)
- Use hashlib.sha256 (hardware-accelerated on modern CPUs)

---

## Non-Functional Requirements

### NF1: Security

- **Algorithm**: SHA-256 (256-bit output, no collisions in practice)
- **Resistance**: Tampering detection 100% (any byte change detected)
- **Forensics**: Stores before/after hashes for investigation
- **Immutability**: Checksums in notebook metadata, versioned in git

### NF2: Auditability

- All checksum computations timestamped (ISO 8601 UTC)
- Verification events logged to `incident_state['_integrity_checks']`
- Tampering events logged to SIEM with full forensic details
- Incident timeline includes integrity checks as non-agentic events

### NF3: Usability

- Error messages clear: "Cell 3 (Triage) has been modified. Hash mismatch detected."
- Recovery path documented: "Regenerate notebook from source, verify with git diff"
- False positive rate: 0 (legitimate notebooks always match)

---

## Example Walkthrough

### Scenario 1: Clean Notebook Execution

1. **Build phase**: SigmaNotebookV2 generates notebook, computes checksums for all 8 cells
2. **Metadata**: `nb.metadata['cell_integrity']` contains 8 checksums
3. **Notebook saved** to `/notebooks/incident_12345.ipynb`
4. **Execution starts**: Operator opens notebook, runs Cell 0
5. **Verification**: CellIntegrityVerifier loads notebook, computes all 8 current hashes, compares to stored
6. **Result**: All 8 match ✅ Verification PASSED
7. **Execution proceeds**: Cells 1-8 execute normally

### Scenario 2: Cell Tampering Detected

1. **After build**: Notebook has checksums for all cells
2. **Before execution**: Administrator manually edits Cell 5 on server to skip containment
3. **Operator runs**: Opens notebook, starts execution
4. **Verification**: CellIntegrityVerifier loads notebook, verifies all cells
5. **Checksum mismatch**: Cell 5 current hash `0x9999...` doesn't match stored hash `0x1234...`
6. **Action**:
   - Add Cell 5 to tampered_cells list
   - Post SIEM event: `security.event.playbook_tampering_detected`
   - Create Jira ticket: "Playbook Tampering Detected"
   - Send Slack alert: `#security-alerts`
   - Raise IntegrityError: "Execution halted. Cell 5 tampered."
7. **Result**: Execution blocked, incident team notified

### Scenario 3: Attacker Modifies Metadata

1. **Attacker goal**: Inject code AND hide it
2. **Attempt**: Modify Cell 3, then modify stored hash in metadata to match new code
3. **But**: Notebooks are versioned in git
4. **Result**: `git diff` shows metadata change, audit trail reveals tampering
5. **Detection**: Integrity check fails because git history shows unauthorized change

---

## Test Specifications

### Unit Tests

1. **test_compute_cell_hash_deterministic** — Same source always produces same hash
2. **test_compute_cell_hash_encoding** — UTF-8 encoding handled correctly
3. **test_compute_cell_hash_line_endings** — \r\n and \n produce same hash
4. **test_compute_notebook_checksums** — All cells checksummed, outputs excluded
5. **test_to_metadata_dict** — Checksums converted to metadata format correctly
6. **test_verify_notebook_unchanged** — Notebook with all original cells passes
7. **test_verify_notebook_one_cell_modified** — One modified cell detected
8. **test_verify_notebook_multiple_cells_modified** — Multiple modifications detected
9. **test_verify_notebook_no_checksums** — Notebook without checksums handled (warning)
10. **test_tampering_alert_message** — Alert includes tampered cell details
11. **test_siem_event_structure** — SIEM event has required fields
12. **test_forensic_record** — Tampered cell record includes before/after hashes

### Integration Tests

13. **test_notebook_generated_with_checksums** — Generated notebook has cell_integrity metadata
14. **test_verification_hook_registered** — IPython hook registered at startup
15. **test_verification_execution_blocked** — Modified cell prevents execution
16. **test_forensic_trail_preserved** — Tampering details logged to incident_state
17. **test_all_four_generators_support_checksums** — V2, V1, Marimo, CACAO all support

### Performance Tests

18. **test_performance_single_cell** — <1ms per cell hash
19. **test_performance_100_cell_notebook** — <100ms for full verification
20. **test_performance_metadata_overhead** — <5% notebook size increase

---

## Edge Cases & Handling

| Edge Case                                           | Handling                                                      |
| --------------------------------------------------- | ------------------------------------------------------------- |
| Cell added after build (not in checksums)           | Allowed (new cells don't have checksums, no tampering signal) |
| Cell removed (was in checksums, now missing)        | Ignored (removed cells can't be verified)                     |
| Notebook edited legitimately before execution       | Checksum fails, operator must rebuild from source             |
| Metadata corrupted (invalid JSON in cell_integrity) | Warning logged, verification skipped (fallback to trust)      |
| Hash collision (extremely unlikely, 1 in 2^256)     | Treat as tampering, investigate further                       |
| Attacker modifies both cell AND hash                | Git history shows unauthorized changes in metadata            |

---

## Success Criteria

✅ All code + markdown cells have checksums in metadata
✅ Tampering detected 100% (any modification caught)
✅ False positive rate: 0 (no legitimate changes trigger alerts)
✅ Verification completes in <100ms for 100-cell notebook
✅ Tampering alert reaches SOC within 5 seconds
✅ Forensic details logged for investigation

---

## Deployment Considerations

- **Rollout**: Enabled by default for all generated notebooks
- **Backward compatibility**: Old notebooks without checksums allowed (warning)
- **Regeneration**: Operators can rebuild notebooks to update checksums
- **Git**: Notebook versions tracked in git, changes auditable
- **Immutability**: Once written, notebook checksums part of permanent record
