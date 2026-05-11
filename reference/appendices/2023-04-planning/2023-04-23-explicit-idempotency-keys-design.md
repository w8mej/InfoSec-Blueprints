# Specification: Implement Explicit Idempotency Keys

## Overview

State-mutating actions (like "Isolate Endpoint" or "Block IP") executed over network connections are vulnerable to timeouts. A network failure might cause the agent to retry the action, resulting in catastrophic double-executions. This spec requires idempotency keys for all mutating actions.

## Objectives

- Ensure that retried state-mutating actions are only executed once.
- Provide a cryptographic guarantee that actions map to a specific intent.
- Improve system resilience and prevent accidental self-denial of service.

## Requirements

- All tool schemas for mutating actions must include a mandatory `idempotency_key` string parameter.
- The Sentinel Mesh runtime must automatically inject or mandate the generation of this key (e.g., UUIDv4 combined with incident ID).
- Target systems (EDR, Firewall) integration layers must respect and store idempotency keys.
