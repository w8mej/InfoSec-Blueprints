# Specification: Log Sub-Agent Context Windows

## Overview

Every agent API call must log the exact context window (messages, system prompt, tool schemas, function definitions, and injected data) that was sent to the LLM. This enables auditors to understand _what the AI knew_ when making a decision, supports compliance reviews, and helps debug hallucinations caused by incomplete or malformed context. Context windows are captured at the SDK level (Anthropic/OpenAI), compressed for efficiency, and stored in append-only audit logs.

---

## 1. Context Window Capture

### What Gets Captured

```json
{
  "agent_call_id": "uuid-...",
  "timestamp": "2023-04-25T14:30:00Z",
  "lLM_model": "claude-3-sonnet-20240229",
  "client_library": "anthropic-python-0.32.0",
  "api_endpoint": "api.anthropic.com",
  "system_prompt": "You are an incident response agent...",
  "messages": [
    {
      "role": "user",
      "content": "Analyze this event log: [EVENT_LOG_DATA]"
    },
    {
      "role": "assistant",
      "content": "I have analyzed the event log and found 3 suspicious processes..."
    },
    {
      "role": "user",
      "content": "What is the blast radius of the detected compromise?"
    }
  ],
  "tools": [
    {
      "name": "grr_query",
      "description": "Query GRR Rapid Response API",
      "input_schema": {...}
    },
    {
      "name": "execute_containment",
      "description": "Execute containment action on host",
      "input_schema": {...}
    }
  ],
  "request_tokens_estimate": 2847,
  "response_tokens_limit": 2048
}
```

### Capture Mechanism

**Interception Point:** Anthropic/OpenAI SDK `messages.create()` method

```python
REDACTED
```

**Interception Layer:** Function monkey-patching at module load time

```python
REDACTED
```

---

## 2. Context Window Storage

### Schema

```python
REDACTED
```

### Storage Options

| Storage Type   | Use Case                                | Retention                  | Cost        |
| -------------- | --------------------------------------- | -------------------------- | ----------- |
| **File**       | Development, single-host                | 90 days (local disk)       | Lowest      |
| **S3**         | Production, distributed                 | Indefinite (with archival) | Low-Medium  |
| **DynamoDB**   | Searchable index, TTL                   | Configurable (default 30d) | Medium-High |
| **PostgreSQL** | Integration with SIEM, full-text search | Indefinite                 | Medium      |

### File Storage Format

**Path:** `/var/log/aso/context-windows/cell_{CELL_ID}_{TIMESTAMP}.json.gz`

```
/var/log/aso/context-windows/
├── cell_3_evidence_collection_2023-04-25T14_30_00Z.json.gz
├── cell_3_evidence_collection_2023-04-25T14_35_15Z.json.gz
├── cell_5_state_mutation_2023-04-25T14_40_22Z.json.gz
└── context-index.jsonl  ← Append-only index
```

**Index Format** (`context-index.jsonl`):

```json
{"timestamp":"2023-04-25T14:30:00Z","cell_id":"cell_3","model":"claude-3-sonnet","hash":"a1b2c3...","uri":"file://...json.gz","size_bytes":4782}
{"timestamp":"2023-04-25T14:35:15Z","cell_id":"cell_3","model":"claude-3-sonnet","hash":"d4e5f6...","uri":"file://...json.gz","size_bytes":5104}
```

---

## 3. Audit Trail & Compliance

### Audit Summary (Lightweight View)

For auditors who don't need the full context, a summary is generated:

```markdown
## Agent Context Window Audit

**Cell:** cell_3_evidence_collection  
**Timestamp:** 2023-04-25T14:30:00Z  
**Model:** claude-3-sonnet-20240229  
**Messages:** 5 user turns, 4 assistant turns  
**Tokens (estimated):** 2,847 input + 1,200 output  
**Tools Available:** 6 (grr_query, execute_containment, ...)  
**Payload Hash:** a1b2c3d4e5f6g7h8...  
**Compressed Size:** 4.8 KB

[View Full Context] [Export JSON] [Cross-Reference with Output]
```

### Full Context Viewing (Auditor Mode)

Collapsible HTML element in notebook:

```html
<details>
  <summary>📋 View Full Context Window (Audit Mode)</summary>
  <div>
    <pre>
{
  "model": "claude-3-sonnet-20240229",
  "messages": [...full message history...],
  "system": "You are an incident response agent...",
  "tools": [...all tool schemas...]
}
    </pre>
    <p>Captured: 2023-04-25T14:30:00Z | Hash: a1b2c3...</p>
  </div>
</details>
```

### Compliance Reports

Query context windows by incident ID:

```sql
SELECT timestamp, cell_id, model, payload_hash, payload_uri
FROM context_windows
WHERE incident_id = 'INC-2026-0451'
ORDER BY timestamp DESC;
```

Generate report showing:

- What decisions the agent made
- What context it had for each decision
- Any changes to context over time (was data injected/hidden?)

---

## 4. Integration with Playbook Types

### SigmaNotebookV2 (Jupyter V2)

**Cell 0 (Bootstrap):**

```python
REDACTED
```

**Cell 3 (Evidence Collection):**

Agent calls are automatically captured:

```python
REDACTED
```

**Audit View (Optional New Cell):**

```python
REDACTED
```

### SigmaNotebook (Jupyter V1)

Integration in bootstrap and GRR/GAO cells (same pattern as V2)

### MarimoNotebook

Integration in context cell and execution cells (same pattern)

### CacaoSidecar

Reference to context window log in metadata:

```json
{
  "execution_context_windows": {
    "log_type": "file",
    "log_path": "/var/log/aso/context-windows/",
    "index_uri": "file:///var/log/aso/context-windows/context-index.jsonl",
    "retention_days": 90
  }
}
```

---

## 5. Performance & Storage Considerations

### Token Estimation

```
Message Text: "Analyze this event log: [3000 chars of event data]"
Tokens (approx) = (3000 chars + JSON overhead) / 4 = ~800 tokens
```

### Compression Ratios

| Scenario          | Raw Size | Compressed | Ratio |
| ----------------- | -------- | ---------- | ----- |
| Simple question   | 2 KB     | 0.8 KB     | 40%   |
| With event data   | 50 KB    | 8 KB       | 16%   |
| Tool schemas      | 100 KB   | 15 KB      | 15%   |
| Full conversation | 200 KB   | 25 KB      | 12.5% |

### Storage Per Incident

- Average context window: 5 KB compressed
- Typical incident: 20-50 agent calls
- Total per incident: 100-250 KB
- Annual storage (10k incidents): ~2.5 GB

---

## 6. Benefits

### Compliance & Auditing

- **Demonstrate due diligence:** Full audit trail of what the AI knew
- **Regulatory alignment:** CCPA, GDPR, SOC 2 requirements for automated decisions
- **Legal defense:** Prove the agent had complete and accurate context

### Debugging & Improvement

- **Hallucination root causes:** Was data missing? Corrupted? Incomplete?
- **Prompt engineering:** Iterate on system prompts based on what works
- **Agent behavior analysis:** Identify patterns in decision-making

### Security & Forensics

- **Incident reconstruction:** What exactly happened and why?
- **Compromise detection:** Did an attacker inject false context?
- **Evidence chain:** Immutable record of investigation context

---

## 7. Testing Reference

Create `tests/test_agent_context_logger.py` with 18+ tests:

**Unit (6 tests)**

- Snapshot dataclass initialization
- LLMPayloadInterceptor.install_anthropic_hook()
- LLMPayloadInterceptor.install_openai_hook()
- Payload compression and decompression
- Token estimation accuracy
- Hash generation

**Storage (6 tests)**

- Append to file log
- Compress payload
- Generate URI
- Deduplicate by hash
- Handle concurrent writes
- Storage error handling

**Viewer (2 tests)**

- Render audit summary markdown
- Render collapsible HTML

**Integration (4 tests)**

- Full capture → store → audit flow
- Cross-reference with agent outputs
- Multiple agent calls in same cell
- Storage backend failover

**Total:** ~18 tests
