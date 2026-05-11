# Specification: Prohibit "Black Box" Agent Thinking

## Problem Statement

Agents make critical incident response decisions (triage, containment, remediation) that operators must approve. But if agent reasoning is hidden, operators cannot:

- **Understand why** the agent chose that action
- **Audit the logic** for bias or hallucination
- **Build trust** in autonomous decisions
- **Challenge decisions** they don't agree with
- **Debug failures** when something goes wrong

**Current behavior (black box):**

- Agent outputs: `"Verdict: true_positive"`
- Operator sees: No explanation
- Result: Operator rejects or re-analyzes manually (slow, defeats automation)

**Desired behavior (transparent):**

- Agent outputs reasoning chain: "I evaluated 5 indicators: (1) malware hash match (confidence 0.95), (2) suspicious parent process (0.85), (3) etc."
- Operator sees clear reasoning in collapsible widget
- Operator can approve/reject with confidence

**Impact:**

- 30-50% slower MTTR when operators don't understand agent decisions
- Operators override safe decisions due to lack of visibility
- Regulatory audits: "Why did the AI decide this was a breach?" (need evidence)
- No audit trail of agent decision logic

---

## Goals

1. **Full transparency** — Every agent decision includes explicit reasoning
2. **Operator trust** — Clear, understandable explanations build confidence
3. **Auditability** — Reasoning logged for compliance and post-mortems
4. **Debuggability** — When agent fails, we can see exactly where logic broke
5. **Regulatory compliance** — Audit trail proves AI decisions are explainable

---

## Functional Requirements

### R1: Reasoning Block Output Format

**R1.1 — Agent Output Schema**

Every agent cell must output JSON with mandatory `reasoning` field:

```json
{
  "reasoning": "Step 1: Analyzed event indicators...\nStep 2: Evaluated alternatives...\nStep 3: Selected best action because...",
  "confidence": 0.92,
  "confidence_rationale": "High confidence because malware hash matches APT28 TTP with zero false positives in our dataset",
  "action": "Isolate host and preserve memory image",
  "model": "claude-3-sonnet-20240229",
  "metadata": {
    "decision_timestamp": "2023-04-25T14:30:00Z",
    "indicators_evaluated": 7,
    "alternatives_considered": 3
  }
}
```

**R1.2 — Reasoning Content Requirements**

Reasoning must include:

- **Step 1: Situation Analysis** — What evidence was reviewed?
- **Step 2: Alternative Evaluation** — What other options were considered?
- **Step 3: Justification** — Why is this option best?
- **Step 4: Risk Assessment** — What are potential downsides?

Example good reasoning:

```
Step 1: Analyzed indicators
  - WMI execution detected (parent: svchost.exe)
  - Command line: suspicious PowerShell obfuscation
  - Network: outbound connection to known C2 IP 192.168.1.45
  - File: newly created .exe in temp folder

Step 2: Evaluated alternatives
  - Option A: Monitor only → Too slow, high blast radius risk
  - Option B: Isolate + monitor → Good balance of speed + safety
  - Option C: Terminate process immediately → Loses forensics, risky

Step 3: Selected Option B because:
  - High fidelity indicators (malware hash is 100% match to APT28)
  - Critical business impact justifies immediate isolation
  - Preserving memory image enables forensic analysis
  - Reversible if false positive (can re-enable host)

Step 4: Risks identified:
  - User data loss if in-progress (but host is service account, acceptable)
  - False positive risk: <5% based on confidence scores
  - Remediation time: ~30min estimated
```

Example bad reasoning (black box):

```
Isolation recommended because host is compromised
```

---

### R2: Confidence Scoring

**R2.1 — Confidence Scale**

| Score    | Label    | Meaning                              | Action                        |
| -------- | -------- | ------------------------------------ | ----------------------------- |
| 0.9-1.0  | CRITICAL | Absolute certainty, act immediately  | Approve and execute           |
| 0.7-0.89 | HIGH     | Strong confidence, safe to proceed   | Approve and execute           |
| 0.5-0.69 | MEDIUM   | Reasonable choice, monitor carefully | Approve with caution, monitor |
| <0.5     | LOW      | Uncertain, recommend human review    | Escalate to SOC analyst       |

**R2.2 — Confidence Rationale**
Must explain _why_ confidence is at that level:

- `0.92`: "High confidence because malware hash matches APT28 TTP with 100% fidelity in our 10-year dataset"
- `0.65`: "Medium confidence because indicators are mixed (3 high-fidelity, 2 ambiguous)"
- `0.35`: "Low confidence because we lack data on this particular attack pattern"

---

### R3: Rendering in Notebooks

**R3.1 — Collapsible HTML Display**

In each agent cell, render reasoning as collapsible `<details>` element:

```html
<details>
  <summary style="cursor: pointer; font-weight: bold;">
    🤖 Agent Reasoning (Confidence:
    <span style="color: #d4302e; font-weight: bold;">HIGH</span>)
  </summary>
  <div
    style="margin-left: 20px; margin-top: 10px; padding: 10px; background-color: #f5f5f5; border-left: 3px solid #d4302e;"
  >
    <p><strong>Decision:</strong> Isolate host WORKSTATION-01</p>
    <p><strong>Model:</strong> claude-3-sonnet-20240229</p>
    <p><strong>Confidence:</strong> 92%</p>
    <p><strong>Reasoning:</strong></p>
    <pre>
Step 1: Analyzed indicators...
Step 2: Evaluated alternatives...
Step 3: Selected best option because...
Step 4: Risk assessment...</pre
    >
    <p style="font-size: 0.8em; color: #999;">
      Captured at 2023-04-25T14:30:00Z
    </p>
  </div>
</details>
```

**R3.2 — Color-Coding by Confidence**

- CRITICAL (0.9-1.0): Dark red (`#d4302e`)
- HIGH (0.7-0.89): Orange (`#f7a035`)
- MEDIUM (0.5-0.69): Yellow (`#fbcc46`)
- LOW (<0.5): Gray (`#c0c0c0`)

**R3.3 — Placement**

Reasoning displayed immediately after agent output:

- Cell output: "Decision: Isolate WORKSTATION-01"
- Below output: Collapsible reasoning widget (collapsed by default)
- Operator can click to expand and review reasoning

---

### R4: Audit Logging

**R4.1 — Reasoning Persistence**

Reasoning block logged to:

1. **Notebook metadata**: `nb.metadata['reasoning_audit']` array
2. **Incident ticket**: Jira/ServiceNow comment with full reasoning
3. **Audit log file**: `/var/log/SentinelMeshs/reasoning-audit.jsonl`

**R4.2 — Log Format (JSONL)**

```json
{
  "timestamp": "2023-04-25T14:30:00Z",
  "cell_id": "cell_3_triage",
  "decision": "true_positive",
  "confidence": 0.92,
  "model": "claude-3-sonnet",
  "reasoning_hash": "sha256:abc123..."
}
```

**R4.3 — Retention**

- Audit logs: 7 years (regulatory requirement)
- Notebook metadata: Until incident closed + 90 days
- Jira tickets: Permanent

---

### R5: System Prompt Enforcement

**R5.1 — Mandatory Reasoning Instructions**

Add to agent system prompt:

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
```

**R5.2 — Enforcement Mechanism**

- Validate JSON structure before displaying
- Reject outputs without `reasoning` field
- Retry agent if reasoning missing or malformed
- Log rejections for monitoring

---

### R6: Integration with Compliance Systems

**R6.1 — Ticket Attachment**

Reasoning automatically appended to incident tickets:

```
🤖 **Agent Decision Log**

**Decision:** Isolate host WORKSTATION-01
**Confidence:** HIGH (92%)
**Model:** claude-3-sonnet-20240229
**Timestamp:** 2023-04-25T14:30:00Z

**Reasoning:**
Step 1: Analyzed indicators
  - Malware hash match: APT28 (100% fidelity)
  - Parent process anomaly: svchost.exe hosting PowerShell
  - Network activity: Connection to known C2 IP

Step 2: Evaluated alternatives
  - Monitor only: Too slow given critical indicators
  - Isolate + monitor: Best option (speed + reversibility)

Step 3: Justification
  High-fidelity indicators warrant immediate action.
  Isolation is reversible if false positive.

Step 4: Risk assessment
  Estimated false positive rate: <5%
  Remediation time: ~30 minutes
  User impact: Service account (minimal)

---
*This comment was auto-generated by SentinelMesh for compliance and auditability.*
```

**R6.2 — Regulatory Reporting**

For breach notifications, include agent reasoning:

- "The automated system determined this was a true positive breach based on: [reasoning chain]"
- Demonstrates due diligence and reasoned decision-making
- Supports regulatory defense

---

## Non-Functional Requirements

### NF1: Performance

| Operation         | Target |
| ----------------- | ------ |
| Reason parsing    | <10ms  |
| HTML rendering    | <50ms  |
| Ticket attachment | <2s    |
| Audit logging     | <100ms |

### NF2: User Experience

- Reasoning **collapsed by default** (doesn't clutter UI)
- One click to expand and review
- Clear color-coding for confidence level
- Readable formatting (not wall of text)

### NF3: Auditability

- No reasoning blocks edited or deleted (immutable)
- Complete audit trail (no missing entries)
- Searchable by incident_id, model, confidence threshold
- Retention: 7 years minimum

---

## Example Walkthrough

### Scenario: Malware Detection Decision

**Agent output:**

```json
{
  "reasoning": "Step 1: Analyzed event indicators\n  - File hash 8f2d... matches APT28 malware family (100% confidence in threat intel DB)\n  - Parent process svchost.exe spawning PowerShell (anomalous, only 0.1% baseline)\n  - Network callback to 192.168.1.45 (known C2 infrastructure)\n  - Registry modification: HKLM\Software\Microsoft\Windows\Persistence (attack pattern)\n\nStep 2: Evaluated alternatives\n  - Option A: Monitor only → Too slow given indicators, 95%+ breach confidence\n  - Option B: Isolate host + preserve memory → Good balance\n  - Option C: Terminate process immediately → Loses forensics\n\nStep 3: Selected Option B because\n  - Multiple high-fidelity indicators (malware hash is 100% match)\n  - Critical business impact (domain admin account)\n  - Isolation is reversible if false positive\n  - Preserves memory for forensic analysis\n\nStep 4: Risk assessment\n  - False positive risk: <5% (all 4 indicators firing)\n  - Recovery time: 30-45 min\n  - User impact: Service account, minimal business disruption\n  - Escalation risk: Could spread if we wait → isolation justified",
  "confidence": 0.94,
  "confidence_rationale": "Very high confidence because malware hash is 100% match to known APT28 malware, combined with multiple attack pattern indicators. False positive probability <5%.",
  "action": "Isolate WORKSTATION-01 from network and preserve memory image",
  "model": "claude-3-sonnet-20240229"
}
```

**Notebook display:**

```
✅ Triage Verdict: TRUE POSITIVE

🤖 Agent Reasoning (Confidence: HIGH)
┌──────────────────────────────────────────────────────────┐
│ Decision: Isolate WORKSTATION-01 from network             │
│ Model: claude-3-sonnet-20240229                           │
│ Confidence: 94% (HIGH)                                    │
│                                                          │
│ Reasoning:                                                │
│ Step 1: Analyzed indicators                               │
│   - Malware hash match: 100% fidelity (APT28)             │
│   - Parent process anomaly: svchost.exe → PowerShell      │
│   - Network callback: Known C2 infrastructure             │
│   - Registry persistence detected                         │
│                                                          │
│ Step 2: Alternatives                                      │
│   Option A: Monitor only (too slow, high risk)            │
│   Option B: Isolate + preserve memory (selected)          │
│   Option C: Kill process immediately (loses forensics)    │
│                                                          │
│ Step 3: Justification                                     │
│   Multiple high-fidelity indicators + critical impact     │
│   → Isolation justified and reversible                    │
│                                                          │
│ Step 4: Risk Assessment                                   │
│   False positive <5%, recovery time ~30min                │
│   User impact: Service account (minimal disruption)       │
│                                                          │
│ Captured at 2023-04-25T14:30:00Z                          │
└──────────────────────────────────────────────────────────┘
```

**Operator reaction:**

- Reads reasoning (1 minute)
- Understands why agent chose isolation
- Approves confidently → execution proceeds quickly
- MTTR improved by 40% vs asking analyst to re-analyze

---

## Test Specifications

### Unit Tests

1. **test_reasoning_block_creation** — Block initialized correctly
2. **test_reasoning_block_serialization** — Serializes to JSON
3. **test_confidence_score_to_label** — Scores map to labels correctly
4. **test_html_rendering** — Collapsible HTML generated correctly
5. **test_html_escaping** — XSS prevention (no script injection)
6. **test_parse_reasoning_from_json** — Extract reasoning from agent output
7. **test_parse_reasoning_missing** — Handle missing reasoning block
8. **test_audit_entry_format** — Audit log has required fields
9. **test_confidence_rationale_present** — Rationale included with score
10. **test_timestamp_format_iso8601** — Timestamps in ISO 8601

### Integration Tests

11. **test_reasoning_in_notebook** — Reasoning displayed in cell output
12. **test_reasoning_appended_to_ticket** — Jira comment created with reasoning
13. **test_reasoning_logged_to_audit_file** — JSONL audit entry written
14. **test_multiple_reasoning_blocks** — Multiple agent decisions logged
15. **test_reasoning_with_low_confidence** — Low confidence marked visually
16. **test_reasoning_with_high_confidence** — High confidence marked visually

### Scenario Tests

17. **test_malware_detection_reasoning** — Realistic triage reasoning
18. **test_containment_decision_reasoning** — Containment action reasoning
19. **test_remediation_reasoning** — Remediation choice reasoning

---

## Edge Cases & Handling

| Edge Case                                  | Handling                                         |
| ------------------------------------------ | ------------------------------------------------ |
| Agent output missing `reasoning` field     | Reject output, ask agent to retry with reasoning |
| Confidence score out of range (>1.0 or <0) | Clamp to 0.0-1.0 range, log warning              |
| Confidence_rationale missing               | Use generic rationale based on score             |
| Reasoning is empty string                  | Treat as missing, reject and retry               |
| Ticket system unavailable                  | Log to audit file, attach manually later         |
| HTML rendering fails                       | Display as plain text (graceful fallback)        |
| Reasoning contains PII                     | Redact before logging to audit trail             |

---

## Success Criteria

✅ 100% of agent decisions include reasoning blocks
✅ All reasoning includes step-by-step justification
✅ Confidence scores present and meaningful
✅ Reasoning rendered cleanly in notebooks (collapsed by default)
✅ Operators report improved understanding of agent logic
✅ Complete audit trail of all reasoning blocks
✅ All 18+ tests passing
✅ <100ms overhead per agent decision
✅ MTTR improved due to faster operator decision-making

---

## Compliance & Trust

**Regulatory Value:**

- Demonstrates AI explainability and due diligence
- Supports breach notification defense: "AI system used documented reasoning process"
- Audit trail proves decisions were reviewable
- CISO confidence: Can explain every AI decision if challenged

**Operator Trust:**

- "I understand why the AI chose this action"
- Builds confidence in autonomous SOC operations
- Enables approval without re-analysis
- Speeds incident response by 30-50%
