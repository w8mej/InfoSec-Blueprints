# Specification: Time-Lock Puzzles for Containment Actions

**Version**: 0.3.0  
**Status**: Pending Implementation  
**Owner**: Gemini Flash  
**Date**: 2023-04-27

---

## Problem Statement

Current containment actions in remediation playbooks execute immediately after approval, risking:

- **Cascade failures**: Rapid block/isolate actions trigger unintended downtime cascades
- **Accidental mass containment**: Copy-paste errors or script loops isolate thousands of hosts
- **No human verify delay**: Between "approve" and "execute" is milliseconds
- **Irrevocable actions**: Some containment can't be rolled back (data deletion, account lock)

### Current State

- Containment cells execute on-demand without delay
- No pause mechanism between approval and execution
- Dry-run mode exists but not enforced for high-risk actions

### Target State

- Containment actions embedded in time-lock puzzle
- Human must solve puzzle to prove intentionality and awareness
- Puzzle difficulty configurable (5s, 15s, 30s, 60s)
- Puzzle hash recorded in cell checksum for audit trail
- Skippable only with explicit `HITL_OVERRIDE=true` env var and log marker

---

## Goals

1. **Prevent cascade failures** via mandatory human pause
2. **Reduce accidental mass containment** via intentionality check
3. **Create audit trail** of containment approvals
4. **Maintain reversibility** via puzzle solution proof
5. **Educate operators** about action consequences (puzzle solving = reflection time)

---

## Functional Requirements

### R1: Time-Lock Puzzle Generator

**Files**: `src/runtime/time_lock_puzzles.py`

```python
REDACTED
```

**Requirements**:

- R1.1: Support 4 difficulty levels (5, 15, 30, 60 seconds target)
- R1.2: Puzzle expires in 5 minutes (prevent solution reuse)
- R1.3: Puzzle tied to specific action (action_hash in proof)
- R1.4: Solve operation is intentionally blocking (CPU-bound proof-of-work)

### R2: SigmaNotebookV2 Integration

**Files**: `src/generate/SigmaNotebookV2.py` (modify `_add_cell_5_state_mutation()`)

```python
REDACTED
```

**Requirements**:

- R2.1: Generate puzzle in cell 5 before any state mutation
- R2.2: Puzzle tied to specific action description
- R2.3: Puzzle difficulty configurable via `CONTAINMENT_PUZZLE_DIFFICULTY` env var
- R2.4: Block execution until puzzle solved
- R2.5: Record solution in telemetry for audit trail

### R3: Puzzle Checksum Recording

**Files**: `src/runtime/cell_checksums.py` (extend existing)

```python
REDACTED
```

**Requirements**:

- R3.1: Record puzzle ID, nonce solution, action hash
- R3.2: Include timestamp (immutable)
- R3.3: Checksum includes solver proof (sha256(nonce))

### R4: Override Mechanism (HITL)

**Files**: All generators with state mutation cells

```python
REDACTED
```

**Requirements**:

- R4.1: `HITL_OVERRIDE=true` env var skips puzzle requirement
- R4.2: Override reason logged via `HITL_OVERRIDE_REASON` env var
- R4.3: Override events visible in execution telemetry
- R4.4: Override only accepted for manual/interactive sessions (not CI/CD)

---

## Non-Functional Requirements

### NF1: Performance

- Puzzle generation: < 10ms
- Puzzle solving: ~difficulty_seconds (intentionally blocking)
- Puzzle verification: < 5ms
- No timeout: solving can take up to 2x difficulty_seconds

### NF2: Usability

- Clear user messaging: puzzle difficulty, action description, countdown timer
- Progress indicator: show hash rate or iteration count during solve
- Solution feedback: confirm solve time vs. expected difficulty

### NF3: Security

- Puzzle tied to action (can't reuse solution for different action)
- Puzzle expires (5 min window prevents solution reuse)
- Nonce verification uses constant-time comparison

---

## Test Specifications

### Unit Tests (25+)

**File**: `tests/test_time_lock_puzzles.py`

```python
REDACTED
```

**Coverage Target**: >= 80%

---

## Edge Cases & Handling

| Edge Case                              | Handling                                            |
| -------------------------------------- | --------------------------------------------------- |
| Puzzle solving timeout (2x difficulty) | Raise TimeoutError, don't execute action            |
| Puzzle expired (> 5 min)               | Reject verification, require new puzzle             |
| Invalid nonce format                   | Return False from verify()                          |
| Difficulty < 5 or > 60                 | Clamp to nearest valid level                        |
| HITL_OVERRIDE without reason           | Log warning, accept override but flag as suspicious |

---

## Success Criteria

- [ ] 4 difficulty levels implemented (5, 15, 30, 60s)
- [ ] Puzzles expire in 5 minutes
- [ ] SigmaNotebookV2 Cell 5 includes puzzle
- [ ] Puzzle solution recorded in checksums
- [ ] HITL override mechanism working
- [ ] 25+ unit tests, >= 80% coverage
- [ ] All 4 generators support puzzles (optional for investigation, required for remediation)

---

## Acceptance Checklist

- [ ] Code review passed
- [ ] All tests passing
- [ ] Type checking passed
- [ ] Manual test: solve puzzles at each difficulty level
- [ ] Feature doc created (`docs/guides/time-lock-puzzles.md`)
- [ ] Example notebook with puzzle generated
