# Dashboard: Actor Intelligence Cards

## Document Metadata

- **Audience**: Threat Intelligence Analysts | SOC Managers | Security Engineers | Red Teams
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [veris-intelligence-dashboard.md](./veris-intelligence-dashboard.md)
- **Related Specs**: `2023-04-22veris-incident-intelligence-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/scripts/generate_actor_cards.py`

## Quick Summary

The Actor Intelligence Cards Dashboard is the "Adversary Profiling" engine of the SentinelMesh platform. It transforms dry threat intel feeds into a set of interactive, visual cards that profile the adversaries tracked by the framework. Each card synthesizes data on an actor's motivation, preferred techniques, and recent campaigns, while also providing a "Readiness Score" that quantifies SentinelMesh's ability to counter that specific adversary.

This dashboard ensures that the SOC is not just "Alert Driven," but **Adversary Aware**, allowing for more strategic defense against sophisticated nation-state and criminal groups.

---

## 1. Persona-Based Value Proposition

### For the Threat Intelligence Analyst

- **Unified Profile**: Aggregate internal intelligence and external feeds (e.g., MITRE, Mandiant) into a single, high-fidelity view of a threat group.
- **Technique Correlation**: See exactly which [ATT&CK Techniques](./attack-matrix-dashboard.md) are preferred by an actor and link them to the corresponding defensive playbooks.

### For the SOC Manager

- **Adversary-Specific Readiness**: Understand which threat groups the organization is most (and least) prepared to handle.
- **Resource Allocation**: Prioritize detection engineering efforts for actors that are actively targeting your industry sector.

### For the Red Team

- **Adversary Emulation**: Use the "Preferred Techniques" list to build realistic emulation plans that mimic the behavior of specific tracked actors.

---

## 2. Architecture & Design: The Actor Card

### 2.1 The Card UI

Each Actor Card is a self-contained HTML component containing:

- **Header**: Actor Alias (e.g., APT29, Cozy Bear), Origin, and Sophistication level.
- **Motivation & Sector**: Primary objectives (e.g., Espionage) and target industries.
- **Technique Heatmap**: A mini-view of the [ATT&CK Matrix](./attack-matrix-dashboard.md) showing the actor's preferred T-codes.
- **Defensive Readiness Score**: A percentage (0-100%) based on the coverage density of playbooks for that actor's preferred techniques.
- **Recent Activity**: A timeline of sightings or campaigns involving this actor.

### 2.2 Relational Data Ingestion

The dashboard is powered by a relational JSON artifact (`actor_data.json`) that links actors to:

- **Playbooks**: Every playbook tagged with a `relevant_actor` is linked back to the card.
- **Incidents**: Real-world incidents attributed to the actor are displayed in the "Recent Activity" list.
- **Malware**: Links to the malware families commonly used by the group.

### 2.3 Interactive Search & Filter

Analysts can filter the card grid by Actor Origin (e.g., Russia, China, North Korea), Industry Target (e.g., Finance, Energy), or Readiness Score.

---

## 3. Implementation Details: Generation Logic

### Core Generator (`src/scripts/generate_actor_cards.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Intelligence Attribution Policy

The dashboard adheres to the organization's policy on "Public Attribution." All actor profiles are sourced from validated, non-sensitive intel feeds unless the user has authorized the inclusion of internal "Internal-Only" attribution data.

### 4.2 Compliance Mapping

- **NIST 800-53 (RA-3)**: Supports "Risk Assessment" by identifying threat sources and their capabilities.
- **ISO 27001 (A.16.1.1)**: Fulfills requirements for "Reporting Information Security Events" by providing context on the likely adversary behind an incident.

---

## 5. Operations & Performance Tuning

### Data Ingestion

The dashboard can ingest data from multiple formats:

- **STIX 2.1 Bundles**: Direct import of standardized intel.
- **CSV/Excel**: For manual intelligence entry by analysts.
- **Internal API**: Real-time sync with an internal Threat Intelligence Platform (TIP).

### Scaling the Grid

The dashboard uses a responsive CSS Grid layout, supporting thousands of actor cards with "Infinite Scroll" and client-side searching for zero-latency performance.

---

## 6. Future Growth & Opportunities

- **Actor Relationship Graph**: A D3.js visualization showing the links between different actors, shared infrastructure, and common exploit kits.
- **Predictive Campaign Analysis**: Using the [AI Optimization Pipeline](../TIER-DEEP-DIVES/tier4-ai-model-optimization.md) to predict an actor's "Next Move" based on their historical behavior and current environmental telemetry.
- **Dynamic Playbook Recommendation**: Automatically suggesting the "Best Playbook" for a new alert based on the adversary's known profile.
