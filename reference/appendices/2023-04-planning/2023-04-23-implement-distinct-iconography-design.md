# Specification: Implement Distinct Iconography

## Overview

During time-pressured incident response, analysts must parse notebook cell intent in seconds, not minutes. Static text headers are skimmed, color alone fails colorblind users, and wall-of-code cells are cognitively overwhelming. This specification defines a standardized emoji-based iconography system that provides immediate, universally recognized visual cues for cell purpose and execution actor. Icons distinguish agent-autonomous cells (🤖) from human-required approvals (✋), data collection (📊) from remediation (🔧), and critical alerts (⚠️) from successful outcomes (✅). The system supports dark/light theme variants, cross-platform rendering (JupyterLab, Marimo, Databricks, VS Code Notebooks), and is WCAG-compliant when combined with text labels.

**Key Innovation:** A single emoji icon + text header reduces cognitive load from "read 20 words" to "recognize icon pattern in 200ms," enabling faster decision-making and fewer operator errors during high-stress incidents.

---

## 1. Problem Statement

### Current Situation: Text-Only Headers

```markdown
## Collect Evidence from GRR

## Triage Agent Analysis

## Authorize Containment Actions

## Apply Remediation Patches

## Critical: Check Rollback Status
```

**Issues:**

1. **Cognitive Load:** Operators must read full header text; under stress, details are missed
2. **Accessibility:** Color coding alone (sometimes used) fails colorblind users
3. **Scanability:** 30-50 cells per playbook; plain text headers blur together
4. **Intent Ambiguity:** "Collect Evidence" could be done by agent OR human (unclear)
5. **Speed:** Response time increases when operators must parse context from content, not headers
6. **Consistency:** Different playbooks use different terminology ("collect", "gather", "fetch")

### Proposed Solution: Emoji Icons + Text

```markdown
## 📊 Collect Evidence from GRR

## 🤖 Triage Agent Analysis

## ✋ Authorize Containment Actions

## 🔧 Apply Remediation Patches

## ⚠️ Critical: Check Rollback Status
```

**Benefits:**

1. **Instant Recognition:** Icon visible before text is even read
2. **Accessibility:** Icon + text = WCAG AA compliant; works for colorblind users
3. **Scanability:** Visual patterns emerge; operator's eye knows where to look
4. **Clarity:** Icon disambiguates intent (agent vs. human, data vs. action)
5. **Speed:** 200ms to understand cell intent (vs. 2-5 seconds for text parsing)
6. **Standardization:** Consistent icons across all SentinelMesh playbooks

---

## 2. Icon System Design

### Icon Categories

| Category             | Purpose                | Icons                                           |
| -------------------- | ---------------------- | ----------------------------------------------- |
| **Execution Actor**  | Who runs the cell?     | 🤖 Agent Autonomous, ✋ Human Required          |
| **Cell Purpose**     | What does the cell do? | 📊 Data Collection, 🔧 Remediation, ↩️ Rollback |
| **Severity/Outcome** | Is there a problem?    | ⚠️ Alert, ✅ Success, ❌ Error                  |

### Core Icon Definitions

#### Execution Actor Icons

**🤖 Agent Autonomous**

- **Semantic Name:** `agent_autonomous`
- **Description:** Cell executed by AI agent without human interaction
- **Use Cases:**
  - Agent-run GRR queries
  - Automated alert parsing
  - Agent-driven evidence collection
  - Agent triage analysis
- **Color (Light):** #4CAF50 (green) — conveys autonomy, trust
- **Color (Dark):** #81C784 (light green)
- **Unicode:** U+1F916
- **Aliases:** robot, ai, agent, autonomous

**✋ Human Required**

- **Semantic Name:** `human_required`
- **Description:** Cell requires human review, approval, or input
- **Use Cases:**
  - Approval gates for containment
  - Manual witness interviews
  - Human decision on remediation strategy
  - Interactive widgets or input forms
- **Color (Light):** #FF9800 (orange) — conveys caution, human involvement
- **Color (Dark):** #FFB74D (light orange)
- **Unicode:** U+270B
- **Aliases:** hand, human, approval, review, stop

#### Cell Purpose Icons

**📊 Data Collection**

- **Semantic Name:** `data_collection`
- **Description:** Cell gathers evidence or observational data
- **Use Cases:**
  - Collect artifacts from endpoint (GRR, Velociraptor)
  - Query SIEM for events
  - Pull user activity logs
  - Gather DNS/network telemetry
- **Color (Light):** #2196F3 (blue) — conveys information, data
- **Color (Dark):** #64B5F6 (light blue)
- **Unicode:** U+1F4CA
- **Aliases:** data, evidence, collect, gather

**🔧 Remediation**

- **Semantic Name:** `remediation`
- **Description:** Cell performs containment, eradication, or recovery action
- **Use Cases:**
  - Isolate endpoint
  - Disable user account
  - Apply security patches
  - Reset credentials
  - Restore from backup
- **Color (Light):** #9C27B0 (purple) — conveys action, transformation
- **Color (Dark):** #CE93D8 (light purple)
- **Unicode:** U+1F527
- **Aliases:** fix, remediate, patch, recovery

**↩️ Rollback**

- **Semantic Name:** `rollback`
- **Description:** Cell reverts or undoes previous actions
- **Use Cases:**
  - Restore endpoint from snapshot
  - Re-enable disabled user account
  - Restore network connectivity
  - Revert configuration changes
- **Color (Light):** #FF5722 (deep orange) — conveys reversal, caution
- **Color (Dark):** #FF7043 (light orange)
- **Unicode:** U+21A9
- **Aliases:** undo, revert, back, restore

#### Outcome Icons

**⚠️ Alert**

- **Semantic Name:** `alert`
- **Description:** Cell highlights risk, warning, or critical attention needed
- **Use Cases:**
  - Blast radius exceeds threshold
  - Suspicious lateral movement detected
  - Failed containment action
  - Timeout on remediation
- **Color (Light):** #F44336 (red) — conveys danger, urgency
- **Color (Dark):** #EF5350 (light red)
- **Unicode:** U+26A0
- **Aliases:** warning, risk, critical, danger

**✅ Success**

- **Semantic Name:** `success`
- **Description:** Cell confirms task completion or validation
- **Use Cases:**
  - Evidence collection completed
  - Endpoint successfully isolated
  - Credentials reset verified
  - Incident resolved
- **Color (Light):** #4CAF50 (green) — conveys completion, safety
- **Color (Dark):** #81C784 (light green)
- **Unicode:** U+2705
- **Aliases:** ok, done, pass, valid

**❌ Error**

- **Semantic Name:** `error`
- **Description:** Cell indicates failure or problem requiring attention
- **Use Cases:**
  - Failed API call
  - Containment action failed
  - Network unreachable
  - Timeout exceeded
- **Color (Light):** #F44336 (red) — conveys failure
- **Color (Dark):** #EF5350 (light red)
- **Unicode:** U+274C
- **Aliases:** fail, error, problem, reject

---

## 3. Rendering Specifications

### Markdown Rendering

**Input:**

```python
REDACTED
```

**Output:**

```markdown
## 🤖 Triage Agent Analysis
```

**Behavior:**

- Icon is Unicode emoji character (no images, no encoding issues)
- Single space between icon and text
- Works in all markdown renderers (GitHub, JupyterLab, Marimo, Databricks)
- Zero styling overhead

### HTML Rendering (Light Theme)

**Input:**

```python
REDACTED
```

**Output:**

```html
<h2 style="display: flex; align-items: center; gap: 0.5em;">
  <span style="font-size: 1.5em; color: #FF9800;">✋</span>
  <span>Authorize Containment</span>
</h2>
```

**Rendering:**

```
✋ Authorize Containment
```

(Icon displayed 1.5x larger than text, in orange)

### HTML Rendering (Dark Theme)

**Same markup, with color changed:**

```html
<span style="font-size: 1.5em; color: #FFB74D;">✋</span>
```

**Rendering:**

```
✋ Authorize Containment
```

(Icon in lighter orange, readable on dark background)

### Cross-Platform Compatibility

| Platform          | Markdown | HTML | Display                | Notes                             |
| ----------------- | -------- | ---- | ---------------------- | --------------------------------- |
| JupyterLab        | ✅       | ✅   | Native emoji rendering | Works out-of-box                  |
| Marimo            | ✅       | ✅   | Native emoji rendering | Reactive; updates on theme change |
| Databricks        | ✅       | ✅   | Native emoji rendering | Supports dark mode                |
| VS Code Notebooks | ✅       | ✅   | Native emoji rendering | Works in .ipynb files             |
| GitHub (README)   | ✅       | ⚠️   | Native emoji rendering | HTML stripped in markdown         |

---

## 4. Integration Examples

### SigmaNotebookV2 Cell Headers

**Cell 1: Evidence Collection (Agent-Autonomous)**

```python
REDACTED
```

**Cell 3: Triage Analysis (Agent-Autonomous)**

```python
REDACTED
```

**Cell 5: Human Authorization (Human-Required)**

```python
REDACTED
```

**Cell 6: Remediation (Remediation Icon)**

```python
REDACTED
```

### Icon Legend in Playbook Output

**Cell 0 Bootstrap:**

```python
REDACTED
```

**Rendered Output:**

```
| Icon | Semantic Name | Description | Category |
|------|---------------|-------------|----------|
| 🤖 | agent_autonomous | Cell executed by AI agent without human interaction | execution_actor |
| ✋ | human_required | Cell requires human review, approval, or input | execution_actor |
| 📊 | data_collection | Cell gathers evidence or observational data | cell_purpose |
| 🔧 | remediation | Cell performs containment, eradication, or recovery action | cell_purpose |
| ⚠️ | alert | Cell highlights risk, warning, or critical attention needed | severity |
| ✅ | success | Cell confirms task completion or validation | outcome |
| ❌ | error | Cell indicates failure or problem requiring attention | outcome |
| ↩️ | rollback | Cell reverts or undoes previous actions | cell_purpose |
```

### MarimoNotebook Integration

```python
REDACTED
```

### CacaoSidecar Integration

```json
{
  "workflow": {
    "steps": [
      {
        "id": "step_collect_evidence",
        "type": "action",
        "name": "📊 Collect Evidence from GRR",
        "extensions": {
          "icon_semantic": "data_collection",
          "execution_actor": "agent"
        }
      },
      {
        "id": "step_authorize_containment",
        "type": "interaction",
        "name": "✋ Authorize Containment Actions",
        "extensions": {
          "icon_semantic": "human_required",
          "execution_actor": "human"
        }
      },
      {
        "id": "step_isolate_endpoint",
        "type": "action",
        "name": "🔧 Isolate Endpoint",
        "extensions": {
          "icon_semantic": "remediation",
          "execution_actor": "agent"
        }
      }
    ]
  }
}
```

---

## 5. Accessibility Specification

### WCAG 2.1 Level AA Compliance

**Requirement 1: Icon + Text (Not Icon Alone)**

- ✅ Every icon is paired with descriptive text
- ✅ Icon is decoration; meaning is conveyed by text
- ✅ Screenreaders announce "Collect Evidence from GRR" (not just emoji)
- ❌ WRONG: Using icon alone without text label

**Requirement 2: Color Not Only Signal**

- ✅ Icon shape is distinguishable (🤖 vs ✋ is clear even in grayscale)
- ✅ Text label provides redundant signal
- ❌ WRONG: Using color alone to distinguish (e.g., "green = agent" without icon shape)

**Requirement 3: Sufficient Contrast**

- ✅ Icon color (e.g., #FF9800 orange) on white background has contrast ratio 3.5:1
- ✅ Icon color on dark background (e.g., #FFB74D) maintains contrast
- ❌ WRONG: Using low-contrast colors like #FFCCCC on white

**Screenreader Output**

```
Heading level 2: Robot Emoji - Triage Agent Analysis
```

---

## 6. Theme Support

### Light Theme (Default)

**Background:** White or light gray  
**Icon Colors:**

- 🤖 Agent: #4CAF50 (green)
- ✋ Human: #FF9800 (orange)
- 📊 Data: #2196F3 (blue)
- 🔧 Remediation: #9C27B0 (purple)
- ⚠️ Alert: #F44336 (red)
- ✅ Success: #4CAF50 (green)
- ❌ Error: #F44336 (red)
- ↩️ Rollback: #FF5722 (deep orange)

### Dark Theme

**Background:** Dark gray or black  
**Icon Colors:** Lightened versions of light theme

- 🤖 Agent: #81C784 (light green)
- ✋ Human: #FFB74D (light orange)
- 📊 Data: #64B5F6 (light blue)
- 🔧 Remediation: #CE93D8 (light purple)
- ⚠️ Alert: #EF5350 (light red)
- ✅ Success: #81C784 (light green)
- ❌ Error: #EF5350 (light red)
- ↩️ Rollback: #FF7043 (light orange)

**Implementation:**

```python
REDACTED
```

**Auto-Detection:**

```python
REDACTED
```

---

## 7. Examples & Walkthroughs

### Example 1: Multi-Step Incident Playbook

**Visual Flow:**

```
## 📊 Collect Evidence from GRR
   [Evidence gathered]

## 🤖 Triage Agent Analysis
   [Agent triages]

## ⚠️ Critical: Blast Radius Exceeds Threshold
   [Alert displayed]

## ✋ Authorize Containment Actions
   [Human must approve]

## 🔧 Isolate Endpoint
   [Containment executed]

## ✅ Isolation Verified
   [Confirmation]

## 🔧 Apply Security Patches
   [Remediation executed]

## ✅ Patches Applied and Verified
   [Final confirmation]
```

**Operator Experience:**

1. Opens playbook
2. Scans cell headers (takes 5 seconds)
3. Immediately sees where human decision is needed (✋)
4. Understands execution flow (📊→🤖→⚠️→✋→🔧)
5. Knows what to do without reading prose

### Example 2: Theme Switching

**Light Mode (9am):**

```
## ✋ Authorize Containment Actions
   [Icon in orange #FF9800]
```

**Dark Mode (9pm):**

```
## ✋ Authorize Containment Actions
   [Icon in lighter orange #FFB74D, readable on dark background]
```

---

## 8. Edge Cases & Error Handling

### Case 1: Icon Not Found

**Input:** `CellIconRegistry.get_icon("unknown_icon")`  
**Behavior:** Returns None (graceful)  
**Fallback:** Use default markdown without icon  
**Recovery:** Log warning; continue with plain text header

### Case 2: Emoji Rendering on Legacy System

**Platform:** Old JupyterHub without proper Unicode support  
**Behavior:** Emoji may display as placeholder (□) or text code  
**Mitigation:** Include text label; meaning preserved  
**Alternative:** Use HTML entity rendering fallback

### Case 3: Unicode Encoding in JSON Logs

**Scenario:** Notebook saved with emoji headers to .ipynb file  
**Handling:** Python's `json` module handles Unicode natively  
**Verification:** Test that cell metadata round-trips correctly through JSON serialization

### Case 4: Icon Color Contrast on Custom Backgrounds

**Scenario:** User customizes Jupyter with non-standard background color  
**Behavior:** Icon color may not contrast properly  
**Mitigation:** Ensure text label is always readable (not just icon color)  
**Alternative:** User can override icon colors in theme settings

---

## 9. Performance Considerations

### Rendering Overhead

| Operation                      | Time |
| ------------------------------ | ---- |
| Get icon from registry         | <1ms |
| Build markdown header          | <1ms |
| Build HTML header with styling | <2ms |
| Render legend (8 icons)        | <5ms |
| **Total per cell**             | <2ms |

### Storage Impact

- **Unicode emoji:** 4 bytes per emoji (UTF-8)
- **Per playbook:** ~20 icons × 4 bytes = 80 bytes (negligible)
- **JSON serialization:** No additional overhead (emoji is standard UTF-8)

---

## 10. Testing Reference

Create `tests/test_cell_icon_registry.py` with 15+ tests:

**Unit Tests (8):**

- test_cell_icon_initialization — Initialize CellIcon with all fields
- test_cell_icon_render_markdown — Markdown header output format
- test_cell_icon_render_html — HTML with color styling
- test_cell_icon_registry_get_by_semantic_name — Lookup by name
- test_cell_icon_registry_get_by_alias — Lookup by alias (case-insensitive)
- test_cell_icon_registry_get_unknown_returns_none — Unknown icon returns None
- test_cell_icon_registry_list_all_icons — List all 8 icons
- test_cell_icon_registry_list_by_category — Filter by category (execution_actor, cell_purpose, etc.)

**Rendering Tests (5):**

- test_markup_builder_markdown_header — Correct markdown syntax
- test_markup_builder_html_header_light_theme — Light theme colors correct
- test_markup_builder_html_header_dark_theme — Dark theme colors correct
- test_markup_builder_html_with_metadata — Data attributes preserved
- test_markup_builder_cell_metadata_serialization — CellMetadata to dict

**Accessibility & Platform Tests (2):**

- test_emoji_unicode_no_encoding_errors — UTF-8 handling correct
- test_icons_render_in_all_platforms — JupyterLab, Marimo, Databricks

**Total:** ~15 tests

---

## 11. Benefits

### For Operators

- **Speed:** Identify cell intent in 200ms (vs. 2-5 seconds reading text)
- **Clarity:** Icon disambiguation removes ambiguity (agent vs. human, data vs. action)
- **Safety:** Prominent ⚠️ alerts prevent missed critical issues
- **Consistency:** Same icons across all playbooks; learns pattern once, applies everywhere

### For Agents

- **Navigation:** Clearer signal of expected action type
- **Reasoning:** Better understanding of playbook structure and decision points
- **Output:** Can reference icons in reasoning ("then execute the 🔧 cell")

### For Organization

- **Accessibility:** WCAG AA compliant; usable by colorblind and low-vision operators
- **Training:** New operators learn playbook structure faster with visual cues
- **Adoption:** Visual polish increases playbook adoption and usage

---

## 12. Future Enhancements

1. **Custom Icon Themes:** Allow orgs to define org-specific icons (e.g., company branding)
2. **Icon Analytics:** Track which cells are most frequently skipped/viewed
3. **Auto-Icon Detection:** LLM suggests appropriate icon based on cell content
4. **Animated Transitions:** Subtle animations when cell execution completes
5. **Icon Notifications:** Use icons in Slack/email summaries of playbook execution
