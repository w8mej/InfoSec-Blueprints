# TIER 1 Deep-Dive: Interactive Attack Graphs (Mermaid.js)

## Document Metadata

- **Audience**: SOC Analysts | Incident Commanders | Security Architects
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [visual-ui-capabilities.md](../../appendices/2023-04-planning/visual-ui-superpowers.md)
- **Related Specs**: `2023-04-27-tier1-interactive-attack-graphs.md`, `2023-04-23-modularize-playbook-branching-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/runtime/mermaid_graph_generator.py`

## Quick Summary

Interactive Attack Graphs are the "Battle Maps" of SentinelMesh. They provide a visual, real-time representation of the incident response flow directly within the [Jupyter](../GENERATORS/sigma-notebook-v2-guide.md) or [Marimo](../GENERATORS/marimo-notebook-guide.md) playbook. By utilizing **Mermaid.js**, these graphs translate complex [Autonomous Loop](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) logic and branching paths into an intuitive flow-chart that updates as the investigation progresses.

These graphs are a critical component of the [Visual UI capabilities](../../appendices/2023-04-planning/visual-ui-superpowers.md), ensuring that analysts can maintain situational awareness even in deep, non-linear investigations.

---

## 1. Persona-Based Value Proposition

### For the SOC Analyst / Incident Commander

- **Situational Awareness**: Instantly see where you are in the overall response process. The "Active" node in the graph is highlighted in real-time.
- **Visual Branching**: Understand the alternative paths the agent might take (e.g., "If Malicious" vs. "If Benign") at a glance.

### For the Security Architect

- **Design Verification**: Use the graph to verify that the [Playbook Template](../TIER-DEEP-DIVES/tier4-playbook-templating-system.md) correctly implements the intended defensive logic.
- **Standardization**: All playbooks across the enterprise use the same visual language for representing investigative flows.

### For the Forensic Auditor

- **Logic Reconstruction**: The attack graph provides a clear, high-level summary of the "Procedural History" of the incident, making it easier to explain the agent's actions during a post-mortem.

---

## 2. Architecture & Design: Graph Generation

### 2.1 The Mermaid.js Integration

SentinelMesh uses Mermaid's `graph TD` (Top-Down) and `subgraph` syntax to render incident flows:

- **Nodes**: Represent individual cells or logical steps (e.g., "Check IP Reputation").
- **Edges**: Represent the logical transitions between steps.
- **Styling**:
  - `stroke-width: 4px` for the current active node.
  - `fill: #1a1b26` (Dark Mode background).
  - `color: #7aa2f7` (Standard node color).

### 2.2 Dynamic Graph Updating

The [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) manages the graph's state:

1.  **Generation**: The initial graph is rendered based on the [Playbook Configuration](../TIER-DEEP-DIVES/tier3-configuration-file-format.md).
2.  **Execution**: As a cell completes, the ALE updates the Mermaid source to reflect the transition.
3.  **Branching**: If a "Fork" is taken (e.g., the agent decides the alert is a False Positive), the graph visually highlights the chosen path and dims the unchosen alternatives.

---

## 3. Implementation Details: Generator Logic

### Core Generator (`src/runtime/mermaid_graph_generator.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 "Black-Box" Prevention

By requiring a visual graph for every playbook, SentinelMesh prevents the use of "Opaque Logic" where the agent's next steps are hidden from the human analyst. The graph serves as a visual contract of the agent's intended behavior.

### 4.2 Compliance Mapping

- **NIST 800-53 (AU-6)**: Supports "Audit Record Review" by providing a visual summary of the sequence of investigative events.
- **ISO 27001 (A.12.1.1)**: Fulfills requirements for "Documented Operating Procedures."

---

## 5. Operations & Performance Tuning

### Rendering Performance

Mermaid graphs are rendered client-side in the browser/notebook. For extremely large DAGs (100+ nodes), the generator uses **Subgraphs** to group related tasks (e.g., "Initial Triage" vs. "Final Cleanup"), keeping the visualization manageable.

### Exporting for Reports

The graph can be exported as an SVG or PNG for inclusion in executive incident reports or compliance documentation.

---

## 6. Future Growth & Opportunities

- **Interactive "Click-to-Jump"**: Allowing analysts to click a node in the graph to instantly scroll to the corresponding cell in the notebook.
- **3D Logic Visualization**: (Experimental) Using WebGL to render complex, multi-dimensional investigation graphs for advanced threat hunting.
- **AI-Generated Graph Summaries**: Using a specialized model to provide a natural language "Play-by-Play" description of the incident based on the attack graph state.
