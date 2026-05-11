# Specification: Encode Rollback URI Linkage

## Overview

Agentic mistakes happen. If an action is taken (e.g., isolating a host), the metadata must define a specific rollback procedure that the agent or human can invoke instantaneously to revert the state to baseline.

## Objectives

- Ensure that every destructive action is strictly reversible.
- Provide operators with a one-click "undo" button in the case of a false positive containment.
- Decrease MTTR (Mean Time to Recovery) for accidental outages.

## Requirements

- Every playbook containing a state-mutating action must include a `rollback_procedure_id` or `rollback_uri` in its metadata.
- This URI must point to an atomic "Undo" playbook (e.g., `Unisolate_Host.ipynb`).
- The notebook UI must expose this rollback option visibly upon the completion of a mutating cell.
