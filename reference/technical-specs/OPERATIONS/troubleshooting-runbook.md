# Operations: Platform Troubleshooting Runbook

## Document Metadata

- **Audience**: SREs | Platform Engineers | On-Call Engineers | SOC Leads
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [monitoring-observability.md](./monitoring-observability.md)
- **Related Specs**: `2023-04-27-operations-troubleshooting-runbook.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Escalation Path**: #aso-sre-oncall (Internal)

## Quick Summary

The Platform Troubleshooting Runbook is the "First Responder's Guide" for maintaining the SentinelMesh infrastructure. It provides a structured approach to diagnosing and resolving common platform failures, performance bottlenecks, and security anomalies. In a system where autonomous agents are performing critical remediation, **Infrastructure Reliability is Security Reliability**.

This runbook focuses on the "Health of the Machine," ensuring that the [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md), the [KMS Signer](../TIER-1-FOUNDATIONS/kms-schema-signer.md), and the [Ingest Pipeline](../TIER-DEEP-DIVES/tier4-realtime-alert-streaming.md) are always available and performing within their specified SLOs.

---

## 1. Persona-Based Value Proposition

### For the On-Call Engineer

- **Reduced MTTR**: Fast, step-by-step diagnostic paths for common error codes (e.g., `ASO-ERR-KMS-403`).
- **Standardized Response**: Ensures that all on-call engineers follow the same authorized procedures for platform recovery.

### For the SOC Lead

- **Transparency during Outages**: Clear instructions on how to communicate platform status and "Remediation Downtime" to the broader organization.

### For the Security Auditor

- **Operational Discipline**: Demonstrates that the organization has a formal, documented process for managing the reliability of its autonomous security tools.

---

## 2. Common Failure Scenarios & Resolutions

### 2.1 KMS Signing Failures (`ASO-ERR-KMS-XXX`)

- **Symptom**: Playbooks fail to generate or execute; error "Unable to fetch signature from KMS."
- **Diagnosis**:
  1.  Check [Cloud Monitoring](./monitoring-observability.md) for `cloudkms.googleapis.com/api/request_count` error spikes.
  2.  Verify the `aso-signer` service account has the `roles/cloudkms.signerVerifier` permission on the key.
  3.  Check if the KMS key version has been accidentally disabled or deleted.
- **Resolution**: Re-enable key version or restore IAM permissions. Restart the `aso-runtime` service to refresh the identity token.

### 2.2 Alert Ingest Backlog (`ASO-ERR-INGEST-001`)

- **Symptom**: MTTR is rising; alerts are appearing in the SIEM but playbooks are not being generated for minutes.
- **Diagnosis**:
  1.  Check the Pub/Sub "Oldest Unacked Message" metric.
  2.  Examine Cloud Run logs for `MEMORY_LIMIT_EXCEEDED` or `CPU_THROTTLING`.
- **Resolution**: Increase the `min-instances` and `memory` allocation for the `aso-ingest` Cloud Run service.

### 2.3 LLM Reasoning Timeouts (`ASO-ERR-LLM-504`)

- **Symptom**: Agents are "hanging" during the Decide phase; error "Upstream LLM Timeout."
- **Diagnosis**:
  1.  Check for regional outages in the AI provider (e.g., Vertex AI).
  2.  Examine the [Performance Profiler](../TIER-DEEP-DIVES/tier3-performance-profiling.md) to see if prompt length is exceeding the model's efficient processing window.
- **Resolution**: Temporarily switch to a faster model (e.g., Gemini Flash) or increase the `timeout_seconds` in the [Playbook Configuration](../TIER-DEEP-DIVES/tier3-configuration-file-format.md).

---

## 3. The "Kill-Switch" Protocol

If the platform is behaving erratically or a "Runaway Agent" is detected:

1.  **Halt Autonomy**: Set the global `MIN_AUTONOMOUS_CONFIDENCE` to `1.0` in the [Master Configuration](../TIER-DEEP-DIVES/tier3-configuration-file-format.md). This forces all actions to go through the [HITL Gate](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md).
2.  **Sever Signing Access**: Disable the production [KMS Signing Key](../TIER-1-FOUNDATIONS/kms-schema-signer.md). This cryptographically prevents the agent from taking any state-mutating actions.
3.  **Drain the Ingest Queue**: Pause the Pub/Sub subscriptions to prevent new playbooks from being generated while you troubleshoot.

---

## 4. Security & Compliance Deep-Dive

### 4.1 Troubleshooting Isolation

Always perform diagnostics using a dedicated, least-privilege "Diagnostic Role." Never use "Owner" or "Super Admin" privileges for routine troubleshooting.

### 4.2 Compliance Mapping

- **NIST 800-53 (CP-2)**: Directly supports "Contingency Planning" and "Incident Response for Information Systems."
- **ISO 27001 (A.12.1.1)**: Fulfills requirements for "Documented Operating Procedures."

---

## 5. Operations & Maintenance

### Weekly Health Checks

- Review the [Fidelity Dashboard](../DASHBOARDS-UI/detection-fidelity-dashboard.md) for rules with rising error rates.
- Perform a "Dry-Run" deployment of the infrastructure to verify [Terraform](./deployment-google-cloud.md) integrity.

---

## 6. Future Growth & Opportunities

- **Autonomous Troubleshooting Agent (ATA)**: (Experimental) A specialized agent that can monitor platform logs and automatically execute these troubleshooting steps (with human approval).
- **Self-Healing Infrastructure**: Implementing auto-remediation scripts (e.g., Cloud Functions) that trigger based on specific [Monitoring Alerts](./monitoring-observability.md).
- **Interactive "War Room" Dashboard**: A dedicated UI for on-call engineers that aggregates all platform health metrics and troubleshooting guidance into a single view.
