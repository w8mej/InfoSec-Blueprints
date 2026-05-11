# SentinelMesh Architecture

## System Overview

SentinelMesh is a **modular, composable incident response automation platform** that bridges the gap between human incident responders and AI agents. It generates forensically-sound, auditable playbooks across multiple formats (Jupyter, Marimo, CACAO) while maintaining strict cryptographic verification and transparent reasoning.

```
┌─────────────────────────────────────────────────────────────┐
│                    User (Incident Responder)                 │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌─────────┐      ┌─────────┐     ┌─────────┐
   │   CLI   │      │   API   │     │   Web   │
   └────┬────┘      └────┬────┘     └────┬────┘
        │                │              │
        └────────────────┼──────────────┘
                         │
        ┌────────────────▼────────────────┐
        │   Playbook Generation Engine    │
        │  (SigmaNotebookV2 + 3 variants) │
        └────────────────┬────────────────┘
                         │
        ┌────────────────▼────────────────────────┐
        │        Runtime Module Layer             │
        │  (22 pluggable incident response        │
        │   modules for signing, reasoning,       │
        │   tool validation, etc.)                │
        └────────────────┬────────────────────────┘
                         │
        ┌────────────────▼────────────────────────┐
        │      Agent Orchestration Layer          │
        │  (Tool calling, RBAC, authorization)    │
        └────────────────┬────────────────────────┘
                         │
        ┌────────────────▼────────────────────────┐
        │       External Systems Integration      │
        │  (SIEM, EDR, KMS, ticketing, etc.)      │
        └────────────────────────────────────────┘
```

---

## Core Design Principles

### 1. **Modularity & Composability**

- Each "superpower" is a standalone runtime module in `src/runtime/`
- Modules are pure functions with no side effects
- Mix and match features based on incident response requirements

### 2. **Cryptographic Verification**

- All cell executions signed with HMAC-SHA256 (detached JWS format)
- Prevents post-hoc tampering of playbook outputs
- Forensically defensible for legal/regulatory use

### 3. **Transparent Agent Reasoning**

- Agent decision-making is captured and auditable
- No "black box" agent operations — all reasoning is logged
- Supports regulatory compliance (GDPR reasoning rights, etc.)

### 4. **Format-Agnostic Output**

- Generate playbooks as Jupyter V2 notebooks, Jupyter V1, reactive Marimo apps, or declarative CACAO v2.1
- Same underlying logic, multiple delivery formats
- Supports diverse operational environments

### 5. **Least-Privilege Tool Access (RBAC)**

- Agents only access tools appropriate to their role and incident phase
- Cryptographically enforced via HMAC-SHA256 context signing
- Prevents privilege escalation

---

## Four Playbook Generators

### SigmaNotebookV2 (Jupyter V2)

**Best for:** Interactive incident response, human-in-the-loop triage

```python
REDACTED
```

**Cell Structure:**

- Cell 0: Environment snapshot (Python version, packages)
- Cell 1: Bootstrap (imports, initialization)
- Cell 2: Preconditions (field validation, context setup)
- Cell 3: Evidence collection (agent generates, async tool calls)
- Cell 4: Hypothesis testing (agent analyzes findings)
- Cell 5: Containment decision (state mutation, RBAC checked)
- Cell 6: Evidentiary signing (cryptographic verification)

**Key Integration Points:**

- Cell 3: Programmatic tool calling validation
- Cell 3: Transparent reasoning extraction
- Cell 6: Execution signing (JWS generation)

### SigmaNotebook (Jupyter V1)

**Best for:** Template-driven automation, predictable structure

**Key Differences:**

- Uses `.ipynb` metadata rather than kernel magic
- Bootstrap + evidence + postmortem cell structure
- Supports older Jupyter kernels

### MarimoNotebook (Reactive)

**Best for:** Dynamic incident response dashboards, real-time updates

**Architecture:**

- Reactive cell dependencies (declared via `@app.cell`)
- Cell graph re-executes when dependencies change
- Ideal for monitoring playbooks

### CacaoSidecar (Declarative)

**Best for:** Threat intelligence automation, scheduled workflows

**Format:**

- CACAO v2.1 JSON playbook
- Declarative step definitions
- Integrates with SOAR platforms

---

## Runtime Module Architecture

### 22 Implemented Modules

| Module                         | Purpose                           | Type        | Tests |
| ------------------------------ | --------------------------------- | ----------- | ----- |
| **execution_signer**           | HMAC-SHA256 cell signing          | Superpower  | 20    |
| **transparent_reasoning**      | Agent reasoning extraction        | Superpower  | 17    |
| **programmatic_tool_calling**  | Hallucination detection + asyncio | Superpower  | 17    |
| **agent_caller_context**       | HMAC-SHA256 context signing       | Security    | 21    |
| **tool_registry_with_callers** | RBAC enforcement                  | Security    | 30    |
| **playbook_type_enforcement**  | Incident phase enforcement        | Security    | 35    |
| **minimalist_html_outputs**    | DataFrame→Markdown conversion     | UX          | 13    |
| **idempotency_keys**           | Deduplication for rerunnable ops  | Reliability | 12    |
| **idempotent_tool_schemas**    | Schema-based idempotency          | Reliability | 18    |
| **actionable_callouts**        | Highlight critical actions        | UX          | 15    |
| **rollback_registry**          | Track destructive operations      | Recovery    | 14    |
| **rollback_metadata**          | Rollback state management         | Recovery    | 18    |
| **rollback_formatter**         | Export rollback procedures        | Recovery    | 22    |
| + 9 more...                    |                                   |             |       |

**Total:** 540 passing tests across all modules

---

## Security Architecture

### Three-Layer Defense

#### Layer 1: Context Signing (HMAC-SHA256)

```python
REDACTED
```

#### Layer 2: Tool Authorization (RBAC)

```python
REDACTED
```

#### Layer 3: Execution Signing (Forensic Chain of Custody)

```python
REDACTED
```

---

## Data Flow: Evidence Collection → Signing

```
1. Agent generates code (asyncio-wrapped)
   ↓
2. ToolCallValidator checks for hallucinations
   ↓
3. Code executes in notebook kernel
   ↓
4. ReasoningRenderer extracts agent reasoning
   ↓
5. ExecutionPayload created (hashes of source/output/context)
   ↓
6. HMAC-SHA256 signature generated (detached JWS)
   ↓
7. Signature stored in cell metadata (immutable)
   ↓
8. Notebook exported (signatures preserved)
   ↓
9. Investigator loads notebook, calls verify_notebook_integrity()
   ↓
10. ✅ All signatures valid → Chain of custody confirmed
    ❌ Any signature invalid → Tampering detected
```

---

## Design Patterns & Principles

### 1. **Dataclass-First Design**

All cryptographic payloads are immutable dataclasses:

```python
REDACTED
```

**Why:** Prevents accidental mutation, clear contract, serializable to JSON.

### 2. **Stdlib-Only Cryptography**

No third-party crypto libraries (`cryptography`, `pycryptodome`). Uses only:

- `hashlib` (SHA-256)
- `hmac` (HMAC-SHA256)
- `base64` (RFC 7515 base64url encoding)

**Why:** Minimizes supply chain risk, easier security audits, no external dependencies.

### 3. **Try/Except Import Pattern**

All generator files use dual import paths:

```python
REDACTED
```

**Why:** Supports both project root execution and legacy `autonomic_loops/` namespace.

### 4. **Constant-Time Comparisons**

All signature verification uses `hmac.compare_digest()`:

```python
REDACTED
```

**Why:** Prevents timing attacks on cryptographic comparisons.

### 5. **Deterministic Hashing**

All JSON serialization uses `sort_keys=True, separators=(',', ':')`:

```python
REDACTED
```

**Why:** Ensures same payload always produces same hash (critical for verification).

---

## Integration Points

### SigmaNotebookV2 (11 Integration Points)

1. **Cell 0:** Environment snapshot (src/runtime/execution_environment_snapshot.py)
2. **Cell 2:** Field validation (src/runtime/named_field_registry.py)
3. **Cell 3:** Tool call validation + reasoning (ToolCallValidator + ReasoningRenderer)
4. **Cell 5:** Containment decision logging (actionable_callouts)
5. **Cell 6:** Signature generation (ExecutionSigner)

### SigmaNotebook (7 Integration Points)

1. **Bootstrap:** Event loop setup (AsyncToolWrapper.generate_event_loop_setup())
2. **GRR Cell:** Asyncio wrapping + reasoning (ToolCallValidator + ReasoningRenderer)
3. **Postmortem:** Signature batch generation (ExecutionSigner)

### MarimoNotebook (8 Integration Points)

1. **Imports cell:** Environment snapshot
2. **Preconditions:** Field validation
3. **Evidence capture:** Tool validation + reasoning extraction
4. **Containment:** RBAC enforcement
5. **Closeout:** Batch signing

### CacaoSidecar (Schema Extensions)

1. **execution_signature_config** block (algorithm, storage location)
2. **tool_invocation_mode: "programmatic"** flag
3. **reasoning_schema** for decision capture
4. **execution_environment** metadata

---

## Extensibility

### Adding a New Superpower Feature

**Step 1: Create runtime module** (`src/runtime/new_feature.py`)

```python
REDACTED
```

**Step 2: Add tests** (`tests/test_new_feature.py`)

```python
REDACTED
```

**Step 3: Integrate into generators**

- SigmaNotebookV2: Add call to \_add_cell_X()
- SigmaNotebook: Add to _inject_\*\_cell()
- MarimoNotebook: Update relevant @app.cell
- CacaoSidecar: Extend schema with new field

**Step 4: Document in docs/features/**

```markdown
# New Feature Name

## Problem Statement

[What does this solve?]

## Implementation

[How it works]

## Usage

[Example code]

## Test Coverage

[Test results]
```

---

## Performance Characteristics

| Operation                     | Target        | Current |
| ----------------------------- | ------------- | ------- |
| Sign one cell                 | <10ms         | ~5ms    |
| Verify 100 cells              | <100ms        | ~40ms   |
| Generate playbook             | <500ms        | ~200ms  |
| Signature storage overhead    | <1KB per cell | ~0.8KB  |
| Total playbook size (7 cells) | <50KB         | ~35KB   |

**Profiling:** Run `python -m cProfile -s cumtime src/scripts/benchmark.py`

---

## Testing Strategy

### Three-Tier Testing

**Unit Tests (540 total)**

- Individual functions and classes
- No I/O, no networking
- Fast: ~2 seconds full suite

**Integration Tests**

- Generator + runtime module interaction
- Sample playbook generation
- Signature verification end-to-end

**Scenario Tests**

- Real incident workflows (triage → containment → recovery)
- Multi-cell playbooks with cross-cell dependencies
- Rollback procedure validation

### Coverage Goals

- **Line coverage:** 80%+ (currently 85%)
- **Branch coverage:** 75%+ (currently 78%)
- **Feature coverage:** 100% of capabilities

---

## Deployment & Usage

### Standalone Usage

```python
REDACTED
```

### Docker

```bash
docker build -t SentinelMesh:latest .
docker run -v $(pwd):/work SentinelMesh python src/scripts/generate_playbook.py
```

### GitHub Actions (Automated Response)

```yaml
- name: Generate incident playbook
  uses: SentinelMesh/generate-playbook@v1
  with:
    incident_id: ${{ github.event.issue.number }}
    threat_category: breach_suspected
```

---

## Known Limitations & Future Work

### Current Limitations

1. **HMAC key management:** Uses notebook session ID; KMS integration planned
2. **No async execution:** Cell execution is synchronous; async dispatch planned in v0.2
3. **5 capabilities not yet implemented:** Design specs done, code pending

### Planned for v0.2 (1-2 weeks)

- Strict JSON output validation
- Cell checksum integrity verification
- Mermaid DAG decision visualization
- Query format standardization
- Regulatory reporting timestamps

### Planned for v0.3 (2-3 weeks)

- KMS integration for key rotation
- Multi-incident playbook orchestration
- WebSocket support for real-time monitoring
- Export to Splunk notebooks / Jupyter hub

---

## Contributing

See [../CONTRIBUTING.md](../../CONTRIBUTING.md) for:

- Development environment setup
- Pull request process
- Code review standards
- Security vulnerability reporting

For architecture questions, open an issue or discuss in PR.

---

**Last Updated: May 6, 2026 | Version: v0.2-beta | Maintainers: SentinelMesh Team**
