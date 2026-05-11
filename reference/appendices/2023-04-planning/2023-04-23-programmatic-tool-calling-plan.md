# Implementation Plan: Enforce Programmatic Tool Calling

## Context

Agents often hallucinate natural language tool invocations ("Call grr_artifact_collector with these parameters...") that pollute the context window and fail at runtime. This plan enforces that ALL tool invocations must be executed programmatically within isolated Python code cells using `asyncio`, eliminating hallucination and providing clear, isolated execution boundaries.

---

## Feature Overview

**Objective:** Mandate that agents invoke tools only through proper Python code execution, never through natural language descriptions.

**Scope:**

- Parse agent output for hallucinated tool calls (regex + AST patterns)
- Validate that tool invocations appear in code blocks
- Wrap valid tool calls in asyncio context
- Reject invalid calls with error feedback + retry loop
- Support all 4 generator types (V2, V1, Marimo, CACAO)

**Success Criteria:**

- Zero natural language tool calls in logs
- 100% of tool invocations validated before execution
- <50ms validation latency
- Clear error messages when validation fails
- Automatic retry with corrections

---

## Implementation Details

### 1. Runtime Module: `src/runtime/programmatic_tool_calling.py`

````python
REDACTED
```python block
    context: str             # Surrounding text for error messages
    line_number: int         # Where in output it appears

class ToolCallValidator:
    """Detects and validates tool invocation patterns"""

    # Regex patterns for common hallucination signatures
    HALLUCINATION_PATTERNS = [
        r"call\s+(\w+)\s*\(",                    # "call tool_name("
        r"invoke\s+(\w+)\s*\(",                  # "invoke tool_name("
        r"execute\s+(\w+)\s*\(",                 # "execute tool_name("
        r"run\s+(\w+)\s+with",                   # "run tool_name with"
        r"use\s+(\w+)\s+to",                     # "use tool_name to"
    ]

    @staticmethod
    def detect_raw_tool_calls(text: str) -> List[ToolCallSignature]:
        """
        Scan agent output for natural language tool invocations.
        Returns list of detected calls that are NOT in code blocks.
        """
        calls = []
        code_blocks = _extract_code_blocks(text)
        code_block_ranges = [(m.start(), m.end()) for m in code_blocks]

        for pattern in ToolCallValidator.HALLUCINATION_PATTERNS:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                start, end = match.span()
                tool_name = match.group(1)

                # Check if this match is inside a code block
                in_code_block = any(s <= start < e for s, e in code_block_ranges)

                if not in_code_block:
                    context_start = max(0, start - 50)
                    context_end = min(len(text), end + 50)
                    calls.append(ToolCallSignature(
                        tool_name=tool_name,
                        args={},
                        is_code_block=False,
                        context=text[context_start:context_end],
                        line_number=text[:start].count('\n') + 1
                    ))

        return calls

    @staticmethod
    def is_valid_code_execution(cell_source: str) -> bool:
        """
        Verify that cell source is syntactically valid Python.
        Check for asyncio patterns if tool calls present.
        """
        try:
            ast.parse(cell_source)
        except SyntaxError:
            return False

        # Check for asyncio.run() or async/await keywords
        has_asyncio = 'asyncio.run' in cell_source or 'await ' in cell_source

        return True

    @staticmethod
    def inject_asyncio_wrapper(func_name: str, body: str) -> str:
        """
        Wrap a tool invocation in asyncio context if not already wrapped.

        Input: grr_artifact_collector(paths=["/var/log"])
        Output: asyncio.run(grr_artifact_collector(paths=["/var/log"]))
        """
        if 'asyncio.run' in body or 'await ' in body:
            return body  # Already wrapped

        # Check if body contains a direct function call
        if body.strip().endswith(')'):
            return f"import asyncio\nresult = asyncio.run({body})"

        return body

class AsyncToolWrapper:
    """Generates asyncio-compliant tool invocation code"""

    @staticmethod
    def wrap_in_async(tool_name: str, args: Dict) -> str:
        """
        Generate a complete asyncio code block for tool invocation.

        Returns:
            Python code string ready for notebook execution
        """
        args_str = ', '.join(f'{k}={repr(v)}' for k, v in args.items())

        return f"""import asyncio

async def invoke_tool():
    result = await {tool_name}({args_str})
    return result

result = asyncio.run(invoke_tool())
print(f"Tool invocation result: {{result}}")
"""

    @staticmethod
    def generate_event_loop_setup() -> str:
        """
        Generate setup code for notebook-wide asyncio event loop.
        Call once at notebook start.
        """
        return """import asyncio
import sys

# Setup event loop for notebook environment
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# Store loop in a cell variable for reuse
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)
print("Asyncio event loop initialized for notebook execution")
"""
````

---

### 2. Validation Integration Points

**SigmaNotebookV2.py** (Cell 3 + Cell 5):

- Before agent output is rendered, call `ToolCallValidator.detect_raw_tool_calls()`
- If hallucinations found, inject error message and retry loop
- If valid code blocks detected, verify with `is_valid_code_execution()`

**SigmaNotebook.py** (\_inject_bootstrap_cell):

- Add event loop setup code from `AsyncToolWrapper.generate_event_loop_setup()`
- Provide example tool invocation patterns

**MarimoNotebook.py** (evidence_capture cell):

- Wrap tool calls in asyncio context automatically
- Validate tool invocations at cell definition time

**CacaoSidecar.py** (declarative):

- Add `tool_invocation_mode: "programmatic"` to playbook schema
- Validate that tool references are properly defined as async functions

---

### 3. Error Handling and Retry Logic

When hallucinations detected:

```
Error detected: Natural language tool invocation
Location: Line 45
Detected call: "Call grr_artifact_collector(...)"

Solution: Wrap this in a Python code block using asyncio.run():
```

asyncio.run(grr_artifact_collector(...))

```

Please rewrite the tool invocation in a proper Python code cell.
```

Max retries: 3 (same as JSON validation)
Escalation: After 3 failures, flag for human review

---

## Testing Strategy

Unit tests (12+):

- `test_detect_raw_tool_calls_simple()` — Detects "call tool(...)" pattern
- `test_detect_raw_tool_calls_multiple()` — Multiple patterns in one text
- `test_detect_tool_calls_in_code_block()` — Ignores calls inside ```python
- `test_detect_tool_calls_with_variations()` — invoke, execute, run, use patterns
- `test_is_valid_code_execution_syntax()` — Parses valid Python
- `test_is_valid_code_execution_invalid()` — Rejects bad syntax
- `test_is_valid_code_execution_asyncio()` — Detects asyncio patterns
- `test_wrap_in_async_simple()` — Wraps basic function call
- `test_wrap_in_async_with_args()` — Preserves arguments
- `test_wrap_in_async_already_wrapped()` — Idempotent
- `test_event_loop_setup_code()` — Generates valid setup
- `test_event_loop_setup_windows_policy()` — Handles Windows platform

Integration tests (8+):

- `test_notebook_detects_hallucination()` — Notebook validation catches hallucination
- `test_notebook_retry_on_hallucination()` — Automatic retry with feedback
- `test_notebook_succeeds_with_valid_code()` — Valid code passes through
- `test_asyncio_wrapper_in_v2_cell()` — V2 generator wraps tool calls
- `test_asyncio_wrapper_in_marimo_cell()` — Marimo generator wraps calls
- `test_tool_call_execution_time()` — Tool execution completes quickly
- `test_multiple_tool_calls_sequential()` — Multiple calls in same notebook
- `test_tool_call_error_handling()` — Exception in tool is caught gracefully

---

## Success Metrics

1. **Coverage:** 100% of tool invocations validated
2. **Hallucination detection:** 99%+ catch rate on natural language patterns
3. **Validation latency:** <50ms per check
4. **Retry rate:** <5% (high first-pass validation rate)
5. **Zero runtime failures** from invalid tool invocations
6. **Clear error messages** guide agents to correct format

---

## Risks & Mitigations

| Risk                                          | Mitigation                                           |
| --------------------------------------------- | ---------------------------------------------------- |
| Over-strict validation rejects valid patterns | Expand regex patterns, add custom validator hooks    |
| Asyncio overhead slows notebook execution     | Benchmark <5ms per invocation, use event loop reuse  |
| Windows/Mac event loop incompatibility        | Platform-specific setup in event loop initialization |
| Agent continues hallucinating after feedback  | Max retries + escalation to human review             |
