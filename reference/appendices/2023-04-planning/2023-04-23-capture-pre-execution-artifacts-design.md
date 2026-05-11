# Specification: Capture Pre-Execution Artifacts

## Overview

Containment actions (e.g., isolating a host or killing a process) destroy volatile memory state that may be critical for later forensic analysis. This specification requires agents to automatically capture volatile memory dumps before executing any human-gate containment.

## Objectives

- Preserve volatile state permanently for deep forensic analysis.
- Ensure that autonomous remediation does not destroy evidence.
- Automate the standard "first responder" artifact collection phase.

## Requirements

- Identify all state-mutating containment tools in the registry.
- Enforce a dependency that a "Memory/State Capture" playbook cell must execute successfully _before_ the containment tool is permitted to run.
- Use integrations like Volatility 3, GRR, or EDR native API functions to grab memory and process trees.
