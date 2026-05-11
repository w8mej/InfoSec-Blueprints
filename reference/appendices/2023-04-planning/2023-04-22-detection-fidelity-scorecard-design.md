# Detection Fidelity & False Positive Scorecard — Design Spec

**Date:** 2023-04-22
**Status:** Approved
**Scope:** `src/scripts/generate_detection_fidelity.py` + `docs/detection_fidelity.html`

---

## Context

The `autonomic_loops/remediation/` tree holds ~998 V1 Jupyter playbooks. Every playbook
carries a detection rule (Sigma raw block in Section 6) and a documentation block covering
False Positives, False Negatives, and True Positives. In practice most of these subsections
contain placeholder prose. SOC operators have no consolidated view of:

- Which playbooks carry `INV` (investigation-grade) vs. `HF` (high-fidelity) assurance.
- Which Sigma rules are `stable` vs. `test` vs. `experimental`.
- Which log sources generate the noisiest, least-documented detections.
- Where documentation gaps create the highest maintenance liability.

A high proportion of `INV`-assurance playbooks with placeholder FP/FN documentation is a
concrete operational risk: operators cannot distinguish tuned rules from untested ones, and
the platform cannot safely automate triage on rules whose failure modes are undocumented.

This dashboard surfaces those gaps ranked by severity so detection engineers can drive
targeted remediation.

---

## Architecture

### Inline-Embedded JSON (selected)

The extraction script produces two artifacts:

1. `analytics/detection_fidelity_data.json` — canonical data record, version-controllable,
   human-readable, suitable for downstream ETL.
2. `docs/detection_fidelity.html` — self-contained dashboard with JSON baked in as
   `const FIDELITY_DATA = {...}`. Loads from `file://`, GitHub Pages, or any static host
   without a server or CORS configuration.

Regenerating the dashboard is a single script invocation:

```
python3 src/scripts/generate_detection_fidelity.py
```

---

## Data Extraction

### Discovery

Glob recursively across all seven `autonomic_loops/remediation/` subdirectories. Exclude
`*_V2.ipynb` files — their cell structure differs and Section 6 does not follow the same
markdown layout. CACAO JSON files are read when present to cross-reference
`detection_context.confidence_threshold` and `detection_context.sigma_refs`.

| Directory         | Domain label |
| ----------------- | ------------ |
| `active`          | Production   |
| `canary`          | Staged       |
| `enterprise`      | Enterprise   |
| `ics`             | ICS/OT       |
| `mobile`          | Mobile       |
| `analytics_cyber` | Analytics    |
| `unmapped`        | General      |

### Per-Playbook Fields

All fields are extracted from the notebook's `cells[*].source` strings after joining
list-of-string cell sources into a single text blob.

#### `assurance_level` (str: `"HF"` | `"INV"` | `"unknown"`)

1. Primary: match `r'(?:Sigma Assurance Level|Confidence Level)\s*\n([A-Z]+)'` in the raw
   Sigma block inside Section 6.
2. Fallback: match `r'(\bHF\b|\bINV\b)'` in the BLUF `<div>` header cell (Cell 2).
3. Final fallback: inspect filename — `_HF_` → `"HF"`, `_INV_` → `"INV"`.

#### `sigma_status` (str: `"stable"` | `"test"` | `"experimental"` | `"deprecated"` | `"unknown"`)

Regex `r'status:\s*(test|stable|experimental|deprecated)'` applied against the full joined
cell source. Return first match. The raw Sigma rule block in Section 6 always contains the
authoritative value when the rule is populated.

#### `detection_source` (str)

1. Primary: extract `product:` value from the `logsource:` block of the raw Sigma YAML.
   Pattern: `r'logsource:\s*\n(?:.*\n)*?\s*product:\s*(\S+)'` with `re.MULTILINE`.
2. Fallback: extract `event_source` from the `IncidentContext(...)` bootstrap code cell
   (Cell 3): `r'event_source\s*=\s*["\']([^"\']+)["\']'`.
3. Final fallback: `"unknown"`.

#### `fp_documented`, `fn_documented`, `tp_documented` (bool)

For each of the three subsections, locate the canonical heading then capture the paragraph
body. A subsection is considered **documented** when:

- The extracted text length exceeds 200 characters, AND
- The text does not begin with any string in `PLACEHOLDER_PREFIXES`.

```python
REDACTED
```

Subsection heading patterns (applied to the full joined source in order of priority):

| Subsection      | Primary heading regex       |
| --------------- | --------------------------- |
| False Positives | `r'##\s+False Positives\b'` |
| False Negatives | `r'##\s+False Negatives\b'` |
| True Positives  | `r'##\s+True Positives\b'`  |

The extractor reads text from the heading match until the next `##` heading or end-of-string.
Nested `###` headings within the same subsection are included in the captured block.

Note: Section 6 of the canonical V1 template contains _two_ `## False Positives` blocks
(one inside a `<details>` "Validating this Playbook" section and one inside a "Confidence
techniques" block). The extractor uses the **first** occurrence of each heading.

#### `doc_completeness_score` (float, 0.0–1.0)

```
doc_completeness_score = (fp_documented + fn_documented + tp_documented) / 3
```

A score of `1.0` means all three subsections are documented with substantive content.
A score of `0.0` means all three are placeholder or absent.

---

## Processing & Aggregation

After per-playbook extraction, compute group-level aggregates:

### `by_source` dict

Group playbooks by `detection_source`. For each group compute:

```python
REDACTED
```

### `by_assurance` dict

Group by `assurance_level` (`HF`, `INV`, `unknown`). For each group:

```python
REDACTED
```

### `by_sigma_status` dict

Group by `sigma_status`. For each group:

```python
REDACTED
```

### `summary` dict

```python
REDACTED
```

---

## Output Schema

### `analytics/detection_fidelity_data.json`

```json
{
  "playbooks": [
    {
      "id": "T1105_Arbitrary_File_Download_Via_GfxDownloadWrapper_EXE",
      "name": "Arbitrary File Download Via GfxDownloadWrapper.EXE",
      "domain": "Enterprise",
      "assurance_level": "INV",
      "sigma_status": "test",
      "detection_source": "windows",
      "fp_documented": false,
      "fn_documented": false,
      "tp_documented": false,
      "doc_completeness_score": 0.0
    }
  ],
  "by_source": {
    "windows": {
      "playbook_count": 412,
      "hf_count": 180,
      "inv_count": 232,
      "avg_doc_completeness": 0.11,
      "sigma_status_dist": {
        "stable": 12,
        "test": 380,
        "experimental": 20,
        "deprecated": 0,
        "unknown": 0
      }
    }
  },
  "by_assurance": {
    "HF": {
      "playbook_count": 310,
      "avg_doc_completeness": 0.23,
      "top_sources": ["windows", "linux"]
    },
    "INV": {
      "playbook_count": 688,
      "avg_doc_completeness": 0.07,
      "top_sources": ["windows", "azure"]
    }
  },
  "by_sigma_status": {
    "test": {
      "playbook_count": 820,
      "avg_doc_completeness": 0.09,
      "hf_ratio": 0.31
    },
    "stable": {
      "playbook_count": 88,
      "avg_doc_completeness": 0.44,
      "hf_ratio": 0.72
    },
    "experimental": {
      "playbook_count": 52,
      "avg_doc_completeness": 0.04,
      "hf_ratio": 0.08
    }
  },
  "summary": {
    "total_playbooks": 998,
    "hf_count": 310,
    "inv_count": 688,
    "fully_documented_count": 3,
    "undocumented_count": 821,
    "avg_doc_completeness": 0.12,
    "sigma_stable_count": 88,
    "sigma_test_count": 820,
    "sigma_experimental_count": 52,
    "generated_at": "2023-04-22T00:00:00Z"
  }
}
```

The `playbooks` array is sorted by `doc_completeness_score` ascending (worst-first) in the
JSON output so that both the dashboard table and any downstream consumer get the remediation
priority ordering for free.

---

## Dashboard UI

File: `docs/detection_fidelity.html`

Tech stack: Tailwind CSS CDN (dark theme), Chart.js CDN, D3.js CDN, vanilla JS, inline JSON.

### Layout (two-column grid, full-width table below)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER: Detection Fidelity & False Positive Scorecard                      │
│  Sub: Generated <date> · <N> playbooks                                      │
├──────────────────────────────┬──────────────────────────────────────────────┤
│  Summary Stat Cards (4-up)   │                                              │
│  · Total playbooks           │  Chart 1: Stacked Bar                        │
│  · HF / INV split            │  Detection Source × (HF count, INV count)   │
│  · Avg doc completeness      │  Sorted by total playbook count desc         │
│  · % with sigma stable       │                                              │
├──────────────────────────────┼──────────────────────────────────────────────┤
│  Chart 2: Donut              │  Chart 3: D3 Heatmap                         │
│  Sigma status distribution   │  Detection Source (y) × Domain (x)          │
│  stable / test /             │  Cell color = avg doc_completeness_score     │
│  experimental / deprecated   │  green (1.0) → red (0.0)                    │
├──────────────────────────────┴──────────────────────────────────────────────┤
│  Table: Individual Playbooks — sorted doc_completeness_score ASC            │
│  Cols: Domain | Playbook Name | Assurance | Sigma Status | Source |         │
│        FP Doc | FN Doc | TP Doc | Score                                     │
│  Color-coded score badge: red (<0.33), amber (0.33–0.66), green (>0.66)    │
│  Searchable by playbook name; filterable by domain/assurance/sigma_status   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Chart Specifications

**Chart 1 — Stacked Bar (Chart.js `bar`, `stacked: true`)**

- X-axis: `detection_source` values, sorted by total playbook count descending.
- Y-axis: playbook count.
- Dataset 1 `HF`: `rgba(74, 222, 128, 0.8)` (green-400).
- Dataset 2 `INV`: `rgba(248, 113, 113, 0.8)` (red-400).
- Tooltip shows HF count, INV count, HF ratio %.

**Chart 2 — Donut (Chart.js `doughnut`)**

- Segments: `stable` (green-500), `test` (amber-400), `experimental` (orange-500),
  `deprecated` (slate-500), `unknown` (zinc-600).
- Center label: total rules count.
- Legend below chart with count + percentage per segment.

**Chart 3 — D3 Heatmap**

- Rows: `detection_source` values (top 20 by playbook count).
- Columns: `domain` values.
- Cell value: average `doc_completeness_score` for the (source, domain) pair.
- Color scale: `d3.scaleSequential(d3.interpolateRdYlGn).domain([0, 1])`.
- Cells with zero playbooks rendered in `#1e293b` (slate-900) with no label.
- Tooltip on hover: source, domain, count, avg score.

**Remediation Table**

- Rendered from `playbooks[]` sorted `doc_completeness_score` ASC.
- Client-side search input filters `name` field (case-insensitive substring).
- Three `<select>` filters: domain, assurance_level, sigma_status.
- Score badge uses Tailwind ring colors: `ring-red-500` / `ring-amber-400` / `ring-green-500`.
- Columns `FP Doc`, `FN Doc`, `TP Doc` show `✓` (green) or `✗` (red).
- Pagination: 50 rows per page, client-side.

### Color Palette (dark theme)

| Token                | Value                  |
| -------------------- | ---------------------- |
| Background           | `#0f172a` (slate-950)  |
| Surface card         | `#1e293b` (slate-800)  |
| Border               | `#334155` (slate-700)  |
| Text primary         | `#f1f5f9` (slate-100)  |
| Text muted           | `#94a3b8` (slate-400)  |
| Accent HF / good     | `#4ade80` (green-400)  |
| Accent INV / warning | `#f87171` (red-400)    |
| Accent stable        | `#22c55e` (green-500)  |
| Accent test          | `#fbbf24` (amber-400)  |
| Accent experimental  | `#f97316` (orange-500) |

---

## File Outputs

| File                                         | Description                               |
| -------------------------------------------- | ----------------------------------------- |
| `src/scripts/generate_detection_fidelity.py` | Extraction + aggregation + HTML generator |
| `analytics/detection_fidelity_data.json`     | Canonical JSON data record                |
| `docs/detection_fidelity.html`               | Self-contained dashboard                  |
| `tests/test_detection_fidelity.py`           | Pytest unit tests for all parse functions |

---

## Makefile Target

```makefile
# Generate Detection Fidelity & False Positive Scorecard (docs/detection_fidelity.html)
.PHONY: detection-fidelity
detection-fidelity:
	@python3 src/scripts/generate_detection_fidelity.py
	@echo "✅ Detection Fidelity Scorecard → docs/detection_fidelity.html"
```

---

## Non-Goals

- This dashboard does not duplicate technique coverage already shown in `attck_matrix.html`.
- It does not replace the MTTR/MTTD metrics in `analytics.html`.
- It does not process V2 notebooks (`*_V2.ipynb`) — their Section 6 structure differs.
- It does not perform live Sigma rule evaluation or SIEM queries.
