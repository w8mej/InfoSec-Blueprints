# Specification: Enforce Minimalist HTML Outputs

## Overview

Complex ipywidgets or heavy JavaScript rendering for data frames often fail to render cleanly in PDF exports and disrupt LLM agent parsing capabilities. This specification restricts the use of heavy UI elements in favor of minimalist, export-safe formats.

## Objectives

- Ensure playbooks can be cleanly exported to PDF for legal/compliance archiving.
- Ensure agents can read the DOM/output state without choking on complex JS/HTML structures.
- Reduce notebook file size and load times.

## Requirements

- Prohibit the use of complex interactive JavaScript widgets for standard data tables.
- Mandate standard Markdown tables or plain text JSON formatting for agent-facing outputs.
- Any interactive widgets (like HITL gates) must have a graceful fallback to raw text or be excluded from PDF exports.
