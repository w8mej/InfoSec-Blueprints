# Specification: Inject Tool Use Examples

## Overview

LLMs frequently hallucinate or misformat parameters when using complex tools. Without concrete examples, an agent might provide `ip_address: "192.168.1.abc"` (syntactically invalid), `timestamp: "Oct 25 2023"` (missing timezone), or `user_principal_name: "alice"` (missing domain). The JSON Schema `examples` field is explicitly designed for this use case—it teaches the LLM proper formatting without inflating the global system prompt. This specification defines how to inject SOC-realistic, domain-specific examples into all tool definitions, validate their correctness, and ensure the execution framework passes them to the LLM backend.

**Key Innovation:** Localized, parameter-level examples (inside tool schema) reduce format errors without requiring larger system prompts or repeated instruction text.

---

## 1. Problem Statement

### Current Situation: No Parameter Examples

**Tool Definition (current):**

```json
{
  "name": "query_siem",
  "description": "Query SIEM for events",
  "input_schema": {
    "type": "object",
    "properties": {
      "hostname": {
        "type": "string",
        "description": "Target hostname to search"
      },
      "timestamp": {
        "type": "string",
        "description": "Event timestamp"
      },
      "ip_address": {
        "type": "string",
        "description": "IP address to query"
      }
    }
  }
}
```

**Agent call (typical error):**

```
User: "Find events on prod-db-01"
Agent: "I'll query SIEM with hostname='prod-db-01', timestamp='October 25 2023', ip_address='192.168.1.500'"
Error: Invalid timestamp format. Valid formats: 'YYYY-MM-DDTHH:MM:SSZ'
Error: Invalid IP '192.168.1.500' (octet > 255)
```

**Root Causes:**

1. No concrete examples in schema → agent guesses format
2. Format rules in `description` field → easy to miss or misinterpret
3. System prompt may mention formats, but LLM forgets them for complex tools
4. Similar-sounding formats (multiple timestamp standards) confuse LLM

### Proposed Solution: Inject Parameter Examples

**Tool Definition (enhanced):**

```json
{
  "name": "query_siem",
  "description": "Query SIEM for events",
  "input_schema": {
    "type": "object",
    "properties": {
      "hostname": {
        "type": "string",
        "description": "Target hostname to search",
        "examples": ["prod-db-01.internal", "DESKTOP-ABC123", "srv-app-prod-02"]
      },
      "timestamp": {
        "type": "string",
        "description": "Event timestamp (ISO 8601 UTC)",
        "examples": ["2023-04-25T14:30:00Z", "2023-04-25T09:30:00-05:00"]
      },
      "ip_address": {
        "type": "string",
        "description": "IP address to query",
        "examples": ["192.168.1.100", "10.0.0.5", "172.16.10.50"]
      }
    }
  }
}
```

**Agent call (with examples):**

```
User: "Find events on prod-db-01"
Agent: "I'll query SIEM with hostname='prod-db-01.internal', timestamp='2023-04-25T14:30:00Z', ip_address='192.168.1.100'"
Success: Query executed correctly
```

---

## 2. Architecture & Design

### Parameter Example Categories

**Network Domain:**

- `ip_address` — IPv4 or IPv6 (examples: "192.168.1.100", "10.0.0.5")
- `domain_name` — FQDN (examples: "attacker.net", "c2.malicious.com")
- `port` — Network port (examples: "443", "22", "8080")

**Windows/AD Domain:**

- `hostname` — Machine name, FQDN, or short name (examples: "prod-db-01.internal", "DESKTOP-ABC123")
- `user_principal_name` — Email-style UPN (examples: "alice@company.com", "bob.smith@subsidiary.com")
- `process_guid` — Sysmon process GUID (examples: "{12345678-...}-4")
- `sid` — Windows SID (examples: "S-1-5-21-...")

**Filesystem Domain:**

- `file_path` — Absolute path (examples: "C:\\Windows\\System32\\svchost.exe", "/usr/bin/bash")
- `sha256_hash` — 256-bit hash in hex (examples: "aaaa...aaaa")
- `file_size` — Bytes (examples: "1048576")

**Temporal Domain:**

- `timestamp` — ISO 8601 with timezone (examples: "2023-04-25T14:30:00Z", "2023-04-25T09:30:00-05:00")
- `date_range_start`, `date_range_end` — ISO 8601 (examples: "2023-04-20T00:00:00Z")
- `event_id` — Windows Event Log ID (examples: "4688", "1102", "4688")

### ParameterExampleRegistry Schema

```python
REDACTED
```

**Field Meanings:**

- `parameter_name` — Exact name used in tool input_schema properties
- `parameter_type` — JSON Schema type (string, integer, etc.)
- `examples` — List of 2-4 realistic, valid examples
- `description` — Human-readable explanation
- `validation_regex` — Regex pattern all examples must match (for validation)
- `source_domain` — Category for organizational purposes (network, windows, filesystem, temporal)

---

## 3. Integration Flow

### Step 1: Define Parameter Examples

```python
REDACTED
```

### Step 2: Validate Examples

```python
REDACTED
```

### Step 3: Inject Into Tool Schema

**Before LLM sees the tool:**

```python
REDACTED
```

**Result:**

```json
{
  "name": "query_siem",
  "input_schema": {
    "properties": {
      "hostname": {
        "type": "string",
        "examples": ["prod-db-01.internal", "DESKTOP-ABC123"]
      },
      "timestamp": {
        "type": "string",
        "examples": ["2023-04-25T14:30:00Z", "2023-04-25T09:30:00-05:00"]
      },
      "ip_address": {
        "type": "string",
        "examples": ["192.168.1.100", "10.0.0.5"]
      }
    }
  }
}
```

### Step 4: Pass to LLM

```python
REDACTED
```

---

## 4. Example Walkthrough

### Scenario: SIEM Query Tool

**Before (No Examples):**

```
User: "Find all events on prod-db-01 from the last hour"

Agent Reasoning:
  I need to call query_siem with:
  - hostname: should be something like "prod-db-01"?
  - timestamp: maybe "2023-04-25 14:30" or "April 25 2026"?
  - I'll guess...

Agent Output:
  query_siem(hostname="prod-db-01", timestamp="April 25 14:30", ip_address="192.168.1.0")

Result: 3 validation errors (hostname missing domain, timestamp wrong format, IP format invalid)
```

**After (With Examples):**

```
User: "Find all events on prod-db-01 from the last hour"

Tool Definition (with examples):
  {
    "name": "query_siem",
    "input_schema": {
      "properties": {
        "hostname": {
          "examples": ["prod-db-01.internal", "DESKTOP-ABC123"]
        },
        "timestamp": {
          "examples": ["2023-04-25T14:30:00Z", "2023-04-25T09:30:00-05:00"]
        },
        "ip_address": {
          "examples": ["192.168.1.100", "10.0.0.5"]
        }
      }
    }
  }

Agent Reasoning:
  Looking at the examples:
  - hostname examples show FQDN or short names → "prod-db-01.internal"
  - timestamp examples show ISO 8601 with Z suffix → "2023-04-25T14:30:00Z"
  - ip_address examples show standard IPv4 → "192.168.1.0"

Agent Output:
  query_siem(hostname="prod-db-01.internal", timestamp="2023-04-25T14:30:00Z", ip_address="192.168.1.0")

Result: ✅ Query succeeds
```

---

## 5. Built-In Example Library

### Network Domain

| Parameter     | Type    | Examples                                                      |
| ------------- | ------- | ------------------------------------------------------------- |
| `ip_address`  | string  | "192.168.1.100", "10.0.0.5", "2001:0db8:85a3::8a2e:0370:7334" |
| `domain_name` | string  | "attacker.net", "c2.malicious.com", "exfil.attacker.io"       |
| `port`        | integer | 443, 22, 8080, 3389                                           |

### Windows/AD Domain

| Parameter             | Type   | Examples                                                                               |
| --------------------- | ------ | -------------------------------------------------------------------------------------- |
| `hostname`            | string | "prod-db-01.internal", "DESKTOP-ABC123", "srv-app-prod-02"                             |
| `user_principal_name` | string | "alice@company.com", "bob.smith@subsidiary.com", "svc-automation@company.com"          |
| `process_guid`        | string | "{12345678-1234-1234-1234-123456789012}-4", "{87654321-4321-4321-4321-210987654321}-8" |
| `sid`                 | string | "S-1-5-21-2127521184-1604012920-1887927527-72713"                                      |

### Filesystem Domain

| Parameter     | Type    | Examples                                                                                          |
| ------------- | ------- | ------------------------------------------------------------------------------------------------- |
| `file_path`   | string  | "C:\\Windows\\System32\\svchost.exe", "/usr/bin/bash", "C:\\Users\\alice\\Desktop\\document.docx" |
| `sha256_hash` | string  | "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"                                |
| `file_size`   | integer | 1048576, 512, 2097152                                                                             |

### Temporal Domain

| Parameter          | Type    | Examples                                            |
| ------------------ | ------- | --------------------------------------------------- |
| `timestamp`        | string  | "2023-04-25T14:30:00Z", "2023-04-25T09:30:00-05:00" |
| `date_range_start` | string  | "2023-04-20T00:00:00Z"                              |
| `date_range_end`   | string  | "2023-04-25T23:59:59Z"                              |
| `event_id`         | integer | 4688, 1102, 4672                                    |

---

## 6. Validation Strategy

### Validation Layer 1: Example Regex Validation

```python
REDACTED
```

### Validation Layer 2: Tool Schema Validation

```python
REDACTED
```

### Validation Layer 3: LLM Payload Validation

```python
REDACTED
```

---

## 7. Error Handling

### Case 1: Parameter Has No Matching Example

**Scenario:** Tool parameter "custom_field" has no entry in ParameterExampleRegistry  
**Behavior:** Log warning; continue without examples  
**Recovery:** Tool still works, but benefits of examples lost for that parameter  
**Mitigation:** Add custom parameter to registry or create organization-specific registry subclass

### Case 2: Example Fails Validation Regex

**Scenario:** Built-in example for `ip_address` is "999.999.999.999"  
**Behavior:** Raise ValueError at registry initialization  
**Recovery:** Fix example or fix regex  
**Impact:** This should never happen in production; caught immediately in tests

### Case 3: LLM Still Produces Invalid Format

**Scenario:** Despite examples, agent provides `timestamp: "2023-04-25"` (missing time)  
**Behavior:** API validation layer rejects the tool call  
**Recovery:** Retry with error message; agent learns from failure  
**Metrics:** Track such failures to identify missing/incorrect examples

---

## 8. Metrics & Validation

### Before Implementation

```
Format validation errors per 100 tool calls: 12-15
Most common: timestamp (32%), IP address (28%), hostname (18%)
Recovery time per error: 2-4 seconds (agent retry)
```

### Target After Implementation

```
Format validation errors per 100 tool calls: <5 (60%+ reduction)
Recovery time per error: <1 second (fewer retries)
User time saved per incident: 1-2 minutes (fewer corrections)
```

### Monitoring

```python
REDACTED
```

---

## 9. Testing Reference

Create `tests/test_parameter_example_injector.py` with 18+ tests:

**Unit Tests (8):**

- test_parameter_example_initialization — Create ParameterExample
- test_parameter_example_to_json_schema_field — Serialize to schema
- test_registry_get_by_parameter_name — Lookup by name
- test_registry_get_unknown_returns_none — Unknown param returns None
- test_registry_list_all — List all 8+ examples
- test_registry_list_by_domain — Filter by source_domain
- test_validate_examples_matches_regex — Valid examples pass
- test_validate_examples_fails_regex — Invalid examples raise ValueError

**Integration Tests (6):**

- test_inject_into_tool_single_param — Inject one param
- test_inject_into_tool_multiple_params — Inject multiple
- test_inject_preserves_other_fields — Other fields unchanged
- test_inject_into_tool_no_properties — Handle missing properties
- test_validate_tool_schema_critical_fields — Critical fields required
- test_validate_tool_schema_all_present — All examples present

**Validator Tests (4):**

- test_validate_tool_output_format — Correct structure
- test_validate_llm_receives_examples — Examples in payload
- test_validate_llm_receives_examples_logging — Missing examples warn
- test_example_consistency_all_domains — Examples consistent across registry

**Total:** ~18 tests

---

## 10. Benefits

### For Agents

- **Format Understanding:** Concrete examples teach proper formatting better than prose descriptions
- **Success Rate:** Fewer format errors → fewer retries → faster incident response
- **Context Efficiency:** Examples in tool schema don't inflate global system prompt

### For Operators

- **Fewer Errors:** Reduced validation failures on parameters
- **Faster Turnaround:** Agent calls work first time more often
- **Consistency:** All tools use same parameter formats across playbooks

### For Organization

- **Scalability:** As tool library grows, examples keep new tools immediately usable
- **Maintainability:** Examples in one registry; update once, benefit everywhere
- **Auditability:** Clear examples demonstrate what formats are expected (useful for compliance)

---

## 11. Future Enhancements

1. **Organization-Specific Examples:** Allow override of defaults (e.g., custom hostname formats)
2. **Dynamic Example Generation:** Derive examples from live data (actual recent hostnames, IPs)
3. **Format Inference:** LLM suggests examples based on parameter description
4. **Example Analytics:** Track which examples are most effective; auto-optimize
5. **Cross-Tool Consistency:** Detect parameters with same meaning across different tools; ensure consistent examples
