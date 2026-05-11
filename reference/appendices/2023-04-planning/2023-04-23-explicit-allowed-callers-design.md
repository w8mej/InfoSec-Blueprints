# Specification: Define Explicit allowed_callers

## Overview

Not all agent functions should have the ability to execute high-risk tool schemas. A compromised or hallucinating "Triage Agent" should not be able to invoke the "Isolate Endpoint" tool. This spec defines a cryptographic/RBAC mapping to prevent privilege escalation within the agentic architecture.

## Objectives

- Implement least-privilege principles for agentic tool access.
- Prevent unprivileged agents/prompts from calling destructive actions.
- Map tool schemas strictly to their authorized execution contexts.

## Requirements

- Every tool definition must include an `allowed_callers` array detailing the specific agent roles or cell IDs that can execute it.
- The tool execution runtime must inspect the calling context before invoking the tool.
- Unauthorized calls must be cryptographically or programmatically blocked with an immediate failure.
