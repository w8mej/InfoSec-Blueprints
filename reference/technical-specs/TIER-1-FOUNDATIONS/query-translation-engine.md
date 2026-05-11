# TIER 1 Deep-Dive: Query Translation Engine

## Document Metadata

- **Audience**: Detection Engineers | Security Engineers | Data Architects
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [integration-data-capabilities.md](../../appendices/2023-04-planning/integration-data-superpowers.md)
- **Related Specs**: `2023-04-27-query-translation-engine-design.md`, `2023-04-23-standardize-query-formats-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/runtime/query_translation_engine.py`

## Quick Summary

The Query Translation Engine is the "Universal Translator" of the SentinelMesh platform. It allows analysts and agents to write security queries in a **Single, Platform-Agnostic Format** (SentinelMesh Query Language - AQL) and automatically translates them into the native syntax of diverse SIEM and Log platforms (e.g., KQL for Sentinel, SPL for Splunk, BigQuery SQL for Chronicle).

This module is the technical foundation of the "Write Once, Run Anywhere" (WORA) philosophy, ensuring that playbooks are portable across heterogeneous cloud and on-prem environments without needing to rewrite complex search logic.

---

## 1. Persona-Based Value Proposition

### For the Detection Engineer

- **Unified Querying**: Stop learning five different query languages. Write your detections in AQL and let the engine handle the vendor-specific nuances.
- **Portability**: Move your hunting playbooks from Azure to GCP or vice-versa with zero modifications to the underlying search logic.

### For the Security Engineer / Data Architect

- **Schema Mapping**: The engine automatically handles mapping between [Canonical Fields](../../appendices/2023-04-planning/integration-data-superpowers.md) and vendor-specific fields (e.g., `user.id` -> `TargetUserName`).
- **Optimization**: The translator can optimize queries for the target platform, ensuring they run efficiently and don't exceed API quotas.

### For the SOC Manager

- **Vendor Neutrality**: Reduce vendor lock-in by maintaining your core detection intellectual property in a standardized format.

---

## 2. Architecture & Design: The Translation Pipeline

### 2.1 The AQL Grammar

The engine uses a formal grammar (based on [Sigma](https://sigmaid.io/)) to define security searches:

- **Selectors**: Matching on specific field/value pairs.
- **Conditions**: Boolean logic (AND, OR, NOT).
- **Time Windows**: Standardized time ranges (e.g., `last 1h`).
- **Aggregations**: Counting, summing, or grouping results.

### 2.2 The Translation Process

1.  **Parse**: Convert the AQL string into an Abstract Syntax Tree (AST).
2.  **Normalize**: Map [Canonical Fields](../../appendices/2023-04-planning/integration-data-superpowers.md) to the target vendor's schema.
3.  **Optimize**: Perform platform-specific optimizations (e.g., pushing filters down to the database layer).
4.  **Render**: Emit the final query string in the target language (e.g., `Index=Security | stats count by user`).

### 2.3 Provider-Specific Translators

- **BigQuery Translator**: Emits SQL for Google Chronicle.
- **KQL Translator**: Emits Kusto for Microsoft Sentinel/ADX.
- **SPL Translator**: Emits SPL for Splunk.
- **Elasticsearch Translator**: Emits DSL or EQL for Elastic.

---

## 3. Implementation Details: Translator Logic

### Core Translation Logic (`src/runtime/query_translation_engine.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Query Injection Prevention

The engine uses **Parameterized Queries** or strict escaping to ensure that an attacker cannot perform a "Query Injection" attack (e.g., escaping a search filter to delete data from the SIEM).

### 4.2 Compliance Mapping

- **NIST 800-53 (AU-7)**: Supports "Audit Reduction and Report Generation" by providing a consistent way to query audit data across platforms.
- **ISO 27001 (A.12.4.1)**: Fulfills requirements for "Event Logging" by ensuring that logs are consistently searchable.

---

## 5. Operations & Performance Tuning

### Latency

Translation is a near-instantaneous CPU-bound operation (typically < 10ms).

### Debugging Translations

The engine provides a "Debug Mode" that shows the intermediate AST and the optimization steps taken during translation. This is useful for troubleshooting complex queries that don't return the expected results.

---

## 6. Future Growth & Opportunities

- **AI-Assisted AQL Authoring**: Allowing analysts to describe their search in natural language and using a fine-tuned model to generate the AQL.
- **Live Query Optimization**: Learning which query patterns are most expensive in production and suggesting more efficient AQL structures.
- **Cross-Platform Join Support**: (Experimental) Enabling queries that "Join" data across multiple SIEMs (e.g., joining GCP logs with AWS logs) through a federated query layer.
