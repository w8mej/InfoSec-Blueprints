# Implementation Plan: Implement Distinct Iconography

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook  
**Applies to:** All cells with clear execution semantics (agent-autonomous vs human-required)  
**Priority:** MEDIUM (UX, incident response speed, operator cognitive load)

## Overview

During high-pressure incident response, analysts must parse notebook cell intent in milliseconds. Long text headers are skimmed. Color alone is not accessible. Emoji icons provide immediate, universally recognized visual cues: 🤖 for agent-autonomous cells, ✋ for human-required approvals, 📊 for data collection, 🔧 for remediation, etc. This feature standardizes iconography across all SOC playbooks, enables dark/light theme variants, and ensures cross-platform rendering (JupyterLab, Marimo, Databricks, VS Code Notebooks).

---

## 1. Runtime Module: `cell_icon_registry.py`

### Location

`src/runtime/cell_icon_registry.py` (new file)

### Classes & Methods

#### `CellIcon` (dataclass)

```python
REDACTED
```

#### `CellIconRegistry` (class)

```python
REDACTED
```

---

## 2. Runtime Module: `cell_metadata_markers.py`

### Location

`src/runtime/cell_metadata_markers.py` (new file)

### Classes & Methods

#### `CellMetadata` (dataclass)

```python
REDACTED
```

#### `CellMarkupBuilder` (class)

```python
REDACTED
```

---

## 3. Integration Points by Playbook Type

### SigmaNotebookV2

**Cell 0 (Bootstrap):**

```python
REDACTED
```

**Cell 1-6 (Each gets icon-prefixed header):**

```python
REDACTED
```

**Cell 3 (Agent analysis):**

```python
REDACTED
```

**Cell 5 (Human approval):**

```python
REDACTED
```

### SigmaNotebook (Jupyter V1)

Same pattern in template injection cells.

### MarimoNotebook

Marimo cells get icon prefix in title or section headers:

```python
REDACTED
```

### CacaoSidecar

CACAO step metadata includes icon reference:

```json
{
  "steps": [
    {
      "id": "step_1_collect",
      "type": "action",
      "name": "📊 Collect Evidence from GRR",
      "extensions": {
        "icon_semantic": "data_collection",
        "execution_actor": "agent"
      }
    }
  ]
}
```

---

## 4. Test Cases

Create `tests/test_cell_icon_registry.py` with 15+ tests:

**Unit Tests (8):**

- test_cell_icon_initialization
- test_cell_icon_render_markdown
- test_cell_icon_render_html
- test_cell_icon_registry_get_by_semantic_name
- test_cell_icon_registry_get_by_alias
- test_cell_icon_registry_get_unknown_raises_none
- test_cell_icon_registry_list_all_icons
- test_cell_icon_registry_list_by_category

**Integration Tests (5):**

- test_cell_markup_builder_markdown_header
- test_cell_markup_builder_html_header
- test_cell_markup_builder_html_with_metadata
- test_cell_metadata_to_notebook_metadata
- test_icon_legend_rendering_all_icons

**Encoding & Platform Tests (2):**

- test_emoji_render_no_encoding_errors
- test_icons_display_correctly_in_dark_mode

**Total:** ~15 tests

---

## 5. Success Criteria

- ✅ All 8 built-in icons render correctly in markdown and HTML
- ✅ Icon registry provides fast lookup by semantic name and alias
- ✅ Cell headers in SigmaNotebookV2 include icons without breaking markdown
- ✅ Icons render without encoding errors across JupyterLab, Marimo, Databricks
- ✅ Dark/light theme variants defined for all icons
- ✅ Icon legend auto-generated and readable in playbook output
- ✅ CellMetadata serializes to Jupyter cell metadata
- ✅ All 15+ tests passing
- ✅ No rendering overhead (<1ms per icon)
