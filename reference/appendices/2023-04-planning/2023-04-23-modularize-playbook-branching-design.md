# Specification: Modularize Playbook Branching

## Overview

Monolithic incident response playbooks with hundreds of cells and massive if/else trees become unmaintainable, brittle, and impossible for LLM agents to navigate. Agents get lost in conditional logic, operators struggle to understand the flow, and changes to one branch risk breaking others. This specification defines a modular, orchestrator-driven architecture where a parent "router" playbook dynamically invokes smaller, atomic "sub-playbooks" based on probabilistic agent decisions. Each atomic playbook is self-contained, independently executable, and fully testable in isolation.

**Key Innovation:** Instead of `if containment_strategy == "isolate": ... elif "disable_user": ...`, the router calls `execute_branch("containment_isolate_endpoint", incident_state)` which runs an isolated notebook and returns updated state. Agents see a cleaner decision surface, operators understand flow more easily, and notebooks become reusable across incident types.

---

## 1. Problem Statement

### Current Monolithic Approach

```python
REDACTED
```

**Problems:**

1. **Cognitive Load:** Humans and agents struggle with 500+ line notebooks
2. **Testing:** Cannot test isolation logic independently from user-disable logic
3. **Reusability:** Logic for "disable user" is buried; cannot reuse in other playbooks
4. **Maintainability:** Change to one branch risks breaking others
5. **Agent Navigation:** LLMs have harder time understanding the full branching tree
6. **Parallelization:** Cannot run independent branches in parallel

### Proposed Modular Approach

```
┌─ Parent Playbook (50 lines) ──────────────────────┐
│ 1. Gather evidence into incident_state            │
│ 2. Agent decides: "isolate" or "disable_user"?    │
│ 3. Route to atomic notebook: execute_branch()     │
│ 4. Receive updated incident_state                 │
│ 5. Continue to next decision point                │
└───────────────────────────────────────────────────┘
        ↓                              ↓
    ┌────────────────────┐    ┌──────────────────────┐
    │ Atomic Notebook A  │    │ Atomic Notebook B    │
    │ Isolate Endpoint   │    │ Disable User         │
    │ (100 lines)        │    │ (100 lines)          │
    │ Standalone, tested │    │ Standalone, tested   │
    └────────────────────┘    └──────────────────────┘
        ↓                              ↓
    Updates state                  Updates state
```

---

## 2. Architecture & Design Principles

### Principle 1: Atomic Notebooks are Fully Self-Contained

- Accept `IncidentState` dictionary as input
- Perform their action (isolate endpoint, disable user, reset credentials)
- Return updated `IncidentState` with postcondition fields set
- Cannot call back into parent; parent orchestrates sequencing

### Principle 2: State Schema Enforces Continuity

- Every atomic notebook declares required preconditions: `["target_hostname", "incident_id"]`
- Parent validates state against preconditions before invoking
- Child declares postconditions: `["containment_status", "isolation_timestamp"]`
- Parent merges postconditions back into state after execution
- Ensures no state is lost or corrupted across boundaries

### Principle 3: Orchestrator is Stateless, Declarative

- Branching decisions are expressed in a DAG config (JSON/YAML)
- No hardcoded branching logic in the orchestrator
- Routes are determined by agent output + probabilistic weights
- Decision log is immutable for audit purposes

### Principle 4: Atomic Notebooks are Reusable

- `templates/atomic/Containment_Isolate_Endpoint.ipynb` is useful in any incident playbook
- No playbook-specific hardcoding
- Parameters and logic flow are driven by input state, not by parent

---

## 3. Data Structures & Schemas

### IncidentState Schema (Strict)

```json
{
  "incident_id": "INC-2026-0451",
  "alert_confidence": 92,
  "target_hostname": "prod-db-01.internal",
  "affected_users": ["alice@company.com", "bob@company.com"],
  "containment_status": "pending",
  "evidence_collected": {
    "malware_hash": "a1b2c3...",
    "c2_domain": "attacker.net",
    "process_guid": "12345..."
  },

  "_optional_remediation_notes": "Malware signature matches APT28 TTP",
  "_optional_eradication_complete": false,
  "_optional_recovery_start_time": "2023-04-25T14:35:00Z",
  "_optional_rollback_uri": "s3://backups/prod-db-01_2023-04-25_1430.tar.gz"
}
```

**Required Fields:**

- `incident_id` (string) — Unique incident identifier
- `alert_confidence` (0-100 int) — Confidence in the threat
- `target_hostname` (string) — Primary affected host
- `affected_users` (string[]) — List of affected user principals
- `containment_status` (enum) — Current stage: pending|contained|eradicated|recovered
- `evidence_collected` (object) — Hash, domain, artifacts, etc.

**Optional Fields (nullable):**

- `remediation_notes` (string)
- `eradication_complete` (bool)
- `recovery_start_time` (ISO 8601 string)
- `rollback_uri` (string)

### DAG Configuration Schema

```json
{
  "playbook_id": "incident_response_generic",
  "version": "1.0",
  "branches": {
    "containment_isolate_endpoint": {
      "branch_id": "containment_isolate_endpoint",
      "branch_name": "Isolate Endpoint",
      "notebook_path": "templates/atomic/Containment_Isolate_Endpoint.ipynb",
      "preconditions": ["target_hostname", "incident_id"],
      "postconditions": ["containment_status", "isolation_timestamp"],
      "probability_weight": 0.7,
      "timeout_seconds": 300,
      "rollback_procedure": "templates/rollback/Undo_Endpoint_Isolation.ipynb"
    },
    "containment_disable_user": {
      "branch_id": "containment_disable_user",
      "branch_name": "Disable User",
      "notebook_path": "templates/atomic/Containment_Disable_User.ipynb",
      "preconditions": ["affected_users", "incident_id"],
      "postconditions": ["user_disabled_at"],
      "probability_weight": 0.3,
      "timeout_seconds": 180,
      "rollback_procedure": null
    }
  },
  "transitions": {
    "containment_isolate_endpoint": ["remediation_patch_system"],
    "containment_disable_user": ["remediation_reset_credentials"],
    "remediation_patch_system": ["recovery_backup_restore"],
    "recovery_backup_restore": ["END"]
  },
  "entry_point": "containment_isolate_endpoint"
}
```

### BranchingDecision Log Entry

```json
{
  "selected_branch_id": "containment_isolate_endpoint",
  "confidence_score": 92,
  "reasoning": "Agent determined endpoint compromise. Isolation is safest containment.",
  "alternative_branches": [
    "containment_disable_user",
    "containment_revoke_tokens"
  ],
  "timestamp": "2023-04-25T14:30:00Z",
  "execution_start_time": "2023-04-25T14:30:02Z",
  "execution_end_time": "2023-04-25T14:31:15Z"
}
```

---

## 4. PlaybookOrchestrator Class API

### Constructor

```python
REDACTED
```

**Parameters:**

- `dag_config` (dict) — DAG structure defining branches and transitions
- `log_path` (str) — Where to write orchestration logs

### `route_decision(current_state, agent_decision, confidence)`

Selects the next branch based on agent's decision string.

**Args:**

- `current_state` (dict) — Current IncidentState
- `agent_decision` (str) — Branch ID selected by agent (e.g., "containment_isolate_endpoint")
- `confidence` (float) — Agent confidence (0-100)

**Returns:**

- `PlaybookBranch` — Branch metadata and execution config

**Raises:**

- `ValueError` if branch not found
- `ValueError` if preconditions not met

**Behavior:**

1. Look up branch in DAG
2. Validate IncidentState against branch preconditions
3. Log decision to audit trail
4. Return branch config

### `execute_branch(branch, incident_state, use_papermill=True)`

Invokes the atomic notebook for the selected branch.

**Args:**

- `branch` (PlaybookBranch) — Branch to execute
- `incident_state` (dict) — Current IncidentState to pass to notebook
- `use_papermill` (bool) — If True, use papermill; otherwise use nbconvert

**Returns:**

- `dict` — Updated IncidentState after notebook execution

**Behavior:**

1. Write incident_state to temp JSON file
2. Invoke notebook via papermill or nbconvert with timeout
3. Read returned state from output file
4. Validate returned state against postconditions
5. Merge postconditions back into state
6. Update decision log with execution times
7. Return merged state

**Exceptions:**

- `subprocess.TimeoutExpired` if notebook exceeds timeout_seconds
- `ValueError` if postconditions not produced by notebook
- `json.JSONDecodeError` if state I/O fails

### `get_orchestration_summary()`

Returns audit-friendly summary of decisions and execution flow.

**Returns:**

```python
REDACTED
```

---

## 5. Integration Examples

### SigmaNotebookV2 Integration

**Cell 4 (New):**

```python
REDACTED
```

### MarimoNotebook Integration

Marimo's reactive DAG automatically respects branch dependencies:

```python
REDACTED
```

### CacaoSidecar Integration

CACAO workflow steps map to atomic notebooks:

```json
{
  "steps": [
    {
      "id": "step_1_containment",
      "type": "action",
      "name": "Route containment decision",
      "action": {
        "type": "execute",
        "playbook_ref": "playbook_id_containment_router",
        "step_variables": {
          "incident_state": "$.incident_state"
        }
      },
      "on_success": {
        "next": "step_2_remediation"
      }
    },
    {
      "id": "step_2_remediation",
      "type": "action",
      "name": "Execute remediation",
      "action": {
        "type": "execute",
        "playbook_ref": "$($.incident_state.remediation_playbook_id)",
        "step_variables": {
          "incident_state": "$.incident_state"
        }
      }
    }
  ]
}
```

---

## 6. Walkthrough Example

### Scenario: Ransomware Incident on prod-db-01

**Step 1: Parent playbook collects evidence**

```python
REDACTED
```

**Step 2: Agent decides containment strategy**

- Agent sees: "Endpoint compromised with ransomware. What containment action?"
- Agent decides: "containment_isolate_endpoint"
- Confidence: 95%

**Step 3: Orchestrator routes decision**

```python
REDACTED
```

**Step 4: Execute atomic notebook**

```python
REDACTED
```

**Step 5: Parent continues to remediation decision**

- incident_state now has `containment_status = "isolated"`
- Next branch available: "remediation_patch_system"
- Agent decides: proceed with patching
- Orchestrator routes to `Remediation_Patch_System.ipynb`

**Step 6: Audit trail**

```json
{
  "total_decisions": 2,
  "decisions": [
    {
      "selected_branch_id": "containment_isolate_endpoint",
      "confidence_score": 95,
      "reasoning": "Ransomware detected, endpoint isolation is safest containment",
      "alternative_branches": [
        "containment_disable_user",
        "containment_revoke_tokens"
      ],
      "timestamp": "2023-04-25T14:30:00Z",
      "execution_start_time": "2023-04-25T14:30:02Z",
      "execution_end_time": "2023-04-25T14:31:15Z"
    },
    {
      "selected_branch_id": "remediation_patch_system",
      "confidence_score": 87,
      "reasoning": "Patch available for vulnerability. System isolation allows patching.",
      "alternative_branches": ["remediation_restore_from_backup"],
      "timestamp": "2023-04-25T14:35:00Z",
      "execution_start_time": "2023-04-25T14:35:02Z",
      "execution_end_time": "2023-04-25T14:38:45Z"
    }
  ]
}
```

---

## 7. Edge Cases & Error Handling

### Case 1: Atomic Notebook Exceeds Timeout

**Scenario:** Endpoint isolation takes 5 minutes, timeout is 300s

- **Behavior:** papermill raises `subprocess.TimeoutExpired`
- **Recovery:** Parent catches exception, logs timeout, optionally invokes rollback notebook
- **Audit:** Decision log captures `execution_end_time: null` (incomplete)

### Case 2: State Missing Precondition

**Scenario:** Agent selects "disable_user" but `affected_users` list is empty

- **Behavior:** Orchestrator validates preconditions, raises `ValueError("Branch missing preconditions: ['affected_users']")`
- **Recovery:** Parent can ask agent to reconsider, or skip this branch
- **Audit:** Decision was attempted but rejected by schema validation

### Case 3: Atomic Notebook Produces Invalid Postconditions

**Scenario:** Notebook returns state but forgets to set `containment_status`

- **Behavior:** Parent validates returned state, raises `ValueError("Postcondition 'containment_status' not produced")`
- **Recovery:** Parent treats notebook as failed, may invoke rollback
- **Audit:** Execution logged as failed; postconditions incomplete

### Case 4: Agent Selects Unknown Branch

**Scenario:** Agent says "cleanup_registry" but that branch doesn't exist in DAG

- **Behavior:** Orchestrator raises `ValueError("Unknown branch: cleanup_registry")`
- **Recovery:** Parent re-prompts agent or moves to next decision point
- **Audit:** Invalid routing decision logged and rejected

### Case 5: State Mutation Between Decisions

**Scenario:** After isolation, new evidence emerges (C2 domain) before remediation

- **Behavior:** Parent can update incident_state["evidence_collected"] before next routing
- **Validation:** PlaybookStateSchema.validate() ensures no field deletion
- **Result:** State is thread-safe; parent owns state evolution

---

## 8. Performance Considerations

### Execution Overhead

| Operation                                | Time                        |
| ---------------------------------------- | --------------------------- |
| Route decision (precondition validation) | ~10ms                       |
| Write state to temp JSON                 | ~5ms                        |
| Invoke papermill                         | ~50-100ms (overhead)        |
| Notebook execution                       | Variable (50s-300s typical) |
| Read state from output JSON              | ~5ms                        |
| Merge states                             | ~2ms                        |
| **Total per branch**                     | Notebook time + ~150ms      |

### Scalability

- **Sequential execution:** One branch at a time (current model)
- **Parallel execution:** Use MarimoNotebook's reactive DAG or async orchestration to run independent branches in parallel (future enhancement)
- **State size:** Typical IncidentState is 5-50 KB (JSON); gzips to <1 KB

### Storage

- **Decision log per incident:** ~1-2 KB (10-20 decisions)
- **Atomic notebooks stored:** `templates/atomic/*.ipynb` → ~50-100 KB each
- **Typical incident:** 20-40 atomic notebooks × 75 KB + decision logs → ~2-3 MB on disk

---

## 9. Testing Reference

Create `tests/test_playbook_branching_orchestrator.py` with 20+ tests:

**Unit Tests (6):**

- test_playbook_branch_initialization
- test_playbook_branch_serialization
- test_branching_decision_creation
- test_state_schema_validation_valid
- test_state_schema_validation_missing_required
- test_state_schema_merge_states

**Orchestrator Tests (8):**

- test_route_decision_valid_branch
- test_route_decision_invalid_branch_raises_valueerror
- test_route_decision_validates_preconditions
- test_route_decision_missing_precondition_raises_valueerror
- test_execute_branch_with_papermill
- test_execute_branch_with_nbconvert_fallback
- test_execute_branch_timeout_handling
- test_get_orchestration_summary_format

**Integration Tests (4):**

- test_full_orchestration_workflow_two_sequential_branches
- test_state_threading_parent_child_merge
- test_decision_log_audit_trail_complete
- test_dag_validation_no_cycles

**Total:** ~18-20 tests

---

## 10. Benefits

### For Operators

- **Readability:** 50-line parent playbook instead of 500-line monolith
- **Debugging:** Atomic notebooks can be executed independently for testing
- **Maintenance:** Change to one branch doesn't affect others

### For Agents

- **Navigation:** Simpler decision surface (route to branch vs. navigate deep if/else)
- **Reasoning:** Clearer action-outcome model
- **Auditing:** Every decision is logged with confidence and reasoning

### For Organizations

- **Reusability:** Atomic notebooks can be mixed across different incident types
- **Testing:** Each branch is independently unit-testable
- **Scalability:** Foundation for parallel execution and cloud-scale orchestration

---

## 11. Future Enhancements

1. **Parallel Branch Execution:** Use asyncio or workflow orchestrators to run independent branches in parallel
2. **Dynamic DAG Generation:** Agent generates DAG structure based on incident characteristics
3. **Recursive Branching:** Atomic notebooks can themselves invoke sub-orchestrators
4. **Cost Analysis:** Estimate incident remediation cost before committing to branch
5. **Rollback Automation:** If branch execution fails, automatically invoke rollback_procedure
