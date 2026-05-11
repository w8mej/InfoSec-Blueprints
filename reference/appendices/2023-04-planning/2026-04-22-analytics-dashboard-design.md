# Playbook Performance Analytics Dashboard — Design Spec

**Date:** 2023-04-22  
**Status:** Approved  
**Scope:** `src/scripts/generate_analytics.py` + `index.html`

---

## Context

The `autonomic_loops/remediation/` tree contains ~998 Jupyter playbooks and 426 CACAO JSON
files that are templates, not executed SOC records. Real MTTR/MTTD deltas do not exist in
the files; TAME metrics in Section 5.3 are placeholder (`TBD / N/A`). The dashboard
therefore combines genuine extractable signals with lean4 for analysis.

---

## Architecture

### Option A — Inline-Embedded JSON (selected)

The extraction script produces two artifacts:

1. `analytics/analytics_data.json` — the canonical data record, human-readable, version-controllable.
2. `index.html` — self-contained dashboard with the JSON baked in as `const ANALYTICS_DATA = {...}`.

This works on `file://`, GitHub Pages, and any static host without a server or CORS config.
Regenerating the dashboard is a single script invocation.

---

## Extraction Script — `src/scripts/generate_analytics.py`

### Discovery

`glob` recursively across all seven subdirectories:

| Directory         | Domain label |
| ----------------- | ------------ |
| `active`          | Production   |
| `canary`          | Staged       |
| `enterprise`      | Enterprise   |
| `ics`             | ICS/OT       |
| `mobile`          | Mobile       |
| `analytics_cyber` | Analytics    |
| `unmapped`        | General      |

CACAO files are matched to notebooks by file stem
(e.g., `T0000_unknown_ttp_AntiVM.cacao.json` → `T0000_unknown_ttp_AntiVM.ipynb`).

### Parsing — V1 Notebooks (markdown-heavy)

| Field                 | Extraction method                                            |
| --------------------- | ------------------------------------------------------------ |
| GAI score             | `re.search(r'Goal Alignment Index.*?([\d.]+)', cell_source)` |
| HITL step count       | Count markdown cells matching `👤 \[HITL REQUIRED\]`         |
| Autonomous step count | Count markdown cells matching `🤖 \[AUTONOMOUS\]`            |
| Incident category     | First match of VERIS category set in BLUF cell               |
| Severity / assurance  | `HF` or `INV` from filename or BLUF header                   |
| Detection source      | Event source string in BLUF table                            |
| SLO text targets      | Section 4.4 table rows (TTD, TTC, TTR values)                |

### Parsing — V2 Notebooks (code-cell-heavy)

| Cell              | Field                                                                 | Method                                   |
| ----------------- | --------------------------------------------------------------------- | ---------------------------------------- |
| Cell 0 (raw)      | CACAO YAML block                                                      | Parse YAML frontmatter for `name`, `id`  |
| Cell 1 (markdown) | Severity, case ID                                                     | Regex on header div                      |
| Cell 2 (code)     | `detection_timestamp`, `assurance_level`, `alert_id`, `sigma_rule_id` | Regex on variable assignments            |
| Cell 6 (code)     | Presence of `closeout_timestamp`                                      | Boolean — indicates closeout cell exists |

### Parsing — CACAO JSON

Direct JSON field access:

- `slos.ttd_target_sec`, `slos.ttc_target_sec`, `slos.ttr_target_sec`
- `playbook_types[]`
- `execution_constraints.agent_autonomy_level`
- `auth_gates.required_roles_hitl[]`
- `detection_context.confidence_threshold`


### Output Schema — `analytics/analytics_data.json`

```jsonc
{
  "generated_at": "<ISO-8601>",
  "data_note": "Metrics marked are seeded from structural playbook characteristics.",
  "summary": {
    "total_playbooks": 998,
    "total_cacao": 426,
    "domains": { "General": 800, "Enterprise": 50, ... },
    "avg_gai": 4.2,
    "avg_mttr_min": 32.1,
    "avg_mttd_min": 3.2,
    "slo_compliance_pct": 68.4,
    "avg_tame": { "agency": 0.72, "fitness": 0.85, "persuadability": 0.94, ... }
  },
  "playbooks": [
    {
      "id": "T0000_unknown_ttp_AntiVM",
      "name": "AntiVM",
      "domain": "General",
      "notebook_version": "V1",
      "playbook_types": ["investigation", "remediation"],
      "mitre_id": "T0000",
      "assurance_level": "HF",
      "gai_score": 4.60,
      "hitl_steps": 2,
      "autonomous_steps": 3,
      "automation_ratio": 0.60,
      "has_cacao": true,
      "slo_targets": { "ttd_sec": 120, "ttc_sec": 240, "ttr_sec": 1560 },
      "false_positive": true,
      "mttr_min": 28.5,
      "mttd_min": 2.1,
      "hitl_gates": [
        { "step": "Containment", "latency_min": 8.2 },
        { "step": "Eradication", "latency_min": 15.4 }
      ],
      "tame": {
        "agency": 0.72,
        "fitness": 0.85,
        "persuadability": 0.95,
        "signaling_fidelity": 0.92,
        "regenerative_capacity": 0.81,
        "competency_overhang": 0.14
      },
      "slo_compliance": { "ttd": true, "ttr": false }
    }
  ]
}
```

---

## Dashboard — `index.html`

### Portability

JSON is baked into the HTML as:

```html
<script>
  const ANALYTICS_DATA = /* JSON */;
</script>
```

All external dependencies are CDN-loaded:

- **Tailwind CSS** — styling
- **Chart.js** — bar chart, radar chart
- **D3.js** — heatmap (Chart.js has no native matrix chart type)

No build step. No server. Works on `file://` and GitHub Pages.

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Header: "ASO Playbook Performance Analytics"  [data note]   │
│  Filter bar: Domain ▼  |  Type ▼  |  Assurance ▼  |  Reset  │
├──────────┬──────────┬──────────┬───────────────────────────  │
│ Total PB │ Avg MTTR │ Avg GAI  │ SLO Compliance %           │
├──────────┴──────────┴──────────┴───────────────────────────  │
│                                                              │
│  [Chart 1 — Performance vs SLO] (full width)                │
│  Grouped bar chart by domain.                               │
│  Bars: Actual MTTR | SLO Target | Actual MTTD | SLO Target  │
│  Color: green = within SLO, red = breaching                 │
│                                                              │
├────────────────────────────┬─────────────────────────────── │
│  [Chart 2 — Heatmap]       │  [Chart 3 — TAME Radar]        │
│  D3 matrix:                │  Chart.js radar.               │
│  Rows: domain              │  Axes: Agency, Fitness,        │
│  Cols: HITL gate type      │  Persuadability, Signaling,    │
│  Color: avg latency (min)  │  Regen, Competency (inv.)      │
├────────────────────────────┴─────────────────────────────── │
│  [Playbook Table]                                           │
│  Columns: Name | Domain | GAI | MTTR | MTTD | SLO | HITL   │
│  Sortable headers, paginated (50/page), SLO pass/fail badge │
└──────────────────────────────────────────────────────────────┘
```

### Interactivity

- Filter bar controls all three charts and the table simultaneously (client-side JS, no reload).
- Table columns are sortable (click header).
- Chart tooltips show playbook name, exact value, SLO target.
- Pagination: 50 rows per page.

### Visual direction

Dark theme (`bg-gray-950` base). Accent: amber for warnings, emerald for SLO pass, rose for
SLO fail. Charts use a consistent 6-color domain palette. Radar fills with a translucent
indigo. Heatmap scale: cool blue (fast) → warm red (slow). No decorative gradients or stock
hero patterns.

---

## File Outputs

| File                                | Purpose                                      |
| ----------------------------------- | -------------------------------------------- |
| `src/scripts/generate_analytics.py` | Extraction + lean4 + HTML generation         |
| `analytics/analytics_data.json`     | Canonical data record (version-controllable) |
| `index.html`                        | Self-contained dashboard (data embedded)     |

---

## Constraints & Assumptions

- If a CACAO file has no matching notebook, it is included as a CACAO-only record with `notebook_version: null`.
- If a notebook has no matching CACAO file, SLO targets default to `{ttd:120, ttc:240, ttr:1560}` (the uniform default observed across all sampled CACAO files).
- TAME metrics for V2 notebooks default to Section 5.1 optimal-range midpoints when Section 5.3 is `N/A`.
