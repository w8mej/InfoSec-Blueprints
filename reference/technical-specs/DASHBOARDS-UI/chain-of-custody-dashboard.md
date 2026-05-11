# Dashboard: Chain of Custody & Forensic Audit

## Document Metadata

- **Audience**: Forensic Investigators | Auditors | Legal Counsel | Security Evaluators
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [custody-chain-analysis.md](../ANALYSIS-MODULES/custody-chain-analysis.md)
- **Related Specs**: `2023-04-23-implement-append-only-execution-logs-design.md`, `2023-04-27-signed-timestamps-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/scripts/generate_custody_dashboard.py`

## Quick Summary

The Chain of Custody & Forensic Audit Dashboard is the "Transparency Engine" of the SentinelMesh platform. It provides a visual, cryptographically verified record of every action taken during an incident. By transforming raw [Append-Only Execution Logs](../../appendices/2023-04-planning/forensic-security-superpowers.md) and [Merkle Proofs](../TIER-1-FOUNDATIONS/signed-timestamp-merkle-proofs.md) into an interactive timeline, this dashboard proves that the investigation followed procedural standards and that no evidence has been tampered with.

This is the definitive tool for demonstrating **Non-Repudiation** to auditors, Legals, and senior leadership, ensuring that SentinelMesh's autonomous actions are fully defensible.

---

## 1. Persona-Based Value Proposition

### For the Forensic Investigator

- **Tamper Evidence**: Every cell execution in the timeline includes a "Verified" badge. If a badge is Rose (Red), the dashboard highlights exactly where the [Merkle Chain](../TIER-1-FOUNDATIONS/signed-timestamp-merkle-proofs.md) was broken.
- **Artifact Traceability**: One-click access to the original, signed forensic artifacts captured during the [Pre-Execution phase](../ANALYSIS-MODULES/pre-execution-artifacts.md).

### For the Compliance Auditor / Legal Counsel

- **Audit-Ready Evidence**: Generate a "Forensic Integrity Certificate" (PDF/JSON) that proves the incident was handled according to organizational and regulatory policy.
- **Identity Binding**: See exactly which [KMS Key Version](../TIER-1-FOUNDATIONS/kms-schema-signer.md) and [Service Account Identity](../OPERATIONS/security-hardening.md) was used for each state-mutating action.

### For the Security Architect

- **Proof of Correctness**: Verify that the [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) followed the authorized [Playbook Template](../TIER-DEEP-DIVES/tier4-playbook-templating-system.md) without unauthorized deviation.

---

## 2. Architecture & Design: The Verified Timeline

### 2.1 The Forensic Timeline UI

The dashboard features a vertical, interactive timeline of the incident:

- **Event Nodes**: Each node represents a cell execution (Triage, Containment, etc.).
- **Signature Badges**:
  - **Emerald (Checkmark)**: Cryptographically verified signature and hash.
  - **Rose (Warning)**: Invalid signature or broken Merkle link.
  - **Amber (Clock)**: Pending verification or missing signature.
- **Metadata Panel**: Displays the raw JWS signature, KMS Key ID, and execution timestamp for the selected node.

### 2.2 Merkle Chain Visualization

A specialized view that shows the "Linking" of events:

- **Parent/Child Connections**: Visual lines showing how each event's hash is woven into the next.
- **Root Hash Status**: Displays the "Final Root Hash" of the incident and its hardware-backed signature.

### 2.3 Evidence Search & Export

Auditors can search for specific actions (e.g., "Show all containment steps") and export the associated signed logs and metadata as a "Best Evidence" package.

---

## 3. Implementation Details: Verification Logic

### Core Generator (`src/scripts/generate_custody_dashboard.py`)

```python
REDACTED
```

### Dashboard Template (HTML/JS)

Uses a minimalist CSS timeline layout with SVG badges. Verification logic can be optionally re-run client-side if the auditor provides the public KMS keys, ensuring **Zero-Trust Auditability**.

---

## 4. Security & Compliance Deep-Dive

### 4.1 "Tamper-Evident" Guarantees

The dashboard is designed to be "Adversary Resistant." Even if an attacker modifies the HTML source of the dashboard, they cannot forge the underlying cryptographic signatures or the Merkle proof chain, which are independently verifiable.

### 4.2 Compliance Mapping

- **NIST 800-53 (AU-10)**: Directly addresses the requirement for "Non-Repudiation."
- **ISO 27001 (A.16.1.7)**: Fulfills requirements for the "Collection of Evidence" during information security incidents.
- **GDPR (Article 30)**: Supports the requirement for maintaining "Records of Processing Activities."

---

## 5. Operations & Performance Tuning

### Data Ingestion

The dashboard ingests logs directly from the [Signed Execution Streams](../../appendices/2023-04-planning/forensic-security-superpowers.md).

### Performance for Long Investigations

For incidents with 1,000+ events, the dashboard uses "Virtual Scrolling" to ensure the timeline remains smooth and responsive.

---

## 6. Future Growth & Opportunities

- **Cross-Organization Notarization**: (Experimental) Periodically publishing the "Master Merkle Root" of all SOC incidents to a public ledger for absolute non-repudiation.
- **Automated Audit Feedback**: Allowing auditors to digitally "Sign-off" on an incident timeline directly within the dashboard.
- **Diff-based Investigation**: Comparing two different investigations of the same incident type to find deviations in procedural adherence.
