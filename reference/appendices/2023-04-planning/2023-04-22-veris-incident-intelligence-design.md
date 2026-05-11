# VERIS Incident Category Intelligence Dashboard — Design Spec

**Dashboard Number:** 5
**Output file:** `docs/veris_intelligence.html`
**Generator script:** `src/scripts/generate_veris_intelligence.py`
**Makefile target:** `veris-intelligence`
**Data artifact:** `analytics/veris_data.json`
**Date:** 2023-04-22
**Status:** Design / Pre-implementation

---

## 1. Context and Motivation

The SentinelMesh playbook corpus uses an extended VERIS (Vocabulary for Event Recording and Incident Sharing) taxonomy that goes substantially beyond the standard VERIS 1.3.7 categories. The project has introduced AI/ML-specific incident categories (AGENT_DRIFT, PROMPT_INJECTION, MODEL_EVASION, DATA_POISONING, SHADOW_AI, ORCHESTRATION_ERROR, IAM_ANOMALY, EXPOSURE_ANOMALY, AI_GENERATED_LURE) and space/orbital categories (ORBITAL_ENVIRONMENTAL, RF_INTERFERENCE, C2_HIJACKING, SIGNAL_SPOOFING, GROUND_STATION_PIVOT, EDGE_COMPUTE_EXHAUSTION, PAYLOAD_COMPROMISE, ORBITAL_KINETIC) that are not tracked in any existing dashboard.

**Gap addressed:** No current dashboard shows:

- The distribution of incident categories across the corpus
- How response characteristics (MTTR, autonomy ratio, HITL burden) differ across categories
- Whether AI/ML and orbital threat categories receive proportionally adequate playbook coverage
- Which categories are "fast and automated" versus "slow and human-intensive"

**Audience:** SOC leadership, red team leads, and threat intelligence consumers who need to understand where the autonomous response capability is strong, where it is deficient, and how the AI/ML threat surface is staffed relative to traditional cyber categories.

---

## 2. Existing Dashboard Inventory (Do Not Duplicate)

| File                     | Content                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| `docs/analytics.html`    | MTTR/MTTD, TAME scores, SLO compliance, HITL latency — per-playbook |
| `docs/attck_matrix.html` | MITRE ATT&CK technique heatmap                                      |
| `docs/actor_cards.html`  | Threat actor intelligence cards                                     |
| `docs/cve_radar.html`    | CVE/zero-day exposure radar                                         |
| `docs/web/index.html`    | Project health dashboard                                            |
| `docs/index.html`        | Project landing page                                                |

This dashboard does **not** duplicate any MTTR/MTTD per-playbook detail from `analytics.html`. It aggregates by VERIS category and super-group, offering a strategic threat-landscape view.

---

## 3. Architecture Overview

```
autonomic_loops/remediation/{domain}/
    *.ipynb  →  _parse_notebook_veris()  ─┐
    *.cacao.json  →  _parse_cacao()      ─┤→ build_records() → build_category_aggregates()
                                           ↓
                               analytics/veris_data.json  (inline JSON)
                                           ↓
                               src/scripts/generate_veris_intelligence.py
                                           ↓
                               docs/veris_intelligence.html
```

All JSON is embedded inline in the HTML (no CDN data fetch at runtime). Charts render entirely client-side using Chart.js and D3.js from CDN. The dark Tailwind theme matches the existing dashboard family.

---

## 4. VERIS Taxonomy Extension

### 4.1 Canonical Category List (30 categories)

```python
REDACTED
```

### 4.2 Super-Group Map

Categories are organized into five super-groups for the sunburst/treemap visualization. A category may appear in more than one super-group (dual-tag) for display purposes; the primary assignment drives the treemap hierarchy.

| Super-Group           | Primary Members                                                                                                                                           | Notes                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Traditional Cyber** | HOT_THREAT, TREND, TARGET, MALWARE, HACKING, SOCIAL, MISUSE, POLICY, PHYSICAL, ERROR, ENVIRONMENTAL                                                       | Standard VERIS A4 classification                                        |
| **AI/ML Threats**     | SHADOW_AI, PROMPT_INJECTION, DATA_POISONING, MODEL_EVASION, AI_GENERATED_LURE, AGENT_DRIFT, IAM_ANOMALY, EXPOSURE_ANOMALY, ORCHESTRATION_ERROR            | Extended taxonomy; IAM_ANOMALY dual-tagged with Identity                |
| **Space/Orbital**     | ORBITAL_ENVIRONMENTAL, RF_INTERFERENCE, C2_HIJACKING, SIGNAL_SPOOFING, GROUND_STATION_PIVOT, EDGE_COMPUTE_EXHAUSTION, PAYLOAD_COMPROMISE, ORBITAL_KINETIC | Novel domain                                                            |
| **Identity**          | IAM_ANOMALY, EXPOSURE_ANOMALY                                                                                                                             | Dual-tagged from AI/ML group; standalone grouping for IAM-focused views |
| **Operational**       | POLICY, MISUSE, ERROR                                                                                                                                     | Dual-tagged from Traditional Cyber; process-failure playbooks           |

```python
REDACTED
```

---

## 5. Data Extraction

### 5.1 Domain Map (inherited from generate_analytics.py)

```python
REDACTED
```

### 5.2 V1 Notebook Extraction

The BLUF cell is the **first markdown cell** of a V1 notebook (cell type `"markdown"`, containing the heading with the incident ID or an `<!-- -->` HTML comment with metadata).

```python
REDACTED
```

**Extraction targets from BLUF cell:**

| Field             | Source                                         | Default     |
| ----------------- | ---------------------------------------------- | ----------- |
| `veris_category`  | First `VERIS_CATEGORY_RE` match in BLUF source | `"UNKNOWN"` |
| `gai_score`       | First `GAI_RE` capture group, cast to float    | `None`      |
| `assurance_level` | First `ASSURANCE_RE` match                     | `"HF"`      |

**Extraction targets from all cells (step counting):**

| Field              | Source                                               | Method                                                  |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------- |
| `hitl_steps`       | Count of cells/lines matching `🤖 \[AUTONOMOUS\]`    | `len(re.findall(r'🤖 \[AUTONOMOUS\]', full_source))`    |
| `autonomous_steps` | Count of cells/lines matching `👤 \[HITL REQUIRED\]` | `len(re.findall(r'👤 \[HITL REQUIRED\]', full_source))` |

> **Note:** Variable name alignment — `hitl_steps` is the count of HITL-gated steps; `autonomous_steps` is the count of fully-autonomous steps. This matches the naming used in `generate_analytics.py` PlaybookRecord.

### 5.3 CACAO Extraction

```python
REDACTED
```

---

REDACTED

---

## 7. Processing Pipeline

```
build_records()
  └─ for each domain subdirectory:
       for each *.ipynb file:
         parse BLUF → veris_category, gai_score, assurance_level
         count step markers → hitl_steps, autonomous_steps
         resolve CACAO file → ttr_target_sec, agent_autonomy_level
         compute automation_ratio
         simulate_mttr()
         emit PlaybookVERISRecord

build_category_aggregates(records)
  └─ group by veris_category
       compute: count, avg_mttr, avg_gai, avg_hitl_ratio, avg_autonomous_ratio
       compute: domain distribution dict {domain: count}
       map category → supergroup

build_supergroup_aggregates(category_aggs)
  └─ group category_aggs by supergroup
       compute: total_count, avg_mttr, avg_gai, avg_hitl_ratio, avg_autonomous_ratio

build_summary(records, category_aggs, supergroup_aggs)
  └─ total_playbooks, categories_observed, supergroups, top_category, most_autonomous_category
```

---

## 8. Output JSON Schema

**File:** `analytics/veris_data.json`

```jsonc
{
  "generated_at": "2023-04-22T...",
  "total_playbooks": 998,
  "categories": [
    {
      "name": "HOT_THREAT",
      "supergroup": "Traditional Cyber",
      "dual_tags": [],
      "count": 142,
      "avg_mttr": 18.4,
      "avg_gai": 3.71,
      "hitl_ratio": 0.31,
      "autonomous_ratio": 0.69,
      "domains": {
        "Enterprise IT": 88,
        "Canary / Honeypot": 32,
        "ICS / OT": 22,
      },
    },
    // ... one entry per observed category
  ],
  "supergroups": [
    {
      "name": "Traditional Cyber",
      "count": 620,
      "avg_mttr": 17.2,
      "avg_gai": 3.55,
      "hitl_ratio": 0.28,
      "autonomous_ratio": 0.72,
      "category_names": ["HOT_THREAT", "TREND", "TARGET", "..."],
    },
    // ...
  ],
  "summary": {
    "total_playbooks": 998,
    "categories_observed": 22,
    "fastest_category": "HOT_THREAT",
    "slowest_category": "ORBITAL_KINETIC",
    "most_autonomous_category": "MALWARE",
    "highest_hitl_category": "ORBITAL_KINETIC",
    "best_gai_category": "PROMPT_INJECTION",
    "ai_ml_coverage_pct": 18.4,
    "orbital_coverage_pct": 3.2,
  },
}
```

---

## 9. Dashboard UI Specification

### 9.1 Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Header: "VERIS Incident Category Intelligence"                  │
│  Subtitle + generation timestamp + disclaimer                    │
├─────────────────────┬───────────────────────────────────────────┤
│  Super-Group        │  Category Radar (Chart.js)                │
│  Treemap/Sunburst   │  5 axes: MTTR, GAI, Autonomous%,          │
│  (D3.js)            │  HITL%, Coverage                          │
│  Click to drill     │  One dataset per supergroup               │
├─────────────────────┴───────────────────────────────────────────┤
│  Top-15 Categories — Horizontal Bar (Chart.js)                  │
│  X = playbook count   Color = autonomous_ratio gradient          │
├─────────────────────────────────────────────────────────────────┤
│  Category Detail Table (sortable)                               │
│  Cols: Category | Super-Group | Count | Avg MTTR | Avg GAI |   │
│        HITL% | Auto% | Top Domain                               │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Visualization Details

#### 9.2.1 D3 Treemap

- **Hierarchy:** root → supergroup → category
- **Node size:** proportional to `count`
- **Node color:** continuous scale on `avg_mttr` — cool blue (#3b82f6) = fast (< 10 min), warm orange (#f97316) = medium, hot red (#ef4444) = slow (> 40 min)
- **Interaction:** hover tooltip showing category, count, avg_mttr, avg_gai; click to filter the table
- **Labels:** supergroup labels in bold, category labels in smaller weight; elide labels on nodes < 30px wide

#### 9.2.2 Radar Chart (Chart.js)

- **Axes (5):** Avg MTTR (inverted: higher = worse), Avg GAI, Autonomous Ratio, HITL Ratio (inverted), Coverage %
- **Normalization:** each axis min-max normalized across all supergroups to [0, 1]
- **Datasets:** one per super-group, semi-transparent fill
- **Colors:** Traditional Cyber (#3b82f6), AI/ML Threats (#a855f7), Space/Orbital (#06b6d4), Identity (#f59e0b), Operational (#10b981)
- **Legend:** positioned bottom-center

#### 9.2.3 Horizontal Bar — Top 15 Categories

- **Y axis:** category name (sorted descending by count)
- **X axis:** playbook count
- **Bar color:** continuous gradient from `autonomous_ratio` — red (#ef4444) at 0.0 to green (#10b981) at 1.0
- **Bar label:** count value rendered at right end of bar
- **Tooltip:** category name, count, avg_mttr, autonomous_ratio

#### 9.2.4 Category Detail Table

- **Columns:** Category, Super-Group, Count, Avg MTTR (min), Avg GAI, HITL %, Auto %, Top Domain
- **Sorting:** all columns, client-side
- **Row coloring:** supergroup color badge in Super-Group column
- **Filtering:** text search input above table filtering category name
- **Pagination:** 20 rows per page

### 9.3 Summary Stats Bar

Four stat cards above the treemap:

| Card                | Value                           | Description                                  |
| ------------------- | ------------------------------- | -------------------------------------------- |
| Total Playbooks     | `summary.total_playbooks`       | Corpus size                                  |
| Categories Observed | `summary.categories_observed`   | Distinct VERIS categories found              |
| AI/ML Coverage      | `summary.ai_ml_coverage_pct`%   | % of corpus addressing AI/ML threats         |
| Orbital Coverage    | `summary.orbital_coverage_pct`% | % of corpus addressing space/orbital threats |

### 9.4 Theme and Styling

- Background: `#0f172a` (Tailwind `slate-900`)
- Card surfaces: `#1e293b` (Tailwind `slate-800`)
- Border: `#334155` (Tailwind `slate-700`)
- Primary text: `#f1f5f9` (Tailwind `slate-100`)
- Muted text: `#94a3b8` (Tailwind `slate-400`)
- Chart grid lines: `rgba(148,163,184,0.15)`
- Accent colors: supergroup palette defined in §9.2.2
- Font: system-ui stack (no external font CDN required)
- Tailwind CSS: `https://cdn.tailwindcss.com`
- Chart.js: `https://cdn.jsdelivr.net/npm/chart.js@4`
- D3.js: `https://cdn.jsdelivr.net/npm/d3@7`

---

## 10. Data Disclaimer

All MTTR values are pulled from structural notebook metadata (step counts, CACAO SLO targets, domain classification). e,g matching the pattern used in `analytics.html`.

---

## 11. File Outputs

| Path                                         | Description                     |
| -------------------------------------------- | ------------------------------- |
| `src/scripts/generate_veris_intelligence.py` | Generator script                |
| `analytics/veris_data.json`                  | Intermediate data artifact      |
| `docs/veris_intelligence.html`               | Dashboard HTML (self-contained) |
| `tests/test_veris_intelligence.py`           | pytest test suite               |

---

## 12. Makefile Integration

```makefile
# Generate VERIS Incident Category Intelligence Dashboard (docs/veris_intelligence.html)
veris-intelligence:
	@echo "🧬 [ASO] Generating VERIS incident category intelligence dashboard..."
	@python3 src/scripts/generate_veris_intelligence.py

.PHONY: ... veris-intelligence
```

Add `veris-intelligence` to the `docs` phony target and include it in the `help` block.

---

## 13. Open Questions / Risks

| Item                            | Risk                                                        | Mitigation                                                                                        |
| ------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| VERIS category sparsity in BLUF | Many playbooks may resolve to `UNKNOWN`                     | Fallback: also scan notebook title/filename for category tokens                                   |
| GAI score availability          | GAI is not present in all V1 notebooks                      | Treat `null` gracefully; show "N/A" in table; exclude from radar avg                              |
| Dual-tag display                | IAM_ANOMALY appears in both AI/ML and Identity super-groups | Primary supergroup drives treemap placement; dual_tags list drives radar multi-dataset membership |
| CACAO template defaults         | Many CACAO files use identical default SLO values           | 
