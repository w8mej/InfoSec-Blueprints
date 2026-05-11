# TIER 4.1: Playbook Templating System

**Goal**: Enable analysts to create parameterized playbook templates with dynamic substitution and reusability across incident types.

**Files**:

- `src/runtime/playbook_template_engine.py` (NEW)
- `src/runtime/template_variable_resolver.py` (NEW)
- `tests/test_playbook_template_engine.py` (NEW)
- `templates/` directory with 10+ pre-built templates

## Core Features

### Template Variables

```yaml
# Template with variables
templates:
  ransomware_containment:
    parameters:
      - name: "affected_systems"
        type: "list"
        description: "Hostnames or IPs of affected endpoints"
        required: true

      - name: "isolation_method"
        type: "enum"
        values: ["network_isolation", "process_kill", "system_shutdown"]
        default: "network_isolation"
        required: true

      - name: "recovery_window_hours"
        type: "integer"
        description: "Max hours to restore systems"
        min: 1
        max: 72
        default: 24

      - name: "notify_stakeholders"
        type: "boolean"
        default: true

      - name: "rollback_snapshot_id"
        type: "string"
        description: "VMware snapshot ID for rollback"
        pattern: "^snap-[a-z0-9]{16}$"
        required: false

    substitutions:
      - variable: "{{affected_systems}}"
        inject_point: "Cell 2"
        description: "Preconditions validation"

      - variable: "{{isolation_method}}"
        inject_point: "Cell 5"
        description: "Containment action selection"

      - variable: "{{recovery_window_hours}}"
        inject_point: "Cell 3"
        description: "Incident timeline planning"

      - variable: "{{rollback_snapshot_id}}"
        inject_point: "Cell 6"
        description: "Recovery step preparation"

    outputs:
      - name: "isolation_status"
        type: "json"
        schema:
          success: boolean
          isolated_count: integer
          failed_systems: array

      - name: "recovery_plan"
        type: "markdown"
        description: "Detailed recovery instructions"
```

## Implementation

```python
REDACTED
```

**Test Specifications**:

- Load template from YAML
- Validate required parameters
- Validate enum values
- Validate integer ranges
- Validate string patterns
- Validate parameter types
- Render template with substitutions
- Handle missing optional parameters
- Return errors for invalid inputs
- Support 10+ built-in templates
- Template reuse across incidents

**Pre-Built Templates**:

- ransomware_containment.yaml
- ddos_mitigation.yaml
- credential_compromise.yaml
- data_exfiltration_response.yaml
- malware_eradication.yaml
- privilege_escalation_remediation.yaml
- insider_threat_investigation.yaml
- supply_chain_incident.yaml
- zero_day_exploitation.yaml
- ransomware_recovery.yaml

**Success**: 20+ template tests pass, 10+ pre-built templates available, parameter validation comprehensive.
