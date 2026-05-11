# Dashboard: Blast Radius & Impact Analysis

## Document Metadata

- **Audience**: SREs | Incident Commanders | Systems Architects | Risk Managers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [blast-radius-calculator.md](../ANALYSIS-MODULES/blast-radius-calculator.md)
- **Related Specs**: `2023-04-23-calculate-display-blast-radius-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/scripts/generate_blast_radius_dashboard.py`

## Quick Summary

The Blast Radius & Impact Analysis Dashboard is the "Operational Safety View" of the SentinelMesh platform. It provides a real-time, interactive visualization of the potential consequences of any proposed remediation or containment action. By transforming abstract [Blast Radius Scores](../ANALYSIS-MODULES/blast-radius-calculator.md) into intuitive "Sunburst" and "Dependency Graph" visualizations, this dashboard ensures that analysts can make "Risk-Informed" decisions at the speed of an incident.

This dashboard is a mandatory component of the [HITL Approval Gate](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md), providing the critical business context needed to approve or modify autonomous containment recommendations.

---

## 1. Persona-Based Value Proposition

### For the Incident Commander

- **Visual Impact Awareness**: Instantly see the "Ripple Effect" of isolating a host. If a high-criticality service (e.g., Checkout) is in the blast radius, the dashboard will glow Rose (Red).
- **Strategy Comparison**: Compare the blast radius of two different strategies (e.g., "Block All Traffic" vs. "Block Specific Port") to find the minimal-impact path.

### For the SRE / On-Call Engineer

- **Dependency Discovery**: Use the force-directed graph to find "Hidden" dependencies that might cause a cascading failure during remediation.
- **Service Level Assurance**: Ensure that your response actions do not violate organizational SLOs for system availability.

### For the Risk Manager

- **Post-Mortem Impact Audit**: Review the "Estimated vs. Actual" blast radius of completed incidents to improve the accuracy of future risk modeling.

---

## 2. Architecture & Design: Visualizing the Ripple Effect

### 2.1 The Dependency Sunburst (D3.js)

The sunburst chart provides a multi-layered view of impact:

- **Inner Circle**: The target asset (e.g., Host-01).
- **Middle Layer**: Direct dependencies (e.g., Application-A, DB-B).
- **Outer Layer**: Business-level impact (e.g., "Checkout Workflow," "Billing System").
- **Interaction**: Hovering over any segment displays the specific [Risk Score](../ANALYSIS-MODULES/blast-radius-calculator.md) and "Estimated Downtime" for that component.

### 2.2 The Service Relationship Graph

A force-directed graph showing the network of services:

- **Red Nodes**: Critical services in the direct path of the containment action.
- **Amber Nodes**: At-risk services with indirect dependencies.
- **Green Nodes**: Safe services outside the blast radius.

### 2.3 The "Remediation Safety Check" Sidebar

A summary panel that translates the math into human-readable advice:

- **"SAFE TO PROCEED"**: Impact is limited to non-critical dev/test assets.
- **"HIGH OPERATIONAL RISK"**: Action will impact production revenue-generating services.
- **"CRITICAL: HUMAN APPROVAL REQUIRED"**: Blast radius score exceeds 0.75.

---

## 3. Implementation Details: Visualization Logic

### Core Generator (`src/scripts/generate_blast_radius_dashboard.py`)

```python
REDACTED
```

### Dashboard Template (HTML/JS)

Uses `d3.partition()` to calculate the sunburst layout and `d3.forceSimulation()` for the relationship graph. The data is "Baked-In" to the HTML using the [Dashboard Architecture](./dashboard-architecture.md).

---

## 4. Security & Compliance Deep-Dive

### 4.1 Asset Criticality Mapping

The dashboard relies on an "Asset Sensitivity" database. This data is protected by strict IAM policies to ensure that only authorized personnel can view the internal dependency structure of the organization's infrastructure.

### 4.2 Compliance Mapping

- **NIST 800-34 (Contingency Planning)**: Directly supports "Business Impact Analysis" for information system contingency planning.
- **ISO 22301**: Fulfills requirements for understanding the impact of disruptions on business continuity.

---

## 5. Operations & Performance Tuning

### Data Freshness

The dashboard is updated in real-time as the [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) discovers new data during the "Orient" phase of the OODA loop.

### Optimizing Complex Graphs

For environments with 10,000+ assets, the graph uses "Pruning" logic to only display nodes within 3 "Hops" of the target asset, keeping the visualization performant and readable.

---

## 6. Future Growth & Opportunities

- **Cost-of-Outage Overlay**: Integrating with cloud billing data to provide a "Dollar-Cost" estimate for the proposed downtime.
- **Automated Mitigation Trees**: Recommending the "Optimal Containment Path" that achieves the security goal with the absolute minimum blast radius.
- **Live Traffic Re-routing**: (Future Integration) Suggesting traffic re-routing rules (e.g., in Istio or Envoy) that could minimize the blast radius by moving users away from the target asset before it is isolated.
