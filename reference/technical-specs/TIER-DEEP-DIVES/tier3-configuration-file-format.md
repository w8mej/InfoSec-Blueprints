# TIER 3 Deep-Dive: ASO Configuration File Format (.aso.yaml)

## Document Metadata

- **Audience**: Detection Engineers | DevOps Engineers | SOC Architects
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [tier4-playbook-templating-system.md](../TIER-DEEP-DIVES/tier4-playbook-templating-system.md)
- **Related Specs**: `2023-04-27-tier3-configuration-file-format.md`, `2023-04-23-implement-template-version-control-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/runtime/playbook_configuration.py`

## Quick Summary

The `.aso.yaml` file is the "Genetic SentinelMesh" for every SentinelMesh playbook. It defines the technical parameters, safety guardrails, and metadata required to transform a generic template into a specific, actionable response plan. By using a **Strictly Standardized Schema**, we ensure that all playbooks are machine-readable, version-controlled, and compatible with the [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) and the [Analytics Dashboards](../DASHBOARDS-UI/html-dashboards-overview.md).

Every directory in the [Enterprise ATT&CK Structure](../ORGANIZE-MODULES/enterprise-structure-generator.md) contains an `.aso.yaml` file that governs the behavior of the playbooks within that folder.

---

## 1. Persona-Based Value Proposition

### For the Detection Engineer

- **Declarative Response**: Define your response logic (tool calls, confidence thresholds, HITL gates) in a simple YAML format, without needing to write complex Python boilerplate.
- **Inheritance & Overrides**: Settings can be defined at the "Tactic" level and overridden at the "Technique" level, reducing redundancy across the playbook corpus.

### For the DevOps / SRE

- **Configuration as Code**: Manage your entire SOC's response policy in Git. Use PRs to review and audit changes to remediation logic.
- **Automated Validation**: The [Generator Testing Framework](./tier3-generator-testing-framework.md) automatically validates every `.aso.yaml` file against the master JSON schema before it is deployed.

### For the Compliance Officer

- **Traceability**: The configuration file maps every playbook to specific [MITRE ATT&CK Techniques](../DASHBOARDS-UI/attack-matrix-dashboard.md) and [Regulatory Controls](../DASHBOARDS-UI/compliance-matrix-dashboard.md).

---

## 2. Architecture & Design: The Schema Sections

### 2.1 Metadata Block

Defines the "Identity" and "Purpose" of the playbook.

- `id`: Unique ASO identifier.
- `type`: `TRIAGE`, `INVESTIGATE`, `REMEDIATE`, or `PURGE`.
- `mitre_id`: The primary MITRE ATT&CK Technique ID.
- `compliance_tags`: List of regulatory controls (e.g., `NIST_IR_4`, `PCI_10.1`).

### 2.2 Runtime Guardrails

Defines the "Safety Envelope" for the [Autonomous Loop](./tier4-autonomous-loop-executor.md).

- `min_autonomous_confidence`: The threshold below which the agent must ask for [HITL Approval](../../appendices/2023-04-planning/runtime-agentic-superpowers.md).
- `max_loop_iterations`: Prevents infinite reasoning loops.
- `dry_run_default`: Whether state-mutating tools should default to simulation mode.

### 2.3 Tool Context (Few-Shot Injection)

Defines the [Tool Examples](../../appendices/2023-04-planning/integration-data-superpowers.md) to be injected into the agent's prompt.

- `preferred_tools`: A prioritized list of plugins for this incident type.
- `example_calls`: Snippets of successful tool executions for the agent to follow.

---

## 3. Implementation Details: Schema Example

### Example `.aso.yaml`

```yaml
# ASO Configuration v2.0
schema_version: 2.1
playbook_id: ASO-T1566-001
type: REMEDIATE

target_domain:
  platform: GCP
  resource_type: IAM_USER

runtime_guards:
  min_autonomous_confidence: 0.95
  max_autonomous_actions: 3
  timeout_seconds: 600

orchestration:
  template_path: templates/gcp/iam_remediation.marimo.py
  default_hitl_gate: "Security Ops Lead"

mappings:
  mitre_attck: ["T1566.001"]
  veris: ["discovery.malware"]
  nist_800_53: ["AC-2", "IR-4"]
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Schema Enforcement

The configuration parser (`src/runtime/playbook_configuration.py`) performs strict type-checking and value-range validation. For example, it will reject any configuration where `min_autonomous_confidence` is less than 0.5, ensuring a baseline of agent certainty.

### 4.2 Compliance Mapping

- **NIST 800-53 (AC-6)**: Supports "Least Privilege" by allowing engineers to restrict which tools are available in a specific playbook configuration.
- **ISO 27001 (A.12.1.1)**: Fulfills requirements for "Documented Operating Procedures."

---

## 5. Operations & Performance Tuning

### Validating Configs (CLI)

```bash
python -m src.runtime.playbook_configuration \
  --validate-all \
  --schema-path conf/schema/aso_v2.json
```

### Inheritance Logic

Configurations are merged at runtime:

1.  **Global Defaults**: `conf/aso_global.yaml`
2.  **Tactic Defaults**: `playbooks/TA0001/.aso.yaml`
3.  **Technique Specifics**: `playbooks/TA0001/T1566/.aso.yaml` (Highest Priority)

---

## 6. Future Growth & Opportunities

- **Dynamic Configuration Tuning**: Allowing the [AI Optimization Pipeline](../TIER-DEEP-DIVES/tier4-ai-model-optimization.md) to suggest updates to the `min_autonomous_confidence` based on historical [Fidelity Data](../DASHBOARDS-UI/detection-fidelity-dashboard.md).
- **Interactive Config Editor**: A web-based UI for building and validating `.aso.yaml` files with live schema-checking and documentation tooltips.
- **Secret Interpolation**: Allowing `.aso.yaml` to securely reference [Secret Manager](../OPERATIONS/deployment-google-cloud.md) variables without including them in the YAML source.
