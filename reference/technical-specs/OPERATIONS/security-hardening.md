# Operations: Security Hardening & Zero-Trust Architecture

## Document Metadata

- **Audience**: Security Architects | Cloud Security Engineers | Compliance Auditors | SREs
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [forensic-security-capabilities.md](../../appendices/2023-04-planning/forensic-security-superpowers.md)
- **Related Specs**: `2023-04-27-operations-security-hardening.md`, `2023-04-23-explicit-allowed-callers-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Tooling**: Google Cloud IAM, VPC Service Controls, Cloud Armor

## Quick Summary

The Security Hardening & Zero-Trust Architecture document defines the "Defense-in-Depth" strategy for the SentinelMesh platform. Because SentinelMesh possesses significant privileges to remediate incidents across production environments, it is a high-value target for attackers. This guide outlines the mandatory security controls required to protect the platform's integrity, isolate its runtime from the broader network, and ensure that [Autonomous Actions](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) are strictly governed by least-privilege principles.

The platform's security model is built on the principle of **Implicit Distrust**: no component or identity is trusted without cryptographic proof.

---

## 1. Persona-Based Value Proposition

### For the Security Architect

- **Isolation by Design**: The use of VPC Service Controls and private VPC connectors ensures that SentinelMesh operates in a "Clean Room" environment.
- **Cryptographic Enclaves**: All sensitive operations (signing, decryption) are offloaded to [KMS HSMs](../TIER-1-FOUNDATIONS/kms-schema-signer.md), removing keys from the runtime memory space.

### For the Compliance Auditor

- **Provable Least Privilege**: Every service identity is mapped to a discrete set of IAM permissions, fulfilling the "Principle of Least Privilege" (PoLP).
- **Tamper-Evident Configuration**: All infrastructure is deployed via [Terraform](./deployment-google-cloud.md), providing a version-controlled audit trail of security settings.

### For the SRE / Systems Engineer

- **Reduced Attack Surface**: By disabling public endpoints and using [Cloud Armor](https://cloud.google.com/armor) for ingress protection, the platform is shielded from common internet-based attacks.

---

## 2. Hardening Layers: Defense-in-Depth

### 2.1 Identity & Access Management (IAM)

- **Service Account Isolation**: Each component (Ingest, Executor, Signer) has its own unique service account.
- **Conditional IAM**: Access to high-risk tools is restricted using IAM Conditions (e.g., "Only allow access from specific VPC connectors").
- **Workload Identity**: Eliminates the need for long-lived service account keys by using short-lived tokens.

### 2.2 Network Security (Zero-Trust VPC)

- **VPC Service Controls (VPC-SC)**: Creates a logical perimeter around the ASO project, preventing data exfiltration to unauthorized Google Cloud or external services.
- **Private Google Access**: All communication between the ASO runtime and Google APIs (KMS, GCS, Firestore) stays within the Google network.
- **Micro-segmentation**: Using firewall rules to restrict traffic between the ASO components to only the minimum necessary ports.

### 2.3 Runtime Protection

- **Confidential Computing**: Running the ALE runtime in [Confidential VMs](https://cloud.google.com/confidential-computing) to encrypt data-in-use at the hardware level.
- **Binary Authorization**: Ensuring that only container images signed by the authorized [KMS Signer](../TIER-1-FOUNDATIONS/kms-schema-signer.md) can be deployed to the production environment.

### 2.4 Data-at-Rest Security

- **CMEK (Customer-Managed Encryption Keys)**: All GCS buckets and Firestore databases are encrypted using keys managed in [Cloud KMS](../TIER-1-FOUNDATIONS/kms-schema-signer.md).
- **Object Lock (WORM)**: Forensic artifacts in GCS are protected by retention policies that prevent deletion or modification.

---

## 3. Mandatory Security Baseline (Checklist)

| Control              | Status    | Technical Detail                                     |
| -------------------- | --------- | ---------------------------------------------------- |
| **KMS HSM Keys**     | Mandatory | Asymmetric P-256 for all signing operations.         |
| **VPC-SC Perimeter** | Mandatory | Restrict to authorized ASO project and CIDRs.        |
| **No Public IPs**    | Mandatory | Cloud Run services must be "Internal Only."          |
| **TLS 1.3**          | Mandatory | Minimum version for all inter-service communication. |
| **JWS Signatures**   | Mandatory | Every state-mutating action must be signed.          |

---

## 4. Operations & Monitoring

### Security Anomaly Detection

Use [GCP Security Command Center (SCC)](https://console.cloud.google.com/security/command-center) to monitor for:

- Unauthorized IAM permission changes.
- Attempts to access the ASO runtime from outside the VPC perimeter.
- Deletion or disabling of critical [KMS Keys](../TIER-1-FOUNDATIONS/kms-schema-signer.md).

### Incident Response (for the platform)

If the ASO platform itself is compromised, the primary recovery strategy is to **Sever the KMS Access**. By disabling the signing keys, you immediately halt all [Autonomous Remediation](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) capabilities across the enterprise.

---

## 5. Compliance Mapping

- **NIST 800-53 (AC-2, AC-3, SC-7)**: Directly addresses access control and boundary protection requirements.
- **ISO 27001 (A.13.1.1)**: Fulfills requirements for "Network Controls."
- **FedRAMP (High)**: The architecture is designed to meet the rigorous security requirements for US federal agencies.

---

## 6. Future Growth & Opportunities

- **Hardware-Enforced Multi-Party Authorization (M-of-N)**: Requiring multiple independent KMS-backed signatures before a "Global Remediation" action can be executed.
- **Zero-Knowledge Architecture**: Moving towards an architecture where the ASO runtime never sees raw alert data, only encrypted blobs and [Merkle Proofs](../TIER-1-FOUNDATIONS/signed-timestamp-merkle-proofs.md).
- **Continuous Security Validation**: Automatically running "Red Team" scripts against the ASO platform to verify that hardening controls are effective.
