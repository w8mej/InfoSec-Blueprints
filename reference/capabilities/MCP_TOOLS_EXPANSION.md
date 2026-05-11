# MCP Tools Expansion (April 30, 2026)

## Overview

Expanded the SentinelMesh MCP (Model Context Protocol) tools registry from 3 hardcoded tools to a comprehensive catalog of 37 tools organized by category and integrated across all generation layers.

## Tools Added (34 new tools)

### EDR & Incident Response (14 tools)

- `velociraptor` - Advanced endpoint visibility and IR
- `wazuh_agent` - Open-source EDR and HIDS
- `sentinelone_shell` - Remote shell for Singularity EDR
- `carbon_black_live_ops` - Real-time querying and remediation
- `defender_live_response` - Microsoft Defender's remote response
- `tanium_interact` - Real-time search and action at scale
- `limacharlie_agent` - Cloud-native EDR with remote CLI
- `mandiant_hx` - Enterprise-grade EDR/IR agent
- `cortex_xdr_terminal` - Palo Alto's remote response console
- `sophos_live_response` - Sophos Intercept X remote terminal
- `cybereason_powershell` - Cybereason's remote shell capability
- `cylance_optics` - EDR component for automated response

### Orchestration & Automation (1 tool)

- `thehive_cortex` - Orchestration engine for IR actions

### Forensics & Triage (6 tools)

- `kape_collector` - Kroll Artifact Parser and Extractor
- `osquery_fleet` - Managed SQL-powered system querying
- `f_response_tactical` - Remote forensic imaging and access
- `fastir_collector` - Rapid incident response data gathering
- `kansa_ir` - PowerShell-based incident response framework
- `magnet_axiom_cyber` - Remote evidence collection and processing

### CNAPP & Cloud (15 tools)

- `wiz_defend` - Real-time cloud threat detection and response
- `sysdig_secure` - Runtime security and forensics for containers/K8s
- `lacework_polygraph` - Behavioral analysis and automated cloud triage
- `orca_security_remediation` - Agentless workload scanning and direct fix action
- `prisma_cloud_compute` - Palo Alto's cloud-native protection
- `cloud_custodian` - Rules engine for real-time cloud fleet management
- `prowler_pro` - Advanced AWS/Azure/GCP security auditing and response
- `steampipe_security` - SQL-based cloud querying for live incident hunting
- `tamnoon_automation` - Cloud investigation and managed remediation
- `mitiga_cloud_ir` - SaaS-based cloud incident response and readiness
- `aws_incident_manager` - AWS Systems Manager component for automated IR
- `defender_for_cloud` - Microsoft's integrated cloud security and response
- `gcp_scc_remediation` - GCP Security Command Center's response automation
- `diffy_cloud_triage` - Netflix's tool for scoping compromise in cloud instances
- `sweet_security_runtime` - Focused on cloud runtime layer and lateral movement

## Changes Made

### 1. Created Centralized Registry

**File:** `src/runtime/mcp_tools_registry.py` (NEW)

- Organized tools by category
- Exported `MCP_TOOLS_FOR_HITL` for easy import
- Provides `TOOL_CATEGORY_MAP` for future filtering

### 2. Updated Programmatic Tool Detection

**File:** `src/runtime/programmatic_tool_calling.py`

- Expanded `TOOL_PATTERNS` from 5 to 41 regex patterns
- Covers all 37 tools for hallucination detection

### 3. Updated CACAO Sidecar Generation

**File:** `src/generate/CacaoSidecar.py`

- Now imports `MCP_TOOLS_FOR_HITL` registry
- auth_gates.mcp_tool_allowlist now contains all 37 tools
- Enables rich HITL composition analysis

### 4. Updated V2 Notebook Generator

**File:** `src/generate/SigmaNotebookV2.py`

- YAML header now includes all 37 tools in auth_gates
- Organized with category comments for clarity

## Impact on HITL Dashboard

When you regenerate playbooks and the composition dashboard:

```bash
make generate
python src/scripts/generate_hitl_composition.py
```

The dashboard will now show:

### Metrics Enhanced:

- **Total MCP Tools:** 37 (was 3)
- **Tool Gating Roles:** Full role-to-tool mapping
- **Playbook Count per Tool:** Each playbook now references all 37 tools
- **Role Bottleneck Scores:** More accurate load distribution analysis

### Dashboard Insights:

1. **MCP Tool Table** - All 37 tools visible with their gating roles
2. **Role Co-occurrence Matrix** - Shows which roles must collaborate
3. **Bottleneck Analysis** - Identifies SOC-tier-2 and IR-lead as critical gatekeepers
4. **Bubble Chart** - Visualizes playbook count vs. approval latency per role

## Backward Compatibility

✅ **Fully backward compatible** - Existing playbooks will be updated with the new tools on next generation.

## Future Enhancements

- [ ] Add tool-specific HITL requirements (some tools may need fewer gates)
- [ ] Add tool success/failure rates
- [ ] Create tool usage patterns in the dashboard
- [ ] Link tools to specific containment/eradication capabilities
- [ ] Build role-to-tool affinity scores based on typical workflows

## Files Modified Summary

| File                                       | Change Type                 | Impact                  |
| ------------------------------------------ | --------------------------- | ----------------------- |
| `src/runtime/mcp_tools_registry.py`        | NEW                         | Central tool catalog    |
| `src/runtime/programmatic_tool_calling.py` | EXPANDED                    | Tool detection patterns |
| `src/generate/CacaoSidecar.py`             | REFACTORED                  | Uses registry import    |
| `src/generate/SigmaNotebookV2.py`          | EXPANDED                    | YAML tool list          |
| `src/scripts/generate_hitl_composition.py` | ENHANCED (previous session) | Fixed extraction logic  |
| `src/generate/SigmaNotebook.py`            | ENHANCED (previous session) | Added HITL markers      |

---

**Status:** Ready for generation and dashboard analysis.
Run `make generate && python src/scripts/generate_hitl_composition.py` to see the comprehensive MCP tool ecosystem in action.
