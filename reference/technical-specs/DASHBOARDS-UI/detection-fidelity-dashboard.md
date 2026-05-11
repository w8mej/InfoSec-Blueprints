# Dashboard: Detection Fidelity & Rule Tuning

## Document Metadata

- **Audience**: Detection Engineers | SOC Managers | Analysts | SREs
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [false-positive-feedback.md](../ANALYSIS-MODULES/false-positive-feedback.md)
- **Related Specs**: `2023-04-22detection-fidelity-scorecard-design.md`, `2023-04-23-automate-false-positive-tuning-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/scripts/generate_fidelity_dashboard.py`

## Quick Summary

The Detection Fidelity & Rule Tuning Dashboard is the "Performance Monitor" of the SentinelMesh detection engine. Its primary goal is to track and improve the **Signal-to-Noise Ratio** of the organization's SIEM and Sigma rules. By aggregating data on True Positives (TPs), False Positives (FPs), and [Analyst Rejection Reasons](../ANALYSIS-MODULES/false-positive-feedback.md), the dashboard provides a prioritized list of "Noisy" rules and manages the automated [Tuning PR Pipeline](../ANALYSIS-MODULES/false-positive-feedback.md).

This dashboard is the key to eradicating "Alert Fatigue" and ensuring that the SOC's autonomous response loops are triggered by high-fidelity detections only.

---

## 1. Persona-Based Value Proposition

### For the Detection Engineer

- **Data-Driven Prioritization**: See exactly which rules are causing the most noise in production and focus your tuning efforts where they will have the most impact.
- **Tuning PR Management**: Track the status of all automated [Tuning PRs](../ANALYSIS-MODULES/false-positive-feedback.md) and verify their effectiveness before merging.

### For the SOC Manager

- **Operational Efficiency**: Measure the reduction in "False Positive Triage Time" over time, providing a clear ROI for detection engineering activities.
- **SLA/SLO Tracking**: Ensure that detection fidelity remains above organizational thresholds (e.g., > 90% True Positive Rate for Critical alerts).

### For the SOC Analyst

- **Visibility into Feedback**: See that your "False Positive" tags are actually being used to fix the noisy rules, increasing your confidence in the reporting system.

---

## 2. Architecture & Design: The Fidelity Scorecard

### 2.1 Rule Fidelity Grid

The dashboard features a filterable grid of all active detection rules:

- **Rule Metadata**: Name, ID, Severity, and [ATT&CK Tactic](./attack-matrix-dashboard.md).
- **Fidelity Metrics**:
  - **TP Rate**: % of alerts that were confirmed as legitimate threats.
  - **FP Rate**: % of alerts marked as False Positives by analysts.
  - **Noise Score**: A weighted metric combining FP volume and analyst triage time.
- **Status Indicator**:
  - **Emerald (Healthy)**: High fidelity, low noise.
  - **Amber (Tuning Needed)**: Rising FP rate, tuning recommended.
  - **Rose (Critical Noise)**: Immediate tuning required; rule may be candidates for temporary suppression.

### 2.2 The "Noisy" Top 10

A prioritized list of the rules that are currently degrading SOC performance, including the "Most Common Rejection Reasons" (e.g., "Expected Admin Activity," "Service Account Noise").

### 2.3 Tuning PR Tracker

A live view of the [Git-Ops Tuning Pipeline](../ANALYSIS-MODULES/false-positive-feedback.md):

- **Source Rule**: The rule being tuned.
- **Proposed Change**: A diff view of the suggested exclusion logic.
- **PR Status**: Open, Reviewing, Merged, or Rejected.

---

## 3. Implementation Details: Metrics Logic

### Core Generator (`src/scripts/generate_fidelity_dashboard.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Safety: The "Blind Spot" Guardrail

The dashboard monitors for "Over-Tuning." If a tuning PR would exclude a large percentage of legitimate historical TP alerts, the dashboard flags the PR as "HIGH RISK" and requires manual engineering review.

### 4.2 Compliance Mapping

- **NIST 800-53 (SI-4)**: Fulfills requirements for "Information System Monitoring" by providing a mechanism for tuning detection systems.
- **SOC2 (Processing Integrity)**: Ensures that security alerts are accurate and that the detection logic is consistently refined.

---

## 5. Operations & Performance Tuning

### Data Freshness

The dashboard is updated hourly by ingesting the latest [Signed Telemetry Streams](../../appendices/2023-04-planning/forensic-security-superpowers.md) from the production SIEM and ASO runtime.

### Scaling for 1,000+ Rules

The UI uses "Faceted Search" to allow engineers to quickly filter by Tactic, Vendor (e.g., Chronicle, Splunk), or specific Resource Type.

---

## 6. Future Growth & Opportunities

- **AI-Driven Logic Synthesis**: Using the [AI Optimization Pipeline](../TIER-DEEP-DIVES/tier4-ai-model-optimization.md) to automatically suggest complex, multi-field exclusions that would be difficult for a human to write.
- **Predictive Noise Analysis**: Predicting the likelihood of an alert being a False Positive _before_ it reaches the analyst, based on historical fidelity patterns.
- **Cross-Framework "Tuning Heatmap"**: Visualizing which areas of the [ATT&CK Matrix](./attack-matrix-dashboard.md) are most prone to noise, helping to identify systemic issues with specific data sources.
  - For example: identifying that "Process Execution" logs from a specific fleet of servers are 90% noisy.
