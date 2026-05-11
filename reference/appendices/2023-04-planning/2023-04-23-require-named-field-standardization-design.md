# Specification: Require Named Field Standardization

## Overview

Every playbook explicitly declares its required input fields using standardized names (e.g., `src_ip`, `dest_ip`, `user_principal_name`) that are agnostic to any single SIEM product. The orchestrator maps SIEM-specific field names (Splunk `src`, CrowdStrike `LocalAddressIP4`, Microsoft Sentinel `SourceIP`) to these standard names before injecting them into the playbook as variables. Validation at playbook startup ensures all required fields are populated, with clear error messages guiding SIEM operators on how to configure their alert-to-playbook field mappings.

---

## 1. Standard Field Schema

### Core Fields (Always Supported)

| Standard Name         | Data Type    | SIEM Examples                                                              | Required | Description                    |
| --------------------- | ------------ | -------------------------------------------------------------------------- | -------- | ------------------------------ |
| `src_ip`              | IPv4         | Splunk: `src`, CrowdStrike: `LocalAddressIP4`, Sentinel: `SourceIP`        | YES      | Source IP address              |
| `dest_ip`             | IPv4         | Splunk: `dest`, CrowdStrike: `RemoteAddressIP4`, Sentinel: `DestinationIP` | YES      | Destination IP address         |
| `user_principal_name` | String       | Splunk: `user`, Sentinel: `UserPrincipalName`, CrowdStrike: `UserName`     | YES      | User principal name / username |
| `hostname`            | String       | Splunk: `host`, Sentinel: `Computer`, CrowdStrike: `ComputerName`          | YES      | Hostname / device name         |
| `timestamp`           | ISO 8601 UTC | Splunk: `_time`, Sentinel: `TimeGenerated`                                 | YES      | Event timestamp                |
| `process_guid`        | GUID/String  | Splunk: `process_id`, Sentinel: `ProcessId`                                | FALSE    | Process GUID or PID            |
| `sha256_hash`         | Hex String   | Splunk: `file_hash`, Sentinel: `FileHash`                                  | FALSE    | SHA-256 file hash              |
| `domain`              | String       | Splunk: `domain`, Sentinel: `DNSName`                                      | FALSE    | Domain name                    |

### Field Validation

```json
{
  "src_ip": {
    "data_type": "ipv4",
    "regex": "^(\\d{1,3}\\.){3}\\d{1,3}$",
    "example": "192.168.1.45"
  },
  "user_principal_name": {
    "data_type": "string",
    "regex": "^[a-zA-Z0-9._-@]*$",
    "example": "admin@corp.local"
  },
  "timestamp": {
    "data_type": "iso8601",
    "regex": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$",
    "example": "2023-04-25T14:30:00Z"
  }
}
```

---

## 2. Playbook Metadata Schema

### Declared Required Fields

Every playbook includes a `required_fields` array in its metadata:

```json
{
  "playbook_metadata": {
    "title": "Isolate WMI-Executing Host",
    "required_fields": [
      "src_ip",
      "dest_ip",
      "user_principal_name",
      "hostname",
      "timestamp"
    ],
    "optional_fields": ["sha256_hash", "domain"]
  }
}
```

### SIEM Alias Mapping

Playbooks provide a reference mapping to help operators configure their SIEM connectors:

```json
{
  "siem_field_mapping": {
    "splunk": {
      "src_ip": "src",
      "dest_ip": "dest",
      "user_principal_name": "user",
      "hostname": "host",
      "timestamp": "_time"
    },
    "crowdstrike": {
      "src_ip": "LocalAddressIP4",
      "dest_ip": "RemoteAddressIP4",
      "user_principal_name": "UserName",
      "hostname": "ComputerName",
      "timestamp": "EventTime"
    },
    "sentinel": {
      "src_ip": "SourceIP",
      "dest_ip": "DestinationIP",
      "user_principal_name": "UserPrincipalName",
      "hostname": "Computer",
      "timestamp": "TimeGenerated"
    }
  }
}
```

---

## 3. Validation & Error Handling

### Field Validation Cell (Cell 0 or 1)

```python
REDACTED
```

### Error Messages

```
❌ FIELD VALIDATION FAILED

Missing fields: ['user_principal_name', 'hostname']

Required fields that are missing:
- user_principal_name (String): User principal name / username
- hostname (String): Hostname / device name

Your SIEM alert contains:
- src: 192.168.1.45 ✓
- dest: 10.0.0.1 ✓
- timestamp: 2023-04-25T14:30:00Z ✓

Configure your orchestrator to map:
  Splunk "user" → standard "user_principal_name"
  Splunk "host" → standard "hostname"
```

---

## 4. Variable Injection

### Before Playbook Execution

```python
REDACTED
```

---

## 5. Integration Points

### SigmaNotebookV2

**Validation cell (first executable cell):**

```python
REDACTED
```

**Notebook metadata:**

```json
{
  "metadata": {
    "playbook": {
      "required_fields": [...],
      "optional_fields": [...],
      "siem_field_mapping": {...}
    }
  }
}
```

### SigmaNotebook (V1)

**Bootstrap cell includes validation code**

### MarimoNotebook

**Params cell includes validation**

### CacaoSidecar

**`named_fields_schema` field:**

```json
{
  "named_fields_schema": {
    "required_fields": ["src_ip", "dest_ip", ...],
    "field_definitions": {
      "src_ip": {
        "type": "ipv4",
        "description": "Source IP address",
        "aliases": ["src", "SourceIP", "LocalAddressIP4"]
      }
    }
  }
}
```

---

## 6. Orchestrator Implementation Guide

### Connector Configuration (Example: Splunk → Playbook)

```python
REDACTED
```

### Multi-SIEM Support

```python
REDACTED
```

---

## 7. Error Recovery

### Missing Field Handling

1. **Immediate validation failure** - Playbook stops with clear error
2. **Error includes** - Which fields are missing, SIEM field name examples
3. **Operator action** - Reconfigure SIEM → playbook mapping, retry
4. **Audit trail** - Failed field validation logged

### Partial Match Handling

```
SIEM has: src_ip, dest_ip, hostname
Playbook requires: src_ip, dest_ip, hostname, user_principal_name, timestamp

Result: FAIL with error showing missing user_principal_name, timestamp
```

---

## 8. Benefits

### Data Quality

- Guaranteed all required fields present and non-null
- Type validation prevents invalid data
- Reduces "Entity Not Found" runtime errors

### Portability

- Playbooks work with any SIEM that maps fields correctly
- Single playbook, multiple SIEM sources
- No playbook customization per SIEM

### Operability

- Clear error messages guide SIEM operators
- Mapping reference for configuration
- Audit trail of field mappings

---

## 9. Testing Reference

Create `tests/test_named_field_registry.py` with 22+ tests:

**Core Tests (12)**

- Field resolution (Splunk, CrowdStrike, Sentinel)
- Validation with required fields
- Validation with missing fields
- Regex pattern enforcement
- Case-insensitive alias matching

**Integration Tests (6)**

- Playbook metadata includes fields
- Validation cell generated correctly
- Error messages include SIEM mapping examples
- Notebook execution fails on missing fields
- CACAO sidecar includes schema

**Orchestrator Tests (4)**

- SIEM payload transformation
- Multi-SIEM support
- Field mapping correctness
- Partial match error handling

---

## 10. Examples

### Splunk Alert → Playbook Execution

```
Splunk Alert:
{
  "src": "192.168.1.45",
  "dest": "10.0.0.1",
  "user": "admin",
  "host": "WORKSTATION-01",
  "_time": "2023-04-25T14:30:00Z"
}

↓ (Orchestrator mapping)

Playbook Variables:
{
  "src_ip": "192.168.1.45",
  "dest_ip": "10.0.0.1",
  "user_principal_name": "admin",
  "hostname": "WORKSTATION-01",
  "timestamp": "2023-04-25T14:30:00Z"
}

↓ (Playbook validation)

✅ All required fields validated and available
```
