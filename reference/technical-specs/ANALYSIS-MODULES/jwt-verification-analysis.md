# Analysis Module: JWT Integrity & Lifecycle Verification

## Document Metadata

- **Audience**: Security Architects | Incident Responders | Identity & Access Management (IAM) Engineers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [forensic-security-capabilities.md](../../appendices/2023-04-planning/forensic-security-superpowers.md)
- **Related Specs**: `2023-04-23-eliminate-ephemeral-jwt-trust-design.md`, `2023-04-23-sign-executions-via-detached-jws-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/analysis/jwt_verification.py`

## Quick Summary

The JWT Integrity & Lifecycle Verification module is the "Identity Guard" of SentinelMesh. It is responsible for the cryptographic validation and forensic analysis of JSON Web Tokens (JWTs) used within the framework. In a zero-trust environment, we cannot assume that a token is valid just because it hasn't expired. This module verifies the **Signature, Claims, and Issuer** of every token, while also performing a "Lifecycle Analysis" to detect anomaly patterns such as "Token Replay" or "Session Hijacking."

By ensuring the absolute integrity of identity tokens, this module protects the [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) from unauthorized command injection and ensures that all [Signed Forensics](../../appendices/2023-04-planning/forensic-security-superpowers.md) are bound to legitimate, non-compromised identities.

---

## 1. Persona-Based Value Proposition

### For the IAM Engineer

- **Token Hardening**: Identify tokens with weak signing algorithms (e.g., `none` or `HS256`) or excessively long lifetimes.
- **Root Cause Analysis**: When an unauthorized action is detected, use the lifecycle analysis to determine exactly how and when the token was compromised.

### For the SOC Analyst / Responder

- **Identity Assurance**: Before taking a high-risk action, the module provides a "Green Checkmark" verification of your current session token, ensuring your actions are properly attributed.
- **Automated Revocation**: If a token is flagged as "Suspicious" (e.g., used from an abnormal IP), the module can automatically trigger a revocation via the [Integration Plugin System](../TIER-DEEP-DIVES/tier4-integration-plugin-system.md).

### For the Security Architect

- **Cryptographic Rigor**: Enforces the use of asymmetric signing (RS256/ES256) and hardware-backed key material (Cloud KMS) for all internal identity operations.

---

## 2. Architecture & Design: The Verification Pipeline

### 2.1 Cryptographic Validation

The module performs a strict check of the JWT structure:

1.  **Header Analysis**: Rejects tokens with `alg: "none"` or unauthorized algorithms.
2.  **Signature Verification**: Validates the payload signature against the authorized `jwks_uri` or [Cloud KMS Public Keys](../TIER-1-FOUNDATIONS/kms-schema-signer.md).
3.  **Claim Validation**: Enforces standard claims (`iss`, `sub`, `aud`, `exp`, `nbf`, `iat`) and organization-specific custom claims.

### 2.2 Forensic Lifecycle Analysis

Beyond simple validation, the module tracks the "History of a Token":

- **JTI Tracking**: Monitors "JWT ID" (JTI) claims to prevent **Replay Attacks**.
- **Contextual Binding**: Checks if the token is being used from a different IP, User-Agent, or Geographic region than its initial issuance.
- **Velocity Check**: Detects tokens used across an impossible distance in a short time (e.g., "San Francisco to London in 10 minutes").

---

## 3. Implementation Details: Verification Logic

### Core Verification Engine (`src/analysis/jwt_verification.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 "Zero-Ephemeral-Trust" Policy

We prohibit the use of "Self-Signed" or "Untracked" tokens. Every token must be issued by a central authority and its JTI must be recorded in the [Signed Execution Logs](../../appendices/2023-04-planning/forensic-security-superpowers.md) for non-repudiation.

### 4.2 Compliance Mapping

- **NIST 800-63B (Authentication and Lifecycle Management)**: Fulfills requirements for "Validator Requirements" and "Reassertion of Identity."
- **PCI-DSS (Requirement 8)**: Supports "Identify and Authenticate Access to System Components" through rigorous token validation.

---

## 5. Operations & Performance Tuning

### Token Expiration Strategy

We enforce a **Short-Lived Token** policy (e.g., 15-minute expiry) combined with [Detached JWS Signatures](../../appendices/2023-04-planning/forensic-security-superpowers.md) for long-term forensic persistence.

### Debugging Failed Verifications

Check the [Monitoring Dashboard](../OPERATIONS/monitoring-observability.md) for "JWT_SIGNATURE_INVALID" alerts. These often indicate a misconfigured `jwks_uri` or an expired KMS key version.

---

## 6. Future Growth & Opportunities

- **DPoP (Demonstrating Proof-of-Possession)**: Implementing the DPoP standard to cryptographically bind a JWT to a specific client private key, making token theft virtually useless.
- **AI-Driven Anomaly Detection**: Using ML to identify subtle patterns in token usage that might indicate "Session Fixation" or other complex identity attacks.
- **Hardware-Enforced JWTs**: Binding tokens to a device's **TPM (Trusted Platform Module)** to ensure they cannot be moved from the machine on which they were issued.
