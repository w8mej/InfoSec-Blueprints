# Implementation Plan: Log Sub-Agent Context Windows

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook  
**Applies to:** Notebooks with agent decision points (not pure CACAO)  
**Priority:** HIGH (Compliance, auditability, hallucination debugging)

## Overview

Every agent call must capture the exact context window (system prompt, message history, tool schemas, function definitions, and injected data) that was presented to the LLM at inference time. This enables auditors to understand _what the AI knew_ when making a decision, supports compliance reviews, and helps debug hallucinations caused by malformed or incomplete context. Context windows are captured at the Anthropic/OpenAI SDK level, compressed, and stored in append-only audit logs alongside cell execution traces.

---

## 1. Runtime Module: `agent_context_logger.py`

### Location

`src/runtime/agent_context_logger.py` (new file)

### Classes & Methods

#### `ContextWindowSnapshot` (dataclass)

```python
REDACTED
```

#### `LLMPayloadInterceptor` (class)

```python
REDACTED
```

#### `ContextWindowStorage` (class)

```python
REDACTED
```

#### `ContextWindowViewer` (class)

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2 (Jupyter V2)

**Location:** Cell 3 (evidence collection) and Cell 5 (state mutation)

```python
REDACTED
```

### SigmaNotebook (Jupyter V1)

**Location:** Bootstrap cell and GRR/GAO code cells

### MarimoNotebook

**Location:** Context cell and execution cells

### CacaoSidecar

**Location:** Metadata field (reference to context window log)

---

## 3. Test Cases

Create `tests/test_agent_context_logger.py` with 18+ tests:

- **Test ContextWindowSnapshot** (2 tests)
  - Initialization
  - Serialization

- **Test LLMPayloadInterceptor** (6 tests)
  - Install Anthropic hook
  - Install OpenAI hook
  - Capture message history
  - Capture tool schemas
  - Handle missing fields gracefully
  - Thread safety of global context log

- **Test ContextWindowStorage** (6 tests)
  - Append context to file storage
  - Compress payload correctly
  - Generate URI for retrieval
  - Hash payload for deduplication
  - Estimate token count
  - Handle storage errors

- **Test ContextWindowViewer** (2 tests)
  - Render audit summary markdown
  - Render collapsible HTML

- **Integration tests** (2 tests)
  - Full pipeline: agent call → capture → store → audit view
  - Cross-reference context windows to agent outputs

**Total:** ~18 tests

---

## 4. Success Criteria

- ✅ SDK hooks installed without breaking agent functionality
- ✅ Context windows captured before every LLM API call
- ✅ Payloads compressed to reduce storage footprint
- ✅ Audit log provides searchable index of contexts
- ✅ Auditors can view full context without raw JSON parsing
- ✅ Context snapshots cross-reference to agent outputs
- ✅ All 18+ tests passing
- ✅ <50ms latency overhead per agent call
