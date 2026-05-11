# Implementation Plan: Prohibit "Black Box" Agent Thinking

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook, CacaoSidecar  
**Applies to:** Notebooks with agent decision points (not pure CACAO)  
**Priority:** CRITICAL (Transparency, compliance, auditability)

## Overview

Agents must not be "black boxes" — every decision, containment action, and recommendation must include explicit reasoning. Agents are required to output reasoning alongside actions using a structured JSON schema with mandatory `reasoning` and `confidence` fields. Playbooks display reasoning in collapsible HTML details tags; compliance systems log reasoning to ticket systems for permanent audit trails. This ensures operators understand AI decisions, security reviewers can audit logic, and incident reports include complete decision chains.

---

## 1. Runtime Module: `transparent_reasoning.py`

### Location

`src/runtime/transparent_reasoning.py` (new file)

### Classes & Methods

#### `ReasoningBlock` (dataclass)

```python
REDACTED
```

#### `ReasoningRenderer` (class)

```python
REDACTED
```

#### `ReasoningAuditLogger` (class)

```python
REDACTED
```

---

## 2. Agent System Prompt Requirements

### Mandatory Reasoning Instructions

Add to all agent system prompts:

```
TRANSPARENCY REQUIREMENT
═════════════════════════════════════════════════════════════════════════════

You MUST provide explicit reasoning for every decision, action, and recommendation.

OUTPUT FORMAT (JSON):
{
  "reasoning": "Step 1: [analyze current state]\nStep 2: [evaluate options]\nStep 3: [select best action]\nStep 4: [justify choice]",
  "confidence": 0.95,
  "confidence_rationale": "High confidence because [specific reasons]",
  "action": "Isolate host and preserve logs",
  "model": "claude-3-sonnet"
}

REASONING REQUIREMENTS:
- Explain your thought process clearly
- State assumptions you're making
- Mention alternative options you considered
- Justify why you selected this action
- Flag any uncertainties or gaps in information

CONFIDENCE SCORING:
- 0.9-1.0: CRITICAL (action is essential, no doubt)
- 0.7-0.89: HIGH (strong confidence, proceed)
- 0.5-0.69: MEDIUM (reasonable choice, monitor)
- <0.5: LOW (uncertain, recommend human review)

EXAMPLES:

✓ GOOD:
{
  "reasoning": "Analyzing indicators: (1) Multiple failed logins to admin account suggest credential attack. (2) Failed attempts originated from single IP 192.168.1.45 (suspicious). (3) Timing correlates with phishing email delivery 30 min prior. Alternative: soft-block account for 1h. Best choice: isolate immediately because indicators are strong and account is critical.",
  "confidence": 0.92,
  "action": "Isolate admin account and force re-authentication",
  "model": "claude-3-sonnet"
}

✗ BAD (Black box):
{
  "reasoning": "Isolation recommended",
  "confidence": 0.8,
  "action": "Isolate host"
}
```

---

## 3. Notebook Integration

### SigmaNotebookV2 Integration

**In Cell 3 (evidence collection) or decision point cells:**

```python
REDACTED
```

### Display Output Example

```
Evidence Analysis Complete

Agent Decision: Isolate host WORKSTATION-01 immediately

🤖 Agent Reasoning (Confidence: HIGH)
┌────────────────────────────────────────────┐
│ Decision: Isolate host and preserve logs    │
│ Model: claude-3-sonnet                      │
│ Confidence: 0.92 (HIGH)                     │
│                                            │
│ Reasoning:                                  │
│ Step 1: Analyzed event timeline             │
│   - WMI execution detected at 14:25:00      │
│   - Parent process: svchost.exe (anomaly)   │
│   - Command line: suspicious PowerShell     │
│                                            │
│ Step 2: Evaluated alternatives              │
│   Option A: Monitor (too slow, high risk)   │
│   Option B: Isolate + monitor (best)        │
│   Option C: Terminate process (insufficient)│
│                                            │
│ Step 3: Selected Option B                   │
│   Reasoning: High fidelity indicators       │
│   + critical business impact justify        │
│   immediate isolation. Preservation of      │
│   logs ensures forensic completeness.       │
│                                            │
│ Captured at 2023-04-25T14:30:00Z            │
└────────────────────────────────────────────┘
```

---

## 4. Test Cases

Create `tests/test_transparent_reasoning.py` with 16+ tests:

- **Test ReasoningBlock** (2 tests)
  - Initialization
  - Serialization

- **Test ReasoningRenderer** (8 tests)
  - Parse reasoning from JSON
  - Parse reasoning from markdown (if format varies)
  - Confidence score to label conversion
  - Render collapsible HTML
  - Extract and render combined
  - Handle missing reasoning
  - Handle malformed JSON
  - HTML escaping (XSS prevention)

- **Test ReasoningAuditLogger** (4 tests)
  - Format audit entry
  - Generate Jira comment format
  - Generate ServiceNow format
  - Generate GitHub format

- **Integration tests** (2 tests)
  - Full pipeline: agent output → display + audit
  - Multiple decisions in single notebook

**Total:** ~16 tests

---

## 5. Compliance Integration

### Audit Trail Storage

Options for permanent audit trail:

1. **Ticket system** (Jira, ServiceNow, GitHub)
   - Comments on incident ticket
   - Auto-linked to playbook execution
   - Permanent, searchable

2. **Audit log file**
   - JSON log: `/var/log/SentinelMeshs/reasoning-audit.jsonl`
   - One entry per agent decision
   - Queryable by incident, date, confidence

3. **Compliance database**
   - Central repository of all reasoning blocks
   - Supports SIEM audit feeds
   - Enables post-mortems and trend analysis

---

## 6. Success Criteria

- ✅ Agent output schema requires `reasoning` field
- ✅ All agent decisions include confidence scores
- ✅ Reasoning rendered in Jupyter playbooks
- ✅ Reasoning appended to incident tickets
- ✅ Audit trail complete and searchable
- ✅ HTML rendering prevents XSS
- ✅ All 16+ tests passing
- ✅ Zero performance impact on agent inference
