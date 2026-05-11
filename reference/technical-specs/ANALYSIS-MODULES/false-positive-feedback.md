# Analysis Module: Automated False-Positive Tuning

## Document Metadata

- **Audience**: Detection Engineers | SOC Analysts | Data Scientists | Engineering Managers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [detection-fidelity-dashboard.md](../DASHBOARDS-UI/detection-fidelity-dashboard.md)
- **Related Specs**: `2023-04-23-automate-false-positive-tuning-design.md`, `2023-04-23-prohibit-black-box-agent-thinking-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/analysis/false_positive_feedback.py`

## Quick Summary

The Automated False-Positive Tuning module is the "Continuous Improvement" engine for SentinelMesh's detection rules. It manages the feedback loop between human analysts and the SIEM/Sigma rule repository. When an analyst rejects an autonomous recommendation or marks an alert as a "False Positive," this module analyzes the **Rejection Reason**, identifies the specific detection logic that triggered the noise, and proposes a **Tuning PR** (Pull Request) to refine the rule.

This module is the key to reducing "Alert Fatigue" and improving the [Signal-to-Noise Ratio](../DASHBOARDS-UI/detection-fidelity-dashboard.md) of the entire SOC.

---

## 1. Persona-Based Value Proposition

### For the SOC Analyst

- **Meaningful Feedback**: Your rejections are no longer "lost in the logs." Every time you dismiss an alert, you are actively helping the system become smarter and quieter.
- **Immediate Impact**: See your feedback transformed into a draft detection rule update within seconds.

### For the Detection Engineer

- **Data-Driven Tuning**: Receive pre-analyzed tuning recommendations based on real analyst behavior, rather than having to manually hunt through logs for noisy rules.
- **Consistency**: The module ensures that exclusions (e.g., "Ignore backup service IP") are applied consistently across the entire rule corpus.

### For the Engineering Manager

- **Quantifiable ROI**: Track the reduction in "Human Triage Time" as noisy rules are tuned out, providing a clear metric for SOC efficiency.

---

## 2. Architecture & Design: The Tuning Loop

### 2.1 Feedback Ingestion

The module listens for `ACTION_REJECTED` or `ALERT_CLOSED_AS_FP` events from the [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md). These events contain:

- **Rule ID**: The specific Sigma/SIEM rule that fired.
- **Rejection Context**: The specific field/value that the analyst identified as "Expected" or "Benign."
- **Analyst Commentary**: Natural language reasoning (e.g., "This is the authorized monthly backup script").

### 2.2 Tuning Recommendation Engine

The engine uses the following logic:

1.  **Clustering**: Are multiple analysts rejecting the same rule for the same reason?
2.  **Logic Extraction**: Identify the specific `condition` in the rule that is too broad.
3.  **Exclusion Generation**: Propose a new exclusion block (e.g., `NOT (process.name == "backup.exe" AND user.name == "sa_backup")`).
4.  **Risk Verification**: Check if the proposed exclusion would have missed any _True Positive_ incidents in the historical logs.

### 2.3 The Git-Ops Pipeline

- **Goal**: Safe, version-controlled rule updates.
- **Implementation**:
  - The module automatically clones the rule repository.
  - It creates a new branch and commits the proposed change.
  - It opens a **Tuning PR** in GitHub/GitLab and links it to the [Detection Fidelity Dashboard](../DASHBOARDS-UI/detection-fidelity-dashboard.md).

---

## 3. Implementation Details: Tuning Logic

### Core Feedback Engine (`src/analysis/false_positive_feedback.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Safety: Preventing "Over-Tuning"

An attacker might attempt to "Train the SOC to ignore them" by slowly introducing malicious behavior that looks like "Noise." The module includes a **Safety Baseline** check that prevents exclusions for critical system binaries or highly sensitive user accounts.

### 4.2 Compliance Mapping

- **NIST 800-53 (SI-4)**: Fulfills requirements for "Information System Monitoring" by providing a mechanism for "Tuning and Adjusting Detection Systems."
- **SOC2 (Change Management)**: Ensures that all rule changes go through a formal PR review process, providing a full audit trail of _why_ a rule was modified.

---

## 5. Operations & Performance Tuning

### MTT-Tune (Mean Time to Tune)

Track how long it takes from the first analyst rejection to the final PR merge. Goal: < 4 hours for high-noise rules.

### Reviewing Tuning PRs

Detection engineers should review the [Fidelity Scorecard](../DASHBOARDS-UI/detection-fidelity-dashboard.md) daily to prioritize which Tuning PRs to merge first.

---

## 6. Future Growth & Opportunities

- **AI-Driven Logic Synthesis**: Using the [AI Optimization Pipeline](../TIER-DEEP-DIVES/tier4-ai-model-optimization.md) to synthesize complex, multi-field exclusions that would be difficult for a human to write.
- **Cross-Customer Noise Sharing**: (For MSSPs) Identifying noisy rules that affect multiple customers and proposing "Global Tuning" recommendations.
- **Interactive Rule Sandbox**: Allowing analysts to "Test Drive" a proposed tuning change against live data before opening the PR.
