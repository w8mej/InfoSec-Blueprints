# TIER 3 Deep-Dive: Performance Profiling & Telemetry

## Document Metadata

- **Audience**: SREs | Platform Engineers | AI Engineers | SOC Managers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [monitoring-observability.md](../OPERATIONS/monitoring-observability.md)
- **Related Specs**: `2023-04-27-tier3-performance-profiling.md`, `2023-04-23-capture-execution-telemetry-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/runtime/performance_profiler.py`

## Quick Summary

Performance Profiling & Telemetry is the "Health Monitor" of the SentinelMesh platform. It is responsible for capturing, aggregating, and analyzing the operational metrics of the [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) and the underlying AI models. By monitoring **Token Consumption, Reasoning Latency, Tool Execution Time, and Memory Pressure**, the system ensures that the SOC remains responsive and cost-effective, even during high-velocity incident response scenarios.

This module provides the data needed for [AI Model Optimization](../TIER-DEEP-DIVES/tier4-ai-model-optimization.md) and [Linear Scaling](../OPERATIONS/scaling-performance-tuning.md) of the SentinelMesh infrastructure.

---

## 1. Persona-Based Value Proposition

### For the SRE / Platform Engineer

- **Bottleneck Identification**: Pinpoint exactly which stage of the OODA loop (e.g., "Enrichment" vs. "Reasoning") is causing latency spikes.
- **Resource Rightsizing**: Use memory and CPU telemetry to optimize the [Cloud Run](../OPERATIONS/deployment-google-cloud.md) configuration for maximum throughput.

### For the AI Engineer

- **Token Budget Management**: Track token usage per incident to prevent "Budget Runaway" and optimize prompt length.
- **Model Comparison**: Compare the performance metrics (Latency vs. Accuracy) of different models (Gemini Flash vs. Pro) for specific task types.

### For the SOC Manager

- **MTTR Optimization**: Use telemetry to identify and eliminate systemic delays in the automated response process.
- **Cost Transparency**: View the "Total Cost to Resolve" for every incident, including API costs and infrastructure overhead.

---

## 2. Architecture & Design: Telemetry Collection

### 2.1 The Execution Telemetry Logger (ETL)

The ETL is a lightweight background process that hooks into the runtime:

- **Event Hooks**: Captures the start/end time of every cell execution and tool call.
- **LLM Metadata**: Records the model name, token count (input/output), and `finish_reason` for every agent turn.
- **System Metrics**: Periodically snapshots the container's CPU usage, memory resident set size (RSS), and active network connections.

### 2.2 Metrics Aggregation (GAI Score)

The system calculates a composite "General AI Performance" (GAI) Score:
$GAI = \frac{Accuracy}{Latency \times TokenCost}$

- **Goal**: Maximize accuracy while minimizing time and cost.
- **Usage**: Used in the [Detection Fidelity Dashboard](../DASHBOARDS-UI/detection-fidelity-dashboard.md) to compare playbook effectiveness.

### 2.3 Integration with Cloud Observability

- **Google Cloud Trace**: Exports spans to Cloud Trace for distributed tracing across multiple microservices.
- **Cloud Monitoring (OpenTelemetry)**: Publishes custom metrics for real-time alerting and dashboarding.

---

## 3. Implementation Details: Profiler Logic

### Core Profiler (`src/runtime/performance_profiler.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Telemetry Privacy

Telemetry data never contains PII or sensitive forensic content. It only includes operational "Metatada" (times, counts, IDs), ensuring that the observability stack does not become a target for data exfiltration.

### 4.2 Compliance Mapping

- **NIST 800-53 (AU-12)**: Fulfills requirements for "Audit Record Generation" by providing a detailed operational log of system behavior.
- **SOC2 (Availability)**: Supports availability by providing the data needed for proactive performance tuning and scaling.

---

## 5. Operations & Performance Tuning

### Setting Performance Thresholds

Thresholds are defined in `conf/monitoring_alerts.yaml`.

- **Alert**: `llm_latency_avg > 15s`
- **Alert**: `token_usage_per_incident > 500k`
- **Alert**: `memory_pressure > 85%`

### Reviewing Traces

Use the [Google Cloud Trace UI](https://console.cloud.google.com/traces) to drill down into specific high-latency incidents and identify the root cause of the delay.

---

## 6. Future Growth & Opportunities

- **Predictive Scaling**: Using historical telemetry to predict upcoming alert spikes and pre-scale the [Ingest Pipeline](../TIER-DEEP-DIVES/tier4-realtime-alert-streaming.md).
- **Automated "Prompt Pruning"**: Identifying prompt sections that have zero impact on agent accuracy but contribute to high token costs.
- **Energy Efficiency Profiling**: Measuring the "Carbon Footprint" of autonomous response loops as part of corporate ESG reporting.
