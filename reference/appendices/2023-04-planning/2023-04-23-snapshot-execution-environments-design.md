# Specification: Snapshot Execution Environments

## Overview

Every playbook execution is anchored to a specific, reproducible environment consisting of Python version, OS kernel, container image (if containerized), and all installed packages. Environment snapshots are captured at both playbook generation and execution time to enable forensic reproducibility, detect unexpected environment changes, and support debugging of environment-dependent behavior. If the execution environment differs from the generation environment, operators are warned of potential compatibility issues.

---

## 1. Environment Components

### Core Snapshot Fields

```python
REDACTED
```

---

## 2. Generation-Time Snapshot

Captured when playbook is generated (Cell 0):

```python
REDACTED
```

Embedded in notebook metadata:

```json
{
  "metadata": {
    "execution_environment": {
      "generation": {...GENERATION_SNAPSHOT...}
    }
  }
}
```

---

## 3. Execution-Time Snapshot

Captured when playbook runs (first executable cell):

```python
REDACTED
```

Stored in execution log:

```json
{
  "execution_record": {
    "playbook_id": "INC-2026-0451",
    "status": "success",
    "environment_snapshot": {...EXECUTION_SNAPSHOT...},
    "environment_match": true
  }
}
```

---

## 4. Environment Detection

### Container Detection (Priority Order)

1. **DOCKER_IMAGE_SHA env var** (set by orchestrator)
   - If present, use directly: `docker://sha256:a1b2c3d4e5f6...`

2. **Docker cgroup** (`/proc/self/cgroup`)
   - Parse: `docker/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
   - Return: `docker://a1b2c3d4e5f6g7h8` (truncated)

3. **Docker socket** (`/.dockerenv` exists)
   - Call Docker API: `docker ps --format "{{.Image}}"`
   - Return: `docker://playbook-runtime:3.11-ubuntu22.04`

4. **Kubernetes** (HOSTNAME format: `pod-name-abc123-xyz`)
   - Return: `kubernetes://pod-name-abc123-xyz`

5. **Bare Metal**
   - Return: `non-containerized`

### Dependency Snapshot

```python
REDACTED
```

Example hash represents:

- Total: 147 packages
- Key packages: numpy 1.24.3, pandas 2.0.2, scikit-learn 1.2.2
- Deterministic (sorted)

---

## 5. Environment Mismatch Handling

### Detection

Compare generation-time vs. execution-time snapshots:

```python
REDACTED
```

### Warning Levels

| Mismatch          | Severity   | Action                                   |
| ----------------- | ---------- | ---------------------------------------- |
| `packages_hash`   | ⚠️ WARNING | Log and continue; may affect results     |
| `python_version`  | ⚠️ WARNING | Log and continue; behavior may differ    |
| `os_kernel`       | 🔴 ERROR   | Stop playbook; environment too different |
| `container_image` | ⚠️ WARNING | Log but continue; likely compatible      |

### Error Message Example

```
⚠️  ENVIRONMENT MISMATCH DETECTED

Generation-time environment:
  Python: 3.11.5 (Linux 6.1.0-21-generic)
  Container: docker://playbook-runtime:3.11-ubuntu22.04
  Packages: f6g7h8i9j0k1m2n3... (147 packages)

Execution-time environment:
  Python: 3.11.5 (Linux 6.5.0-28-generic)  ← Kernel version changed
  Container: docker://playbook-runtime:3.11-ubuntu22.04
  Packages: h0i1j2k3l4m5n6o7... (148 packages)  ← Packages changed

Warnings:
  - OS kernel updated (6.1.0 → 6.5.0): Behavior may differ
  - Package changes detected (147 → 148): Review pip freeze output

Continue with caution. If results differ from original run, re-execute
with the original environment or archive for forensic analysis.
```

---

## 6. Reproducibility Support

### Re-execution with Original Environment

```bash
# If original playbook documented container image:
docker run --rm -v /data:/data \
  playbook-runtime:3.11-ubuntu22.04 \
  jupyter execute original-playbook.ipynb

# If archived in registry:
docker pull archive.company.com/playbook-runtime/sha256:a1b2c3d4e5f6...
docker run ... archive.company.com/playbook-runtime/sha256:a1b2c3d4e5f6... ...
```

### Forensic Audit Trail

```json
{
  "incident_id": "INC-2026-0451",
  "playbook_executions": [
    {
      "run_id": 1,
      "timestamp": "2023-04-25T14:30:00Z",
      "environment": {
        "python": "3.11.5",
        "os": "Linux 6.1.0",
        "container": "docker://playbook-runtime:3.11-ubuntu22.04 (sha256:a1b2...)",
        "packages_hash": "f6g7h8..."
      },
      "result": "success",
      "actions_taken": [...]
    },
    {
      "run_id": 2,
      "timestamp": "2023-04-28T10:15:00Z",  # 3 days later
      "environment": {
        "python": "3.11.5",
        "os": "Linux 6.1.0",
        "container": "docker://playbook-runtime:3.11-ubuntu22.04 (sha256:a1b2...)",
        "packages_hash": "f6g7h8..."  # Identical
      },
      "result": "success",
      "actions_taken": [...]
    }
  ]
}
```

---

## 7. Container Image Archival (Optional)

### Archive Strategy

When a playbook executes in a containerized environment:

1. Extract image SHA from execution environment
2. Check if already archived in registry
3. If new, copy to cold-storage registry (optional)

```python
REDACTED
```

### Storage Considerations

- **Cold storage** (e.g., Harbor, AWS ECR): ~1-2 GB per image
- **Retention**: As long as playbooks may be re-executed
- **Cleanup**: Only delete if no active playbooks reference the image

---

## 8. Integration Points

### SigmaNotebookV2

**Cell 0: Environment Snapshot**

```python
REDACTED
```

**Notebook metadata:**

```json
{
  "metadata": {
    "execution_environment": {
      "generation": {...},
      "required_for_reproduction": true
    }
  }
}
```

### Execution Log

```json
{
  "execution": {
    "playbook_id": "INC-2026-0451",
    "environment_snapshot": {...},
    "environment_match": true|false,
    "environment_warnings": []
  }
}
```

### CACAO Sidecar

```json
{
  "execution_environment": {
    "python": "3.11.5",
    "os_kernel": "Linux 6.1.0",
    "container_image": "sha256:a1b2c3d4..."
  }
}
```

---

## 9. Benefits

### Forensic Integrity

- Proves playbook behavior under exact environment
- Enables reproduction of incidents 6, 12, 24 months later
- Supports legal proceedings

### Debugging

- Identifies environment-dependent bugs
- Shows when dependencies changed
- Facilitates post-mortem analysis

### Compliance

- Documents execution context for audits
- Traces changes to incident response logic
- Supports SOC runbook governance

---

## 10. Testing Reference

Create `tests/test_execution_environment_snapshot.py` with 16+ tests:

**Unit Tests (8)**

- Capture Python version
- Capture OS kernel
- Capture container image (Docker, K8s, bare metal)
- Compute packages hash
- Serialize snapshots
- Generate snapshot code

**Integration Tests (4)**

- V2 playbook includes snapshot cell
- V1 playbook includes snapshot
- Marimo includes environment info
- CACAO sidecar includes environment field

**Comparison Tests (2)**

- Identical environments detected
- Environment mismatches detected

**Edge Cases (2)**

- Missing pip (graceful degradation)
- Running in restricted environment
