# Analysis Module: Blast Radius Calculator

## Document Metadata

- **Audience**: SREs | Incident Commanders | Risk Managers | Security Engineers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [blast-radius-dashboard.md](../DASHBOARDS-UI/blast-radius-dashboard.md)
- **Related Specs**: `2023-04-23-calculate-display-blast-radius-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/analysis/blast_radius_calculator.py`

## Quick Summary

The Blast Radius Calculator is the "Operational Risk Engine" of SentinelMesh. It is responsible for quantifying the transitive impact of a proposed containment or remediation action. Before an agent isolates a host or blocks a network segment, the calculator analyzes the **Service Dependency Graph** to identify which upstream and downstream applications, business units, and users will be affected.

This module provides the mathematical foundation for the [Confidence Threshold Gating](../../appendices/2023-04-planning/runtime-agentic-superpowers.md), ensuring that high-impact actions are automatically escalated to a human analyst for "Risk-Informed Approval."

---

## 1. Persona-Based Value Proposition

### For the Incident Commander

- **Risk-Informed Decisions**: You no longer have to guess "What happens if I block this IP?". The calculator provides an estimated "Operational Cost" for the action.
- **Priority Management**: Focus your efforts on containment steps that have the _lowest_ blast radius but the _highest_ security impact.

### For the SRE / Systems Engineer

- **Dependency Awareness**: Automatically discovers hidden dependencies that might not be documented in the CMDB (Configuration Management Database).
- **Service Level Maintenance**: Ensures that remediation efforts do not inadvertently cause a widespread outage that exceeds the organization's Error Budget.

### For the Risk Manager / CISO

- **Quantifiable Resilience**: Provides a clear metric for "Business Impact" during an incident, allowing for more accurate post-mortem risk assessments.

---

## 2. Architecture & Design: Dependency Mapping

### 2.1 The Dependency Graph

The calculator builds a directed graph of the environment:

- **Nodes**: Hosts, Containers, Databases, Load Balancers, Business Units.
- **Edges**: Network flows, IAM permissions, Service Calls (from traces).

### 2.2 Impact Scoring Algorithm

The "Blast Radius Score" (0.0 - 1.0) is calculated based on:

1.  **Direct Impact**: The primary target (e.g., 1 VM).
2.  **Transitive Impact**: All downstream nodes that rely on the target (e.g., the Web FE that talks to the DB).
3.  **Criticality Multiplier**: A weight assigned to the impacted nodes (e.g., "Production" = 1.0, "Dev" = 0.1).
4.  **Redundancy Factor**: If a service has multiple replicas, the impact of losing one is reduced.

### 2.3 Integration with Asset Inventory

- **GCP**: Queries Cloud Asset Inventory and VPC Flow Logs.
- **AWS**: Queries AWS Config and VPC Flow Logs.
- **Internal**: Can ingest static `.json` or `.yaml` dependency maps.

---

## 3. Implementation Details: Calculator Logic

### Core Calculator (`src/analysis/blast_radius_calculator.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Safety: The "Critical Threshold"

If the calculated score exceeds a pre-defined "Operational Safety Threshold" (e.g., 0.5), the [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) is prohibited from taking the action autonomously, regardless of the agent's confidence.

### 4.2 Compliance Mapping

- **NIST 800-34 (Contingency Planning)**: Supports impact analysis for information system contingency planning.
- **ISO 22301 (Business Continuity)**: Fulfills requirements for "Business Impact Analysis" (BIA) in the context of security incidents.

---

## 5. Operations & Performance Tuning

### Data Freshness

The dependency graph is cached for 1 hour. In high-velocity environments, you can force a refresh by calling `calculator.refresh_graph()`.

### Visualizing the Radius

The output of this module is used to render the [Blast Radius Dashboard](../DASHBOARDS-UI/blast-radius-dashboard.md), providing analysts with a "Sunburst" view of the impact.

---

## 6. Future Growth & Opportunities

- **Real-time Flow Analysis**: Integrating with live VPC Flow logs to detect "New" dependencies that appear during an incident (e.g., the attacker spinning up new internal connections).
- **Cost-to-Remediate Modeling**: Assigning a dollar-value to the downtime caused by a containment action.
- **"What-If" Simulation Mode**: Allowing SREs to simulate different containment strategies to find the one with the "Minimum Viable Blast Radius."
