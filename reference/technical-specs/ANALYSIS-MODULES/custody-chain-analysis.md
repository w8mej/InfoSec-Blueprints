# Analysis Module: Custody Chain & Integrity Verification

## Document Metadata

- **Audience**: Forensic Investigators | Auditors | Legal Counsel | Security Engineers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [forensic-security-capabilities.md](../../appendices/2023-04-planning/forensic-security-superpowers.md)
- **Related Specs**: `2023-04-23-implement-append-only-execution-logs-design.md`, `2023-04-27-signed-timestamps-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/analysis/custody_analyzer.py`

## Quick Summary

The Custody Chain Analysis module is the "Truth Verification Engine" of SentinelMesh. Its primary function is to audit the [Append-Only Execution Logs](../../appendices/2023-04-planning/forensic-security-superpowers.md) and ensure that every action recorded in an incident playbook is authentic, untampered, and cryptographically verified. By traversing the **Merkle Proof Chain** and validating the **Detached JWS Signatures**, this module provides a "Certificate of Integrity" that proves the response followed procedural standards.

This module is the bridge between raw technical logs and the high-assurance evidence required by legal and regulatory bodies.

---

## 1. Persona-Based Value Proposition

### For the Forensic Lead

- **Tamper Detection**: Instantly identify if even a single bit of forensic evidence has been modified after the initial capture.
- **Provenance Visualization**: Trace the "History of an Action" from the agent's reasoning to the hardware-backed KMS signature.

### For the Compliance Auditor

- **Audit Automation**: Automatically verify 1,000+ incidents in bulk, replacing manual "Check-the-Box" auditing with mathematical certainty.
- **Signature Traceability**: Easily map every action to a specific [KMS Key Version](../TIER-1-FOUNDATIONS/kms-schema-signer.md) and identity claim.

### For the Legal

- **Chain of Custody Report**: Generate a "Court-Ready" summary of the cryptographic proofs that validate the incident timeline.

---

## 2. Architecture & Design: The Verification Logic

### 2.1 Merkle Chain Traversal

The analyzer implements a "Bottom-Up" verification:

1.  **Leaf Validation**: For every log entry (leaf), verify that its hash matches the entry in the [Merkle Tree](../TIER-1-FOUNDATIONS/signed-timestamp-merkle-proofs.md).
2.  **Parent-Link Validation**: Verify that each node's "Parent Hash" correctly links to the next entry in the chain.
3.  **Root Verification**: Ensure that the "Final Merkle Root" is signed by the authorized [Cloud KMS](../TIER-1-FOUNDATIONS/kms-schema-signer.md) key.

### 2.2 Detached Signature Verification

In addition to the chain integrity, the module verifies individual signatures:

- **Input Integrity**: Does the code in the cell match the hash signed at generation time?
- **Output Integrity**: Does the tool result match the hash signed at execution time?
- **Identity Binding**: Does the signer's identity match the authorized [Service Account](../OPERATIONS/security-hardening.md)?

### 2.3 Timestamp Non-Repudiation

The module compares the execution timestamps against the [Signed Timestamps](../TIER-1-FOUNDATIONS/signed-timestamp-merkle-proofs.md) from the KMS authority to detect any "Time Travel" or log re-ordering attempts.

---

## 3. Implementation Details: Analyzer Logic

### Core Analyzer (`src/analysis/custody_analyzer.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 "Tampered" State Handling

If the analyzer detects a broken link or an invalid signature, it marks the incident as **FORENSICALLY_UNRELIABLE**. This state is high-lighted in the [Custody Chain Dashboard](../DASHBOARDS-UI/chain-of-custody-dashboard.md) and triggers an immediate "Security Audit" alert.

### 4.2 Compliance Mapping

- **NIST 800-86 (Guide to Integrating Forensic Techniques)**: Directly addresses the need for ensuring the integrity of forensic data.
- **ISO 27037 (Guidelines for identification, collection, acquisition and preservation of digital evidence)**: Fulfills requirements for "Digital Evidence Integrity."

---

## 5. Operations & Performance Tuning

### Bulk Verification (CLI)

For weekly audits, run the analyzer in batch mode:

```bash
python -m src.analysis.custody_analyzer \
  --corpus-dir /path/to/incidents/ \
  --threads 16 \
  --output report.json
```

### Visual Audit Trail

The results are used to populate the [Forensic Audit Dashboard](../DASHBOARDS-UI/chain-of-custody-dashboard.md), where "Green" status indicates a perfectly verified chain and "Red" indicates a gap or discrepancy.

---

## 6. Future Growth & Opportunities

- **Cross-Org Evidence Verification**: (Experimental) Allowing a third-party auditor to run this module against the SOC's logs to provide "Independent Verification."
- **AI-Assisted Tamper Analysis**: Using ML to identify "Suspicious Log Patterns" that might indicate a sophisticated attacker attempting to "Gracefully" modify the audit trail.
- **Hardware-Enforced Verification**: Running the analyzer within a "Confidential VM" to ensure that the verification process itself cannot be tampered with.
