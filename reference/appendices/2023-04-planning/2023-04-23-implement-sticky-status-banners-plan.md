# Implementation Plan: Sticky Status Banners

**Target Playbook Types:** SigmaNotebookV2 (Jupyter V2), SigmaNotebook (Jupyter V1), MarimoNotebook  
**Applies to:** Notebook-based types only (N/A for CacaoSidecar)  
**Priority:** HIGH (analyst context preservation during deep analysis)

## Overview

Implement a floating, sticky header banner that remains visible at the top of the notebook viewport as analysts scroll through multi-cell forensic analysis. The banner displays:

- Incident ID (for cross-referencing and alerting)
- Incident Severity (visual indicator of criticality)
- Active SLA Countdown Timer (time remaining to TTR/TTD/TTC)

This prevents context loss during extended deep-dive sessions and ensures SLA compliance visibility.

---

## 1. Runtime Module: `sticky_banner_renderer.py`

### Location

`src/runtime/sticky_banner_renderer.py` (new file)

### Classes & Methods

#### `BannerConfig` (dataclass)

```python
REDACTED
```

#### `StickyBannerRenderer` (class)

Generates HTML/CSS/JavaScript for sticky banner.

```python
REDACTED
```

#### `SLACalculator` (class)

Calculates SLA timers from incident data.

```python
REDACTED
```

---

## 2. Integration Points by Playbook Type

### SigmaNotebookV2 (Jupyter V2)

**Location of changes:** `src/generate/SigmaNotebookV2.py`

1. **In runtime imports:**
   - Add `StickyBannerRenderer`, `BannerConfig`, `SLACalculator`

2. **In `_build` method:**
   - Add call to new method: `self._add_sticky_banner_cell()` (before or after preconditions)

3. **New method `_add_sticky_banner_cell`:**
   - Generate cell that:
     - Creates `BannerConfig` from incident context
     - Calls `StickyBannerRenderer.generate_html_banner()`
     - Displays sticky banner via `IPython.display.HTML`
     - Logs successful deployment

### SigmaNotebook (Jupyter V1)

**Location of changes:** `src/generate/SigmaNotebook.py`

1. **In template cell 0 (initialization):**
   - Add sticky banner rendering code using `StickyBannerRenderer.generate_initialization_code()`
   - Pass incident context (ID, severity, SLA)

2. **In bootstrap cell:**
   - Create `BannerConfig` and display banner

### MarimoNotebook (Reactive DAG)

**Location of changes:** `src/generate/MarimoNotebook.py`

1. **In header cell (or new dedicated cell):**
   - Import `StickyBannerRenderer`, `BannerConfig`
   - Render sticky banner using marimo's HTML/display capabilities

2. **Create dedicated `sticky_banner` cell:**
   - Display banner as Marimo markdown or HTML

---

## 3. Test Cases

Create `tests/test_sticky_banner_renderer.py` with:

- **Test `BannerConfig`** (3 tests)
  - Test initialization with all fields
  - Test `to_css_dict()` returns correct colors per severity
  - Test severity color mapping (CRITICAL, HIGH, MEDIUM, LOW)

- **Test `StickyBannerRenderer`** (5 tests)
  - `test_generate_html_banner` — produces valid HTML with CSS and JS
  - `test_html_includes_incident_id` — incident ID displayed correctly
  - `test_html_includes_severity` — severity badge colored correctly
  - `test_html_includes_countdown` — timer script present
  - `test_initialization_code` — Python code valid and complete

- **Test `SLACalculator`** (4 tests)
  - `test_parse_slo_string_seconds` — parses "900s"
  - `test_parse_slo_string_minutes` — parses "15m"
  - `test_parse_slo_string_hours` — parses "1h"
  - `test_time_remaining_calculation` — calculates correct countdown

- **Integration tests** (4 tests)
  - `test_banner_rendering_v2` — SigmaNotebookV2 banner cell generation
  - `test_banner_rendering_v1` — SigmaNotebook banner integration
  - `test_banner_rendering_marimo` — MarimoNotebook banner
  - `test_banner_does_not_overlap_code` — CSS margins prevent overlap

**Total:** ~16 tests

---

## 4. Success Criteria

- ✅ All 16+ tests pass
- ✅ Sticky banner visible at top of every notebook
- ✅ Banner remains visible during scroll (position: fixed)
- ✅ Incident ID clearly displayed
- ✅ Severity badge color-coded (CRITICAL=red, HIGH=orange, MEDIUM=gold, LOW=green)
- ✅ SLA countdown timer functional and real-time
- ✅ Timer pulses when <15 minutes remaining
- ✅ Banner does not occlude first cell
- ✅ Works in JupyterLab, Jupyter Notebook, and Marimo
