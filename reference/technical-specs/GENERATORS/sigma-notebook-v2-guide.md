# Generator Guide: Sigma Notebook V2 (Jupyter)

## Document Metadata

- **Audience**: Detection Engineers | SOC Analysts | Automation Engineers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [tier4-playbook-templating-system.md](../TIER-DEEP-DIVES/tier4-playbook-templating-system.md)
- **Related Specs**: `2023-04-27-tier2-jupyter-cell-ordering.md`, `2023-04-23-standardize-query-formats-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Template Path**: `templates/jupyter/sigma_v2_base.ipynb`

## Quick Summary

The Sigma Notebook V2 Generator is the workhorse of the SentinelMesh platform, responsible for producing high-fidelity **Jupyter Playbooks** optimized for both human and autonomous execution. These notebooks are generated from abstract [Sigma rules](https://sigmaid.io/) and [ASO configurations](../TIER-DEEP-DIVES/tier3-configuration-file-format.md), ensuring a consistent, [OODA-based](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) structure across the entire defensive corpus.

V2 represents a significant leap forward, introducing [Detached JWS Signatures](../../appendices/2023-04-planning/forensic-security-superpowers.md), [Visual UI capabilities](../../appendices/2023-04-planning/visual-ui-superpowers.md), and [Strict Cell Ordering](#22-strict-cell-ordering) to ensure the highest levels of forensic integrity and operational clarity.

---

## 1. Persona-Based Value Proposition

### For the SOC Analyst

- **Intuitive Navigation**: Every notebook follows the same hierarchy (Overview -> Investigation -> Remediation), reducing the "Time-to-Context" during an incident.
- **Visual Confidence**: Standardized [Iconography](../../appendices/2023-04-planning/visual-ui-superpowers.md) and [Sticky Banners](../../appendices/2023-04-planning/visual-ui-superpowers.md) ensure you never lose track of the current playbook state.

### For the Detection Engineer

- **Low-Effort Generation**: Focus on the detection logic in Sigma; the generator handles all the boilerplate Python code, UI styling, and metadata signing.
- **Portability**: Queries are automatically translated into the native syntax of your SIEM via the [Query Translation Engine](../TIER-1-FOUNDATIONS/query-translation-engine.md).

### For the Forensic Auditor

- **Immutable Trace**: Every cell in the notebook is [Checksummed and Signed](../../appendices/2023-04-planning/forensic-security-superpowers.md), providing a tamper-evident record of the investigation.

---

## 2. Architecture & Design: The V2 Structure

### 2.1 The Standardized Hierarchy

Every Sigma V2 notebook is divided into five mandatory sections:

1.  **Bottom Line Up Front (BLUF)**: A executive-level summary of the incident and recommended actions.
2.  **Architecture & Flow**: A [Mermaid.js diagram](../../appendices/2023-04-planning/visual-ui-superpowers.md) showing the logical flow of the response.
3.  **Phase 1: Triage & Investigation**: 🔍 Low-risk, read-only steps to verify the alert.
4.  **Phase 2: Containment & Remediation**: 🛡️ State-mutating steps with [HITL Gating](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md).
5.  **Phase 3: Verification & Recovery**: 🧪 Post-remediation checks to ensure the threat is neutralized.

### 2.2 Strict Cell Ordering

To prevent "Ad-hoc" (and potentially dangerous) execution patterns, V2 enforces a logical dependency order. Cells are tagged with metadata that indicates their "Prerequisites." The [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) will refuse to run a "Remediation" cell unless all "Investigation" prerequisites have successfully completed.

### 2.3 Integrated Visual Components

- **Interactive Tables**: Raw data is rendered as filterable HTML tables via [Minimalist UI capabilities](../../appendices/2023-04-planning/visual-ui-superpowers.md).
- **Status Banners**: Injected CSS ensures that the current phase (e.g., "REMEDIATING") stays fixed at the top of the analyst's screen.

---

## 3. Implementation Details: Generator Logic

### Core Generator (`src/generate/sigma_notebook_v2.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 "Zero-Vomit" Policy

The generator is prohibited from outputting raw, unformatted JSON blobs. All tool outputs must be processed by a [Formatter Plugin](../TIER-DEEP-DIVES/tier4-integration-plugin-system.md) to ensure clarity and reduce the risk of an analyst missing a critical indicator in a "Wall of Text."

### 4.2 Compliance Mapping

- **NIST 800-53 (IR-4)**: Directly supports "Incident Handling" by providing a standardized, structured response process.
- **ISO 27001 (A.16.1.1)**: Fulfills requirements for "Reporting Information Security Events" by providing a consistent reporting format.

---

## 5. Operations & Performance Tuning

### Generating Playbooks (CLI)

```bash
python -m src.generate.sigma_notebook_v2 \
  --rule-path rules/windows/process_creation.yaml \
  --config-path conf/playbooks/windows_remediation.aso.yaml \
  --output ./out/playbook.ipynb
```

### Performance

The generator can produce a complex 50-cell notebook (including signatures and translations) in < 2 seconds.

---

## 6. Future Growth & Opportunities

- **Jupyter-to-Marimo Migration**: Automated tools to "Upgrade" static Jupyter notebooks into [Reactive Marimo DAGs](../ANALYSIS-MODULES/marimo-analysis.md).
- **Real-time Collaboration**: (Future Integration) Allowing multiple analysts to work in the same generated notebook simultaneously with shared state.
- **Visual Diffing**: A specialized tool to show the "Diff" between two playbook executions, highlighting deviations in forensic artifacts.
