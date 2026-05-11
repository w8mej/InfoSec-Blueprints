# Specification: Highlight Actionable Callouts

## Overview

Information overload is a critical issue. This spec requires the use of distinct, desaturated admonition blocks for conditions requiring human intervention, while suppressing visual noise elsewhere to guide the eye directly to what matters.

## Objectives

- Focus human attention strictly on actionable items.
- Suppress non-actionable debugging or transitional text into collapsible or muted blocks.
- Decrease the time it takes for an analyst to find the "next step".

## Requirements

- Use GitHub-style Markdown alerts (e.g., `> [!IMPORTANT]`) exclusively for actionable human tasks.
- Ensure that non-critical output uses standard or muted text coloring.
