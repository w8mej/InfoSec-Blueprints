# TIER 1 Deep-Dive: KMS Schema Signer

## Document Metadata

- **Audience**: Security Engineers | Cryptographers | Backend Engineers | Auditors
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [forensic-security-capabilities.md](../../appendices/2023-04-planning/forensic-security-superpowers.md)
- **Related Specs**: `2023-04-27-kms-schema-signer-design.md`, `2023-04-23-sign-executions-via-detached-jws-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/runtime/kms_schema_signer.py`

## Quick Summary

The KMS Schema Signer is the "Root of Trust" for the SentinelMesh platform. It provides the cryptographic primitives used to ensure the **Authenticity and Integrity** of every playbook, configuration, and execution artifact. By leveraging hardware-backed keys (FIPS 140-4) in [Cloud KMS](../OPERATIONS/deployment-google-cloud.md), the system ensures that signing keys are never exposed in memory or on disk.

This module implements the [Detached JWS](../../appendices/2023-04-planning/forensic-security-superpowers.md) signing logic, allowing SentinelMesh to prove that its actions were authorized and that its logs have not been tampered with.

---

## 1. Persona-Based Value Proposition

### For the Security Engineer / Cryptographer

- **Hardware-Backed Assurance**: Keys are generated and stored inside an HSM (Hardware Security Module), preventing extraction even if the host OS is compromised.
- **Asymmetric Rigor**: Uses Elliptic Curve (EC) cryptography (P-256) for a superior balance of security and performance compared to RSA.

### For the Backend Engineer

- **Abstracted Complexity**: The `KMSSigner` class handles all the low-level details of hashing, padding, and API retries, providing a simple `sign()` and `verify()` interface.
- **Provider Agnostic**: (Future) Designed to support GCP KMS, AWS KMS, and HashiCorp Vault via a unified provider interface.

### For the Compliance Auditor

- **Non-Repudiable Identity**: Every signature is bound to a specific [GCP Service Account](../OPERATIONS/security-hardening.md), providing a clear audit trail of _who_ (which agent) performed an action.
- **Key Rotation Proof**: The system tracks `KMS_KEY_VERSION` in all signatures, ensuring that historical logs can be verified even after keys have been rotated.

---

## 2. Architecture & Design: The Signing Flow

### 2.1 Detached JWS Pattern

Unlike standard JWS where the payload is included in the token, SentinelMesh uses **Detached Signatures**.

- **The Artifact**: The original JSON or Notebook file.
- **The Signature**: A separate `header.signature` string stored in metadata.
- **Benefit**: Allows the artifact to be read by standard tools (like Jupyter) without needing a JWS parser, while still maintaining full integrity proof.

### 2.2 Hash-Before-Sign Optimization

To minimize the amount of data sent to the KMS API (and thus reduce latency and cost), the signer:

1.  **Hashes Locally**: Calculates a SHA-256 hash of the artifact on the SentinelMesh runtime.
2.  **Signs Remotely**: Sends only the 32-byte hash to the KMS API for signing.
3.  **Appends Metadata**: Stores the resulting signature and the hash algorithm in the artifact's metadata block.

### 2.3 Identity Binding (The "ASO Identity" Claim)

Every signature includes a set of protected headers that bind the action to:

- `iss`: The SentinelMesh runtime identity.
- `iat`: Signed timestamp of issuance.
- `aso_cid`: The unique correlation ID of the incident.

---

## 3. Implementation Details: Signer Logic

### Core Signer (`src/runtime/kms_schema_signer.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Key Protection & IAM

Access to the signing key is strictly restricted via **IAM Least Privilege**. The SentinelMesh Service Account is granted `roles/cloudkms.signerVerifier` but _never_ `roles/cloudkms.admin`, preventing the agent from deleting or misconfiguring its own trust root.

### 4.2 Compliance Mapping

- **FIPS 140-4**: The hardware requirement for HSM-backed keys.
- **NIST SP 800-57**: Aligns with "Recommendation for Key Management."
- **PCI-DSS (Requirement 3.5)**: Fulfills requirements for "Document and Implement Procedures to Protect Stored Cardholder Data."

---

## 5. Operations & Performance Tuning

### Latency Monitoring

Signing is an O(N) operation where N is the number of cells in a playbook. We monitor `kms_sign_latency_ms` to ensure it stays below 50ms per signature.

### Key Rotation

We support **Automatic Key Rotation** in GCP. When a key is rotated, the signer automatically uses the newest version for new signatures, while the `KMS_KEY_VERSION` in older artifacts ensures they can still be verified using the archived public keys.

---

## 6. Future Growth & Opportunities

- **Multi-Cloud Key Mesh**: (Experimental) Using keys from multiple cloud providers (GCP + AWS) to sign high-risk containment actions, providing "Cross-Cloud Non-Repudiation."
- **Post-Quantum Cryptography (PQC)**: Preparing for the future by implementing PQC-ready signing algorithms as they become available in managed KMS providers.
- **Hardware-Enforced Logic**: (Future) Moving part of the "Allowed Callers" policy into the HSM itself, ensuring that even a compromised runtime cannot sign a "Destructive" action unless the HSM-resident policy is satisfied.
