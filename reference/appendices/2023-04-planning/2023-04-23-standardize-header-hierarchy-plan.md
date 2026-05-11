# Implementation Plan: Standardize Header Hierarchy

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook  
**Applies to:** Jupyter and Marimo playbooks (not CACAO, which is declarative)  
**Priority:** MEDIUM (Consistency, accessibility, readability)

## Overview

Enforce a strict, consistent header hierarchy across all playbooks to improve readability, enable automated table-of-contents generation, and prevent agents from breaking document structure with arbitrary nesting. All markdown output is sanitized to enforce H1→H2→H3 hierarchy with no H4+ headings.

---

## 1. Runtime Module: `markdown_header_enforcer.py`

### Location

`src/runtime/markdown_header_enforcer.py` (new file)

### Classes & Methods

#### `HeaderLevel` (enum)

```python
REDACTED
```

#### `HeaderHierarchy` (dataclass)

```python
REDACTED
```

#### `HeaderEnforcer` (class)

```python
REDACTED
```

#### `HeaderAuditLog` (class)

```python
REDACTED
```

---

## 2. Template & Generator Updates

### SigmaNotebookV2 (Jupyter V2)

**Location:** `src/generate/SigmaNotebookV2.py`

1. **In `_build()` method:**
   - Ensure Cell 0 starts with enforced title: `HeaderEnforcer.enforce_title(self.iap._title)`
   - Use `STANDARD_H2_SECTIONS` for main sections
   - Sanitize all agent outputs with `HeaderEnforcer.sanitize_markdown(agent_output)`

2. **In cell generation:**

   ```python
   REDACTED
```

3. **Example structure:**

   ```markdown
   # Incident Response: T1047 WMI Execution

   ## Preconditions

   [validation logic]

   ## Evidence Collection & Analysis

   [agent investigation output - auto-sanitized]

   ### Sub-agent Results

   [any H3 content from agents]

   ## Containment Actions

   [containment logic]

   ## Verification

   [post-action checks]

   ## Incident Report

   [summary and metrics]
   ```

### SigmaNotebook (Jupyter V1)

**Location:** `src/generate/SigmaNotebook.py`

1. **In template rendering:**
   - Enforce title as H1
   - Main sections as H2
   - Sanitize agent outputs

### MarimoNotebook (Reactive DAG)

**Location:** `src/generate/MarimoNotebook.py`

1. **In markdown cell generation:**
   - Apply sanitization to all markdown cells
   - Ensure section titles are H2

---

## 3. Agent Output Integration

### System Prompt Injection

Add to agent system prompt:

```
Use markdown headers for organization. Follow this hierarchy:
- Your section title will be inserted at ### (H3) level
- Do NOT use H1, H2, or H4+ headers
- Stick to body text, bullet points, and inline code
- If you generate subheadings, use ### only
```

### Output Filter

```python
REDACTED
```

---

## 4. Test Cases

Create `tests/test_markdown_header_enforcer.py` with:

- **Test HeaderEnforcer** (8 tests)
  - `test_enforce_title` — wraps as H1
  - `test_sanitize_h4_downgrade` — H4 → H3
  - `test_sanitize_h5_plus_downgrade` — H5+ → H3
  - `test_extract_headers` — parses headers correctly
  - `test_validate_hierarchy_valid` — accepts H1→H2→H3
  - `test_validate_hierarchy_invalid_skip` — rejects H1→H3 skip
  - `test_validate_hierarchy_too_deep` — rejects H4
  - `test_sanitize_preserves_content` — keeps non-header text

- **Test HeaderAuditLog** (3 tests)
  - `test_generate_toc` — creates table of contents
  - `test_validate_cell_headers` — cell validation
  - `test_validate_cell_headers_with_errors` — error detection

- **Integration tests** (4 tests)
  - V2 playbook header structure
  - V1 playbook header structure
  - Marimo playbook sections
  - Agent output sanitization

**Total:** ~15 tests

---

## 5. Success Criteria

- ✅ All playbook titles are H1
- ✅ Main sections are H2
- ✅ Agent outputs sanitized to H3 max
- ✅ No H4+ headers in generated playbooks
- ✅ Hierarchy validation working
- ✅ Table of contents generation working
- ✅ All 15+ tests passing
- ✅ No impact on readability or content
