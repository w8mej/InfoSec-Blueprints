# Analysis Module: Pre-Execution Artifact Preservation

## Document Metadata

- **Audience**: Forensic Investigators | Incident Responders | Legal Counsel | Security Architects
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [forensic-security-capabilities.md](../../appendices/2023-04-planning/forensic-security-superpowers.md)
- **Related Specs**: `2023-04-23-capture-pre-execution-artifacts-design.md`, `2023-04-23-snapshot-execution-environments-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/analysis/pre_execution_artifacts.py`

## Quick Summary

The Pre-Execution Artifact Preservation module is the "Forensic Time Capsule" of SentinelMesh. Its critical mission is to capture and preserve the **Volatile State** of a system _immediately before_ any state-mutating remediation action is taken. In incident response, the act of "Fixing" a problem (e.g., killing a process or isolating a host) often destroys the very evidence needed to understand the "How" and "Who" of the attack.

This module ensures that memory strings, process trees, and open network connections are cryptographically [Signed and Snapshot](../../appendices/2023-04-planning/forensic-security-superpowers.md) before they are lost forever, ensuring a complete and admissible forensic record.

---

## 1. Persona-Based Value Proposition

### For the Forensic Investigator

- **Preserved Evidence**: Never lose critical memory-resident malware or ephemeral C2 connections due to a "Containment First" policy.
- **Root Cause Analysis**: Use the pre-remediation snapshot to perform a deep-dive forensic analysis even after the target host has been wiped or restored.

### For the Legal & Compliance Team

- **Procedural Rigor**: Prove that the organization prioritized "Evidence Preservation" (adhering to the **Daubert Standard**) even while moving at the speed of autonomous response.
- **Audit Admissibility**: Every artifact is timestamped and signed, providing a "Gold Standard" of evidence for legal proceedings.

### For the SOC Lead / Incident Commander

- **Risk Mitigation**: The "Capture-before-Remediate" policy provides a safety net. If a remediation action goes wrong, you still have the original state for analysis and recovery.

---

## 2. Architecture & Design: Preservation Strategy

### 2.1 The "Snapshot-First" Gate

The [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) is configured with a "Snapshot Gate." Before any tool call marked as `DESTRUCTIVE=True` is executed, the ALE _must_ call the Artifact Preservation module.

### 2.2 Volatile Data Capture

The module captures the following "Top 5" volatile artifacts:

1.  **Process List & Tree**: Comprehensive view of all running processes, parent/child relationships, and command-line arguments.
2.  **Network Connections (Netstat)**: Active TCP/UDP connections, listening ports, and associated PIDs.
3.  **Memory Strings (Selected)**: Targeted extraction of strings from suspicious processes (e.g., shellcode patterns).
4.  **Open File Handles**: Identifying which files are being actively accessed or modified by the suspicious process.
5.  **Loaded Modules (DLLs/SOs)**: Capturing the list of shared libraries loaded into memory.

### 2.3 Cryptographic Binding

Every captured artifact is immediately:

- **Hashed (SHA-256)**.
- **Signed via [Cloud KMS HSM](../TIER-1-FOUNDATIONS/kms-schema-signer.md)**.
- **Appended to the [Merkle Proof Chain](../../appendices/2023-04-planning/forensic-security-superpowers.md)**.

---

## 3. Implementation Details: Preservation Logic

### Core Preservation Engine (`src/analysis/pre_execution_artifacts.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Safety: The "Evasion" Risk

Advanced malware may detect the "Artifact Capture" activity and attempt to wipe itself before the snapshot is complete. The module uses "Low-Noise" capture techniques and prioritizes the most volatile data first to minimize the window for adversarial evasion.

### 4.2 Compliance Mapping

- **NIST 800-86 (Guide to Integrating Forensic Techniques)**: Directly addresses the "Acquisition" and "Preservation" phases of the forensic lifecycle.
- **ISO 27037**: Fulfills requirements for "Identification, Collection, Acquisition and Preservation of Digital Evidence."

---

## 5. Operations & Performance Tuning

### Latency vs. Thoroughness

The "Thoroughness" of the snapshot can be tuned in the [Playbook Configuration](../TIER-DEEP-DIVES/tier3-configuration-file-format.md).

- **Light Snapshot**: < 2 seconds (Standard for most incidents).
- **Deep Forensic Snapshot**: 30-60 seconds (Used for suspected state-sponsored actors).

### Storage Management

Forensic artifacts are stored in a dedicated "Cold Storage" GCS bucket with **Object Lock** enabled, preventing any deletion or modification for the duration of the retention policy.

---

## 6. Future Growth & Opportunities

- **Differential Forensics**: Automatically comparing the "Pre-Remediation" and "Post-Remediation" states to verify that the threat was completely neutralized.
- **JIT Memory Imaging**: (Experimental) Integrating with hypervisor-level tools (e.g., Google Cloud "Confidential Computing" memory snapshots) for atomic, non-intrusive memory capture.
- **Auto-Forensic Analysis**: Using the [AI Optimization Pipeline](../TIER-DEEP-DIVES/tier4-ai-model-optimization.md) to automatically analyze the captured artifacts and provide a "Forensic BLUF" (Bottom Line Up Front) to the analyst.
