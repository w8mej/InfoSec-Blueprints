# TIER 1 Deep-Dive: Signed Timestamps & Merkle Proofs

## Document Metadata

- **Audience**: Security Architects | Cryptographers | Forensic Investigators | Compliance Auditors
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [forensic-security-capabilities.md](../../appendices/2023-04-planning/forensic-security-superpowers.md)
- **Related Specs**: `2023-04-27-signed-timestamps-design.md`, `2023-04-23-implement-append-only-execution-logs-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/runtime/signed_timestamp_merkle.py`

## Quick Summary

The Signed Timestamps & Merkle Proofs module is the "Immutability Engine" of SentinelMesh. It ensures that every action recorded in the [Append-Only Execution Logs](../../appendices/2023-04-planning/forensic-security-superpowers.md) is bound to a verifiable point in time and woven into a tamper-evident data structure. By using a **Merkle Tree**, the system can prove the integrity of the entire incident history with O(log N) efficiency, while hardware-backed **Signed Timestamps** from [Cloud KMS](../TIER-1-FOUNDATIONS/kms-schema-signer.md) prevent "Post-Hoc" log manipulation or "Time-Travel" attacks. To ensure maximum availability and censorship resistance, these chains are **distributed across torrent and blockchain protocols**, providing a decentralized, third-party verifiable anchor for all forensic evidence.

This module provides the mathematical certainty required for legal admissibility and long-term forensic reliability.

---

## 1. Persona-Based Value Proposition

### For the Forensic Investigator

- **Provable Timeline**: Every log entry contains a hash of the previous entry, signed by a trusted authority. If an entry is added, removed, or modified, the chain breaks instantly.
- **Timestamp Veracity**: Timestamps are signed by the [KMS HSM](../TIER-1-FOUNDATIONS/kms-schema-signer.md) and are independent of the local system clock, ensuring they cannot be spoofed by an attacker.

### For the Compliance Auditor

- **Audit Traceability**: One-click generation of "Integrity Certificates" that prove the entire incident record has remained pristine since the moment of creation.
- **Efficient Validation**: Verify the integrity of millions of log entries in seconds by checking the Merkle Root against the authorized public key.

### For the Security Architect

- **Zero-Trust Logging**: Even if the logging server is compromised, the attacker cannot modify historical logs without access to the HSM-protected signing keys.

---

## 2. Architecture & Design: The Immutable Ledger

### 2.1 The Merkle Tree Structure

SentinelMesh logs are organized as a "Merkle DAG" (Directed Acyclic Graph):

- **Leaf Nodes**: Individual log entries (e.g., cell executions, tool results).
- **Parent Nodes**: Cryptographic hashes of their children.
- **Root Hash**: The single hash that summarizes the entire state of the incident.
- **Linking**: Every new entry's parent hash is the previous Root Hash, creating a continuous "Append-Only" chain.

### 2.2 HSM-Signed Timestamps

To ensure non-repudiable timing, the system:

1.  **Requests Time**: Calls a trusted time source or uses the KMS-resident `iat` (Issued At) claim.
2.  **Binds to Content**: Signs the `(hash(log_entry) + timestamp)` bundle using the [KMS HSM key](../TIER-1-FOUNDATIONS/kms-schema-signer.md).
3.  **Encapsulates**: Returns a [Detached JWS](../../appendices/2023-04-planning/forensic-security-superpowers.md) that serves as the "Proof of Existence" at that specific time.

### 2.3 Verification Efficiency

A specialized module (`src/analysis/custody_analyzer.py`) can verify any specific log entry's membership in the chain by providing a "Merkle Proof"—a small set of hashes that link the leaf to the root.

### 2.4 Distributed Proof Distribution (Torrent & Blockchain)

To prevent internal data tampering or loss, SentinelMesh employs a dual-distribution strategy:

1.  **Torrent Distribution**: Merkle proof chains are bundled as `.torrent` files and seeded across internal nodes, ensuring that evidence is preserved even if the central SIEM is compromised or destroyed.
2.  **Blockchain Anchoring**: The final Merkle Root of an investigation is periodically "anchored" to a public or private blockchain (Ethereum/Hyperledger). This creates an immutable, timestamped record that serves as absolute proof of the investigation's state at a specific point in time.

---

## 3. Implementation Details: Merkle Logic

### Core Merkle Engine (`src/runtime/signed_timestamp_merkle.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Resistance to "History Rewriting"

Because every hash depends on the previous one, an attacker who wants to modify an entry from 50 steps ago would have to re-sign all 50 subsequent entries. Since they do not have the HSM-protected signing keys, this is computationally impossible.

### 4.2 Compliance Mapping

- **NIST 800-53 (AU-10)**: Fulfills requirements for "Non-Repudiation."
- **ISO 27001 (A.12.4.2)**: Supports "Protection of Log Information."
- **SEC Rule 17a-4**: Aligns with requirements for "Write Once, Read Many" (WORM) storage for financial records.

---

## 5. Operations & Performance Tuning

### Latency

Appending an entry is O(1) plus the KMS API latency. For high-volume log streams, SentinelMesh supports "Batching" where multiple log entries are hashed into a single Merkle leaf to reduce KMS calls.

### Storage

Merkle roots and signatures are stored in the [Playbook Metadata](../TIER-DEEP-DIVES/tier3-configuration-file-format.md), ensuring they travel with the incident record.

---

## 6. Future Growth & Opportunities

- **Cross-Incident Merkle Forests**: (Experimental) Linking the roots of multiple related incidents into a "Global Merkle Root" for the entire SOC.
- **Zero-Knowledge Merkle Proofs**: Allowing a third-party to verify "Entry X exists in the chain" without revealing the content of other entries in the log.
