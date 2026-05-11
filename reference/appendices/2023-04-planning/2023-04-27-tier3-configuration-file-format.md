# TIER 3.4: Configuration File Format Standardization (.aso.yaml)

**Goal**: Define and validate SentinelMesh playbook configuration files with schema enforcement and backwards compatibility.

**Files**:

- `src/runtime/aso_config_loader.py` (NEW)
- `tests/test_aso_config_loader.py` (NEW)
- Example configs in `docs/examples/playbooks/` (NEW)

## Configuration Schema

```yaml
version: "1.0"
metadata:
  title: "Incident Response Playbook"
  description: "Containment and recovery procedures"
  author: "SOC Team"
  created: 2023-04-27
  last_modified: 2023-04-27
  tags: ["containment", "ransomware"]

incident_action_plan:
  title: "Ransomware Containment"
  description: "Stop lateral movement and isolate affected systems"
  techniques: ["T1486", "T1570"]
  sigma_file: "sigma/detection/ransomware_activity.yml"
  playbook_type: "remediation"

capabilities:
  strict_json_validation:
    enabled: true
    fail_on_parse_error: true

  cell_checksums:
    enabled: true
    checksum_algorithm: "sha256"

  mermaid_dag_visualization:
    enabled: true
    output_format: "svg"

  regulatory_timestamps:
    enabled: true
    timezone: "UTC"
    regulatory_deadlines:
      - name: "GDPR 72-hour breach notification"
        hours_from_detection: 72
      - name: "SEC Form 8-K filing"
        hours_from_detection: 96

  query_standardization:
    enabled: true
    target_platforms: ["splunk", "elastic"]
    enforce_standard_fields: true

  kms_signing:
    enabled: false
    provider: "aws"
    key_id: "${AWS_KMS_KEY_ID}"
    region: "us-east-1"

  time_lock_puzzles:
    enabled: false
    difficulty: "medium"
    target_solve_time_seconds: 15

  interactive_graphs:
    enabled: true
    include_risk_scores: true
    export_formats: ["plotly", "graphviz"]

  signed_timestamps:
    enabled: true
    chain_mode: "hash-chained"
    include_audit_report: true

generator:
  type: "SigmaNotebookV2"
  output_format: "ipynb"
  kernel: "python3"
  timeout_seconds: 300

  cell_options:
    include_raw_output: false
    include_error_cells: true
    minimalist_html: true
    dark_mode: true

execution_environment:
  python_version: "3.11"
  required_packages:
    - name: "pandas"
      version: ">=2.0"
    - name: "pyyaml"
      version: ">=6.0"

  env_vars:
    - SIEM_API_KEY
    - AWS_KMS_KEY_ID

validation:
  min_coverage: 0.80
  require_rollback_procedures: true
  require_manual_approval_steps: true
  max_execution_time_seconds: 600

scheduling:
  run_frequency: "daily"
  run_time_utc: "02:00"
  timeout_minutes: 10
  retry_on_failure: true
  max_retries: 3
```

## Implementation

```python
REDACTED
```

**Test Specifications**:

- Load valid YAML config file
- Validate required keys present
- Reject unsupported version
- Reject unsupported generator type
- Reject unsupported playbook type
- Reject unknown capabilities
- Convert to/from dict and YAML
- Environment variable substitution
- Default values for optional fields
- Merge with defaults for backwards compatibility
- Validate superpower-specific constraints
- Circular reference detection in scheduling

**Success**: Config loader handles 20+ test scenarios, supports env var interpolation, validates schema.
