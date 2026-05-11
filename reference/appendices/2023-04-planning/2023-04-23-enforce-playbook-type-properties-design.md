# Specification: Enforce Playbook Type Properties

## Overview

Metadata is the connective tissue between the playbook logic and the executing environment. Mandating the CACAO Playbook Type field (e.g., threat detection, mitigation) provides immediate, definitive context to the agent regarding its operational bounds.

## Objectives

- Prevent context confusion in multi-agent environments.
- Ensure agents know exactly what type of operational playbook they are executing (e.g., a "detection" agent shouldn't try to "mitigate").
- Enforce strict CACAO metadata schema compliance.

## Requirements

- All notebooks must define `cacao_playbook_type` in their metadata header.
- The execution framework must inject this type into the agent's system prompt at runtime.
- The agent framework must restrict the toolset based on this type (e.g., mitigation tools are disabled if `playbook_type == "detection"`).
