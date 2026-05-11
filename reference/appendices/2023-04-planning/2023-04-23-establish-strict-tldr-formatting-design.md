# Specification: Establish Strict TL;DR Formatting

## Overview

Analysts do not have time to read paragraphs of exposition during an active breach. This specification requires a formalized BLUF (Bottom Line Up Front) cell strictly bounded to 150 words outlining the threat, affected user, and immediate system impact.

## Objectives

- Accelerate the "time to understanding" for an analyst opening a new playbook ticket.
- Standardize the incident summary format across all playbooks.
- Ensure brevity is algorithmically enforced.

## Requirements

- The Agent responsible for the initial Triage phase must generate a "TL;DR" summary.
- The summary must explicitly state: The Threat, The Target, The Impact, and The Recommended Action.
- The output must be strictly less than 150 words.
