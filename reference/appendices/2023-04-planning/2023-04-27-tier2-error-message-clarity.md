# TIER 2.5: Error Message Clarity for Configuration Mismatches

**Problem**: Vague errors when playbook type conflicts with tool category (e.g., "investigation" playbook tries to use "containment" tool).

**Solution**: Enhance error messages with actionable guidance.

**Files**:

- `src/runtime/playbook_type_enforcement.py` — Improve error messages
- All generators — Catch and surface errors in cell output

**Requirements**:

- [ ] Error includes: tool name, required category, playbook type
- [ ] Suggest: "Use playbook_type='remediation'" or "Choose investigation-compatible tool"
- [ ] Include example of compatible tools
- [ ] Log to execution telemetry with error details

**Implementation**:

```python
REDACTED
```

**Success**: Error messages tested in 10+ scenarios, user feedback confirms clarity.
