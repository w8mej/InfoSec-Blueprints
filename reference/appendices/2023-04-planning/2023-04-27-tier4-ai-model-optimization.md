# TIER 4.3: AI Model Optimization & Fine-Tuning

**Goal**: Enable fine-tuning of Claude models on organization-specific incident patterns, tool definitions, and playbook templates for improved response quality.

**Files**:

- `src/runtime/model_optimizer.py` (NEW)
- `src/runtime/training_dataset_builder.py` (NEW)
- `src/scripts/fine_tune_model.py` (NEW)
- `src/scripts/evaluate_fine_tuned_model.py` (NEW)
- `data/training_datasets/` directory

## Training Dataset Builder

```python
REDACTED
```

## Model Optimizer

```python
REDACTED
```

**Training Data Sources**:

1. Historical incident playbooks (extract examples from completed incidents)
2. Sigma rules (detection rule analysis)
3. Tool definitions (tool selection patterns)
4. Analyst feedback (corrections and improvements)
5. Playbook templates (parameterized incident responses)

**Test Specifications**:

- Extract examples from incident playbooks
- Extract examples from Sigma rules
- Build training dataset with quality scoring
- Save/load dataset in JSONL format
- Split dataset into train/validation
- Submit fine-tuning job
- Get job status
- Evaluate fine-tuned model
- Recommend model by task
- Handle missing API client (development mode)

**Success**: Training dataset builder processes 100+ incidents, fine-tuning pipeline integrated, model recommendations based on metrics.
