# Specification: Automate False-Positive Tuning

## Overview

When a human operator rejects a probabilistic playbook branch (e.g., marks an alert as a False Positive and cancels containment), this valuable feedback is often lost. This specification establishes an automated feedback loop where rejections trigger a sub-agent to tune the originating detection rule.

## Objectives

- Automatically learn from human overrides.
- Reduce future false positives by tuning Sigma rules.
- Close the loop between incident response and detection engineering.

## Requirements

- The HITL rejection widget must prompt the operator for a brief reason (e.g., "Expected admin behavior").
- Upon rejection, a background "Detection Engineer Agent" must be spun up, fed the context and rejection reason.
- The agent must propose a modification to the underlying Sigma rule (e.g., adding an exclusion filter) and submit it as a Pull Request for review.
