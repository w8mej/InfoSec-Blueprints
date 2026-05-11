# Specification: KMS-Signed Schema Definitions

**Version**: 0.3.0  
**Status**: Pending Implementation  
**Owner**: Gemini Flash  
**Date**: 2023-04-27

---

## Problem Statement

Current execution signing uses stdlib HMAC-SHA256, which is insufficient for:

- **Enterprise PKI compliance**: Requires hardware-backed key storage (HSM, KMS)
- **Key rotation**: Manual HMAC key management doesn't scale
- **Audit requirements**: No external CA attestation for signed artifacts
- **Cross-platform verification**: HMAC keys are environment-specific

### Current State

- `ExecutionSigner` uses `hmac.new()` with optional signing key
- Keys stored as env vars or literals (insecure)
- No cloud provider integration

### Target State

- Abstract KMS provider interface (AWS, GCP, Azure compatible)
- Automatic key rotation policies enforced
- External audit trail in KMS platform
- Backward compatibility with stdlib HMAC fallback

---

## Goals

1. **Enable enterprise deployments** requiring FIPS 140-4 key management
2. **Support multi-cloud environments** (AWS KMS, GCP Cloud KMS, Azure Key Vault)
3. **Maintain backward compatibility** with HMAC for local development
4. **Provide audit trail** of all signing operations
5. **Reduce key management burden** via cloud provider integration

---

## Functional Requirements

### R1: KMS Provider Abstraction

**Files**: `src/runtime/kms_schema_signer.py`

```python
REDACTED
```

**Requirements**:

- R1.1: Support AWS KMS, GCP Cloud KMS, Azure Key Vault
- R1.2: Detect available credentials from environment (IAM roles, service accounts)
- R1.3: Graceful fallback to stdlib HMAC if KMS unavailable (log warning, continue)
- R1.4: Provider selection via env var `KMS_PROVIDER` (aws|gcp|azure|hmac)

### R2: Integration with ExecutionSigner

**Files**: `src/runtime/execution_signer.py` (modify existing)

```python
REDACTED
```

**Requirements**:

- R2.1: Auto-detect KMS provider from env var or credential chain
- R2.2: Maintain existing HMAC interface for backward compatibility
- R2.3: Log signing operation: timestamp, key ID, payload hash

### R3: CACAO Playbook Integration

**Files**: `src/generate/CacaoSidecar.py` (modify `to_dict()`)

```json
{
  "execution_signature_config": {
    "algorithm": "KMS:AWS:ECDSA_SHA_256",
    "storage": "notebook_metadata",
    "chain_of_custody_enabled": true,
    "detached_jws_format": "header.signature",
    "kms_config": {
      "provider": "aws",
      "key_arn": "arn:aws:kms:us-east-1:123456789:key/12345678-1234-1234-1234-123456789",
      "region": "us-east-1",
      "rotation_enabled": true
    }
  }
}
```

**Requirements**:

- R3.1: Inject KMS config into CACAO execution_signature_config
- R3.2: Include key rotation status
- R3.3: Support all 4 generators (SigmaNotebookV2, SigmaNotebook, MarimoNotebook, CacaoSidecar)

### R4: Generator Injection Points

| Generator       | Cell/Method                                | Injection                               |
| --------------- | ------------------------------------------ | --------------------------------------- |
| SigmaNotebookV2 | Cell 6 (`_add_cell_6_evidentiary_signing`) | Import KMSProvider, initialize from env |
| SigmaNotebook   | `_inject_postmortem_code()`                | Add KMS signing setup                   |
| MarimoNotebook  | `closeout` cell                            | Add KMS initialization                  |
| CacaoSidecar    | `to_dict()` execution_signature_config     | Inject kms_config block                 |

**Requirements**:

- R4.1: Each generator detects `KMS_PROVIDER` env var
- R4.2: If set, initialize KMS provider in bootstrap
- R4.3: If unset, warn and fall back to HMAC
- R4.4: All 4 generators pass KMS provider to ExecutionSigner

---

## Non-Functional Requirements

### NF1: Performance

- KMS sign/verify < 500ms per operation (network latency acceptable)
- Cached credentials (boto3 session reuse, GCP client reuse)
- No blocking on KMS availability (log & continue on timeout)

### NF2: Security

- Private keys never leave KMS (no export)
- Credentials loaded from IAM roles, service accounts (not literals)
- TLS verification for KMS API calls
- Audit logs in KMS provider (immutable)

### NF3: Observability

- Log each sign/verify operation: provider, key_id, payload_hash, duration
- Export KMS errors to execution telemetry
- Metrics: success rate, latency histogram

---

## Test Specifications

### Unit Tests (25+)

**File**: `tests/test_kms_schema_signer.py`

```python
REDACTED
```

**Coverage Target**: >= 80%

---

## Edge Cases & Handling

| Edge Case                | Handling                                                 |
| ------------------------ | -------------------------------------------------------- |
| KMS key not found        | Log error, raise ValueError, don't attempt HMAC fallback |
| KMS service unavailable  | Log warning, fall back to HMAC (if key provided)         |
| Invalid credentials      | Raise ImportError with setup instructions                |
| Network timeout (> 5s)   | Abort signing, raise TimeoutError                        |
| Key rotation in progress | Transparent to caller (KMS handles)                      |
| Multiple signing keys    | Use env var `KMS_KEY_ID` to specify                      |

---

## Success Criteria

- [ ] 4 KMS providers implemented (AWS, GCP, Azure, HMAC fallback)
- [ ] All 4 generators support KMS injection
- [ ] CACAO playbooks record KMS metadata
- [ ] 25+ unit tests, >= 80% coverage
- [ ] Backward compatible (HMAC still works)
- [ ] No blocking on KMS availability
- [ ] Documented: setup guide for each cloud provider

---

## Acceptance Checklist

- [ ] Code review passed
- [ ] All tests passing
- [ ] Type checking (pyright) passing
- [ ] Integration test with real AWS/GCP/Azure credentials (manual)
- [ ] Feature doc created (`docs/guides/kms-signing-setup.md`)
- [ ] Example config provided (`.aso.yaml`)
