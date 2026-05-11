# Specification: STIX 2.1 COA Extensions

## Overview

Convert every playbook into a STIX 2.1 Course of Action (COA) object, enabling integration with Threat Intelligence Platforms (TIPs) and standardized sharing of response strategies. Each COA is linked to MITRE ATT&CK techniques via relationship objects, positioning the playbook within the global threat intelligence ecosystem.

---

## 1. STIX 2.1 Schema

### Course of Action Object

Standard STIX 2.1 COA with custom ASO extensions:

```json
{
  "type": "course-of-action",
  "id": "course-of-action--550e8400-e29b-41d4-a716-446655440000",
  "created": "2023-04-25T14:30:00.000Z",
  "modified": "2023-04-25T14:30:00.000Z",
  "name": "Disable Compromised AD Account",
  "description": "Playbook for remediating a compromised Active Directory account by disabling access and forcing password reset across all services.",

  "x_severity": "HIGH",
  "x_playbook_type": "remediation",
  "x_target_techniques": ["T1059.001", "T1003.008"],
  "x_detectable_by": [
    "uri://sigma/rules/windows/process_creation/proc_creation_win_powershell_lateral_movement.yml"
  ]
}
```

#### Standard Fields

| Field         | Type | Required | Description                      |
| ------------- | ---- | -------- | -------------------------------- |
| `type`        | str  | ✅       | Always "course-of-action"        |
| `id`          | str  | ✅       | UUID: "course-of-action--{uuid}" |
| `created`     | str  | ✅       | ISO 8601 UTC timestamp           |
| `modified`    | str  | ✅       | ISO 8601 UTC timestamp           |
| `name`        | str  | ✅       | Playbook title                   |
| `description` | str  | ✅       | Playbook description/objectives  |

#### Custom ASO Extensions

| Field                 | Type  | Required | Description                                                |
| --------------------- | ----- | -------- | ---------------------------------------------------------- |
| `x_severity`          | str   | ✅       | "CRITICAL", "HIGH", "MEDIUM", "LOW"                        |
| `x_playbook_type`     | str   | ✅       | "investigation", "remediation", "containment", "detection" |
| `x_target_techniques` | array | ✅       | MITRE ATT&CK T-codes (e.g., ["T1059.001", "T1003"])        |
| `x_detectable_by`     | array | ✅       | Sigma rule URIs                                            |

### Relationship Object

Links COA to MITRE ATT&CK techniques:

```json
{
  "type": "relationship",
  "id": "relationship--660e8400-e29b-41d4-a716-446655440001",
  "created": "2023-04-25T14:30:00.000Z",
  "modified": "2023-04-25T14:30:00.000Z",
  "relationship_type": "mitigates",
  "source_ref": "course-of-action--550e8400-e29b-41d4-a716-446655440000",
  "target_ref": "attack-pattern--2f6b4ed7-4b60-4b7f-a185-087f1e27cc0d"
}
```

#### Fields

| Field               | Type | Required | Description                        |
| ------------------- | ---- | -------- | ---------------------------------- |
| `type`              | str  | ✅       | Always "relationship"              |
| `id`                | str  | ✅       | UUID: "relationship--{uuid}"       |
| `created`           | str  | ✅       | ISO 8601 UTC                       |
| `modified`          | str  | ✅       | ISO 8601 UTC                       |
| `relationship_type` | str  | ✅       | "mitigates", "detects", "prevents" |
| `source_ref`        | str  | ✅       | Course of Action ID                |
| `target_ref`        | str  | ✅       | Attack Pattern (MITRE) ID          |

### Bundle Object

Container for COA + relationships:

```json
{
  "type": "bundle",
  "id": "bundle--770e8400-e29b-41d4-a716-446655440002",
  "objects": [
    { "type": "course-of-action", ... },
    { "type": "relationship", ... },
    { "type": "relationship", ... }
  ]
}
```

---

## 2. Runtime Module Implementation

### Module Structure

```
src/runtime/stix_coa_generator.py

Classes:
- STIXCourseOfAction (dataclass)
- STIXRelationship (dataclass)
- STIXBundle (dataclass)
- COAGenerator (class with static methods)
- STIXExporter (class with static methods)
```

### STIXCourseOfAction (Dataclass)

```python
REDACTED
```

### STIXRelationship (Dataclass)

```python
REDACTED
```

### STIXBundle (Dataclass)

```python
REDACTED
```

### COAGenerator (Class)

```python
REDACTED
```

### STIXExporter (Class)

```python
REDACTED
```

---

## 3. Integration Code Examples

### SigmaNotebookV2 Integration

**Location:** `src/generate/SigmaNotebookV2.py`, `save()` method

```python
REDACTED
```

### CacaoSidecar Integration

**Location:** `src/generate/CacaoSidecar.py`, `save()` method

```python
REDACTED
```

---

## 4. TIP Integration Examples

### MISP Import

```bash
# Using MISP API to import STIX bundle
curl -X POST https://misp.example.com/events/add \
  -H "Authorization: $MISP_API_KEY" \
  -H "Content-Type: application/json" \
  -d @playbook.stix.json
```

### OpenCTI Import

```python
REDACTED
```

---

## 5. File Naming Convention

Each playbook generates a `.stix.json` file alongside the main artifact:

```
outputs/
├── INC-2023-04-25-001_disable_ad_account.ipynb
├── INC-2023-04-25-001_disable_ad_account.stix.json
├── INC-2023-04-25-001_disable_ad_account.cacao.json
└── INC-2023-04-25-001_disable_ad_account.marimo.py
```

---

## 6. Testing Reference

Create `tests/test_stix_coa_generator.py` with 22+ tests:

**Unit Tests (14 tests)**

- STIXCourseOfAction serialization (2)
- STIXRelationship validation (2)
- STIXBundle creation (2)
- MITRE technique extraction (2)
- COA generation from IAP (3)
- Relationship generation (1)
- Bundle assembly (1)
- UUID and timestamp formatting (1)

**Integration Tests (8 tests)**

- Full playbook to STIX export
- File I/O and directory creation
- Export alongside playbook artifacts
- Multiple playbook types (V2, V1, Marimo, CACAO)
- JSON schema validation

---

## 7. MITRE ATT&CK Mapping

Complete T-code to STIX ID mapping maintained in:

- `src/runtime/mitre_technique_mapping.json`
- Updated quarterly from MITRE ATT&CK release

```json
{
  "T1001": "attack-pattern--...",
  "T1001.001": "attack-pattern--...",
  "T1001.002": "attack-pattern--...",
  "T1001.003": "attack-pattern--..."
}
```
