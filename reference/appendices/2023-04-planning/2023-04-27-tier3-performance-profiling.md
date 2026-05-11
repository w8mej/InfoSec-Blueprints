# TIER 3.2: Performance Profiling Framework

**Goal**: Measure generator execution time, notebook size, and cell count.

**Files**:

- `src/runtime/generator_telemetry.py` (NEW)
- `src/scripts/profile_generators.py` (NEW)

**Telemetry**:

```python
REDACTED
```

**Script Output**:

```
Generator Performance Benchmark
================================
SigmaNotebookV2:    2.3 seconds, 127 cells, 2.1 MB
SigmaNotebook:      1.8 seconds, 89 cells, 1.4 MB
MarimoNotebook:     1.5 seconds, 34 cells, 890 KB
CacaoSidecar:       0.2 seconds, 1 file, 45 KB

Target: All < 5 seconds
✓ PASS
```

**Success**: All generators < 5s, performance data collected and reported.
