# Specification: Template Version Control

## Overview

Playbook logic decays over time. APIs deprecate, threat intelligence becomes stale, and reasoning flaws accumulate. This specification enforces automated freshness validation: every playbook is stamped at generation with a timestamp and Git commit hash. At runtime, templates older than 90 days are rejected with clear instructions to regenerate, preventing the execution of obsolete logic.

---

## 1. Metadata Schema

### TemplateMetadata (Dataclass)

Embedded in notebook metadata or CACAO structure:

```json
{
  "template_version": "1.0.0",
  "template_generation_date": "2023-04-25T14:30:00.000Z",
  "git_commit_hash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  "git_commit_date": "2023-04-25T14:25:00.000Z",
  "git_branch": "main",
  "generator_version": "SentinelMesh 2026.04.25",
  "max_age_days": 90
}
```

#### Fields

| Field                      | Type | Required | Description                                         |
| -------------------------- | ---- | -------- | --------------------------------------------------- |
| `template_version`         | str  | ✅       | Semantic version (e.g., "1.0.0")                    |
| `template_generation_date` | str  | ✅       | ISO 8601 UTC timestamp of generation                |
| `git_commit_hash`          | str  | ✅       | 40-character Git commit SHA-1                       |
| `git_commit_date`          | str  | ✅       | ISO 8601 timestamp of commit                        |
| `git_branch`               | str  | ✅       | Branch name at generation (e.g., "main", "develop") |
| `generator_version`        | str  | ✅       | Version of SentinelMesh that generated this           |
| `max_age_days`             | int  | ✅       | Maximum age in days before rejection (default: 90)  |

### Age Calculation

```python
REDACTED
```

---

## 2. Runtime Module Implementation

### Module Structure

```
src/runtime/template_version_control.py

Classes:
- TemplateMetadata (dataclass)
- TemplateValidator (with TemplateExpiredException)
- TemplateMetadataGenerator (static methods)
```

### TemplateMetadata (Dataclass)

```python
REDACTED
```

### TemplateValidator (Exception + Validation)

```python
REDACTED
```

### TemplateMetadataGenerator (Class)

```python
REDACTED
```

---

## 3. Integration Code Examples

### SigmaNotebookV2 Integration

**Location:** `src/generate/SigmaNotebookV2.py`

```python
REDACTED
```

### Notebook Metadata Integration

```python
REDACTED
```

### CACAO Integration

**Location:** `src/generate/CacaoSidecar.py`

```python
REDACTED
```

---

## 4. Orchestrator Integration Pattern

**SOAR/Orchestration Layer** (external to this codebase)

```python
REDACTED
```

---

## 5. Timeline Examples

### Fresh Template (Day 0-30)

```
Generated: 2023-04-25T14:30:00Z
Today:     2026-05-10T10:00:00Z
Age:       15 days
Status:    ✅ Valid | 75% fresh remaining
```

### Aging Template (Day 60-90)

```
Generated: 2023-04-25T14:30:00Z
Today:     2026-06-24T10:00:00Z
Age:       60 days
Status:    ⚠️  Valid | 33% fresh remaining (warning)
```

### Expired Template (>90 days)

```
Generated: 2023-04-25T14:30:00Z
Today:     2026-07-25T10:00:00Z
Age:       91 days
Status:    ❌ Expired | Regeneration required
Action:    RuntimeError raised, caught by orchestrator
```

---

## 6. Testing Reference

Create `tests/test_template_version_control.py` with 20+ tests:

**Unit Tests (14 tests)**

- TemplateMetadata initialization (2)
- Age calculation accuracy (2)
- Expiration logic (2)
- Validation code generation (2)
- Git info capture (3)
- Exception message formatting (1)

**Integration Tests (6 tests)**

- Metadata embedded in notebook
- Validation cell is first executable cell
- Metadata in CACAO structure
- Generated code runs without errors
- Exception propagates correctly
- Orchestrator retry pattern

---

## 7. Benefits

### Prevents Runbook Rot

- Automatic rejection of stale logic
- Forces regular regeneration
- Keeps threat intelligence current

### Operational Safety

- Clear error messages guide operators
- Commit hash traceability
- Audit trail of playbook versions

### Automation-Ready

- Orchestrator can auto-retry with fresh playbook
- No manual intervention required for expired templates
- Seamless upgrade path
