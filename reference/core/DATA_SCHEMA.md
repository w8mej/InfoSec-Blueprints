# Phase 2: Data Schema & Architecture

**Status:** Ready for Implementation  
**Last Updated:** May 6, 2026
**Based on User Decisions:**

- Scope: Full fleet (12 dashboards)
- Data source: `/data/*.json` (fetch at runtime)
- Tech stack: React + Babel (CDN, no build step)
- Deployment: Replace `/docs/web/index.html`
- Refresh: Poll for updates (configurable interval)
- Data: Dummy/placeholder data (no inference from existing scripts)
- Charts: Custom SVG components (keep as-is)
- Migration: Dual systems; easy future deprecation

---

## Architecture Overview

```
/docs/web/index.html                    ← React SPA entry point (replaces old)
├── /data/                         ← JSON data directory (NEW)
│   ├── dashboard.json                  ← Project Dashboard data
│   ├── performance.json                ← Performance Analytics data
│   ├── hitl.json                       ← HITL Gate Composition data
│   ├── marimo.json                     ← Marimo Coverage data
│   ├── detection.json                  ← Detection Fidelity data
│   ├── d3fend.json                     ← D3FEND & CAPEC data
│   ├── risk.json                       ← Impact & Business Risk data
│   ├── blast.json                      ← Blast Radius data
│   ├── compliance.json                 ← Compliance Matrix data
│   ├── cve.json                        ← CVE Radar data
│   ├── threat.json                     ← Threat Intelligence data
│   └── custody.json                    ← Chain of Custody data
├── /docs/js/                           ← (copy from scratchpad)
│   ├── app.jsx, pages-1.jsx, pages-2.jsx, charts.jsx, tweaks-panel.jsx
├── /docs/styles.css                    ← (copy from scratchpad)
└── /docs/index.html                    ← (keep as-is; rename current)

/scratchpad/ASO/dashboards/project/     ← Design prototype (unchanged)
└── (reference implementation, stays intact)
```

---

## JSON Data Schema

### Common Structure (All Dashboards)

```json
{
  "metadata": {
    "dashboard_id": "dashboard",
    "title": "Project Dashboard",
    "description": "Real-time Sentinel Mesh operations",
    "last_updated": "2023-04-30T12:34:56Z",
    "poll_interval_ms": 30000
  },
  "data": {
    // Dashboard-specific content
  }
}
```

### Dashboard 1: Project Dashboard (`dashboard.json`)

```json
{
  "metadata": {
    "dashboard_id": "dashboard",
    "title": "Project Dashboard",
    "description": "Real-time Sentinel Mesh operations",
    "last_updated": "2023-04-30T12:34:56Z",
    "poll_interval_ms": 30000
  },
  "data": {
    "metrics": {
      "eventsTotal": 1289473,
      "eventsOpen": 4283,
      "eventsClosed": 1285190,
      "autoResolved": 1278413,
      "hitlEscalated": 6480,
      "escalationRate": 5.04,
      "autoResolutionRate": 99.32,
      "noiseReduction": 92.7,
      "activePlaybooks": 184,
      "activeAgents": 47,
      "eventsPerSec": 312,
      "queueDepth": 24,
      "mttdSec": 38,
      "mttrMin": 7.2,
      "p95RespMin": 11.4,
      "slaCompliance": 99.61
    },
    "trends": {
      "eventsTrend": [
        { "t": 1656259200000, "v": 280 },
        { "t": 1656262800000, "v": 310 }
      ],
      "autoResTrend": [
        { "t": 1656259200000, "v": 99.1 },
        { "t": 1656262800000, "v": 99.3 }
      ],
      "queueTrend": [
        { "t": 1656259200000, "v": 30 },
        { "t": 1656262800000, "v": 28 }
      ]
    },
    "inventory": [
      {
        "label": "Playbooks Active",
        "value": 184,
        "color": "oklch(78% 0.13 220)"
      },
      { "label": "AI Agents", "value": 47, "color": "oklch(75% 0.14 290)" }
    ],
    "ranking": [
      {
        "name": "phish-triage-v4",
        "domain": "Email",
        "runs24h": 580,
        "successRate": 0.994,
        "p95Sec": 12,
        "health": 0.98,
        "severity": "low"
      }
    ],
    "eventsBySeverity": [
      { "label": "CRITICAL", "value": 38, "color": "var(--sev-critical)" },
      { "label": "HIGH", "value": 184, "color": "var(--sev-high)" }
    ],
    "eventsBySource": [
      {
        "label": "EDR_TELEMETRY",
        "value": 412300,
        "color": "oklch(72% 0.16 220)"
      }
    ],
    "agentActivity": [
      { "hour": 0, "triage": 120, "enrich": 80, "contain": 12, "escalate": 8 },
      { "hour": 1, "triage": 135, "enrich": 95, "contain": 18, "escalate": 6 }
    ],
    "feed": [
      {
        "ts": "10:42:03",
        "playbook": "phish-triage-v4",
        "action": "AUTO_RESOLVE",
        "target": "user@corp",
        "sev": "low",
        "agent": "triage-α"
      }
    ]
  }
}
```

### Dashboard 2: Performance Analytics (`performance.json`)

```json
{
  "metadata": {
    "dashboard_id": "performance",
    "title": "Performance Analytics",
    "description": "Throughput, MTTD/MTTR, SLO budget"
  },
  "data": {
    "sloMetrics": {
      "ttd_target_sec": 120,
      "ttd_actual_sec": 38,
      "ttd_compliance": 98.5,
      "ttc_target_sec": 240,
      "ttc_actual_sec": 92,
      "ttc_compliance": 99.2,
      "ttr_target_sec": 1560,
      "ttr_actual_sec": 432,
      "ttr_compliance": 99.8
    },
    "sloChart": [
      { "label": "TTD (Detect)", "value": 98.5, "target": 95 },
      { "label": "TTC (Contain)", "value": 99.2, "target": 95 },
      { "label": "TTR (Resolve)", "value": 99.8, "target": 95 }
    ],
    "radarMetrics": {
      "agency": 0.75,
      "fitness": 0.85,
      "persuadability": 0.95,
      "signaling_fidelity": 0.92,
      "regenerative_capacity": 0.81,
      "competency_overhang": 0.14
    },
    "throughputChart": [{ "t": 1656259200000, "v": 280 }]
  }
}
```

### Dashboard 3: HITL Gate Composition (`hitl.json`)

```json
{
  "metadata": {
    "dashboard_id": "hitl",
    "title": "HITL Gate Composition",
    "description": "Human-in-the-loop checkpoint analytics"
  },
  "data": {
    "gates": [
      {
        "gate_id": "containment_gate",
        "name": "Containment",
        "role_pairs": [
          ["ir-lead", "incident-commander"],
          ["forensics-specialist", "threat-intel-lead"]
        ],
        "avg_latency_min": 4.2,
        "tool_allowlist": ["gao_agent", "grr_rapid_response", "crowdstrike_rtr"]
      }
    ],
    "bottleneckChart": [
      { "tool": "gao_agent", "latency": 2.1, "role_count": 3 }
    ],
    "bubbleChart": [
      {
        "role_pair": "ir-lead / incident-commander",
        "playbooks": 45,
        "avg_latency": 3.8
      }
    ]
  }
}
```

### Dashboard 4: Marimo Coverage (`marimo.json`)

```json
{
  "metadata": {
    "dashboard_id": "marimo",
    "title": "Marimo Coverage",
    "description": "Reactive notebook adoption"
  },
  "data": {
    "stats": {
      "total_playbooks": 184,
      "marimo_notebooks": 87,
      "adoption_rate": 47.3,
      "avg_completeness": 78.5,
      "v2_readiness": 65.2
    },
    "domainCoverageChart": [
      { "domain": "Identity", "count": 45, "color": "oklch(78% 0.13 220)" }
    ],
    "adoptionChart": [{ "month": "Jan", "adoption": 12 }]
  }
}
```

### Dashboard 5: Detection Fidelity (`detection.json`)

```json
{
  "metadata": {
    "dashboard_id": "detection",
    "title": "Detection Fidelity",
    "description": "Precision / recall / drift per detection"
  },
  "data": {
    "stats": {
      "total_playbooks": 184,
      "hf_count": 92,
      "inv_count": 92,
      "avg_precision": 0.945,
      "avg_recall": 0.823,
      "avg_f1": 0.88
    },
    "stackedChart": [
      { "label": "High-Fidelity", "value": 92, "color": "var(--green)" },
      { "label": "Investigative", "value": 92, "color": "var(--signal)" }
    ],
    "donutChart": [
      { "label": "Drift < 5%", "value": 156, "color": "var(--green)" },
      { "label": "Drift > 5%", "value": 28, "color": "var(--amber)" }
    ]
  }
}
```

### Dashboard 6: D3FEND & CAPEC (`d3fend.json`)

```json
{
  "metadata": {
    "dashboard_id": "d3fend",
    "title": "D3FEND & CAPEC",
    "description": "Defensive countermeasure mapping"
  },
  "data": {
    "stats": {
      "d3fend_playbooks": 76,
      "capec_playbooks": 58,
      "unique_d3fend_ids": 34,
      "unique_capec_ids": 28
    },
    "mappingChart": [
      { "label": "D3FEND", "value": 34, "color": "var(--signal)" },
      { "label": "CAPEC", "value": 28, "color": "var(--violet)" }
    ]
  }
}
```

### Dashboard 7: Impact & Business Risk (`risk.json`)

```json
{
  "metadata": {
    "dashboard_id": "risk",
    "title": "Impact & Business Risk",
    "description": "Quantitative risk for board reporting"
  },
  "data": {
    "kpis": {
      "aleUSD": 51.5,
      "valueAtRisk": 184.2,
      "riskReductionYoY": 34.6,
      "incidentsPrevented": 412,
      "exposurePercentile": 73
    },
    "businessUnits": [
      {
        "name": "Payments Platform",
        "revenue": 2840,
        "criticality": 5,
        "exposureUSD": 12.4,
        "riskTier": "T0"
      }
    ],
    "tierChart": [{ "label": "T0", "value": 3, "color": "var(--red)" }],
    "domainChart": [
      { "label": "Identity", "value": 28.4, "color": "oklch(78% 0.13 220)" }
    ],
    "scatterChart": [
      { "x": 2840, "y": 12.4, "size": 5, "label": "Payments Platform" }
    ]
  }
}
```

### Dashboard 8: Blast Radius (`blast.json`)

```json
{
  "metadata": {
    "dashboard_id": "blast",
    "title": "Blast Radius",
    "description": "Propagation containment analysis"
  },
  "data": {
    "stats": {
      "blast_scenarios": 42,
      "avg_exposure_hours": 2.3,
      "containment_success_rate": 94.2
    },
    "propagationChart": [
      { "stage": "Initial", "nodes_affected": 5, "time_hours": 0.1 }
    ]
  }
}
```

### Dashboard 9: Compliance Matrix (`compliance.json`)

```json
{
  "metadata": {
    "dashboard_id": "compliance",
    "title": "Compliance Matrix",
    "description": "NIST, ISO, SOC 2, PCI, HIPAA, GDPR, DORA"
  },
  "data": {
    "frameworks": [
      {
        "name": "NIST CSF",
        "coverage": 94.2,
        "color": "var(--signal)"
      },
      {
        "name": "ISO 27001",
        "coverage": 87.5,
        "color": "var(--violet)"
      }
    ],
    "barChart": [
      { "label": "NIST CSF", "value": 94.2, "color": "var(--signal)" }
    ]
  }
}
```

### Dashboard 10: CVE Radar (`cve.json`)

```json
{
  "metadata": {
    "dashboard_id": "cve",
    "title": "CVE Radar",
    "description": "Active exploitation risk per CVE"
  },
  "data": {
    "stats": {
      "cves_in_sigma": 412,
      "covered": 324,
      "gap": 88,
      "repo_only": 156,
      "critical_covered": 38
    },
    "donutChart": [
      {
        "label": "Covered (Repo + KEV)",
        "value": 324,
        "color": "var(--green)"
      },
      { "label": "Gap (KEV, no Sigma)", "value": 88, "color": "var(--amber)" },
      { "label": "Repo Only", "value": 156, "color": "var(--signal)" }
    ]
  }
}
```

### Dashboard 11: Threat Intelligence (`threat.json`)

```json
{
  "metadata": {
    "dashboard_id": "threat",
    "title": "Threat Intelligence",
    "description": "VERIS taxonomies and actor profiles"
  },
  "data": {
    "stats": {
      "active_actors": 47,
      "total_incidents": 892,
      "top_nations": ["China", "Russia", "Iran"]
    },
    "topActors": [
      {
        "name": "APT1",
        "nation": "China",
        "incidents": 45,
        "color": "oklch(72% 0.16 220)"
      }
    ],
    "radarChart": [{ "axis": "Phishing", "value": 85 }]
  }
}
```

### Dashboard 12: Chain of Custody (`custody.json`)

```json
{
  "metadata": {
    "dashboard_id": "custody",
    "title": "Chain of Custody",
    "description": "Cryptographic audit trail"
  },
  "data": {
    "stats": {
      "total_audit_events": 45283,
      "verified_signatures": 45281,
      "integrity_score": 99.996
    },
    "auditEvents": [
      {
        "timestamp": "2023-04-30T10:42:03Z",
        "event": "playbook_executed",
        "user": "secops-user-1",
        "hash": "sha256:abc123...",
        "verified": true
      }
    ],
    "chainChart": [{ "stage": "Triage", "events": 340, "verified": 340 }]
  }
}
```

---

## File Organization Strategy

### `/data/` Directory Structure

```
data/
├── dashboard.json       (1.2 KB) — Project Dashboard
├── performance.json     (1.8 KB) — Performance Analytics
├── hitl.json            (1.5 KB) — HITL Gate Composition
├── marimo.json          (1.2 KB) — Marimo Coverage
├── detection.json       (1.3 KB) — Detection Fidelity
├── d3fend.json          (0.9 KB) — D3FEND & CAPEC
├── risk.json            (2.1 KB) — Impact & Business Risk
├── blast.json           (0.8 KB) — Blast Radius
├── compliance.json      (1.0 KB) — Compliance Matrix
├── cve.json             (1.1 KB) — CVE Radar
├── threat.json          (1.4 KB) — Threat Intelligence
└── custody.json         (1.3 KB) — Chain of Custody
```

**Total:** ~16 KB (gzipped: ~4 KB) — negligible overhead

---

## Data Fetching & Polling Mechanism

### Fetch Strategy

```javascript
// In app.jsx or a useData hook

const fetchDashboardData = async (dashboardId) => {
  try {
    const response = await fetch(`/data/${dashboardId}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${dashboardId}:`, error);
    return null; // Return null on error; UI shows placeholder
  }
};

const usePollingData = (dashboardId, initialData) => {
  const [data, setData] = React.useState(initialData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Poll every 30s (configurable from metadata.poll_interval_ms)
  React.useEffect(() => {
    const poll = async () => {
      setLoading(true);
      const newData = await fetchDashboardData(dashboardId);
      if (newData) {
        setData(newData);
        setError(null);
      } else {
        setError("Failed to load data");
      }
      setLoading(false);
    };

    poll(); // Initial fetch
    const interval = setInterval(poll, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [dashboardId]);

  return { data, loading, error };
};
```

### Error Handling

- **Network error:** Show "Data unavailable" placeholder; keep last-known-good state
- **Stale data:** Show "Last updated: X seconds ago" timestamp
- **Partial data:** Render available metrics; grey out missing ones
- **Retry logic:** Automatic retry on first failure; manual retry button on second failure

---
