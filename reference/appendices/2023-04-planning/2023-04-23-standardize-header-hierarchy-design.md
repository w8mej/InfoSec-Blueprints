# Specification: Standardize Header Hierarchy

## Overview

All playbook markdown must follow a strict three-level header hierarchy to ensure consistent structure, enable automated parsing, and prevent agents from breaking document layout with arbitrary nesting. Playbook titles are H1, main operational sections are H2, and all subsections (tool outputs, agent results) are capped at H3. Any markdown exceeding this hierarchy is automatically downgraded.

---

## 1. Mandatory Header Hierarchy

### Level Assignments

| Level | Format           | Usage                       | Example                                            |
| ----- | ---------------- | --------------------------- | -------------------------------------------------- |
| H1    | `#`              | Playbook title only         | `# Isolate WMI-Executing Host`                     |
| H2    | `##`             | Main lifecycle phases       | `## Evidence Collection`, `## Containment Actions` |
| H3    | `###`            | Agent outputs, tool results | `### GRR Forensic Triage Results`                  |
| H4+   | ❌ **FORBIDDEN** | Never allowed               | (automatically downgraded to H3)                   |

### Standard H2 Sections

Every playbook MUST include these H2 sections in order:

```markdown
# {Playbook Title}

## Preconditions

[Validation logic, prerequisites check]

## Evidence Collection & Analysis

[Investigation, triage, data gathering]

## Containment Actions

[Active response, containment steps]

## Verification

[Post-action validation, success checks]

## Incident Report

[Summary, metrics, compliance notes]
```

**Optional H2 sections** (added if applicable):

- `## Context & Assumptions`
- `## Risk Assessment`
- `## Timeline`

### H3 Usage Examples

```markdown
## Evidence Collection & Analysis

### GRR Forensic Triage Results

Agent output follows...

### Forensic Timeline Analysis

Timeline data...

### Threat Intelligence Enrichment

TI data...

## Containment Actions

### Active Isolation Procedure

Isolation steps...

### Firewall Rule Deployment

Rule details...
```

---

## 2. Runtime Enforcement

### HeaderEnforcer Module

Located in `src/runtime/markdown_header_enforcer.py`.

#### Core Methods

```python
REDACTED
```

#### Sanitization Logic

```
Input markdown:
# Title
## Section A
### Subsection 1
#### Detail (UNAUTHORIZED)
##### More Detail (UNAUTHORIZED)

Output (sanitized):
# Title
## Section A
### Subsection 1
### Detail
### More Detail
```

---

## 3. Integration Points

### SigmaNotebookV2 (Jupyter V2)

**In `_build()` method:**

```python
REDACTED
```

**Method: `_validate_notebook_headers()`**

```python
REDACTED
```

### SigmaNotebook (Jupyter V1)

**In template rendering:**

- Inject `HeaderEnforcer.enforce_title()` at top
- Wrap agent outputs with sanitization

### MarimoNotebook

**In markdown cell generation:**

- Apply sanitization to all `md()` blocks
- Ensure section titles use only H2

---

## 4. Agent System Prompt Injection

Add to agent system prompt when generating markdown output:

```
IMPORTANT: You are generating markdown that will be embedded in a structured playbook.

Header hierarchy is strictly enforced:
- The overall playbook title will be H1 (#)
- Main sections (Evidence, Containment, etc.) are H2 (##)
- YOUR subsections MUST be H3 (###) only

RULES:
1. Never generate H1 or H2 headers yourself
2. If you create subsections, use ONLY ### format
3. Do NOT use #### or deeper
4. Your content will be inserted after a section header, so start with body text or bullet points

EXAMPLE - CORRECT:
### Finding Summary
- Critical finding: ...
- Timeline: ...

EXAMPLE - WRONG:
#### Findings
##### Critical Issue
Data here...

The WRONG version will be automatically downgraded to H3 (###) format.
```

---

## 5. Validation & Audit

### HeaderHierarchy Dataclass

```python
REDACTED
```

### Validation Results

```python
REDACTED
```

### Table of Contents Generation

```python
REDACTED
```

---

## 6. Example: Complete Playbook Structure

```markdown
# Isolate WMI-Executing Host

## Preconditions

- [ ] Incident context verified
- [ ] Target asset confirmed
- [ ] Incident commander briefed

## Evidence Collection & Analysis

### GRR Forensic Triage Results

Process list as of 2023-04-25T14:30:00Z:

- `wmi.exe` PID 4420 spawned by `wmiprvse.exe`
- Command line: `wmi.exe /c powershell.exe -nop...`
- Parent process: svchost.exe (System)

### Forensic Timeline

- 14:25:00 - Lateral movement detected
- 14:26:30 - WMI execution initiated
- 14:27:15 - Data exfiltration attempt

### Threat Intelligence Enrichment

- C2 domain: malware.xyz registered 2026-03-01
- Known to communicate with 42 other samples

## Containment Actions

### Active Host Isolation

Network isolation: COMPLETE at 2023-04-25T14:32:00Z

- All outbound traffic: DENIED
- Lateral movement: BLOCKED
- EDR isolation: APPLIED

### Firewall Rule Deployment

Rules deployed to 3 firewalls:

- Block 192.168.1.45 egress except DNS/DHCP
- Block inbound to 192.168.1.45 except admin RDP

## Verification

### Post-Isolation Health Check

✅ Host unreachable from internal network
✅ EDR heartbeat: NORMAL
✅ All child processes terminated

## Incident Report

- Isolation completed: 7 minutes
- Assets affected: 1
- Containment status: SUCCESS
```

---

## 7. Benefits

### Readability

- Consistent visual hierarchy across all playbooks
- Easier scanning and navigation
- Automated table of contents

### Automation

- Markdown parsers can reliably extract sections
- Agents can identify playbook boundaries
- Export tools work predictably

### Accessibility

- Screen readers benefit from proper hierarchy
- HTML export generates correct `<h1>` through `<h3>` tags
- WCAG 2.1 compliance support

---

## 8. Testing Reference

Create `tests/test_markdown_header_enforcer.py` with 15+ tests:

**Unit Tests (8 tests)**

- Title enforcement
- Header sanitization (H4 → H3, H5+ → H3)
- Header extraction
- Hierarchy validation (valid and invalid cases)
- Content preservation during sanitization

**Integration Tests (4 tests)**

- V2 playbook header structure
- V1 playbook header structure
- Marimo section headers
- Agent output sanitization

**Utility Tests (3 tests)**

- Table of contents generation
- Validation report formatting
- Header counting

---

## 9. Edge Cases

### Multiline Headers

```
Input:  ## This is a\nmultiline header
Output: ## This is a multiline header (preserved as single H2)
```

### Headers in Code Blocks

````
Input:  ## Real Header\n```\n### Fake Header in code\n```
Output: H2 recognized; H3 in code block IGNORED (correct)
````

### Special Characters in Headers

```
Input:  ## Section: foo & bar (2023-04-25)
Output: ## Section: foo & bar (2023-04-25) (preserved)
```
