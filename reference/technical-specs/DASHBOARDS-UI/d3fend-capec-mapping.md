# Dashboard: D3FEND & CAPEC Mapping

## Document Metadata

- **Audience**: Detection Engineers | Red Teams | Security Evaluators | Security Architects
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [attack-matrix-dashboard.md](./attack-matrix-dashboard.md)
- **Related Specs**: `2023-04-22d3fend-capec-coverage-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/scripts/generate_d3fend_mapping.py`

## Quick Summary

The D3FEND & CAPEC Mapping Dashboard is the "Technical Defensive Posture" view of the SentinelMesh platform. While the [ATT&CK Matrix](./attack-matrix-dashboard.md) focuses on adversary _tactics_, this dashboard maps SentinelMesh's playbooks to two complementary frameworks:

1.  **MITRE D3FEND**: A knowledge graph of cybersecurity **counter-measure** techniques (the "How we defend").
2.  **MITRE CAPEC**: A dictionary of common **attack patterns** used by adversaries (the "How they attack").

By correlating playbooks with these frameworks, SentinelMesh demonstrates a deep understanding of the "Mechanism of Action" for both the attack and the defense, allowing for more rigorous security engineering and "Inference-capable" defensive modeling.

---

## 1. Persona-Based Value Proposition

### For the Detection Engineer

- **Counter-Measure Optimization**: Use the D3FEND matrix to identify which defensive categories (e.g., "Harden," "Detect," "Isolate," "Deceive") are under-utilized in your playbook corpus.
- **Mechanism-based Defense**: Shift your focus from "Searching for Indicator X" to "Implementing Counter-Measure Y," resulting in more resilient detection logic.

### For the Red Team / Security Evaluator

- **Pattern-based Testing**: Use the CAPEC mapping to find attack patterns that lack specific defensive playbooks, allowing you to design more effective "Breach & Attack Simulations" (BAS).
- **Defensive Integrity Audit**: Verify that the proposed D3FEND counter-measures in the playbook actually mitigate the target CAPEC patterns.

### For the Security Architect

- **Ontology-Driven Defense**: Leverage the D3FEND knowledge graph to build a more formal, provable model of organizational security.

---

## 2. Architecture & Design: Framework Correlation

### 2.1 The D3FEND Counter-Measure Matrix

Renders the D3FEND hierarchy (Harden, Detect, Isolate, Deceive, Evict):

- **Category Shading**: Color density indicates the number of playbooks implementing counter-measures in that category.
- **Technique Drill-down**: Clicking a D3FEND technique (e.g., "D3-H-DNS - DNS Filtering") shows the list of playbooks and the CAPEC patterns they mitigate.

### 2.2 The CAPEC Attack Pattern List

A prioritized list of attack patterns, grouped by their [ATT&CK Tactics](./attack-matrix-dashboard.md):

- **Defensive Density**: A metric showing how many different D3FEND counter-measures are active for a specific CAPEC pattern.
- **Cross-Framework Links**: Directly links CAPEC IDs to the corresponding D3FEND mitigations.

### 2.3 Knowledge Graph Visualizer (D3.js)

(Experimental) A force-directed graph showing the relationship between:
`[Actor] -> [CAPEC Pattern] -> [ATT&CK Technique] -> [ASO Playbook] -> [D3FEND Counter-measure]`

---

## 3. Implementation Details: Mapping Logic

### Core Generator (`src/scripts/generate_d3fend_mapping.py`)

```python
REDACTED
```

### Data Ingestion

The generator utilizes the official MITRE D3FEND and CAPEC ontologies (JSON/TTL format) to ensure all mappings are up-to-date with industry standards.

---

## 4. Security & Compliance Deep-Dive

### 4.1 "Inference-capable" Defense

By aligning with the D3FEND ontology, SentinelMesh can perform "Defensive Inference." For example: "If we have a playbook for DNS Filtering (D3-H-DNS), we have partial mitigation for all CAPECs involving DNS-based C2."

### 4.2 Compliance Mapping

- **NIST 800-53 (SC-7)**: Supports "Boundary Protection" by identifying the specific counter-measures implemented at the network layer.
- **ISO 27001 (A.14.2.1)**: Fulfills requirements for "Secure Development Policy" by formalizing the counter-measures included in automation.

---

## 5. Operations & Performance Tuning

### Data Freshness

The mapping is regenerated whenever the [Playbook Corpus](../ORGANIZE-MODULES/enterprise-structure-generator.md) is updated.

### Visualizing Large Hierarchies

The D3FEND matrix uses a "Collapsible Tree" UI to manage the hundreds of techniques in the ontology without overwhelming the analyst.

---

## 6. Future Growth & Opportunities

- **Automatic Counter-Measure Selection**: Using the [AI Optimization Pipeline](../TIER-DEEP-DIVES/tier4-ai-model-optimization.md) to automatically suggest the "Optimal D3FEND Strategy" based on the identified CAPEC pattern in a new incident.
- **Deception Playbook Generation**: Automatically creating "Honeytoken" or "Decoy" playbooks for D3FEND categories like "Decoy Systems."
- **Defensive "Maturity" Scoring**: Assigning a maturity score to the SOC based on the breadth and depth of its D3FEND coverage.
