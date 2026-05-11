# Generator Guide: CACAO Workflow Sidecar

## Document Metadata

- **Audience**: SOAR Developers | Automation Engineers | Incident Commanders | Compliance Auditors
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [integration-data-capabilities.md](../../appendices/2023-04-planning/integration-data-superpowers.md)
- **Related Specs**: `2023-04-22cacao-sidecar-design.md`, `2023-04-23-include-workflow-acyclicity-validations-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/generate/cacao_sidecar_generator.py`

## Quick Summary

The CACAO Workflow Sidecar is the "Machine-Readable Standard" for SentinelMesh's response logic. While Jupyter and Marimo notebooks are optimized for human and agent interaction, the CACAO sidecar provides a standardized [OASIS CACAO v2.0](https://www.oasis-open.org/committees/cacao/) JSON bundle. This sidecar allows SentinelMesh playbooks to be exported and executed by enterprise **SOAR (Security Orchestration, Automation, and Response)** platforms (e.g., Palo Alto XSOAR, Splunk Phantom, Google Chronicle SOAR).

By including a CACAO sidecar with every incident response, SentinelMesh ensures 100% interoperability with the broader security ecosystem, enabling "Write Once, Run Anywhere" (WORA) automation.

---

## 1. Persona-Based Value Proposition

### For the SOAR Developer / Automation Engineer

- **Interoperability**: One-click import of SentinelMesh logic into your existing SOAR platform, eliminating the need to manually rebuild complex incident flows.
- **Standardized Schema**: CACAO provides a consistent, vendor-neutral format for defining steps, commands, and logic gates.

### For the Incident Commander

- **Seamless Hand-off**: Use SentinelMesh for the initial autonomous triage and forensics, then hand off the final [CACAO Workflow](#22-workflow-components) to the enterprise SOAR for long-term remediation and tracking.

### For the Compliance Auditor

- **Machine-Verifiable Logic**: Use automated tools to verify the [Acyclicity and Consistency](#23-acyclicity--validation) of the response logic, satisfying high-assurance regulatory requirements.

---

## 2. Architecture & Design: The CACAO Bundle

### 2.1 The Playbook Bundle

A CACAO sidecar is a JSON bundle containing:

- **Playbook Object**: Metadata (ID, Name, Description, Version).
- **Workflow Step Objects**: The individual actions, branches, and gates.
- **Command Objects**: The specific tool calls (e.g., `bash`, `python`, `http-api`).
- **Data Marking Objects**: [MNDA-gated access](../TIER-DEEP-DIVES/tier3-configuration-file-format.md) and sensitivity labels.

### 2.2 Workflow Components

SentinelMesh maps its internal logic to CACAO primitives:

- **Triage Steps** -> `action` steps with `read-only` commands.
- **Decision Gates** -> `if-condition` or `switch-condition` steps.
- **Remediation Steps** -> `action` steps with `state-mutating` commands.
- **HITL Gates** -> `user-input` steps.

### 2.3 Acyclicity & Validation

To ensure the exported workflow is logically sound, the generator performs a **Topological Sort** and **Cycle Detection** check. This prevents the export of any playbook that could cause an "Infinite Loop" in the target SOAR platform.

---

## 3. Implementation Details: Generator Logic

### Core Generator (`src/generate/cacao_sidecar_generator.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Data Marking & Redaction

The CACAO Sidecar supports strict [Data Marking](https://docs.oasis-open.org/cacao/security-playbooks/v2.0/csd01/security-playbooks-v2.0-csd01.html#_Toc103816172). Sensitive credentials or PII (Personally Identifiable Information) used during the investigation are automatically redacted or replaced with "Reference IDs" before export.

### 4.2 Compliance Mapping

- **NIST 800-209 (Security Guidelines for Storage Infrastructure)**: Supports "Interoperability" and "Auditability" of security management functions.
- **OASF (Open Asset Semantic Framework)**: Aligns with industry efforts to standardize asset and action metadata.

---

## 5. Operations & Performance Tuning

### Exporting to SOAR (CLI)

```bash
python -m src.generate.cacao_exporter \
  --input-playbook ./playbooks/T1566_incident.ipynb \
  --output-format cacao_v2_json \
  --target-vendor xsoar
```

### Validating the Export

Use the official [CACAO Validator](https://github.com/oasis-open/cacao-validator) to ensure the generated sidecar is 100% compliant with the OASIS specification.

---

## 6. Future Growth & Opportunities

- **Bidirectional Sync**: Allowing changes made in a SOAR platform's visual editor to be synced back to the original [SentinelMesh Marimo DAG](./marimo-notebook-guide.md).
- **CACAO-to-Agentic-Prompt**: Using the CACAO sidecar as a "Schema Skeleton" for the [AI Reasoning Engine](../TIER-DEEP-DIVES/tier4-ai-model-optimization.md), providing the agent with a pre-defined logical structure to follow.
- **Dynamic CACAO Generation**: Real-time generation of machine-readable playbooks _during_ an active investigation for immediate hand-off to secondary response teams.
