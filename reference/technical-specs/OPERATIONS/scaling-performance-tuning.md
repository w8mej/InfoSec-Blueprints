# Scaling & Performance Tuning Guide

## Document Metadata

- **Audience**: SREs | Performance Engineers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [monitoring-observability.md](./monitoring-observability.md)
- **Related Docs**: [tier3-performance-profiling.md](../TIER-DEEP-DIVES/tier3-performance-profiling.md)
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/runtime/performance_profiler.py`

## Quick Summary

The Scaling & Performance Tuning Guide provides the technical SentinelMesh for optimizing the SentinelMesh framework for high-throughput, enterprise-scale environments. As the volume of alerts and the complexity of playbooks increase, the system must maintain low latency for generation and high concurrency for autonomous response loops.

This guide outlines the strategies for horizontal scaling, resource optimization, and caching to ensure that SentinelMesh remains responsive even during high-intensity "Alert Storms."

## Architecture & Design

- **Horizontal Scalability**: The core runtime is stateless, allowing for seamless horizontal scaling via Cloud Run or GKE.
- **Asynchronous Processing**: Heavily utilizes `asyncio` for non-blocking I/O (KMS signing, SIEM queries, Pub/Sub ingest).
- **Resource Profiling**: Integrated `PerformanceProfiler` captures per-execution CPU, Memory, and I/O metrics to identify bottlenecks.
- **Batching & Queuing**: Uses Pub/Sub to decouple alert ingestion from playbook generation, preventing "burst-overload" of the downstream LLM or KMS APIs.

```mermaid
graph TD
    A[Alert Ingest] --> B[Pub/Sub Queue]
    B --> C[Scaled Cloud Run Instances]
    C --> D[Shared Template Cache]
    C --> E[KMS API (Bottleneck?)]
    C --> F[LLM API (Bottleneck?)]
    C --> G[Forensic Artifact GCS]
```

## Implementation Details

### Performance Bottlenecks & Optimizations

| Component            | Bottleneck                | Optimization                                                                   |
| -------------------- | ------------------------- | ------------------------------------------------------------------------------ |
| **KMS Signing**      | API Latency / Throttling  | Implement local key caching or regional KMS replicas.                          |
| **LLM Generation**   | Token Limits / Throughput | Use specialized "Triage" models; implement semantic caching for common alerts. |
| **Playbook Storage** | I/O Latency               | Use GCS with local disk caching for frequently used templates.                 |
| **Database/Logs**    | Write Throttling          | Use high-throughput streaming (Kinesis/Dataflow) for telemetry ingestion.      |

### Code Example: Profiling-Driven Optimization

```python
REDACTED
```

## Deployment & Integration

- **Auto-Scaling Rules**: Configure Cloud Run to scale based on CPU utilization or request concurrency.
- **VPC Connector**: Use a high-throughput Serverless VPC Access connector to minimize latency between the runtime and internal SIEMs/Tools.

## Operations & Monitoring

- **Performance Baselines**: Establish "P95 Latency" baselines for common playbook types (e.g., < 3s for Triage, < 8s for Full Remediation).
- **Stress Testing**: Periodically run "Alert Storm" simulations using the `src/scripts/simulate_load.py` utility to verify auto-scaling behavior.

## Security & Compliance

- **Resource Quotas**: Implement per-incident resource quotas to prevent a single "Runaway Loop" from consuming the entire SOC budget or capacity.
- **Availability SLOs**: Target 99.9% availability for the playbook generation API to ensure response readiness.

## Future Growth & Opportunities

- **Global Distribution**: Deploying SentinelMesh nodes in multiple GCP regions (US, EU, APAC) to provide low-latency response for global enterprises.
- **JIT Playbook Pre-rendering**: Pre-rendering the "Bootstrap" sections of common playbooks in the background to reduce active generation latency.

## API Reference

- `PerformanceProfiler.record_timing(op_name, seconds)`: Manual instrumentation.
- `Cloud Run Concurrency Settings`: Adjust `max_instances` and `concurrency` based on observed load patterns.
