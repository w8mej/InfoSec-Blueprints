# Specification: Map to CSF 2.0 Community Profiles

## Overview

Incident response playbooks must align with NIST Cybersecurity Framework 2.0 to enable compliance reporting, risk assessment, and strategic coverage analysis. Every playbook is automatically tagged with CSF 2.0 functions (Govern, Detect, Respond, Protect, Recover) and categories based on its Sigma detection rules and response type. Execution logs are annotated with CSF identifiers to support automated CISO dashboards, audit trails, and gap analysis.

---

## 1. CSF 2.0 Function Hierarchy

### Functions

- **GOVERN (GV)**: Risk management, strategy, governance
  - Subcategories: GV.PO, GV.RO, GV.RM, GV.SC, GV.ST

- **DETECT (DE)**: Detection and monitoring
  - Subcategories: DE.AE, DE.CM, DE.DP, DE.PO

- **RESPOND (RS)**: Incident response and recovery
  - Subcategories: RS.AN, RS.CO, RS.MA, RS.MI

- **PROTECT (PO)**: Protection and preventive measures
  - Subcategories: PO.AC, PO.AT, PO.DS, PO.IP, PO.PC, PO.PE

- **RECOVER (RC)**: Recovery planning and restoration
  - Subcategories: RC.IM, RC.RP

---

## 2. Mapping Strategy

### Sigma Rule Tags → CSF Subcategories

Sigma rules contain attack tags (e.g., `attack.t1059`, `attack.execution`) that map to CSF detection categories:

| Sigma Tag Pattern             | Maps to CSF        | Rationale                    |
| ----------------------------- | ------------------ | ---------------------------- |
| `attack.t1047` (WMI)          | DE.CM-01, DE.CM-02 | Command execution detection  |
| `attack.t1566` (Email)        | DE.CM-02, DE.CM-04 | Phishing/email detection     |
| `attack.t1486` (Ransomware)   | DE.CM-01, DE.CM-03 | File operation detection     |
| `detection.lateral_movement`  | DE.CM-02, DE.CM-03 | Network behavior detection   |
| `detection.credential_access` | DE.CM-04           | Account/credential detection |

### Playbook Type → CSF Functions

| Playbook Type   | CSF Functions    | Primary Categories |
| --------------- | ---------------- | ------------------ |
| `investigation` | DETECT, GOVERN   | DE.CM, GV.RM       |
| `remediation`   | RESPOND, RECOVER | RS.MI, RC.IM       |
| `containment`   | RESPOND, PROTECT | RS.CO, PO.AC       |
| `threat-hunt`   | DETECT           | DE.CM, DE.AE       |
| `eradication`   | RESPOND, PROTECT | RS.MA, PO.IP       |

---

## 3. Data Schema

### Playbook CSF Metadata

```json
{
  "csf_mapping": {
    "playbook_id": "INC-2026-0451",
    "playbook_type": "containment",
    "sigma_tags": ["attack.t1047", "attack.lateral_movement"],
    "csf_functions": ["RESPOND", "PROTECT"],
    "csf_categories": ["RS.CO", "RS.MI", "PO.AC"],
    "csf_subcategories": [
      "RS.CO-01",
      "RS.CO-02",
      "RS.MI-01",
      "RS.MI-02",
      "PO.AC-01",
      "PO.AC-02"
    ],
    "csf_identifiers": [
      {
        "function": "RESPOND",
        "category": "RS.CO",
        "subcategory": "RS.CO-01",
        "name": "Incident Coordination",
        "description": "..."
      }
      // ... more identifiers
    ],
    "coverage_by_function": {
      "govern": 0,
      "detect": 2,
      "respond": 3,
      "protect": 2,
      "recover": 0
    }
  }
}
```

### Execution Log Annotation

```json
{
  "execution_record": {
    "playbook_id": "INC-2026-0451",
    "status": "success",
    "timestamp": "2023-04-25T14:30:00Z",
    "csf_functions_covered": ["RESPOND", "PROTECT"],
    "csf_subcategories_executed": ["RS.CO-01", "RS.MI-01", "PO.AC-01"],
    "metrics": {
      "response_time_sec": 120,
      "affected_assets": 45,
      "contained_in_sec": 180
    }
  }
}
```

---

## 4. Runtime Implementation

### CSFIdentifier (Dataclass)

```python
REDACTED
```

### CSF20FrameworkRegistry (Static Registry)

Complete mapping of:

1. All CSF 2.0 subcategories → CSFIdentifier objects
2. Sigma rule tags → CSF subcategories
3. Playbook types → CSF functions

**Size:** ~150 entries (comprehensive NIST CSF 2.0)

### CSFPlaybookMapper (Mapping Logic)

```python
REDACTED
```

---

## 5. Integration Points

### SigmaNotebookV2

**Insertion point:** `__init__` method

- Generate CSF mapping via `CSFPlaybookMapper.map_playbook(iap)`
- Store in `self.csf_mapping`
- Embed in notebook metadata

### SigmaNotebook

**Insertion point:** initialization

- Generate and store CSF mapping
- Include in notebook-level metadata

### MarimoNotebook

**Insertion point:** `__init__`

- Generate CSF mapping
- Include in generated Python metadata comments

### CacaoSidecar

**Insertion point:** `to_dict()` method

- Add `csf_2_0_mapping` field
- Include functions, categories, subcategories
- Include coverage metrics

---

## 6. Reporting: CSF Coverage Dashboard

### Aggregation Logic

```python
REDACTED
```

### Report Outputs

1. **Coverage Matrix:** Playbooks vs. CSF functions
2. **Execution Timeline:** Chronological view of CSF-mapped incidents
3. **Gap Analysis:** Unaddressed CSF functions
4. **MTTR by Function:** Response time aggregated by CSF category

---

## 7. Example: Containment Playbook Mapping

```python
REDACTED
```

---

## 8. Testing Reference

Create `tests/test_csf_2_0_mapper.py` with 17+ tests:

**Unit Tests (8 tests)**

- CSFIdentifier initialization and serialization (2)
- Sigma tag mapping to CSF subcategories (2)
- Playbook type mapping to CSF functions (2)
- CSF taxonomy completeness (1)
- Edge case handling (1)

**Integration Tests (6 tests)**

- Full playbook mapping pipeline (1)
- V2 metadata embedding (1)
- V1 metadata embedding (1)
- Marimo metadata inclusion (1)
- CACAO sidecar field inclusion (1)
- Coverage aggregation (1)

**Reporting Tests (3 tests)**

- Dashboard aggregation logic (1)
- Gap analysis detection (1)
- MTTR calculation by function (1)

---

## 9. Benefits

### Risk Management

- Automated alignment with NIST CSF 2.0
- Gap identification in incident response coverage
- Strategic priority alignment

### Compliance

- Audit trail connecting incidents to governance frameworks
- Automated compliance reporting
- Traceability matrix for auditors

### Operations

- CISO dashboards with CSF-aligned metrics
- Budget justification via coverage analysis
- Tool investment ROI (demonstrate CSF function coverage)

---

## 10. Performance Considerations

- **Mapping lookup:** O(1) hash table for Sigma tags → CSF
- **Aggregation:** O(n) for n execution logs
- **Storage:** ~2-3 KB CSF metadata per playbook
- **No runtime overhead** in playbook execution (metadata only)
