# TIER 4 Deep-Dive: Integration Plugin System

## Document Metadata

- **Audience**: Backend Engineers | Plugin Developers | Security Engineers | Tooling Teams
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [integration-data-capabilities.md](../../appendices/2023-04-planning/integration-data-superpowers.md)
- **Related Specs**: `2023-04-27-tier4-integration-plugin-system.md`, `2023-04-23-explicit-allowed-callers-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/runtime/plugin_manager.py`, `src/runtime/plugin_interface.py`

## Quick Summary

The Integration Plugin System is the "Extensibility Framework" that allows SentinelMesh to interact with the real world. By decoupling the agent's reasoning from the underlying tool implementations, we enable a **Modular, Hot-Swappable Architecture** where new security tools (SIEMs, EDRs, Cloud APIs) can be added or updated without modifying the core runtime.

The system enforces strict [Idempotency](../../appendices/2023-04-planning/runtime-agentic-superpowers.md), [Identity Gating](../../appendices/2023-04-planning/forensic-security-superpowers.md), and [Schema Validation](../../appendices/2023-04-planning/integration-data-superpowers.md), ensuring that every tool call is safe, predictable, and fully auditable.

---

## 1. Persona-Based Value Proposition

### For the Backend Engineer

- **Standardized Interface**: All plugins follow a unified Python base class (`PluginInterface`), which handles common tasks like logging, signing, and secret management.
- **Fast Development**: Create a new plugin in minutes by defining a JSON schema and implementing a single `execute()` method.

### For the Security Engineer

- **Granular Permissions**: The [Explicit Allowed Callers](#23-explicit-allowed-callers) system ensures that only specific playbooks can call high-risk tools (e.g., "Account Delete").
- **Audit Isolation**: Each plugin execution is recorded as a separate, signed artifact, making it easy to isolate failures or security breaches.

### For the SOC Lead

- **Vendor Neutrality**: Easily switch between SIEM/EDR vendors by simply swapping out the plugin while keeping the same [Autonomous Playbooks](./tier4-autonomous-loop-executor.md).

---

## 2. Architecture & Design: The Plugin Lifecycle

### 2.1 The Plugin Manager (`src/runtime/plugin_manager.py`)

The Plugin Manager is responsible for:

- **Discovery**: Scanning the `plugins/` directory for valid `.aso.json` manifests.
- **Initialization**: Loading Python modules and verifying their [Detached JWS](../../appendices/2023-04-planning/forensic-security-superpowers.md) signatures.
- **Dispatch**: Routing tool calls from the agent to the appropriate plugin instance.
- **Lifecycle Management**: Handling plugin timeouts, retries, and clean shutdowns.

### 2.2 Strict Schema Validation

- **Goal**: Prevent "Malformed Tool Calls" from breaking production systems.
- **Design Rationale**: SentinelMesh uses JSON Schema to define the input and output requirements for every tool. The Plugin Manager validates the agent's proposed call _before_ it ever reaches the plugin code.
- **Implementation**:
  - Every plugin includes a `schema.json`.
  - Enforced via `src/runtime/strict_json_validation.py`.

### 2.3 Explicit Allowed Callers (Security Gate)

- **Goal**: Prevent "Privilege Escalation" via tool calling.
- **Design Rationale**: Just because a tool is _available_ doesn't mean it should be _accessible_ to every agent. This feature maps specific tool names to allowed Playbook Types.
- **Implementation**:
  - Defined in `conf/access_control.yaml`.
  - **Example**: Only playbooks of type `REMEDIATION_ADMIN` can call the `aws_iam_delete_user` tool.

---

## 3. Implementation Details: Developing a Plugin

### Core Plugin Interface (`src/runtime/plugin_interface.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Secret Management

Plugins never store credentials. They receive temporary, least-privilege tokens from the [Secret Manager](../OPERATIONS/deployment-google-cloud.md) at runtime, ensuring that no API keys are ever leaked in logs or code.

### 4.2 Compliance Mapping

- **SOC2 (Change Management)**: The requirement for all plugins to be signed and versioned ensures that only authorized tool logic is ever deployed.
- **NIST 800-53 (AC-3)**: Implements "Access Enforcement" by gating tool usage via the Allowed Callers policy.

---

## 5. Operations & Implementation

### Deploying a New Plugin

1. Create `plugins/my_tool/`.
2. Implement `main.py` (inheriting from `ASOPlugin`).
3. Define `manifest.json` (metadata, author, version).
4. Run `src/scripts/sign_plugin.py` to generate the mandatory [KMS Signature](../TIER-1-FOUNDATIONS/kms-schema-signer.md).

### Monitoring Plugin Health

Use the [Dashboard Portfolio](../DASHBOARDS-UI/html-dashboards-overview.md) to track:

- **Plugin Success Rate**: Which tools are failing most often?
- **Call Latency**: Is a specific vendor API slowing down the autonomous loop?

---

## 6. Future Growth & Opportunities

- **WebAssembly (WASM) Plugins**: (Experimental) Running plugin code in a high-security WASM sandbox for near-perfect isolation from the host system.
- **Dynamic Tool Discovery**: Allowing the agent to "Search" for new capabilities in a global Plugin Registry and automatically request access.
- **Plugin Sidecars**: Deploying complex plugins as separate microservices to allow for independent scaling and resource management.
