# Implementation Plan: Standardize Query Formats

## 1. System Prompt & Examples

- Update the agent prompt for query-generating tools to strictly mandate the required format: `[Action][field] in [log type]`.
- Provide positive and negative examples in the system prompt or tool schema to demonstrate efficient vs. unbounded queries.

## 2. Static Analysis Middleware

- Implement a regex or lightweight AST parser within the SIEM tool wrapper.
- Intercept the agent's query and validate it against the required format.
- Ensure explicit time bounds are present (e.g., parsing for `earliest=` and `latest=` in Splunk, or `ago()` in KQL).

## 3. Fallback and Correction

- If a query fails validation or exceeds the maximum allowed time bound, block the execution.
- Return a detailed error to the agent instructing it to rewrite the query with proper bounds and formatting.
