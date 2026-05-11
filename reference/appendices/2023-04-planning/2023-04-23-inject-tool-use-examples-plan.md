# Implementation Plan: Inject Tool Use Examples

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook  
**Applies to:** Tool definitions with complex parameter types (timestamps, IPs, hashes, paths, query formats)  
**Priority:** HIGH (Reduces LLM hallucination, prevents format validation errors)

## Overview

LLMs frequently hallucinate or misformat parameters when calling tools. An agent might provide `ip_address: "192.168.1.abc"` (invalid) or `timestamp: "2023-10-25"` (missing time/timezone). Injecting concrete, SOC-realistic examples directly into JSON Schema `examples` fields teaches the LLM proper formatting without inflating the global system prompt. This feature builds a centralized `ParameterExampleRegistry` with domain-specific examples (IPs, timestamps, hashes, domain names, Windows GUIDs), validates all examples match their parent schema, and ensures the execution framework passes examples to the LLM backend.

---

## 1. Runtime Module: `parameter_example_injector.py`

### Location

`src/runtime/parameter_example_injector.py` (new file)

### Classes & Methods

#### `ParameterExample` (dataclass)

```python
REDACTED
```

#### `ParameterExampleRegistry` (class)

```python
REDACTED
```

#### `ToolExampleValidator` (class)

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2

**Cell 0 (Bootstrap):**

```python
REDACTED
```

**Before agent call (Cell 3-5):**

```python
REDACTED
```

### SigmaNotebook (Jupyter V1)

**Tool registry injection cell:**
Similar pattern, injecting examples at tool definition time.

### MarimoNotebook

**Imports cell:**

```python
REDACTED
```

**Before agent call:**

```python
REDACTED
```

### CacaoSidecar

**Workflow step parameters include examples:**

```json
{
  "steps": [
    {
      "id": "query_siem_step",
      "commands": [
        {
          "type": "query",
          "command": "query_siem",
          "input_parameters": {
            "hostname": {
              "type": "string",
              "examples": ["prod-db-01.internal", "DESKTOP-ABC123"]
            },
            "timestamp": {
              "type": "string",
              "examples": ["2023-04-25T14:30:00Z"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## 3. Test Cases

Create `tests/test_parameter_example_injector.py` with 18+ tests:

**Unit Tests (8):**

- test_parameter_example_initialization
- test_parameter_example_to_json_schema_field
- test_registry_get_by_parameter_name
- test_registry_get_unknown_parameter_returns_none
- test_registry_list_all_examples
- test_registry_list_by_domain
- test_validate_examples_valid
- test_validate_examples_invalid_regex_raises_valueerror

**Integration Tests (6):**

- test_inject_into_tool_schema_single_param
- test_inject_into_tool_schema_multiple_params
- test_inject_into_tool_schema_missing_properties
- test_inject_examples_preserves_other_fields
- test_validate_tool_output_critical_fields_present
- test_validate_tool_output_missing_critical_fields_raises_error

**Validator Tests (4):**

- test_validate_tool_output_format
- test_validate_llm_receives_examples_present
- test_validate_llm_receives_examples_missing_warns
- test_example_formats_consistent_across_registry

**Total:** ~18 tests

---

## 4. Success Criteria

- ✅ All 8 built-in parameter examples defined and validated
- ✅ Custom examples can be added to registry
- ✅ Examples injected into tool schemas before LLM receives them
- ✅ Validation regex ensures example correctness
- ✅ Tool definitions include examples in all critical parameters
- ✅ Agent receives examples in API payload
- ✅ Format validation errors reduced by 30%+ in benchmarks
- ✅ All 18+ tests passing
- ✅ <5ms overhead per tool schema injection
