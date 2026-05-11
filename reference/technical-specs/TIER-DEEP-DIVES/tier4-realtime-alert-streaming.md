# TIER 4 Deep-Dive: Real-time Alert Streaming & Ingest

## Document Metadata

- **Audience**: SREs | Platform Engineers | Data Architects
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [deployment-google-cloud.md](../OPERATIONS/deployment-google-cloud.md)
- **Related Specs**: `2023-04-27-tier4-realtime-alert-streaming.md`, `2023-04-23-suppress-redundant-alerts-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/runtime/alert_stream_consumer.py`, `src/runtime/query_standardization.py`

## Quick Summary

Real-time Alert Streaming is the "Sensory Nervous System" of SentinelMesh. It is responsible for the high-velocity ingestion, normalization, and deduplication of security alerts from diverse sources (SIEMs, Cloud Logs, EDRs). By utilizing a **Distributed Message Queue** (e.g., Google Pub/Sub, Kafka), we ensure that SentinelMesh can process thousands of alerts per second with sub-second latency, providing the "Instant Start" capability required for high-assurance autonomous response.

The ingest pipeline transforms messy, vendor-specific raw logs into the [SentinelMesh Canonical Model](../../appendices/2023-04-planning/integration-data-superpowers.md), ensuring that the downstream [Playbook Generator](./tier4-playbook-templating-system.md) always receives high-quality, actionable metadata.

---

## 1. Persona-Based Value Proposition

### For the Platform Engineer / SRE

- **Linear Scalability**: The ingest pipeline is horizontally scalable. Simply add more consumer instances to handle increasing alert volumes during a large-scale attack.
- **Dead-Letter Handling**: Alerts that fail normalization are automatically routed to a "Dead-Letter Queue" (DLQ) for manual inspection, ensuring no data is ever lost.

### For the SOC Analyst / Detection Engineer

- **Reduced Alert Noise**: The [Redundancy Suppressor](#22-alert-deduplication--suppression) automatically groups related alerts into a single "Incident Context," preventing the generation of 100 identical playbooks for a single malware outbreak.
- **Unified Schema**: Regardless of the source (Azure, AWS, GCP), the alert metadata is always presented in the same standardized format.

### For the Security Architect

- **VPC Isolation**: The ingest stream remains within the [VPC Service Perimeter](../OPERATIONS/security-hardening.md), protecting sensitive alert metadata from unauthorized external access.

---

## 2. Architecture & Design: The Ingest Pipeline

### 2.1 The Stream Consumer (`src/runtime/alert_stream_consumer.py`)

The consumer is a long-running service (or Cloud Run job) that:

1.  **Subscribes**: Listens for new messages on the authorized Pub/Sub topic.
2.  **Validates**: Performs basic schema validation to ensure the message is a valid security alert.
3.  **Standardizes**: Uses the [Query Standardization](../../appendices/2023-04-planning/integration-data-superpowers.md) engine to map vendor fields to canonical keys.
4.  **Triggers**: Calls the [Playbook Generator](./tier4-playbook-templating-system.md) to initialize the response loop.

### 2.2 Alert Deduplication & Suppression

- **Goal**: Prevent "Alert Storms" from overwhelming the autonomous engine.
- **Implementation**:
  - Uses `src/runtime/suppress_redundant_alerts.py`.
  - **Logic**: Creates a sliding window (e.g., 5 minutes) and hashes the `alert_type + target_resource`.
  - If a match is found, the alert is appended as a "Child Alert" to an existing incident rather than starting a new one.

### 2.3 Multi-Source Ingest (Adapters)

- **GCP Adapter**: Ingests from Security Command Center (SCC) and Cloud Logging.
- **AWS Adapter**: Ingests from GuardDuty and Security Hub via EventBridge.
- **Azure Adapter**: Ingests from Microsoft Sentinel via Event Hubs.

---

## 3. Implementation Details: Message Schema

### Canonical Alert Schema (JSON)

```json
{
  "aso_id": "aso-alert-2026-001",
  "source_system": "gcp_scc",
  "timestamp": "2023-04-29T14:00:00Z",
  "severity": "CRITICAL",
  "category": "malware.persistence",
  "target": {
    "hostname": "prod-web-01",
    "project_id": "aso-main-project",
    "region": "us-central1"
  },
  "threat_intel": {
    "actor": "APT29",
    "mitre_id": "T1053"
  }
}
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 In-Transit Encryption

All alert data is encrypted using TLS 1.3 while in transit. For extremely sensitive environments, we support [VPC Service Controls](../OPERATIONS/security-hardening.md) to ensure data never leaves the organization's network perimeter.

### 4.2 Compliance Mapping

- **NIST 800-53 (AU-6)**: Fulfills requirements for "Audit Record Review, Analysis, and Reporting" by providing real-time processing of security events.
- **SOC2 (Processing Integrity)**: Ensures that all alerts are processed completely and accurately through the ingest pipeline.

---

## 5. Operations & Performance Tuning

### Monitoring the Ingest Pipeline

- **Metric: Queue Depth**: Number of alerts waiting to be processed. A rising depth indicates the need for more consumer instances.
- **Metric: Normalization Failure Rate**: Percentage of alerts that could not be mapped to the canonical schema.
- **Metric: End-to-End Latency**: Time from "Alert Fired" in SIEM to "Playbook Generated" in ASO. Target: < 5 seconds.

### Tuning the Consumer

Increase the `concurrency` setting in Cloud Run to allow a single instance to process multiple alerts simultaneously.

---

## 6. Future Growth & Opportunities

- **Intelligent Alert Prioritization**: Using a small ML model at the ingest layer to "Scout" for high-risk patterns and prioritize them in the generation queue.
- **Live Stream Replay**: (Experimental) Allowing SREs to "Replay" a historical alert stream to test new playbook versions or scale-up scenarios.
- **Edge Ingest**: Deploying small ASO "Scouts" at the network edge to normalize and filter alerts before they even reach the central cloud runtime.
