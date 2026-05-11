# Specification: Dry-Run Mode

## Overview

Dry-run mode enforces empirical blast radius validation before any state-mutating action. An agent must first execute a read-only lean4, extract affected entity counts and impact estimates, and present this data to a human for approval. Only after human approval does the tool execute for real.

---

## 1. Event Schema

### BlastRadius (Dataclass)

Represents the calculated impact of a proposed action.

```json
{
  "action_id": "disable_account",
  "affected_entity_count": 18,
  "affected_entities": [
    "user@corp.com",
    "shared-mailbox@corp.com",
    "distribution-list-1@corp.com",
    "distribution-list-2@corp.com"
  ],
  "estimated_impact": "High",
  "irreversible": false,
  "rollback_time_minutes": 30,
  "blast_radius_summary": "Disabling this account will affect 3 shared mailboxes, 5 distribution lists, and 10 forwarding rules. All can be restored within 30 minutes if needed."
}
```

#### Fields

| Field                   | Type  | Required | Description                                                        |
| ----------------------- | ----- | -------- | ------------------------------------------------------------------ |
| `action_id`             | str   | ✅       | Tool action identifier (e.g., "disable_account", "firewall_block") |
| `affected_entity_count` | int   | ✅       | Total number of entities affected (≥0)                             |
| `affected_entities`     | array | ✅       | List of specific entities (users, IPs, processes, etc.)            |
| `estimated_impact`      | str   | ✅       | Severity: "Critical", "High", "Medium", "Low"                      |
| `irreversible`          | bool  | ✅       | Whether the action can be undone                                   |
| `rollback_time_minutes` | int   | ✅       | Minutes needed to undo (0 if irreversible or permanent)            |
| `blast_radius_summary`  | str   | ✅       | Human-readable description of impact                               |

---

## 2. Runtime Module Implementation

### Module Structure

```
src/runtime/dry_run_wrapper.py

Classes:
- DryRunMode (enum)
- BlastRadius (dataclass)
- DryRunExecutor (instance methods)
- ToolSchemaExtension (static methods)
```

### DryRunMode (Enum)

```python
REDACTED
```

### BlastRadius (Dataclass)

```python
REDACTED
```

### DryRunExecutor (Instance Methods)

```python
REDACTED
```

### ToolSchemaExtension (Static Methods)

```python
REDACTED
```

Example: tool_name(target="user@corp.com", action="disable_account", dry_run=True)

```

### Step 2: Parse Blast Radius
The tool will return estimated impact:
- Affected entity count
- List of affected entities
- Reversibility status
- Time to undo (if applicable)

### Step 3: Present to Human
Display blast radius in a clear, structured format:
- How many entities will be affected
- Whether the action is reversible
- Time needed to undo (if applicable)
- Impact level (Critical/High/Medium/Low)

### Step 4: Get Approval
Request human confirmation with dry-run data visible.
Wait for explicit approval before proceeding.

### Step 5: Live Execution
ONLY after approval, call with `dry_run=False`:
```

Example: tool_name(target="user@corp.com", action="disable_account", dry_run=False)

```

### ENFORCEMENT RULES
- ❌ NEVER skip dry-run and jump to live execution
- ❌ NEVER request approval without showing dry-run results
- ❌ NEVER assume impact estimates are correct without verification
- ✅ ALWAYS run dry-run first for every mutation
- ✅ ALWAYS parse and present blast radius to human
- ✅ ALWAYS wait for explicit human approval

### SPECIAL CASES
- If dry-run returns "Critical" impact with >10 affected entities: Request additional confirmation beyond simple approval
- If dry-run fails: Do NOT attempt live execution, report failure to human
- If blast radius is unexpectedly large: Question your action plan before requesting approval
"""
```

---

## 3. Integration Code Examples

### SigmaNotebookV2 Integration

**Location:** `src/generate/SigmaNotebookV2.py`, Cell 5 (State Mutation)

```python
REDACTED
```

### SigmaNotebook Integration

**Location:** `src/generate/SigmaNotebook.py`, Containment Injection

```python
REDACTED
```

### MarimoNotebook Integration

**Location:** `src/generate/MarimoNotebook.py`, Mutation Cell

```python
REDACTED
```

### CacaoSidecar Integration

**Location:** `src/generate/CacaoSidecar.py`

```python
REDACTED
```

---

## 4. Tool Schema Modification Example

### Before

```json
{
  "name": "gao_agent",
  "description": "Disable user account",
  "parameters": {
    "type": "object",
    "properties": {
      "target": { "type": "string" },
      "action": { "type": "string" }
    },
    "required": ["target", "action"]
  }
}
```

### After (with dry_run injection)

```json
{
  "name": "gao_agent",
  "description": "Disable user account",
  "parameters": {
    "type": "object",
    "properties": {
      "target": { "type": "string" },
      "action": { "type": "string" },
      "dry_run": {
        "type": "boolean",
        "default": true,
        "description": "If true, dry-run mode (read-only); if false, execute for real"
      }
    },
    "required": ["target", "action", "dry_run"]
  }
}
```

---

## 5. Query Examples

### Find All Dry-Run Executions

```python
REDACTED
```

### Calculate Average Blast Radius

```sql
SELECT
  action_id,
  COUNT(*) as execution_count,
  AVG(affected_entity_count) as avg_entities,
  MAX(affected_entity_count) as max_entities,
  CAST(100.0 * SUM(CASE WHEN estimated_impact = 'Critical' THEN 1 ELSE 0 END) / COUNT(*) as DECIMAL(5,2)) as critical_percent
FROM dry_run_blast_radius
GROUP BY action_id
ORDER BY critical_percent DESC;
```

---

## 6. Safety Guardrails

### Dry-Run Validation

- Output must be JSON or structured dict with "blast_radius" key
- All required fields must be present (action_id, affected_entity_count, etc.)
- Blast radius must be realistic (no negative values, valid impact levels)

### Live Execution Safeguards

- Requires explicit human approval (no auto-approval)
- System prompt enforces dry-run-first workflow
- Tool schemas mark dry_run as required parameter
- Critical impact with many entities requires additional confirmation

### Audit Trail

- Every dry-run and live execution logged
- Blast radius recorded for post-incident analysis
- User approval recorded in execution metadata

---

## 7. Testing Reference

Create `tests/test_dry_run_wrapper.py` with 14+ tests:

**Unit Tests (10 tests)**

- BlastRadius validation (2)
- DryRunExecutor workflow (5)
- ToolSchemaExtension injection (2)
- Approval prompt generation (1)

**Integration Tests (4 tests)**

- Full dry-run → approval → live flow per playbook type
- Tool schema injection in notebooks
- Enforcement prompt in system prompt
