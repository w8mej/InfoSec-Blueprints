# Implementation Plan: Utilize Mermaid.js Decision DAGs for Playbook Visualization

## Context

Operators executing incident playbooks need immediate situational awareness:

- Which decisions points lie ahead?
- What are the possible branches and outcomes?
- Which paths mutate state (contain, isolate, terminate)?
- What's the risk profile of each branch?

Currently, operators must read cell-by-cell logic or rely on institutional knowledge. This plan introduces automatic visualization of playbook decision logic as Mermaid.js flowcharts.

---

## Feature Overview

**Objective:** Generate Mermaid.js flowchart diagrams from playbook logic structure, embed in notebook, color-code by risk level and state-mutation status.

**Scope:**

- Parse playbook routing logic (SigmaNotebookV2's Cell 4, branching decisions)
- Generate Mermaid syntax DAG representing all paths
- Embed as Markdown cell after title/overview
- Color-code nodes: safe queries (green), state-mutating actions (red), human decisions (orange)
- Support all 4 generator types (V2, V1, Marimo, CACAO)

**Success Criteria:**

- Flowchart renders in all notebook environments (Jupyter, Marimo, GitHub)
- All branching paths visible at a glance
- Risk levels visually distinguishable
- <200ms to generate diagram for 50-node playbook
- 100% of generated playbooks include DAG visualization

---

## Implementation Details

### 1. DAG Generation Engine: `src/runtime/playbook_dag_generator.py`

````python
REDACTED
```mermaid
        graph TD
            A["Decision: Assess Severity"]:::decision_safe
            B["Action: Isolate Asset"]:::action_high
            C["Action: Close Alert"]:::action_safe

            A -->|true_positive_high| B
            A -->|false_positive| C

            classDef action_safe fill:#d4edda,stroke:#28a745,color:#000
            classDef action_high fill:#f8d7da,stroke:#dc3545,color:#000
            classDef decision_safe fill:#e2e3e5,stroke:#6c757d,color:#000
        ```
        """
        lines = ["graph TD"]

        # Define nodes
        for node in nodes:
            shape = "[" if node.node_type == NodeType.DECISION else "["
            node_label = f"{shape}{node.label}]"
            class_name = f"{node.node_type.value}_{node.risk_level.value}"
            lines.append(f'    {node.node_id}{node_label}:::{class_name}')

        lines.append("")

        # Define edges
        for edge in edges:
            edge_label = f' -->|{edge.label}|' if edge.label else ' --> '
            prob_label = f' ({edge.probability:.0%})' if edge.probability else ''
            lines.append(f'    {edge.source_id}{edge_label}{edge.target_id}{prob_label}')

        lines.append("")

        # Define class styles (colors for risk levels)
        style_defs = [
            "classDef query_safe fill:#d4edda,stroke:#28a745,stroke-width:2px,color:#000",
            "classDef action_safe fill:#d4edda,stroke:#28a745,stroke-width:2px,color:#000",
            "classDef action_medium fill:#fff3cd,stroke:#ffc107,stroke-width:2px,color:#000",
            "classDef action_high fill:#f8d7da,stroke:#dc3545,stroke-width:2px,color:#000",
            "classDef decision_safe fill:#d1ecf1,stroke:#17a2b8,stroke-width:2px,color:#000",
            "classDef decision_medium fill:#fff3cd,stroke:#ffc107,stroke-width:2px,color:#000",
            "classDef state_mutation_high fill:#f8d7da,stroke:#dc3545,stroke-width:3px,color:#000",
            "classDef state_mutation_critical fill:#f5c6cb,stroke:#721c24,stroke-width:3px,color:#721c24",
            "classDef alert_high fill:#f8d7da,stroke:#dc3545,stroke-width:2px,color:#000",
            "classDef terminal fill:#e2e3e5,stroke:#6c757d,stroke-width:2px,color:#000"
        ]

        lines.extend(style_defs)

        return "\n".join(lines)

    @staticmethod
    def generate_mermaid_cell(
        playbook_logic: Dict,
        title: str = "Playbook Decision Flowchart"
    ) -> str:
        """
        Generate complete Markdown cell containing Mermaid diagram.
        """
        nodes, edges = PlaybookDAGGenerator.extract_nodes_and_edges(playbook_logic)
        mermaid_syntax = PlaybookDAGGenerator.generate_mermaid_syntax(nodes, edges)

        cell_source = f"""## {title}

This diagram shows all possible decision paths through the playbook.
- **Green**: Safe (information-gathering only)
- **Yellow**: Medium risk (some asset impact)
- **Red**: High risk (state-mutating actions like containment)

```mermaid
{mermaid_syntax}
````

**Legend:**

- Rectangles: Actions or decisions
- Arrows: Possible transitions
- Labels: Condition or probability
  """
          return cell_source

````

---

### 2. Node Styling and Color Scheme

**Safe Operations (Green):**
- Information gathering (SIEM queries, log retrieval)
- Analysis and assessment
- Preparation for escalation
- Fill: `#d4edda`, Stroke: `#28a745`

**Medium Risk (Yellow):**
- Moderate asset isolation
- Targeted account suspension
- Non-critical service termination
- Fill: `#fff3cd`, Stroke: `#ffc107`

**High Risk (Red):**
- Asset isolation
- Process termination
- Network segment blocking
- Fill: `#f8d7da`, Stroke: `#dc3545`

**Critical Risk (Dark Red):**
- Network-wide blocking
- Full infrastructure shutdown
- Fill: `#f5c6cb`, Stroke: `#721c24`

---

### 3. Generator Integration

**SigmaNotebookV2.py:**
- In `build()` method, after routing logic defined:
  ```python
  REDACTED
````

**SigmaNotebook.py:**

- Add DAG cell to template after Title cell
- Generate diagram from routing configuration
- Include in exported notebook

**MarimoNotebook.py:**

- Generate Mermaid cell as part of @app.cell decorator
- Render using marimo's built-in markdown support
- Make diagram interactive (clickable nodes → cell execution)

**CacaoSidecar.py:**

- Add `flowchart_config` to CACAO playbook:
  ```json
  {
    "flowchart_config": {
      "render_diagram": true,
      "show_probabilities": true,
      "highlight_state_mutations": true,
      "include_risk_levels": true
    }
  }
  ```

---

### 4. Dynamic Diagram Generation

Diagrams can be generated:

- **At build time** (static): Playbook structure known at generation
- **At runtime** (dynamic): If playbook routing changes based on incident data

For dynamic cases:

```python
REDACTED
```

---

## Integration Points Summary

| Generator       | Location             | Integration Method                      |
| --------------- | -------------------- | --------------------------------------- |
| SigmaNotebookV2 | Cell 1 (after Title) | Insert Mermaid cell from routing config |
| SigmaNotebook   | After Title cell     | Inject Mermaid markdown cell            |
| MarimoNotebook  | app.cell decorator   | Render Mermaid with marimo markdown     |
| CacaoSidecar    | playbook JSON        | Add flowchart_config block              |

---

## Testing Strategy

Unit tests (16+ tests):

- `test_extract_nodes_linear_path()` — Simple A→B→C path
- `test_extract_nodes_branching()` — Decision point with 3 outcomes
- `test_extract_nodes_parallel_paths()` — Multiple concurrent branches
- `test_extract_nodes_cycles()` — Handle cycles gracefully (don't infinite loop)
- `test_node_risk_level_query()` — Query operations = SAFE
- `test_node_risk_level_containment()` — State-mutating = HIGH or CRITICAL
- `test_edge_probability()` — Probabilities preserved in edges
- `test_mermaid_syntax_valid()` — Generated syntax is valid Mermaid
- `test_mermaid_classes_applied()` — Risk classes applied to nodes
- `test_mermaid_colors_correct()` — Safe=green, high=red, etc.
- `test_cell_markdown_format()` — Generated cell is valid Markdown
- `test_performance_<200ms()` — Generation completes in <200ms for 50-node playbook
- `test_empty_playbook()` — Empty routing logic handled gracefully
- `test_missing_entry_point()` — Missing entry_point handled gracefully

Integration tests:

- `test_notebook_includes_mermaid_cell()` — Generated notebook has DAG cell
- `test_mermaid_renders_in_jupyter()` — Diagram renders in Jupyter
- `test_mermaid_renders_in_github()` — Diagram renders on GitHub

---

## Success Metrics

1. **Coverage:** 100% of playbooks include decision DAG
2. **Visualization quality:** All nodes and edges visible at once
3. **Risk visibility:** Color-coding makes risk profile clear
4. **Performance:** <200ms to generate diagram for 50+ node playbook
5. **Rendering:** Diagram renders in Jupyter, Marimo, GitHub without errors
6. **Operator feedback:** DAG helps operators understand playbook logic

---

## Risks & Mitigations

| Risk                                              | Mitigation                                                     |
| ------------------------------------------------- | -------------------------------------------------------------- |
| Mermaid diagram too complex (50+ nodes cluttered) | Hierarchical layout, grouping by risk level, collapse/expand   |
| Diagram out of sync with actual playbook logic    | Regenerate at every build, version control the logic structure |
| Mermaid syntax invalid (causes rendering error)   | Unit tests validate syntax before embedding in notebook        |
| Performance for very large playbooks              | Lazy loading or pagination for >100 node playbooks             |
