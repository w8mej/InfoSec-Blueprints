# Dashboard: VERIS Incident Category Intelligence

## Document Metadata

- **Audience**: SOC Managers | Incident Commanders | Threat Intelligence Analysts | CISOs
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [actor-cards-dashboard.md](./actor-cards-dashboard.md)
- **Related Specs**: `2023-04-22veris-incident-intelligence-design.md`, `2023-04-23-map-to-csf-2-community-profiles-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/scripts/generate_veris_dashboard.py`

## Quick Summary

The VERIS Incident Category Intelligence Dashboard is the "Risk Quantification" engine of the SentinelMesh platform. It transforms low-level incident metadata into high-level business intelligence using the **VERIS (Vocabulary for Event Recording and Incident Sharing)** framework. By categorizing incidents by Actor, Action, Asset, and Attribute, the dashboard identifies the **Primary Risk Vectors** facing the organization and provides a data-driven basis for strategic security investments.

This dashboard is the bridge between technical SOC operations and enterprise risk management, providing the metrics needed to communicate security impact to executive leadership.

---

## 1. Persona-Based Value Proposition

### For the SOC Manager / CISO

- **Trend Identification**: Spot rising threat patterns (e.g., "Increased Social Engineering attacks against Finance") before they become systemic crises.
- **Resource Allocation**: Prioritize defensive investments based on the actual "Action" and "Asset" categories that are being targeted most frequently.

### For the Threat Intelligence Analyst

- **Structured Sharing**: Easily export incident data in standardized VERIS format for sharing with ISACs or external partners.
- **Adversary Context**: Link high-level VERIS categories back to specific [Actor Intelligence Cards](./actor-cards-dashboard.md) and [ATT&CK Techniques](./attack-matrix-dashboard.md).

### For the Risk Manager

- **Quantifiable Impact**: Use the VERIS "Attribute" (Confidentiality, Integrity, Availability) tags to understand the true impact of incidents on organizational goals.

---

## 2. Architecture & Design: The VERIS A4 Model

### 2.1 The A4 Visualization (Treemaps & Sunbursts)

The dashboard uses interactive D3.js treemaps to visualize the four "A"s of VERIS:

- **Actors**: Who is behind the incident? (External, Internal, Partner).
- **Actions**: What did they do? (Malware, Hacking, Social, Misuse).
- **Assets**: What was targeted? (Server, Media, Person, Network).
- **Attributes**: What was the impact? (Confidentiality, Integrity, Availability).

### 2.2 MTTR vs. Category Analysis

A radar chart comparing the "Mean Time to Resolve" (MTTR) across different VERIS categories:

- **Goal**: Identify categories where the [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) is highly efficient vs. where manual intervention is causing delays.
- **Trend**: Track how the "Automation Ratio" for specific categories (e.g., "Malware Action") has improved over time.

### 2.3 Interactive Data Table

A filterable table of all recent incidents, mapped to their primary VERIS categories and linked to their [Signed Forensic Records](./chain-of-custody-dashboard.md).

---

## 3. Implementation Details: Generation Logic

### Core Generator (`src/scripts/generate_veris_dashboard.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Data Privacy & Anonymization

The dashboard supports an "Anonymized View" where sensitive incident details (e.g., specific IPs or employee names) are removed, leaving only the high-level VERIS categories for cross-departmental reporting.

### 4.2 Compliance Mapping

- **NIST 800-53 (PM-6)**: Fulfills requirements for "Information Security Measures of Performance."
- **ISO 27001 (A.16.1.1)**: Supports the reporting and analysis of information security events.

---

## 5. Operations & Performance Tuning

### Data Freshness

The dashboard is regenerated every 24 hours or upon the closure of a "Major Incident" (Critical severity).

### Scaling for Large Incident Corpora

For organizations with 100,000+ incidents, the dashboard uses "Data Aggregation" to group similar incidents into "Campaigns," ensuring the treemaps remain legible and the HTML file size stays manageable.

---

## 6. Future Growth & Opportunities

- **Automated Loss Calculation**: Integrating with the [Blast Radius Calculator](../ANALYSIS-MODULES/blast-radius-calculator.md) to provide a "Dollar-Value" loss estimate for each VERIS attribute.
- **Predictive Risk Modeling**: Using historical VERIS trends to predict the likelihood and impact of future attack scenarios.
- **Cross-Framework Intelligence**: Automatically generating [Compliance Reports](./compliance-matrix-dashboard.md) directly from the VERIS data.
