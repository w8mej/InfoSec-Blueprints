# Specification: Sticky Status Banners

## Overview

Sticky Status Banners render a persistent, fixed-position header at the top of Jupyter notebooks that displays the incident context (ID, severity level, and SLA countdown timer). The banner remains visible even when analysts scroll deep into multi-cell forensic analysis, preventing context loss and ensuring SLA compliance visibility.

---

## 1. Visual Design

### Banner Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Incident INC-2023-04-25-001 | Severity HIGH | SLA: TTR 04:23:15 │
└─────────────────────────────────────────────────────────────┘
```

### Severity Color Scheme

| Severity | Background              | Text              | Icon |
| -------- | ----------------------- | ----------------- | ---- |
| CRITICAL | `#8B0000` (dark red)    | `#FFFFFF` (white) | 🚨   |
| HIGH     | `#FF4500` (orange-red)  | `#FFFFFF` (white) | ⚠️   |
| MEDIUM   | `#FFD700` (gold)        | `#000000` (black) | ⚡   |
| LOW      | `#90EE90` (light green) | `#000000` (black) | ℹ️   |

### Critical Timer Behavior

- When SLA countdown < 15 minutes: Timer pulses (opacity 1.0 → 0.7 → 1.0, 1s cycle)
- When SLA countdown = 0: Timer displays `00:00:00` in red

---

## 2. Runtime Module Implementation

### Module Structure

```
src/runtime/sticky_banner_renderer.py

Classes:
- BannerConfig (dataclass)
- StickyBannerRenderer (static/class methods)
- SLACalculator (static methods)
```

### BannerConfig (Dataclass)

```python
REDACTED
```

### StickyBannerRenderer (Class Methods)

```python
REDACTED
```

### SLACalculator (Static Methods)

```python
REDACTED
```

---

## 3. Integration Code Examples

### SigmaNotebookV2 Integration

**Location:** `src/generate/SigmaNotebookV2.py`, Cell 0 or Cell 1 (Initialization)

```python
REDACTED
```

### SigmaNotebook Integration

**Location:** `src/generate/SigmaNotebook.py`, Bootstrap or Cell 0

```python
REDACTED
```

### MarimoNotebook Integration

**Location:** `src/generate/MarimoNotebook.py`, Header Cell

```python
REDACTED
```

---

## 4. CSS and JavaScript Details

### CSS Behavior

- **`position: fixed`**: Remains at top regardless of scroll position
- **`z-index: 9999`**: Always above notebook content
- **`height: 60px`**: Compact but readable height
- **`box-shadow`**: Subtle shadow for depth
- **Responsive**: Flexbox layout adapts to container width

### JavaScript Timer

- **Countdown**: Calculates `deadline - current_time` every 500ms
- **Formatting**: Displays as `HH:MM:SS`
- **Pulsing**: Opacity animation when `remaining_time < 15 minutes`
- **Stop**: Displays `00:00:00` in red when deadline reached
- **Cleanup**: Clears interval on page unload

---

## 5. Browser Compatibility

| Browser     | Support    | Notes                                      |
| ----------- | ---------- | ------------------------------------------ |
| Chrome 90+  | ✅ Full    | Tested on latest                           |
| Firefox 88+ | ✅ Full    | CSS Grid/Flexbox compatible                |
| Safari 14+  | ✅ Full    | Fixed positioning works                    |
| Edge 90+    | ✅ Full    | Chromium-based                             |
| Mobile      | ⚠️ Partial | Fixed position may conflict with mobile UI |

---

## 6. Notebook Integration Details

### JupyterLab

- Banner displays above notebook content area
- Notebook cells render below banner
- No conflicts with cell toolbar or kernel status

### Classic Jupyter Notebook

- Banner anchors to top of `.container` element
- Adds 70px top margin to body to prevent overlap
- Works in both light and dark themes

### Marimo

- Use `mo.Html()` to render banner
- Banner persists across cell updates
- Compatible with Marimo's reactive updates

---

## 7. Testing Reference

Create `tests/test_sticky_banner_renderer.py` with 16+ tests:

**Unit Tests (12 tests)**

- BannerConfig validation (2)
- CSS color mapping by severity (2)
- HTML generation completeness (2)
- JavaScript countdown logic (2)
- SLA calculator functions (3)
- Time remaining calculations (1)

**Integration Tests (4 tests)**

- Banner rendering in SigmaNotebookV2
- Banner rendering in SigmaNotebook
- Banner rendering in MarimoNotebook
- No overlap with first cell code

---

## 8. Accessibility Notes

- High contrast colors (WCAG AA compliant)
- Large timer font (16px)
- Clear hierarchy with labels
- No reliance on color alone (text labels included)
- Keyboard accessible (no interactive elements, informational only)
