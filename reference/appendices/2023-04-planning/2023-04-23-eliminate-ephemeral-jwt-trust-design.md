# Specification: Eliminate Ephemeral JWT Trust

## Overview

During forensic investigations, agents must log the full token lifecycle and verify JWT algorithms to detect token forgery (e.g., `alg: none` attacks or symmetric key extraction), rather than implicitly trusting session state.

## Objectives

- Prevent threat actors from pivoting via forged JWTs during an active incident.
- Provide a rigorous audit trail of all authentication tokens involved in an investigation.
- Ensure the agent actively validates trust boundaries.

## Requirements

- Any playbook interacting with authentication logs or APIs must extract and cryptographically verify the JWTs.
- The agent must be equipped with tools to inspect JWT headers, payloads, and signature validity.
- The full token lifecycle (issuance, usage, expiry) must be logged explicitly in the playbook state.
