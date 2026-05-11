# SentinelMesh Dashboards & UI Portfolio

## Document Metadata

- **Audience**: All Stakeholders
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [dashboard-architecture.md](./dashboard-architecture.md)
- **Related Docs**: [compliance-matrix-dashboard.md](./compliance-matrix-dashboard.md)
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only

## Quick Summary

The SentinelMesh platform features a comprehensive suite of 10+ interactive dashboards designed to provide visibility across every dimension of the autonomous SOC—from operational performance and threat actor intelligence to regulatory compliance and forensic integrity.

These dashboards transform the complex metadata of 1,000+ playbooks into actionable insights for SOC leadership, detection engineers, and incident responders.

## Dashboard Portfolio

### 1. [Playbook Performance Analytics](./detection-fidelity-dashboard.md)

- **Goal**: Track MTTR, MTTD, and SLO compliance across the corpus.
- **Key Visuals**: Grouped bar charts (Domain vs. SLO), TAME Radar charts.

### 2. [VERIS Incident Intelligence](./veris-intelligence-dashboard.md)

- **Goal**: Strategic view of incident categories (Traditional, AI/ML, Orbital).
- **Key Visuals**: D3 Treemap of category distribution, Category Radar.

### 3. [MITRE ATT&CK Matrix Heatmap](./attack-matrix-dashboard.md)

- **Goal**: Visualize playbook coverage across Tactic and Technique cells.
- **Key Visuals**: Interactive ATT&CK Matrix with coverage density shading.

### 4. [Compliance & Regulatory Matrix](./compliance-matrix-dashboard.md)

- **Goal**: Map playbooks to SOC2, ISO 27001, and NIST 800-53 controls.
- **Key Visuals**: Compliance Scorecards, Mapping Tables.

### 5. [Chain of Custody & Audit](./chain-of-custody-dashboard.md)

- **Goal**: Forensic verification of all response actions.
- **Key Visuals**: Signature Status Timeline, Tampering indicators.

### 6. [Blast Radius & Risk Assessment](./blast-radius-dashboard.md)

- **Goal**: Quantify the operational impact of containment actions.
- **Key Visuals**: Dependency Sunburst, Service Impact list.

### 7. [Actor & Threat Intelligence Cards](./actor-cards-dashboard.md)

- **Goal**: Profile tracked adversaries and their preferred techniques.
- **Key Visuals**: Actor Profile Cards, Relationship Graphs.

### 8. [CVE & Vulnerability Radar](./cve-radar-dashboard.md)

- **Goal**: Map playbook readiness to active CVE exposures.
- **Key Visuals**: Radar chart of "Time-to-Playbook" for new vulnerabilities.

### 9. [D3FEND & CAPEC Mapping](./d3fend-capec-mapping.md)

- **Goal**: Align response strategies with defensive counter-measures.
- **Key Visuals**: D3FEND Matrix Heatmap.

### 10. [Detection Fidelity Scorecard](./detection-fidelity-dashboard.md)

- **Goal**: Track the accuracy and false-positive rates of detection rules.
- **Key Visuals**: Fidelity Trend lines, Tuning PR status.

## Visual Design System

- **Minimalist Dark Mode**: Optimized for low-light SOC environments.
- **Color Semantics**:
  - **Emerald**: Success / SLO Passed / Low Risk.
  - **Amber**: Warning / Pending Action / Medium Risk.
  - **Rose**: Failure / SLO Breach / High Risk.
- **Typography**: Uses modern, highly-readable sans-serif stacks (Inter, Roboto).

## Deployment & Access

All dashboards are accessible via the **Master Documentation Portal**. Links are established in the `00-START-HERE.md` and `DOCUMENTATION_MAP.md` files.

## Future Growth & Opportunities

- **Executive Summary Dashboard**: A single "Single Pane of Glass" view for CISOs that aggregates high-level KPIs from all other dashboards.
- **Interactive Drill-Down**: Allowing users to click any chart element to jump directly to the underlying playbook source or CACAO JSON.
