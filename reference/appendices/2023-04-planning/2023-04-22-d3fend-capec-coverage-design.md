# D3FEND Countermeasure & CAPEC Attack Pattern Coverage — Design Spec

**Date:** 2023-04-22
**Status:** Approved
**Scope:** `src/scripts/generate_d3fend_capec.py` + `docs/d3fend_capec.html`

---

## Context

The existing `attck_matrix.html` dashboard visualizes which MITRE ATT&CK techniques the
playbook corpus covers. That view answers "what do attackers do?" but leaves two
complementary questions completely unanswered:

- **D3FEND** — what defensive countermeasures does each playbook implement? Which
  defensive capability categories (Harden, Detect, Isolate, Deceive, Evict, Restore) are
  well-represented vs. missing?
- **CAPEC** — which attack pattern classes (gather information, abuse functionality,
  inject, etc.) does the corpus detect? Where are the blind spots?

Both framework identifiers are embedded as prose or inline references in Section 6 of every
V1 notebook, but the corpus has never been mined for them. Without aggregation, the SOC
cannot measure defensive depth per domain, identify coverage gaps at the attack-pattern
level, or communicate defensive posture in D3FEND terms to stakeholders who use that
vocabulary.

This dashboard closes that blind spot by extracting, categorizing, and cross-referencing
D3FEND and CAPEC identifiers across the full V1 corpus, then presenting the coverage
picture in three complementary views.

---

## Architecture

### Inline-Embedded JSON (selected)

The extraction script produces two artifacts:

1. `analytics/d3fend_capec_data.json` — canonical data record, version-controllable.
2. `docs/d3fend_capec.html` — self-contained dashboard with JSON baked in as
   `const D3FEND_CAPEC_DATA = {...}`. Operates from `file://`, GitHub Pages, or any
   static host without a server or CORS configuration.

Regenerating is a single invocation:

```
python3 src/scripts/generate_d3fend_capec.py
```

---

## Data Extraction

### Discovery

Glob recursively across all seven `autonomic_loops/remediation/` subdirectories, targeting
V1 notebooks only (exclude `*_V2.ipynb`). For each notebook, join all cell sources into a
single text blob and apply the extraction patterns below.

| Directory         | Domain label |
| ----------------- | ------------ |
| `active`          | Production   |
| `canary`          | Staged       |
| `enterprise`      | Enterprise   |
| `ics`             | ICS/OT       |
| `mobile`          | Mobile       |
| `analytics_cyber` | Analytics    |
| `unmapped`        | General      |

### D3FEND Identifier Extraction

Pattern: `r'\bD3-[A-Z]{2,6}\b'`

Applied to the full joined cell source. All matches are collected and deduplicated per
playbook. The Section 6 `### D3F3ND` block is the canonical location, but the regex is
intentionally applied corpus-wide to catch inline references in other sections.

**Current corpus state:** Most V1 notebooks contain the D3FEND subsection as a placeholder
("Populate with applicable MITRE D3FEND countermeasure mappings…") with no actual IDs. The
regex therefore returns an empty list for the majority of playbooks. Aggregate counts
reflect genuine annotation coverage, not a synthetic estimate.

### CAPEC Identifier Extraction

Pattern: `r'\bCAPEC-(\d+)\b'`

Applied to the full joined cell source. All numeric IDs are collected and deduplicated per
playbook. The Section 6 `### CAPEC` block is canonical, but the pattern is applied globally.

### ATT&CK Technique Co-Reference

For cross-referencing, also extract ATT&CK technique IDs per playbook using the existing
pattern `r'T\d{4}(?:\.\d{3})?'`. This enables the coverage-matrix view (D3FEND category ×
ATT&CK technique) without duplicating the full ATT&CK extraction logic in `attck_matrix.html`.

---

## D3FEND Category Classification

The D3FEND ontology groups techniques under six top-level functional categories. Map each
extracted ID to a category by prefix matching:

```python
REDACTED
```

Resolution order: longest prefix first (`D3-DC` before `D3-D`) to avoid ambiguity between
`Detect` and `Deceive`. IDs that match no prefix are classified as `"Uncategorized"`.

---

## CAPEC Class Classification

Map each extracted CAPEC numeric ID to a mechanism class by integer range:

```python
REDACTED
```

Resolution: iterate ranges in definition order; assign first matching range. IDs outside
1–9999 are classified as `"Other"`.

---

## Processing & Aggregation

### Per-D3FEND-ID record

```python
REDACTED
```

### Per-CAPEC-ID record

```python
REDACTED
```

### `coverage_matrix`

A nested dict: D3FEND category → CAPEC class → co-occurrence count.
Co-occurrence: count of playbooks that reference at least one ID from the D3FEND category
AND at least one ID from the CAPEC class.

```python
REDACTED
```

### `defense_depth_by_domain`

Per domain: `unique D3FEND IDs referenced / total playbooks in domain`.

```python
REDACTED
```

### `summary`

```python
REDACTED
```

---

## Output Schema

### `analytics/d3fend_capec_data.json`

```json
{
  "d3fend": [
    {
      "id": "D3-OTF",
      "category": "Isolate",
      "playbook_count": 4,
      "domains": ["Enterprise", "ICS/OT"]
    }
  ],
  "capec": [
    {
      "id": "CAPEC-560",
      "class": "Subvert Access",
      "playbook_count": 7
    }
  ],
  "coverage_matrix": {
    "Harden": {
      "Gather Information": 0,
      "Subvert Access": 1,
      "Abuse Functionality": 0,
      "Manipulate": 0,
      "Physical": 0,
      "Inject": 0,
      "Other": 0
    },
    "Detect": {
      "Gather Information": 3,
      "Subvert Access": 2,
      "Abuse Functionality": 1,
      "Manipulate": 1,
      "Physical": 0,
      "Inject": 2,
      "Other": 0
    },
    "Isolate": {
      "Gather Information": 0,
      "Subvert Access": 0,
      "Abuse Functionality": 0,
      "Manipulate": 0,
      "Physical": 0,
      "Inject": 0,
      "Other": 0
    },
    "Deceive": {
      "Gather Information": 1,
      "Subvert Access": 0,
      "Abuse Functionality": 0,
      "Manipulate": 0,
      "Physical": 0,
      "Inject": 0,
      "Other": 0
    },
    "Evict": {
      "Gather Information": 0,
      "Subvert Access": 0,
      "Abuse Functionality": 0,
      "Manipulate": 0,
      "Physical": 0,
      "Inject": 0,
      "Other": 0
    },
    "Restore": {
      "Gather Information": 0,
      "Subvert Access": 0,
      "Abuse Functionality": 0,
      "Manipulate": 0,
      "Physical": 0,
      "Inject": 0,
      "Other": 0
    }
  },
  "defense_depth_by_domain": {
    "Enterprise": {
      "unique_d3fend_ids": 14,
      "total_playbooks": 412,
      "depth_score": 0.034
    }
  },
  "summary": {
    "total_playbooks_scanned": 998,
    "playbooks_with_d3fend": 12,
    "playbooks_with_capec": 18,
    "unique_d3fend_ids": 9,
    "unique_capec_ids": 14,
    "top_d3fend_category": "Detect",
    "top_capec_class": "Gather Information",
    "generated_at": "2023-04-22T00:00:00Z"
  }
}
```

The `d3fend` array is sorted by `playbook_count` descending. The `capec` array is sorted
by `playbook_count` descending.

---

## Dashboard UI

File: `docs/d3fend_capec.html`

Tech stack: Tailwind CSS CDN (dark theme), Chart.js CDN, D3.js CDN, vanilla JS, inline JSON.

### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER: D3FEND Countermeasure & CAPEC Attack Pattern Coverage              │
│  Sub: Generated <date> · <N> playbooks scanned                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  Summary Stat Cards (4-up)                                                   │
│  · Playbooks with D3FEND refs | Playbooks with CAPEC refs                   │
│  · Unique D3FEND IDs | Unique CAPEC IDs                                     │
├──────────────────────────────┬──────────────────────────────────────────────┤
│  Chart 1: Horizontal Bar     │  Chart 2: Horizontal Bar                     │
│  D3FEND categories by        │  CAPEC classes by                            │
│  playbook coverage           │  playbook coverage                           │
│  (sorted desc)               │  (sorted desc)                               │
├──────────────────────────────┴──────────────────────────────────────────────┤
│  Chart 3: D3 Matrix Heatmap                                                  │
│  Rows: D3FEND categories (6)                                                 │
│  Cols: CAPEC classes (7)                                                     │
│  Cell color = co-occurrence count                                            │
│  Cells with 0 co-occurrences rendered as dark baseline, no label            │
├──────────────────────────────────────────────────────────────────────────────┤
│  Defense Depth Cards (per domain, 7-up grid)                                 │
│  Each card: domain name, depth_score gauge, unique IDs, total playbooks      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Chart Specifications

**Chart 1 — D3FEND Horizontal Bar (Chart.js `bar`, `indexAxis: 'y'`)**

- Y-axis: D3FEND category labels.
- X-axis: playbook count.
- Bar color per category:
  - Harden: `#6366f1` (indigo-500)
  - Detect: `#22d3ee` (cyan-400)
  - Isolate: `#f59e0b` (amber-500)
  - Deceive: `#a78bfa` (violet-400)
  - Evict: `#f87171` (red-400)
  - Restore: `#4ade80` (green-400)
- Tooltip: category, playbook count, top 3 specific IDs.

**Chart 2 — CAPEC Horizontal Bar (Chart.js `bar`, `indexAxis: 'y'`)**

- Y-axis: CAPEC class labels.
- X-axis: playbook count.
- Single color `#fb923c` (orange-400) across all bars.
- Tooltip: class name, playbook count, CAPEC IDs present.

**Chart 3 — D3 Matrix Heatmap**

- 6 rows (D3FEND categories) × 7 columns (CAPEC classes).
- Color scale: `d3.scaleSequential(d3.interpolateBlues).domain([0, maxCooccurrence])`.
- Zero cells: `#0f172a` (slate-950), no text.
- Non-zero cells: white text showing count.
- Row and column labels in `#94a3b8` (slate-400).
- Full SVG with explicit `width` and `height`, responsive via `viewBox`.
- Tooltip on hover: "D3FEND: {category} × CAPEC: {class} — {count} playbooks".

**Defense Depth Cards**

- 7 cards in a responsive CSS grid (`grid-cols-2 md:grid-cols-4`).
- Each card shows: domain label, `depth_score` as a percentage ring (D3 arc), unique
  D3FEND ID count, total playbook count.
- Ring fill color: `d3.scaleSequential(d3.interpolateRdYlGn).domain([0, 0.2])` — 20%
  depth is treated as "excellent" for this corpus given the sparse annotation state.
- Cards for domains with zero D3FEND references show an empty gray ring and a muted
  "No D3FEND annotations" label — making gaps visually obvious rather than hiding them.

### Color Palette (dark theme)

| Token          | Value                  |
| -------------- | ---------------------- |
| Background     | `#0f172a` (slate-950)  |
| Surface card   | `#1e293b` (slate-800)  |
| Border         | `#334155` (slate-700)  |
| Text primary   | `#f1f5f9` (slate-100)  |
| Text muted     | `#94a3b8` (slate-400)  |
| D3FEND Harden  | `#6366f1` (indigo-500) |
| D3FEND Detect  | `#22d3ee` (cyan-400)   |
| D3FEND Isolate | `#f59e0b` (amber-500)  |
| D3FEND Deceive | `#a78bfa` (violet-400) |
| D3FEND Evict   | `#f87171` (red-400)    |
| D3FEND Restore | `#4ade80` (green-400)  |
| CAPEC bars     | `#fb923c` (orange-400) |

---

## File Outputs

| File                                   | Description                               |
| -------------------------------------- | ----------------------------------------- |
| `src/scripts/generate_d3fend_capec.py` | Extraction + aggregation + HTML generator |
| `analytics/d3fend_capec_data.json`     | Canonical JSON data record                |
| `docs/d3fend_capec.html`               | Self-contained dashboard                  |
| `tests/test_d3fend_capec.py`           | Pytest unit tests for all parse functions |

---

## Makefile Target

```makefile
# Generate D3FEND Countermeasure & CAPEC Attack Pattern Coverage (docs/d3fend_capec.html)
.PHONY: d3fend-capec
d3fend-capec:
	@python3 src/scripts/generate_d3fend_capec.py
	@echo "✅ D3FEND / CAPEC Coverage → docs/d3fend_capec.html"
```

---

## Design Note: Sparse Annotation Reality

The current corpus has very few populated D3FEND and CAPEC annotations — most Section 6
blocks contain only placeholder text. The dashboard treats sparse data as a signal, not a
failure: zero coverage in a domain is displayed explicitly (empty rings, dark matrix cells)
rather than suppressed. This makes the dashboard immediately actionable as a gap-analysis
tool even before annotation campaigns begin.

---

## Non-Goals

- This dashboard does not replace or duplicate `attck_matrix.html` technique coverage.
- It does not maintain the D3FEND or CAPEC taxonomy trees locally; classification uses
  prefix and range heuristics only.
- It does not process V2 notebooks (`*_V2.ipynb`).
- It does not perform live threat-intelligence lookups.
