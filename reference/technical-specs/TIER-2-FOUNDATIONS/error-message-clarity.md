# TIER 2 Deep-Dive: Error Message Clarity & Actionable Guidance

## Document Metadata

- **Audience**: Backend Engineers | SREs | SOC Analysts | Automation Engineers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [visual-ui-capabilities.md](../../appendices/2023-04-planning/visual-ui-superpowers.md)
- **Related Specs**: `2023-04-27-tier2-error-message-clarity.md`, `2023-04-23-standardize-query-formats-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/runtime/error_formatter.py`

## Quick Summary

Error Message Clarity & Actionable Guidance is the "Operational Polish" layer of the SentinelMesh platform. In a high-stakes security environment, a cryptic "500 Internal Server Error" or "KeyError: 'target_ip'" is unacceptable. This module ensures that every failure—whether it's a tool timeout, a malformed query, or a signature mismatch—is transformed into a **Human-Readable and Actionable** error message.

By providing clear "Next Steps" for every failure, SentinelMesh reduces the MTTR (Mean Time to Resolution) for platform issues and ensures that analysts are never "stuck" due to technical obscurity.

---

## 1. Persona-Based Value Proposition

### For the SOC Analyst

- **Immediate Clarity**: Instead of "API Error," you see "GCP IAM Plugin: Rate limit exceeded. Waiting 30s before retry."
- **Reduced Frustration**: Clear guidance on whether you should "Retry the cell," "Contact SRE," or "Modify the input parameter."

### For the SRE / On-Call Engineer

- **Faster Debugging**: Error messages include the full `correlation_id` and the specific [Integration Plugin](../TIER-DEEP-DIVES/tier4-integration-plugin-system.md) that failed, making log-hunting obsolete.
- **Self-Healing Guidance**: Errors often include a "Suggested Fix" (e.g., "Check if service account ASO-001 has the 'roles/iam.securityAdmin' permission").

### For the Automation Engineer

- **Improved Script Robustness**: Use the standardized `ASOException` class to ensure your new tools provide consistent, high-quality feedback to the [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md).

---

## 2. Architecture & Design: The Error Pipeline

### 2.1 The Standardized Error Schema

Every platform error is encapsulated in a JSON object:

- **`code`**: A unique, searchable ASO error code (e.g., `ASO-KMS-001`).
- **`summary`**: A one-line, non-technical description of what happened.
- **`actionable_guidance`**: A list of specific steps to resolve the issue.
- **`technical_details`**: The raw stack trace or API response (hidden by default in the [Visual UI](../../appendices/2023-04-planning/visual-ui-superpowers.md)).
- **`correlation_id`**: The ID used to link the error to the [Distributed Trace](../OPERATIONS/monitoring-observability.md).

### 2.2 The Error Formatter (`src/runtime/error_formatter.py`)

This module acts as a middleware that intercepts all exceptions:

1.  **Categorization**: Identifies the source of the error (KMS, LLM, Plugin, Runtime).
2.  **Context Enrichment**: Appends the active incident ID and [Playbook TIER](../TIER-DEEP-DIVES/tier3-configuration-file-format.md) to the error metadata.
3.  **UI Rendering**: Generates a high-contrast [Actionable Callout](../../appendices/2023-04-planning/visual-ui-superpowers.md) for the analyst's notebook.

---

## 3. Implementation Details: Formatter Logic

### Core Formatter (`src/runtime/error_formatter.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Preventing Information Leakage

The formatter performs a "Sanitization" step to ensure that sensitive data (e.g., API keys, internal IPs, or PII) is never included in the `summary` or `guidance` fields that are visible to analysts. This prevents the logs from becoming a source of data exfiltration.

### 4.2 Compliance Mapping

- **NIST 800-53 (SI-11)**: Fulfills requirements for "Error Handling" by ensuring the system generates error messages that provide information necessary for corrective actions without revealing exploitable information.
- **OWASP Top 10 (A09:2021)**: Addresses "Security Logging and Monitoring Failures" by providing clear, standardized error reporting.

---

## 5. Operations & Performance Tuning

### Searching Error Codes

Analysts can search for any `ASO-ERR-XXX` code in the internal documentation portal to find more detailed troubleshooting guides and historical context for that specific failure.

### Monitoring Error Trends

Use the [Monitoring & Observability Dashboard](../OPERATIONS/monitoring-observability.md) to track the frequency of specific error codes, helping to identify systemic issues with the platform or its integrations.

---

## 6. Future Growth & Opportunities

- **AI-Generated Error Guidance**: Using a specialized model to analyze the raw stack trace and the active playbook state to provide highly-contextual "Self-Healing" suggestions.
- **Automated Error Correction**: (Experimental) Allowing the [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) to automatically "Retry with Correction" for common transient errors (e.g., refreshing an expired token).
- **Interactive Troubleshooting Wizard**: Providing a "Step-by-Step" wizard directly in the notebook to help analysts resolve complex platform issues.
  - Example: If a KMS signing error occurs, the wizard walks the analyst through verifying their IAM permissions and the KMS key status.
