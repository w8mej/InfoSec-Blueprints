# Dashboard: Compliance & Regulatory Coverage Matrix

## Document Metadata

- **Audience**: Compliance Officers | SOC Managers | CISOs | Auditors | Legal Counsel
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [veris-intelligence-dashboard.md](./veris-intelligence-dashboard.md)
- **Related Specs**: `2023-04-22compliance-coverage-matrix-design.md`, `2023-04-23-map-to-csf-2-community-profiles-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/scripts/generate_compliance_matrix.py`

## Quick Summary

The Compliance & Regulatory Coverage Matrix Dashboard is the "Governance Engine" of the SentinelMesh platform. It provides a real-time, interactive map that correlates technical response capabilities (playbooks) with global security standards and regulatory frameworks (SOC2, ISO 27001, NIST 800-53, HIPAA, PCI-DSS). By transforming abstract control requirements into visual "Readiness Scores," this dashboard allows the organization to demonstrate regulatory adherence and prioritize playbook development for missing or weak controls.

This dashboard translates "Cyber Defense" into "Regulatory Readiness," making it an essential tool for communicating SOC value to non-technical stakeholders and external auditors.

---

## 1. Persona-Based Value Proposition

### For the Compliance Officer / Auditor

- **Evidence Automation**: Instantly generate "Compliance Proof" by linking specific regulatory controls to the [Signed Forensic Records](./chain-of-custody-dashboard.md) of actual incidents.
- **Continuous Compliance**: Move away from "Point-in-Time" audits. This dashboard provides a live view of control coverage that updates as the [Playbook Corpus](../ORGANIZE-MODULES/enterprise-structure-generator.md) evolves.

### For the SOC Manager / CISO

- **Coverage Gap Analysis**: Identify regulatory blind spots (e.g., "Missing playbooks for PCI-DSS Requirement 10") and allocate detection engineering resources accordingly.
- **Stakeholder Assurance**: Provide a high-level "Readiness Scorecard" that demonstrates how the SOC is fulfilling its regulatory obligations.

### For the Detection Engineer

- **Standardized Mapping**: Use the dashboard to see which controls your new playbook will satisfy, ensuring that defensive logic is always aligned with organizational compliance goals.

---

## 2. Architecture & Design: Mapping Logic

### 2.1 The Compliance Grid

The dashboard features a filterable grid of regulatory frameworks:

- **Framework View**: High-level readiness scores for each standard (e.g., "NIST 800-53: 85% Covered").
- **Control Drill-down**: Clicking a specific control (e.g., IR-4) displays:
  - **Control Description**: The official text of the regulatory requirement.
  - **Satisfied By**: A list of active playbooks that implement this control.
  - **Execution History**: Links to recent incidents where this control was successfully exercised.

### 2.2 Dynamic Readiness Scoring

The "Readiness Score" (0-100%) for a framework is calculated as a weighted average of its controls:

- **Weight Factors**: Criticality of the control (e.g., "Mandatory" vs. "Recommended") and the [Performance Fidelity](../DASHBOARDS-UI/detection-fidelity-dashboard.md) of the associated playbooks.
- **Trend Lines**: Time-series charts showing how compliance coverage has improved (or drifted) over the last 90 days.

### 2.3 Evidence Linking (The "Audit Link")

Every control mapping is backed by a "Direct Evidence" link. This link points to a [Signed Playbook Template](../../appendices/2023-04-planning/forensic-security-superpowers.md) and its [Merkle Chain](./chain-of-custody-dashboard.md), providing auditors with cryptographically verifiable proof of control implementation.

---

## 3. Implementation Details: Generation Logic

### Core Generator (`src/scripts/generate_compliance_matrix.py`)

```python
REDACTED
```

### Framework Support

The dashboard ingests mapping data from `conf/compliance/`. New frameworks can be added by simply providing a JSON mapping between control IDs and [MITRE ATT&CK Techniques](./attack-matrix-dashboard.md).

---

## 4. Security & Compliance Deep-Dive

### 4.1 "Drift" Alerting

If a playbook that is critical for a specific compliance control is archived or fails its [Testing Framework](../TIER-DEEP-DIVES/tier3-generator-testing-framework.md), the dashboard triggers a "Compliance Breach" alert.

### 4.2 Compliance Mapping (The Meta-Map)

- **NIST CSF 2.0**: Directly maps to the "Protect", "Detect", and "Respond" functions.
- **SOC2 (Trust Service Criteria)**: Supports the "Security," "Availability," and "Processing Integrity" criteria.

---

## 5. Operations & Performance Tuning

### Data Ingestion

The dashboard is regenerated automatically whenever the [Playbook Repository](../ORGANIZE-MODULES/enterprise-structure-generator.md) is updated.

### Multi-Framework Scaling

The UI uses a tabbed interface to manage multiple frameworks, ensuring that even with 10+ regulatory standards, the dashboard remains performant and easy to navigate.

---

## 6. Future Growth & Opportunities

- **AI-Suggested Mappings**: Using the [AI Optimization Pipeline](../TIER-DEEP-DIVES/tier4-ai-model-optimization.md) to automatically suggest compliance tags for new playbooks based on their technical logic.
- **Cross-Framework "Deduplication"**: Identifying playbooks that satisfy multiple controls across different frameworks, allowing for "Test Once, Comply Many" auditing.
- **Live Auditor Portal**: (Experimental) Providing a read-only "Auditor View" of the dashboard with one-click export of full forensic evidence bundles.
