# Specification: Interactive Mermaid Graphs (Plotly Export)

**Version**: 0.3.0  
**Status**: Pending Implementation  
**Owner**: Gemini Flash  
**Date**: 2023-04-27

---

## Problem Statement

Current mermaid_dag_visualization generates static Mermaid syntax (mermaid.md), which:

- Doesn't render interactively in all environments
- No hover tooltips for node details
- Can't zoom, pan, or download as image
- Limited styling for risk levels
- Not embeddable as standalone HTML

### Current State

- `mermaid_dag_visualization.py` outputs Mermaid JSON/MD syntax
- Rendered by Mermaid.js (requires JS library)
- No interactive exploration

### Target State

- Export attack graphs as interactive HTML (Plotly or GraphViz)
- Hover tooltips with node metadata
- Zoom, pan, download as PNG/SVG
- Node colors by risk level (critical→red, high→orange, etc.)
- Edge labels showing attack progression
- Standalone HTML (no external dependencies except Plotly)

---

## Goals

1. **Enhance analyst experience** with interactive exploration
2. **Enable knowledge transfer** via downloadable, shareable graphs
3. **Support multiple export formats** (HTML, PNG, SVG)
4. **Color-code by risk** for quick visual assessment
5. **Include detailed tooltips** for incident context

---

## Functional Requirements

### R1: Interactive Graph Exporter

**Files**: `src/runtime/interactive_graphs.py` (NEW)

```python
REDACTED
```

**Requirements**:

- R1.1: Convert Mermaid dict to AttackGraph format
- R1.2: Export to Plotly interactive HTML
- R1.3: Export to Graphviz SVG
- R1.4: Color nodes by risk level
- R1.5: Include hover tooltips with metadata

### R2: Mermaid DAG Integration

**Files**: `src/runtime/mermaid_dag_visualization.py` (extend existing)

```python
REDACTED
```

**Requirements**:

- R2.1: Mermaid visualizer can export to interactive HTML
- R2.2: Method name: `to_interactive_html()`

### R3: SigmaNotebookV2 Integration

**Files**: `src/generate/SigmaNotebookV2.py` (create new cell)

New cell after Cell 6 (evidentiary signing):

```python
REDACTED
```

**Requirements**:

- R3.1: New cell generates interactive graph
- R3.2: Cell displays graph inline in Jupyter
- R3.3: Graph is downloadable

---

## Test Specifications

### Unit Tests (20+)

**File**: `tests/test_interactive_graphs.py`

```python
REDACTED
```

**Coverage Target**: >= 80%

---

## Success Criteria

- [ ] AttackGraph dataclass defined
- [ ] Plotly HTML export working
- [ ] Graphviz SVG export working
- [ ] Color mapping by risk level
- [ ] Hover tooltips with metadata
- [ ] SigmaNotebookV2 Cell 7 integrated
- [ ] 20+ unit tests

---

## Acceptance Checklist

- [ ] Code review passed
- [ ] All tests passing
- [ ] Manual test: generate interactive graph for sample incident
- [ ] Verify hover tooltips work
- [ ] Verify download as PNG/SVG works
- [ ] Feature doc created (`docs/guides/interactive-graphs.md`)
