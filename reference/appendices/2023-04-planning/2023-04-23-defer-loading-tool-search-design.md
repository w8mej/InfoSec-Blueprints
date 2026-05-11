# Specification: Utilize defer_loading for Tool Search

## Overview

Playbooks might integrate with hundreds of distinct APIs and tools. Loading all these schemas into the context window at once exhausts token limits and confuses the agent. We will implement Anthropic's Tool Search pattern, allowing the agent to dynamically fetch (`defer_loading`) schemas only when needed.

## Objectives

- Preserve context window limits.
- Allow playbooks to scale to thousands of integrations.
- Enable the agent to dynamically discover tools based on current situational awareness.

## Requirements

- Provide a root tool, such as `search_available_tools(query: str)`, to the agent.
- The search tool must return the JSON schemas of relevant tools based on semantic similarity to the query.
- Only load explicitly requested tool schemas into the active context for subsequent execution.
