# SentinelMesh Master Documentation Map

## Overview

This document serves as the master index for the SentinelMesh Google MNDA documentation suite. It is organized by **Progressive Depth Layers** to help different audiences find the information they need efficiently.

---

## 🌐 SEE IT IN ACTION FIRST

**→ [Live Interactive Dashboards](https://neosis.securesql.info)**

Before diving into technical documentation, experience SentinelMesh through real dashboards showing SOC metrics, KPIs, compliance status, threat intelligence, and performance analytics.

**→ [Dashboards Guide](../guides/DASHBOARDS.md)** — Learn what each dashboard measures and how to interpret the metrics.

---

## Layer 0: Quick-Start

| Document                                    | Description                                     | Audience |
| ------------------------------------------- | ----------------------------------------------- | -------- |
| [00-START-HERE.md](./00-START-HERE.md)      | High-level overview and navigation guide.       | All      |
| [../DASHBOARDS.md](../guides/DASHBOARDS.md) | Interactive dashboard tour and metrics guide.   | All      |
| [../FAQ.md](../guides/FAQ.md)               | Comprehensive FAQ covering all major questions. | All      |

## Layer 1: System-Wide Architecture

| Document                                                 | Description                                      | Audience |
| -------------------------------------------------------- | ------------------------------------------------ | -------- |
| [01-MASTER-ARCHITECTURE.md](./01-MASTER-ARCHITECTURE.md) | Comprehensive system design and TIERed features. | All      |

## Layer 2: TIER Foundations (TIER 1)

| Document                                                                                    | Description                                                                   | Audience  |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------- |
| [interactive-attack-graphs.md](./TIER-1-FOUNDATIONS/interactive-attack-graphs.md)           | Plotly-based attack graph visualization.                                      | Engineers |
| [kms-schema-signer.md](./TIER-1-FOUNDATIONS/kms-schema-signer.md)                           | Hardware-backed cryptographic signing.                                        | Security  |
| [query-translation-engine.md](./TIER-1-FOUNDATIONS/query-translation-engine.md)             | Sigma-to-SIEM multi-platform parsing.                                         | Engineers |
| [signed-timestamp-merkle-proofs.md](./TIER-1-FOUNDATIONS/signed-timestamp-merkle-proofs.md) | Tamper-evident forensic audit chains distributed over torrent and blockchain. | Security  |
| [time-lock-puzzles.md](./TIER-1-FOUNDATIONS/time-lock-puzzles.md)                           | Proof-of-Work safety gates for containment.                                   | Security  |

## Layer 2: TIER Deep-Dives (TIER 2-4)

| Document                                                                                       | Description                              | Audience     |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------ |
| [tier2-cacao-workflow-validation.md](./TIER-DEEP-DIVES/tier2-cacao-workflow-validation.md)     | CACAO DAG integrity and reachability.    | Engineers    |
| [tier2-error-message-clarity.md](./TIER-DEEP-DIVES/tier2-error-message-clarity.md)             | Actionable exception handling standards. | Engineers    |
| [tier2-jupyter-cell-ordering.md](./TIER-DEEP-DIVES/tier2-jupyter-cell-ordering.md)             | Enforcing linear execution in notebooks. | Engineers    |
| [tier2-marimo-reactive-dag-updates.md](./TIER-DEEP-DIVES/tier2-marimo-reactive-dag-updates.md) | Reactive state management in Marimo.     | Engineers    |
| [tier3-configuration-file-format.md](./TIER-DEEP-DIVES/tier3-configuration-file-format.md)     | `.aso.yaml` schema and interpolation.    | SREs         |
| [tier3-documentation.md](./TIER-DEEP-DIVES/tier3-documentation.md)                             | Standards for TIERed feature guides.     | Engineers    |
| [tier3-generator-testing-framework.md](./TIER-DEEP-DIVES/tier3-generator-testing-framework.md) | Fixture-based output validation.         | Engineers    |
| [tier3-performance-profiling.md](./TIER-DEEP-DIVES/tier3-performance-profiling.md)             | Telemetry and efficiency benchmarking.   | SREs         |
| [tier4-ai-model-optimization.md](./TIER-DEEP-DIVES/tier4-ai-model-optimization.md)             | Fine-tuning and dataset building.        | Data Science |
| [tier4-autonomous-loop-executor.md](./TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md)       | End-to-end IR orchestration.             | SREs         |
| [tier4-integration-plugin-system.md](./TIER-DEEP-DIVES/tier4-integration-plugin-system.md)     | Extensible plugin architecture.          | Engineers    |
| [tier4-playbook-templating-system.md](./TIER-DEEP-DIVES/tier4-playbook-templating-system.md)   | Reusable incident SentinelMeshs.            | Engineers    |
| [tier4-realtime-alert-streaming.md](./TIER-DEEP-DIVES/tier4-realtime-alert-streaming.md)       | High-velocity alert ingestion.           | SREs         |

## Layer 2: Analysis Modules

| Document                                                                        | Description                       | Audience  |
| ------------------------------------------------------------------------------- | --------------------------------- | --------- |
| [blast-radius-calculator.md](./ANALYSIS-MODULES/blast-radius-calculator.md)     | Quantifying operational impact.   | SREs      |
| [custody-chain-analysis.md](./ANALYSIS-MODULES/custody-chain-analysis.md)       | Verifying forensic log integrity. | Security  |
| [false-positive-feedback.md](./ANALYSIS-MODULES/false-positive-feedback.md)     | Automated detection rule tuning.  | Engineers |
| [jwt-verification-analysis.md](./ANALYSIS-MODULES/jwt-verification-analysis.md) | Zero-trust token validation.      | Security  |
| [marimo-analysis.md](./ANALYSIS-MODULES/marimo-analysis.md)                     | Reactive DAG and state analysis.  | Engineers |
| [pre-execution-artifacts.md](./ANALYSIS-MODULES/pre-execution-artifacts.md)     | Preserving volatile evidence.     | Security  |

## Layer 2: Dashboards & UI

| Document                                                                           | Description                         | Audience   |
| ---------------------------------------------------------------------------------- | ----------------------------------- | ---------- |
| [html-dashboards-overview.md](./DASHBOARDS-UI/html-dashboards-overview.md)         | Overview of all 10+ dashboards.     | All        |
| [actor-cards-dashboard.md](./DASHBOARDS-UI/actor-cards-dashboard.md)               | Adversary intelligence profiles.    | Intel      |
| [attack-matrix-dashboard.md](./DASHBOARDS-UI/attack-matrix-dashboard.md)           | MITRE ATT&CK coverage heatmap.      | All        |
| [blast-radius-dashboard.md](./DASHBOARDS-UI/blast-radius-dashboard.md)             | Visualizing service dependencies.   | SREs       |
| [chain-of-custody-dashboard.md](./DASHBOARDS-UI/chain-of-custody-dashboard.md)     | Audit trail and signature status.   | Security   |
| [compliance-matrix-dashboard.md](./DASHBOARDS-UI/compliance-matrix-dashboard.md)   | Regulatory control mapping.         | Compliance |
| [cve-radar-dashboard.md](./DASHBOARDS-UI/cve-radar-dashboard.md)                   | Vulnerability response readiness.   | All        |
| [d3fend-capec-mapping.md](./DASHBOARDS-UI/d3fend-capec-mapping.md)                 | Defensive counter-measures.         | Engineers  |
| [detection-fidelity-dashboard.md](./DASHBOARDS-UI/detection-fidelity-dashboard.md) | Signal-to-noise and tuning PRs.     | Engineers  |
| [dark-mode-ui.md](./DASHBOARDS-UI/dark-mode-ui.md)                                 | Minimalist design system tokens.    | Designers  |
| [dashboard-architecture.md](./DASHBOARDS-UI/dashboard-architecture.md)             | Static-first data injection design. | Engineers  |

## Layer 2: Organization Modules

| Document                                                                                    | Description                     | Audience  |
| ------------------------------------------------------------------------------------------- | ------------------------------- | --------- |
| [cac-analytics.md](./ORGANIZE-MODULES/cac-analytics.md)                                     | MITRE CAR directory generator.  | Engineers |
| [enterprise-structure-generator.md](./ORGANIZE-MODULES/enterprise-structure-generator.md)   | Enterprise ATT&CK structure.    | Engineers |
| [mobile-ics-structure-generators.md](./ORGANIZE-MODULES/mobile-ics-structure-generators.md) | Mobile & ICS ATT&CK structures. | Engineers |

## Layer 2: Superpower Modules

| Document                                                                                            | Description                                 | Audience  |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------- | --------- |
| [forensic-security-superpowers.md](../appendices/2023-04-planning/forensic-security-superpowers.md) | JWS signing, Merkle proofs, and audit logs. | Security  |
| [visual-ui-superpowers.md](../appendices/2023-04-planning/visual-ui-superpowers.md)                 | Iconography, sticky status, and callouts.   | Analysts  |
| [runtime-agentic-superpowers.md](../appendices/2023-04-planning/runtime-agentic-superpowers.md)     | Dry-run, idempotency, and DAG branching.    | Engineers |
| [integration-data-capabilities.md](../appendices/2023-04-planning/integration-data-superpowers.md)  | STIX, CACAO, and field standardization.     | Engineers |

## Layer 3: Generator Guides

| Document                                                              | Description                   | Audience  |
| --------------------------------------------------------------------- | ----------------------------- | --------- |
| [sigma-notebook-guide.md](./GENERATORS/sigma-notebook-guide.md)       | Standard Jupyter V1 guide.    | All       |
| [sigma-notebook-v2-guide.md](./GENERATORS/sigma-notebook-v2-guide.md) | High-assurance V2 guide.      | Security  |
| [marimo-notebook-guide.md](./GENERATORS/marimo-notebook-guide.md)     | Reactive Python guide.        | Engineers |
| [cacao-sidecar-guide.md](./GENERATORS/cacao-sidecar-guide.md)         | Machine-readable CACAO guide. | SREs      |

## Layer 4: Operations & Maintenance

| Document                                                                    | Description                         | Audience |
| --------------------------------------------------------------------------- | ----------------------------------- | -------- |
| [deployment-google-cloud.md](./OPERATIONS/deployment-google-cloud.md)       | GCP reference architecture.         | SREs     |
| [monitoring-observability.md](./OPERATIONS/monitoring-observability.md)     | Health, metrics, and alerting.      | SREs     |
| [troubleshooting-runbook.md](./OPERATIONS/troubleshooting-runbook.md)       | Known issues and remediation.       | SREs     |
| [scaling-performance-tuning.md](./OPERATIONS/scaling-performance-tuning.md) | Horizontal scaling and bottlenecks. | SREs     |
| [security-hardening.md](./OPERATIONS/security-hardening.md)                 | Defense-in-depth and hardening.     | Security |

---

**Note**: All documentation is restricted to CONFIDENTIAL MNDA-signed personnel.
