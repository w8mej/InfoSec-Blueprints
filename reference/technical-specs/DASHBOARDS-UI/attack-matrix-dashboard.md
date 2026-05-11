# Dashboard: MITRE ATT&CK Matrix Heatmap

## Document Metadata

- **Audience**: Detection Engineers | SOC Managers | CISOs | Red Teams
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [enterprise-structure-generator.md](../ORGANIZE-MODULES/enterprise-structure-generator.md)
- **Related Specs**: `2023-04-22analytics-dashboard-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/scripts/generate_attck_matrix.py`

## Quick Summary

The MITRE ATT&CK Matrix Heatmap is the "Strategic Compass" of the SentinelMesh platform. It provides a visual, interactive representation of the organization's defensive coverage across the industry-standard ATT&CK Enterprise Matrix. By mapping the 1,000+ playbooks in the corpus to specific tactics and techniques, the heatmap identifies **Defensive Blind Spots** and communicates the maturity of the SOC's response capabilities to stakeholders at all levels.

This dashboard translates the complex technical metadata of the [Playbook Repository](../ORGANIZE-MODULES/enterprise-structure-generator.md) into a high-level "Coverage Scorecard" that drives detection engineering priorities.

---

## 1. Persona-Based Value Proposition

### For the Detection Engineer

- **Gap Identification**: Instantly see which Techniques (e.g., "T1053 - Scheduled Task") have zero playbook coverage.
- **Priority Roadmapping**: Focus your development efforts on high-risk tactics (e.g., "Persistence" or "Exfiltration") where coverage density is low.

### For the SOC Manager / CISO

- **Capability Maturity**: Provide a "Single Pane of Glass" view of the SOC's technical readiness to senior leadership.
- **Investment Justification**: Use the heatmap to demonstrate the ROI of new detection engineering hires or tool investments by showing the "Greening" of the matrix over time.

### For the Red Team / Security Evaluator

- **Path of Least Resistance**: Use the heatmap to identify attack vectors where the SOC's response is likely to be manual or non-existent, allowing for more realistic adversarial simulations.

---

## 2. Architecture & Design: Visualizing Coverage

### 2.1 Matrix Rendering Engine

The dashboard renders the official MITRE ATT&CK Matrix (v14+) using an interactive HTML/CSS layout.

- **Technique Shading**: The color density of a cell is determined by the number of playbooks tagged with that Technique ID.
  - **Transparent**: Zero coverage (Blind Spot).
  - **Light Blue**: Low coverage (1-2 playbooks).
  - **Deep Indigo**: High coverage (5+ playbooks).
- **Sub-technique Support**: Clicking a parent technique expands the view to show coverage for its specific sub-techniques.

### 2.2 Interactive Drill-Down

Clicking on any cell in the matrix triggers a detail view:

- **Playbook List**: Links to the specific [Jupyter/Marimo Playbooks](../GENERATORS/sigma-notebook-guide.md) that cover the technique.
- **Success Metrics**: Average [GAI Score](../TIER-DEEP-DIVES/tier3-performance-profiling.md) and MTTR for incidents involving this technique.
- **Related Actors**: Links to [Actor Intelligence Cards](./actor-cards-dashboard.md) for adversaries known to use this technique.

### 2.3 Tactic-Specific Filtering

Analysts can filter the matrix to focus on specific domains (Cloud, Windows, Linux) or specific [Compliance Frameworks](./compliance-matrix-dashboard.md).

---

## 3. Implementation Details: Generation Logic

### Core Generator (`src/scripts/generate_attck_matrix.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 "Coverage Drift" Detection

The generator tracks the delta between runs. If a technique's coverage decreases (e.g., due to a playbook being archived), a "Capability Degradation" alert is triggered.

### 4.2 Compliance Mapping

- **NIST 800-53 (RA-5)**: Supports "Vulnerability Monitoring and Scanning" by providing a map of where the system can effectively detect and respond to vulnerabilities.
- **MITRE ATT&CK Evaluators**: Directly aligns with the industry-standard framework for evaluating SOC performance.

---

## 5. Operations & Performance Tuning

### Data Freshness

The matrix is regenerated automatically every time a PR is merged into the `playbooks/` repository. It can also be triggered manually via:

```bash
make docs-attck-matrix
```

### Optimizing Rendering

For large matrices (1,000+ sub-techniques), the dashboard uses "Lazy Loading" to ensure the initial page load is < 2 seconds.

---

## 6. Future Growth & Opportunities

- **Live Incident Overlay**: Overlaying real-time incident data (e.g., "Attacks in progress") on the matrix to see which cells are currently under fire.
- **Predictive Gap Analysis**: Using ML to predict which "Empty Cells" are most likely to be targeted next based on current global threat trends.
- **Confidence Shading**: Adjusting cell color not just by "Count," but by the average [Confidence Score](../../appendices/2023-04-planning/runtime-agentic-superpowers.md) of the playbooks in that cell.
