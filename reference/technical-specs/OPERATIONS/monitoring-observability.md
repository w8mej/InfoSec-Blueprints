# Operations: Monitoring & Observability Runbook

## Document Metadata

- **Audience**: SREs | SOC Managers | Platform Engineers | On-Call Engineers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [tier3-performance-profiling.md](../TIER-DEEP-DIVES/tier3-performance-profiling.md)
- **Related Specs**: `2023-04-27-operations-monitoring-observability.md`, `2023-04-23-capture-execution-telemetry-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Dashboard Link**: [GCP Cloud Monitoring](https://console.cloud.google.com/monitoring)

## Quick Summary

The Monitoring & Observability Runbook defines the technical strategy for maintaining the health and performance of the SentinelMesh platform. In a high-assurance autonomous system, **Observability is the ultimate safety net**. This runbook outlines the specific metrics, logs, and traces that must be monitored to detect systemic failures, performance bottlenecks, or security anomalies in the [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md).

This document ensures that SREs have the visibility needed to satisfy the [SLA/SLO requirements](../TIER-DEEP-DIVES/tier3-performance-profiling.md) of a world-class security operations center.

---

## 1. Persona-Based Value Proposition

### For the SRE / On-Call Engineer

- **Proactive Alerting**: Receive notifications _before_ a failure impacts incident response (e.g., "KMS API Latency Rising").
- **Rapid Debugging**: Use distributed traces to follow an incident from the initial [Alert Ingest](../TIER-DEEP-DIVES/tier4-realtime-alert-streaming.md) through every [Agentic Thought](../../appendices/2023-04-planning/runtime-agentic-superpowers.md).

### For the SOC Manager

- **Service Level Assurance**: View real-time dashboards showing the platform's availability and responsiveness.
- **Capacity Planning**: Use historical telemetry to predict when the infrastructure needs to be scaled up.

### For the Security Engineer

- **Anomaly Detection**: Monitor for unusual patterns in [KMS Signing API](../TIER-1-FOUNDATIONS/kms-schema-signer.md) calls or tool execution that might indicate a compromised agent.

---

## 2. Key Performance Indicators (KPIs)

### 2.1 The "Golden Signals" of SentinelMesh

1.  **Latency**: Time to complete an OODA cycle. Target: < 10s.
2.  **Traffic**: Number of active autonomous loops.
3.  **Errors**: Rate of `LLM_TIMEOUT`, `TOOL_FAILURE`, or `SIGNATURE_INVALID`.
4.  **Saturation**: CPU and Memory pressure on the Cloud Run instances.

### 2.2 Security Metrics

- **KMS Error Rate**: Unauthorized or malformed signing requests.
- **HITL Gate Latency**: Average time an action spends in the "Pending Approval" state.
- **Autonomy Ratio**: % of actions taken without human intervention.

---

## 3. Monitoring Infrastructure

### 3.1 Logging (Cloud Logging)

- **Standard Out**: All SentinelMesh services emit JSON-formatted logs to stdout.
- **Forensic Logs**: Dedicated, signed log stream for all state-mutating actions (see [Forensic capabilities](../../appendices/2023-04-planning/forensic-security-superpowers.md)).

### 3.2 Metrics (Cloud Monitoring)

- **Custom Metrics**: Published via the [Performance Profiler](../TIER-DEEP-DIVES/tier3-performance-profiling.md).
- **Service Mesh Metrics**: Automatic capturing of inter-service latency and error rates via Istio/Anthos Service Mesh.

### 3.3 Tracing (Cloud Trace)

- **End-to-End Traces**: Every incident is assigned a `trace_id` that is propagated through the entire stack, allowing for visual bottleneck analysis.

---

## 4. Alerting Rules

### Critical Alerts (P0)

- `ASO_RUNTIME_DOWN`: Cloud Run service is unreachable.
- `KMS_SIGNING_FAILURE`: Unable to sign forensic logs; all remediation must halt.
- `INGEST_QUEUE_BACKLOG`: Alert volume is exceeding ingest capacity.

### Warning Alerts (P1)

- `HIGH_LLM_LATENCY`: Agent reasoning is taking > 30 seconds.
- `LOW_CONFIDENCE_SPIKE`: Agents are consistently producing low-confidence outputs, indicating a need for [Model Optimization](../TIER-DEEP-DIVES/tier4-ai-model-optimization.md).

---

## 5. Operations & Response

### On-Call Triage Steps

1.  Check the **ASO Health Dashboard** in Cloud Monitoring.
2.  Search logs for the `incident_id` or `correlation_id` reported in the alert.
3.  Examine the **Distributed Trace** to find the failing component.
4.  Consult the [Troubleshooting Runbook](./troubleshooting-runbook.md) for specific recovery steps.

---

## 6. Future Growth & Opportunities

- **Automated Root Cause Analysis (A-RCA)**: Using a specialized model to analyze system logs and traces to automatically propose a "Fix" for platform failures.
- **Predictive Saturation Alerts**: Using ML to predict when the system will reach capacity based on historical growth trends.
- **Synthethic Incident Response**: Periodically injecting "Synthetic Alerts" into the stream to verify that the entire monitoring and response pipeline is functional.
