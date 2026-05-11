# HITL Gate Role Composition & Bottleneck Map — Design Spec

**Dashboard #:** 7
**Date:** 2023-04-22
**Author:** SentinelMesh Platform Team
**Status:** Approved for Implementation

---

## 1. Context and Motivation

`analytics.html` (Dashboard #6) surfaces average HITL gate latency broken down by domain × gate type. That view tells operators _how long_ approvals take in aggregate. It does not answer three operationally critical questions:

1. **Which specific roles** (`soc-tier-2`, `ir-lead`, `ciso`, `legal`) are required by which playbook families, and how often?
2. **Which MCP tools** (`grr_rapid_response`, `crowdstrike_rtr`, `gao_agent`) are behind a human gate, and who can authorize them?
3. **Which role is the organizational chokepoint** — required by the most playbooks and carrying the longest approval latency?

This dashboard provides the staffing intelligence layer that sits above the latency view. Where Dashboard #6 answers "how slow is approval?", Dashboard #7 answers "why is it slow, and which role must we staff more heavily to unblock the SOC?"

The answer feeds directly into headcount planning, on-call coverage decisions, and autonomy-level escalation proposals for future CACAO schema updates.

---

## 2. Scope

**In scope:**

- All CACAO JSON playbooks under `autonomic_loops/remediation/{canary,enterprise,ics,mobile,unmapped}/` (recursive)
- V2 Jupyter/Marimo notebooks in the same tree (for HITL step counting)
- Per-gate approval latencies (Lean4 seeded, deterministic)

**Out of scope:**

- Real-time runtime telemetry (not yet wired to `aso_runtime`)
- Dashboards #1–6 (no duplication)
- Non-CACAO artifacts (SBOM, ATT&CK layer JSON)

---

## 3. Architecture

```
src/scripts/generate_hitl_composition.py
    │
    ├── rglob CACAO JSON files → parse auth_gates
    ├── rglob V2 notebooks     → count HITL steps
    ├── compute bottleneck scores
    ├── build role-pair co-occurrence table
    └── emit analytics/hitl_composition_data.json
                │
                └── render docs/hitl_composition.html
                        ├── Chart.js horizontal bar   (bottleneck rank)
                        ├── Chart.js bubble chart      (count × latency × score)
                        ├── D3.js chord/matrix diagram (role co-occurrence)
                        └── HTML table                 (MCP tool gating)
```

All JSON is embedded inline in the HTML `<script>` block. No external data fetches at render time. Dark theme via Tailwind CSS CDN. Chart.js and D3.js via CDN.

---

## 4. Data Extraction

### 4.1 CACAO `auth_gates`

Each CACAO JSON playbook may contain one or more `auth_gates` entries. The canonical structure is:

```json
{
  "required_roles_hitl": ["soc-tier-2", "ir-lead"],
  "mcp_tool_allowlist": ["grr_rapid_response", "crowdstrike_rtr", "gao_agent"]
}
```

Extract per playbook:

- **`required_roles`**: union of all `required_roles_hitl` lists across all `auth_gates` entries
- **`mcp_tools`**: union of all `mcp_tool_allowlist` lists across all `auth_gates` entries
- **`playbook_types`**: top-level `playbook_types` array (e.g. `["notification", "investigation"]`)

### 4.2 HITL Step Count (Notebooks)

For each V2 Jupyter/Marimo notebook co-located with or associated with a CACAO playbook, count occurrences of the literal marker:

```
👤 [HITL REQUIRED]
```

This count becomes `hitl_steps` for the playbook. If no notebook is found, default to the count of `auth_gates` entries (one step per gate).

### 4.3 Domain

Derive domain from the remediation subdirectory name:

| Subdirectory | Domain label |
| ------------ | ------------ |
| `canary`     | `canary`     |
| `enterprise` | `enterprise` |
| `ics`        | `ics`        |
| `mobile`     | `mobile`     |
| `unmapped`   | `unmapped`   |

### 4.4 Gate Latencies

For each gate index within a playbook, produce a Lean4 approval latency (minutes):

```python
REDACTED
```


---

## 5. Processing

### 5.1 Per-Role Aggregation

For each known role, aggregate across all playbooks that require it:

| Field                | Derivation                                                               |
| -------------------- | ------------------------------------------------------------------------ |
| `name`               | Role string (e.g. `soc-tier-2`)                                          |
| `playbook_count`     | Number of playbooks where role appears in `required_roles`               |
| `avg_latency_min`    | Mean of all gate latencies for those playbooks                 |
| `domains`            | Dict `{domain: count}` — how many playbooks per domain require this role |
| `top_playbook_types` | Top 3 playbook types by frequency across this role's playbooks           |

### 5.2 Bottleneck Score

```
bottleneck_score(role) = (playbook_count × avg_latency_min) / total_hitl_steps_across_all
```

Where `total_hitl_steps_across_all` is the sum of `hitl_steps` for every playbook in the corpus. This normalizes the score so it represents role pressure relative to total SOC HITL workload.

Higher score = greater organizational dependency on this role = higher staffing risk.

### 5.3 Role-Pair Co-occurrence

For every playbook, generate all 2-combinations of its `required_roles`. Accumulate counts across all playbooks. The result is a symmetric matrix used to drive the D3 chord diagram.

Example: if a playbook requires `["soc-tier-2", "ir-lead", "ciso"]`, this contributes:

- `(soc-tier-2, ir-lead)` += 1
- `(soc-tier-2, ciso)` += 1
- `(ir-lead, ciso)` += 1

### 5.4 Per-MCP-Tool Aggregation

For each known MCP tool, aggregate:

- `playbook_count`: number of playbooks listing the tool in `mcp_tools`
- `gating_roles`: union of `required_roles` for all playbooks where the tool appears (the human roles that can authorize this tool's execution)

---

## 6. Output Schema

**File:** `analytics/hitl_composition_data.json`

```jsonc
{
  "generated_at": "2023-04-22T00:00:00Z",
  "summary": {
    "total_playbooks": 426,
    "total_hitl_steps": 1240,
    "roles_analyzed": ["soc-tier-2", "ir-lead", "ciso", "legal"],
    "mcp_tools_analyzed": [
      "grr_rapid_response",
      "crowdstrike_rtr",
      "gao_agent",
    ],
    "top_bottleneck_role": "soc-tier-2",
  },
  "playbooks": [
    {
      "id": "playbook--uuid",
      "name": "string",
      "domain": "canary",
      "required_roles": ["soc-tier-2", "ir-lead"],
      "mcp_tools": ["grr_rapid_response"],
      "hitl_steps": 3,
      "playbook_types": ["notification", "investigation"],
      "gate_latencies": [3.412, 5.891, 2.103],
    },
  ],
  "roles": [
    {
      "name": "soc-tier-2",
      "playbook_count": 312,
      "avg_latency_min": 4.87,
      "bottleneck_score": 1.223,
      "domains": {
        "canary": 89,
        "enterprise": 154,
        "ics": 41,
        "mobile": 18,
        "unmapped": 10,
      },
      "top_playbook_types": ["investigation", "remediation", "notification"],
    },
  ],
  "mcp_tools": [
    {
      "name": "grr_rapid_response",
      "playbook_count": 198,
      "gating_roles": ["soc-tier-2", "ir-lead"],
    },
  ],
  "role_pairs": [
    {
      "role_a": "soc-tier-2",
      "role_b": "ir-lead",
      "co_occurrence_count": 287,
    },
  ],
}
```

---

## 7. Dashboard UI

**Output file:** `docs/hitl_composition.html`

### 7.1 Layout

Three-column header stat bar → two-panel row (bar chart left, bubble chart right) → full-width chord matrix → full-width MCP tool table.

Dark theme: Tailwind `bg-gray-950` body, `bg-gray-900` cards, `text-gray-100` primary text, `text-gray-400` secondary. Accent: amber (`#F59E0B`) for highest bottleneck, blue (`#3B82F6`) for mid, gray for low.

### 7.2 Header Stat Bar

Three summary cards (Tailwind flex row):

- **Total Playbooks with HITL gates** (count)
- **Top Bottleneck Role** (role name + bottleneck score)
- **Most Gated MCP Tool** (tool name + playbook count)

### 7.3 Chart 1 — Horizontal Bar: Role Bottleneck Ranking

**Library:** Chart.js `bar` with `indexAxis: 'y'`

- Y-axis: role names, sorted descending by `bottleneck_score`
- X-axis: `bottleneck_score` value
- Bar color: amber gradient from highest to lowest score
- Tooltip: role name, playbook count, avg latency, score
- Title: "Role Bottleneck Score (playbook_count × avg_latency / total_hitl_steps)"

### 7.4 Chart 2 — Bubble Chart: Count × Latency × Score

**Library:** Chart.js `bubble`

- X-axis: `playbook_count`
- Y-axis: `avg_latency_min`
- Bubble radius: `bottleneck_score × 15` (scaled for visibility)
- Color per role: distinct hue from a fixed palette
- Tooltip: all four metrics
- Helps reveal which roles have high latency but low volume (staffing gap) vs. high volume and moderate latency (scaling problem)

### 7.5 Chart 3 — D3 Chord/Matrix: Role Co-occurrence

**Library:** D3.js

Two acceptable renderings (implementer may choose):

**Option A — Chord diagram:** Standard D3 chord diagram where arc size = total playbook exposure for each role, and ribbon width = co-occurrence count between two roles.

**Option B — Matrix heatmap:** Symmetric grid, rows = roles, cols = roles, cell color intensity = co-occurrence count. Simpler to implement, equally informative.

Both use the same `role_pairs[]` data. Color scale: `d3.interpolateBlues` (or amber-to-red for emphasis).

Label each role name on the arc/axis. Tooltip on hover: "role_a + role_b appear together in N playbooks."

### 7.6 MCP Tool Gating Table

Plain HTML table (Tailwind `table-auto w-full`):

| Tool Name            | Playbook Count | Required Roles          |
| -------------------- | -------------- | ----------------------- |
| `grr_rapid_response` | 198            | `soc-tier-2`, `ir-lead` |
| `crowdstrike_rtr`    | 143            | `soc-tier-2`            |
| `gao_agent`          | 67             | `ir-lead`, `ciso`       |

Sort by playbook count descending. Each role rendered as a pill badge (`bg-amber-900 text-amber-200 rounded-full px-2 py-0.5 text-xs`).

### 7.7 Accessibility and Responsive Behavior

- All charts have `aria-label` on their `<canvas>` or `<svg>` elements
- Table has `<th scope="col">` headers
- Minimum viewport: 1024px (SOC dashboard assumption); no mobile breakpoint required
- No animation (reduced-motion safe by default — static render)

---

## 8. Non-Goals

- This dashboard does not replace `analytics.html`; it complements it
- No live data binding — all data is baked at generation time
- No user filtering or drill-down in v1 (can be added in v2)
- Chord diagram does not need to be interactive in v1 (static SVG acceptable)

---

## 9. Success Criteria

1. `src/scripts/generate_hitl_composition.py` runs without error against the full playbook corpus
2. `analytics/hitl_composition_data.json` is valid JSON and matches the schema above
3. `docs/hitl_composition.html` opens in a browser without console errors
4. All four visualizations render with visible data
5. The top bottleneck role is clearly identifiable without reading tooltips
6. Gate latencies are deterministic

---

## 10. Related Dashboards

| Dashboard           | File                    | Relationship                                                                     |
| ------------------- | ----------------------- | -------------------------------------------------------------------------------- |
| #6 Analytics        | `analytics.html`        | Provides avg HITL latency by domain×gate type; this dashboard decomposes by role |
| #1 Dashboard        | `index.html`            | Project health overview                                                          |
| #8 Chain of Custody | `chain_of_custody.html` | Forensic closeout completeness; orthogonal dimension                             |
