# Specification: Eradicate Monolithic Prompts

## Overview

Massive system instructions combining triage, investigation, and remediation cause procedural drift, context confusion, and degraded reasoning. This specification breaks down monolithic prompts into modular sub-agent tasks to improve reliability and focus.

## Objectives

- Prevent agent confusion by strictly limiting context to the immediate task.
- Improve reasoning performance by specializing agents.
- Allow for easier testing, debugging, and updating of specific operational phases.

## Requirements

- Decompose the global agent persona into distinct phases: "Triage", "Investigation", "Remediation", "Reporting".
- Each cell in the playbook must invoke a specific, tightly-scoped agent prompt.
- State must be explicitly handed off between these modular agents rather than relying on a monolithic shared prompt history.
