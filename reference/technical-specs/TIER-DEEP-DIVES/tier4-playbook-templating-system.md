# TIER 4 Deep-Dive: Playbook Templating & Generation

## Document Metadata

- **Audience**: Detection Engineers | SOC Architects | Automation Engineers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [sigma-notebook-v2-guide.md](../GENERATORS/sigma-notebook-v2-guide.md)
- **Related Specs**: `2023-04-27-tier4-playbook-templating-system.md`, `2023-04-23-implement-template-version-control-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/generate/playbook_generator.py`, `src/runtime/playbook_configuration.py`

## Quick Summary

The Playbook Templating & Generation system is the "Manufacturing Line" of SentinelMesh. It is responsible for transforming abstract incident metadata and TIERed specifications into high-fidelity, actionable notebooks (Jupyter/Marimo). By using a **Constraint-Based Generation** approach, we ensure that every playbook—whether it is a simple triage script or a complex, multi-cloud remediation loop—is structurally consistent, cryptographically signed, and adheres to all [Visual UI](../../appendices/2023-04-planning/visual-ui-superpowers.md) standards.

This system eliminates the "Blank Page" problem for SOC analysts, providing them with a 90% complete response plan the moment an alert is detected.

---

## 1. Persona-Based Value Proposition

### For the Detection Engineer

- **Standardized Output**: No more writing playbooks from scratch. Define the logic once in a [YAML Template](../TIER-DEEP-DIVES/tier3-configuration-file-format.md), and the generator handles the notebook layout, iconography, and signature injection.
- **Version Control Integration**: Templates are stored in Git, allowing for full PR-based review of response logic changes.

### For the SOC Analyst / Responder

- **Immediate Context**: The generator automatically injects the active [Incident Metadata](../TIER-DEEP-DIVES/tier3-configuration-file-format.md) (affected assets, attacker IPs) into the code cells, so you can start investigating immediately without manual variable entry.
- **Logical Flow**: Enforces a consistent [OODA-based](./tier4-autonomous-loop-executor.md) structure across all 1,000+ playbook types.

### For the Compliance Auditor

- **Template Integrity**: Every generated playbook includes a [Cell Checksum](../../appendices/2023-04-planning/forensic-security-superpowers.md) that proves it was built from an authorized, version-controlled template.

---

## 2. Architecture & Design: The Generation Engine

### 2.1 The Playbook Generator (`src/generate/playbook_generator.py`)

The generator follows a multi-stage assembly process:

1.  **Schema Ingestion**: Load the incident alert and the corresponding [ASO Configuration](../TIER-DEEP-DIVES/tier3-configuration-file-format.md).
2.  **Context Injection**: Interpolate real-world data (e.g., `{{ target_hostname }}`) into the template cells.
3.  **UI Enhancement**: Inject [Iconography](../../appendices/2023-04-planning/visual-ui-superpowers.md) and [Sticky Banners](../../appendices/2023-04-planning/visual-ui-superpowers.md).
4.  **Security Wrapping**: Calculate [Cell Checksums](../../appendices/2023-04-planning/forensic-security-superpowers.md) and fetch [KMS Signatures](../TIER-1-FOUNDATIONS/kms-schema-signer.md).
5.  **Output Export**: Render to `.ipynb` (Jupyter) or `.py` (Marimo).

### 2.2 Template Version Control (TVC)

- **Goal**: Prevent "Logic Drift" and unauthorized changes to remediation logic.
- **Implementation**:
  - Every template includes a `vMajor.Minor.Patch` version.
  - The generator embeds the `template_version` and the `git_commit_hash` of the source template into the notebook metadata.
  - **Verification**: The [Autonomous Loop Executor](./tier4-autonomous-loop-executor.md) verifies that it is running the latest authorized version of the template.

### 2.3 Constraint-Based Logic

- **Goal**: Enforce TIER-specific requirements during generation.
- **Example**: If a playbook is tagged as `TIER 3`, the generator _must_ include [Performance Profiling](../../appendices/2023-04-planning/runtime-agentic-superpowers.md) cells; otherwise, it will fail the build.

---

## 3. Implementation Details: Template Syntax

### Playbook SentinelMesh (`.aso.yaml`)

```yaml
metadata:
  type: REMEDIATION
  target_platform: GCP
  mitre_id: T1566.001

cells:
  - type: markdown
    content: "## Step 1: Verify Initial Access via {{ source_ip }}"
    icon: investigate

  - type: code
    content: |
      from aso_plugins import gcp_iam
      await gcp_iam.check_permissions("{{ target_user }}")
    gate: AUTONOMOUS
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Template Tamper Detection

By signing the **Template Manifest** itself, we ensure that an attacker cannot modify the "Source Code" of the playbooks. Any unauthorized change to the YAML SentinelMeshs will be detected by the generator's CI/CD pipeline.

### 4.2 Compliance Mapping

- **NIST 800-53 (IR-8)**: Supports "Incident Response Assistance" by providing automated, high-fidelity response templates.
- **ISO 27001 (A.12.1.1)**: Fulfills requirements for "Documented Operating Procedures" by standardizing playbook output.

---

## 5. Operations & Implementation

### Updating a Template

1. Modify the YAML SentinelMesh in `conf/templates/`.
2. Bump the `version` field.
3. Run `make validate-templates` to ensure schema compliance.
4. Commit to Git. The next incident of this type will automatically use the updated version.

### Monitoring Generation Health

Track the `generation_success_rate` in the [Analytics Dashboard](../DASHBOARDS-UI/detection-fidelity-dashboard.md). Failures are usually caused by malformed YAML or missing metadata in the incoming alert.

---

## 6. Future Growth & Opportunities

- **AI-Generated SentinelMeshs**: (Experimental) Allowing the [AI Model Optimizer](./tier4-ai-model-optimization.md) to propose _new_ playbook templates based on novel attack patterns discovered during manual investigations.
- **Interactive Template Builder**: A visual, "Low-Code" editor for building ASO templates with drag-and-drop support for [Integration Plugins](./tier4-integration-plugin-system.md).
- **Multi-Output Targeting**: Extending the generator to export to other formats like Mermaid charts, PDF executive summaries, or specialized EDR remediation scripts.
