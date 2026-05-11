# Specification: Enforce Programmatic Tool Calling

## Problem Statement

Agents generate natural language descriptions of tool invocations that never execute:

- `"Call grr_artifact_collector with parameters /var/log and /etc/passwd"` — hallucination, no execution
- `"Use velociraptor to collect system artifacts"` — reads like a command, isn't code
- `"Run the SIEM query against the main index"` — descriptive, not programmatic

**Consequences:**

- Tool invocations fail silently (agent thinks it ran, it didn't)
- Context window polluted with pseudo-code that wastes tokens
- Operator confusion: "Did the artifact collection happen?"
- No execution isolation: state from one tool bleeds into next

**Current state:**

- No validation of tool invocation format (code block vs. natural language)
- Agents don't receive correction feedback on invalid invocations
- Notebooks accept any output format, creating ambiguity
- No standardized asyncio pattern for tool async execution

**Impact:**

- 15-20% of incident response time wasted on failed/forgotten tool calls
- False confidence: operators believe tools ran when they didn't
- Debugging difficulty: no clear execution log of tool invocations

---

## Goals

1. **Programmatic-only tool use** — All tool invocations are valid Python code
2. **Hallucination detection** — Catch natural language tool descriptions immediately
3. **Clear execution boundaries** — Each tool call isolated in its own code cell
4. **Asyncio standardization** — Non-blocking tool execution (no notebook hangs)
5. **Automatic error correction** — Invalid invocations trigger retry with feedback

---

## Functional Requirements

### R1: Hallucination Detection

**R1.1 — Pattern-Based Detection**

Scan agent output for natural language tool invocation patterns:

| Pattern              | Example                               | Action |
| -------------------- | ------------------------------------- | ------ |
| `call <tool>(`       | `call grr_artifact_collector(...)`    | REJECT |
| `invoke <tool> with` | `invoke velociraptor with parameters` | REJECT |
| `execute <tool> to`  | `execute SIEM query to find events`   | REJECT |
| `run <tool> with`    | `run the artifact collector with`     | REJECT |
| `use <tool> to`      | `use the search tool to query logs`   | REJECT |

**R1.2 — Code Block Exemption**

Tool calls within triple-backtick Python blocks are ACCEPTED:

```python
REDACTED
```

**R1.3 — Detection Algorithm**

````
For each paragraph in agent output:
  1. Extract all regex matches for hallucination patterns
  2. For each match:
     a. Get line number and character position
     b. Check if match is inside a ```pythonREDACTED
``` block
     c. If outside code block:
        - Classify as hallucination
        - Record tool name, arguments, context
        - Prepare error feedback
  3. If hallucinations found:
     - Return list of ToolCallSignature objects
     - Trigger validation error
````

---

### R2: Code Validation

**R2.1 — Syntax Validation**

All code blocks containing tool calls must:

- ✅ Parse as valid Python (AST check)
- ✅ Include `asyncio.run()` or `await` pattern
- ✅ Have proper error handling (try/except or explicit error path)
- ❌ Never use wildcard imports for tool modules
- ❌ Never hardcode sensitive parameters in plain text

Example valid:

```python
REDACTED
```

Example invalid:

```python
REDACTED
```

**R2.2 — Execution Isolation**

Each tool invocation isolated in its own code cell:

- Tool call captures output to a variable
- Variable stored in notebook execution context
- Next cell references previous result via variable name
- No state mutation across tool calls

---

### R3: Asyncio Standardization

**R3.1 — Event Loop Setup**

Notebook starts with event loop initialization cell:

```python
REDACTED
```

**R3.2 — Tool Invocation Pattern**

Standard pattern for all tool calls:

```python
REDACTED
```

**R3.3 — No Blocking Calls**

- All tool APIs must support `async def` / `await`
- If tool is blocking, wrap in `asyncio.to_thread()`:
  ```python
  REDACTED
```
- Timeout protection: `asyncio.wait_for(task, timeout=30.0)`

---

### R4: Validation and Retry Loop

**R4.1 — Validation Pipeline**

```
Agent generates output
  ↓
Scan for hallucinations (ToolCallValidator.detect_raw_tool_calls)
  ├─ If hallucinations found:
  │   - Extract detected patterns
  │   - Prepare error message with examples
  │   - Trigger retry (MAX_RETRIES=3)
  │   - Pass feedback to agent system prompt
  │
  ├─ If code blocks found:
  │   - Validate syntax (ast.parse)
  │   - Validate asyncio patterns present
  │   - Validate error handling
  │   - If invalid: reject + retry
  │
  └─ If valid:
      - Execute code block
      - Capture output
      - Log execution to audit trail
```

**R4.2 — Error Feedback Format**

````
Validation Error: Tool invocation detected outside code block

LOCATION: Paragraph 3, Line 42
DETECTED: "Call grr_artifact_collector with these paths"

ISSUE: Natural language tool descriptions are not executed.

SOLUTION: Wrap your tool invocation in a Python code block:

```python
REDACTED
````

RULES:

1. All tool calls MUST be inside `python ... ` blocks
2. All tool calls MUST use asyncio.run() or await
3. All tool calls MUST have error handling
4. No natural language descriptions of tool execution

Attempt 2 of 3. Please rewrite your response with proper code blocks.

````

**R4.3 — Retry Limits**

| Metric | Value | Action |
|--------|-------|--------|
| Max retries | 3 | After 3 failures, escalate to human |
| Timeout per attempt | 30s | Retry if validation takes >30s |
| Consecutive failures | 3+ | Flag for manual playbook review |

---

### R5: Audit Logging

**R5.1 — Validation Events**

Log all validation outcomes to `/var/log/SentinelMeshs/tool-calls.jsonl`:

```json
{
  "timestamp": "2023-04-25T14:30:00Z",
  "incident_id": "INC-2026-0451",
  "cell_id": "cell_3_evidence",
  "event_type": "tool_invocation",
  "validation_status": "passed",
  "tool_name": "grr_artifact_collector",
  "args_hash": "sha256:abc123...",
  "hallucinations_detected": 0,
  "execution_time_ms": 1240,
  "output_lines": 42
}
````

**R5.2 — Hallucination Tracking**

```json
{
  "timestamp": "2023-04-25T14:29:00Z",
  "incident_id": "INC-2026-0451",
  "event_type": "hallucination_detected",
  "validation_status": "failed",
  "detected_patterns": [
    {
      "pattern": "call grr_artifact_collector",
      "line": 42,
      "confidence": 0.95
    },
    { "pattern": "use velociraptor to", "line": 48, "confidence": 0.87 }
  ],
  "attempt": 1,
  "max_attempts": 3
}
```

---

### R6: Generator Integration

**R6.1 — SigmaNotebookV2**

Cell 2 (Preconditions) + Cell 3 (Evidence Collection):

- Add event loop setup code in Cell 2
- Validate all tool calls in Cell 3 before execution
- Provide example tool invocation in template

**R6.2 — SigmaNotebook (V1)**

Bootstrap cell + tool-invocation cells:

- Initialize event loop in bootstrap
- Template includes standard tool call pattern
- Validation happens before cell execution

**R6.3 — MarimoNotebook**

Evidence capture cells:

- Each @app.cell decorator includes asyncio context
- Tool calls automatically wrapped if not already
- Validation at definition time (before execution)

**R6.4 — CacaoSidecar**

Playbook schema:

- Add `tool_invocation_mode: "programmatic"` field
- Document all tool references as async functions
- No natural language descriptions of tool use

---

## Non-Functional Requirements

### NF1: Performance

| Operation               | Target                       |
| ----------------------- | ---------------------------- |
| Hallucination detection | <50ms per output             |
| Syntax validation       | <10ms per code block         |
| Asyncio setup           | <100ms                       |
| Tool execution          | User-dependent (no overhead) |

### NF2: Reliability

- 99%+ detection of natural language patterns
- Zero false positives on valid code blocks
- Timeout protection: no notebook hangups
- Clear error messages (no cryptic validation errors)

### NF3: Coverage

- 100% of agent outputs validated
- 100% of tool invocations in code blocks
- 100% of code blocks have asyncio pattern
- All 4 generator types supported equally

---

## Example Walkthrough

### Scenario: Artifact Collection

**Agent generates (attempt 1 - INVALID):**

```
I will gather evidence for this incident. First, call grr_artifact_collector
with the paths /var/log and /etc/passwd to collect system artifacts.
Next, invoke velociraptor to gather process information.
```

**Validation Result:**

- ❌ Hallucination detected: "call grr_artifact_collector"
- ❌ Hallucination detected: "invoke velociraptor"
- Error message with correction template sent back

**Agent regenerates (attempt 2 - VALID):**

````
I will gather evidence for this incident using programmatic tool calls:

```python
REDACTED
````

This code invocation is properly structured with:

- Both tools wrapped in single asyncio context
- Error handling implicit via asyncio
- Output captured to variable

```

✅ **Valid**: All validation checks pass
- Syntax: Valid Python
- Asyncio: Proper async/await pattern
- Isolation: Single self-contained code cell
- Audit logged

---

## Test Specifications

### Unit Tests (25+)

1. **test_detect_raw_calls_call_pattern()** — Detects "call tool(...)"
2. **test_detect_raw_calls_invoke_pattern()** — Detects "invoke tool with"
3. **test_detect_raw_calls_execute_pattern()** — Detects "execute tool to"
4. **test_detect_raw_calls_run_pattern()** — Detects "run tool with"
5. **test_detect_raw_calls_use_pattern()** — Detects "use tool to"
6. **test_detect_raw_calls_case_insensitive()** — Case-insensitive matching
7. **test_detect_raw_calls_multiple_in_output()** — Multiple hallucinations
8. **test_detect_raw_calls_in_code_block_ignored()** — Ignores code blocks
9. **test_detect_raw_calls_false_positive_names()** — Avoids false positives
10. **test_validate_code_syntax_valid()** — Accepts valid Python
11. **test_validate_code_syntax_invalid()** — Rejects bad syntax
12. **test_validate_asyncio_pattern_async_def()** — Detects async/await
13. **test_validate_asyncio_pattern_asyncio_run()** — Detects asyncio.run()
14. **test_validate_asyncio_pattern_missing()** — Rejects non-async code
15. **test_validate_error_handling_try_except()** — Accepts try/except
16. **test_validate_error_handling_implicit()** — Accepts implicit asyncio handling
17. **test_wrap_tool_call_simple()** — Wraps basic invocation
18. **test_wrap_tool_call_with_args()** — Preserves arguments
19. **test_wrap_tool_call_already_wrapped()** — Idempotent
20. **test_wrap_tool_call_multiple_tools()** — Multiple tools in one block
21. **test_event_loop_setup_unix()** — Unix platform setup
22. **test_event_loop_setup_windows()** — Windows platform setup
23. **test_event_loop_setup_macos()** — macOS platform setup
24. **test_error_feedback_formatting()** — Clear error messages
25. **test_error_feedback_includes_example()** — Examples in feedback

### Integration Tests (12+)

26. **test_notebook_rejects_hallucination()** — Notebook validation catches it
27. **test_notebook_retries_on_rejection()** — Auto-retry with feedback
28. **test_notebook_passes_valid_code()** — Valid code executes
29. **test_v2_generator_validates_cells()** — V2 validates tool calls
30. **test_v1_generator_validates_cells()** — V1 validates tool calls
31. **test_marimo_generator_validates_cells()** — Marimo validates
32. **test_cacao_sidecar_schema_validation()** — CACAO schema validated
33. **test_asyncio_execution_no_hangs()** — Timeout protection works
34. **test_multiple_tool_calls_sequential()** — Multiple calls in sequence
35. **test_tool_call_error_propagation()** — Errors bubble up properly
36. **test_retry_loop_max_attempts()** — Gives up after 3 retries
37. **test_audit_log_creation()** — Events logged to audit file

### Scenario Tests (5+)

38. **test_artifact_collection_workflow()** — GRR artifact collection
39. **test_multiple_tools_single_cell()** — VTI + GRR in one async block
40. **test_agent_learns_from_feedback()** — Feedback improves agent output
41. **test_error_handling_in_tool_call()** — Tool error caught and logged
42. **test_timeout_protection()** — Long-running tool times out

---

## Edge Cases & Handling

| Edge Case | Handling |
|-----------|----------|
| Agent mentions tool name in description but no hallucination | Allow (e.g., "I can use grr for artifacts") |
| Tool name appears in variable assignment | Allow (e.g., `grr_tool = await import...`) |
| Code block with syntax error | Reject, provide syntax error details |
| Multiple asyncio.run() calls in one block | Reject, suggest combining |
| Tool call with no error handling | Warn but allow (asyncio handles it) |
| Non-existent tool in valid code block | Reject at execution time, not validation |
| Nested async functions | Allow if syntactically valid |
| Agent generates empty code block | Reject, ask for actual invocation |

---

## Success Criteria

✅ 100% of natural language tool descriptions detected
✅ 100% of code blocks syntactically validated
✅ 100% of tool invocations use asyncio pattern
✅ All 4 generator types enforce programmatic calling
✅ Clear error messages guide agent to correct format
✅ <50ms validation latency per output
✅ <5% retry rate (high first-pass success)
✅ All 42+ tests passing
```
