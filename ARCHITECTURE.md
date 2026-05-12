# SentinelMesh System Architecture

## Overview

**SentinelMesh** is an SentinelMesh framework for intelligent security orchestration and autonomous threat analysis. It provides a modular, extensible platform for building security automation systems that can analyze incidents, coordinate responses, and learn from outcomes.

### Key Philosophy

- **Autonomous Intelligence**: Systems that reason about security incidents independently
- **Orchestration**: Coordinating multiple tools and data sources
- **Analysis**: Deep incident investigation and threat assessment
- **Modularity**: Pluggable components that work together
- **Transparency**: Clear decision trails and explainable recommendations

## System Architecture

```
SentinelMesh
├── src/                    # Main source code
│   ├── analysis/          # Threat and incident analysis
│   ├── organize/          # Security data organization
│   ├── runtime/           # Execution and workflow engine
│   ├── generate/          # Report and artifact generation
│   ├── agents/            # Agentic components
│   └── __init__.py
├── autonomic_loops/       # Autonomous decision-making systems
│   ├── lib/              # Shared libraries
│   ├── remediation/      # Automated response execution
│   └── monitoring/       # Continuous security monitoring
├── docs/                  # GitHub Pages (static HTML only)
├── reference/            # Comprehensive documentation
│   ├── core/            # Architecture & concepts
│   ├── guides/          # How-to documentation
│   ├── technical-specs/ # Deep technical dives
│   ├── appendices/      # Legacy & archived docs
│   └── data/            # JSON reference data
├── conf/                # Configuration & templates
├── infra/                # Configuration & templates
│   ├── gcp/            # GCP 
│   ├── oci/          # Oracle Cloud
│   ├── nvidia/       # NVidia Cloud
│   ├── aws/          # AWS
│   └── azure/            # Azure Trusted
│   ├── qemu/            # hypervisors and isolation technologies
│   ├── ibm/             # IBM
│   ├── local/           # offline and private environments based upon nvidia stacks
│   ├── k8s/             # k8s infra
│   └── trustedfedramp5/ # Fed Gov Clouds across redacted
├── tests/               # Test suite
└── [config files]       # setup.py, pyproject.toml, etc.
```

## Core Components

### Analysis Module (`src/analysis/`)

Threat and incident analysis capabilities:

- **Custody Chain Analysis** (`custody_analyzer.py`): Track evidence handling and chain of custody
- **Blast Radius Calculator** (`blast_radius_calculator.py`): Estimate incident scope and impact
- **False Positive Feedback** (`false_positive_feedback.py`): Learn from detection tuning
- **JWT Verification** (`jwt_verification.py`): Validate and analyze JWTs in incidents
- **Marimo Analysis** (`marimo_analyzer.py`): Analyze notebook-based analytics
- **Pre-Execution Artifacts** (`pre_execution_artifacts.py`): Detect attack preparation

### Organization Module (`src/organize/`)

Security data organization and normalization:

- **CAR Analytics** (`CAR_Analytics.py`): Cyber Analytics Repository mapping
- **Enterprise Org** (`Enterprise_createstructure.py`): Enterprise structure creation
- **ICS Org** (`ICS_createstructure.py`): Industrial control systems structure
- **Mobile Org** (`Mobile_createstructure.py`): Mobile security structure

### Runtime Module (`src/runtime/`)

Execution engine and workflow capabilities:

- **Dry Run Wrapper** (`dry_run_wrapper.py`): Safe execution 
- **Cell Checksums** (`cell_checksums.py`): Integrity validation
- **Cell Metadata Markers** (`cell_metadata_markers.py`): Execution tracking
- **Confidence Threshold** (`confidence_threshold.py`): Confidence scoring
- **Query Standardization** (`query_standardization.py`): Query normalization
- **Signed Timestamp Merkle** (`signed_timestamp_merkle.py`): Timestamped audit trail
- **Actionable Callouts** (`actionable_callouts.py`): Alert generation

### Generation Module (`src/generate/`)

Artifact and report generation:

- **CACAO Sidecar** (`CacaoSidecar.py`): CACAO playbook generation
- **Incident Action Plan** (`IncidentActionPlan.py`): IR plan creation
- **Mermaid Generator** (`MermaidGenerator.py`): Diagram generation
- **Markdown Reports** (`MarkdownReportGenerator.py`): Formatted reports

### Autonomous Loops (`autonomic_loops/`)

Self-managed security systems:

- **SBOM Generator**: Software bill of materials creation
- **UDM Validator**: Unified Data Model validation
- **Remediation Engine**: Automated response execution
- **Monitoring**: Continuous observation and triggering

## Data Flow

```
Security Event
    ↓
[Ingestion & Normalization] → src/organize/
    ↓
[Threat Analysis] → src/analysis/
    ├─→ Custody Chain Analysis
    ├─→ Blast Radius Calculation
    ├─→ False Positive Detection
    └─→ Pre-execution Artifact Detection
    ↓
[Confidence & Severity Scoring] → src/runtime/
    ↓
[Response Generation] → src/generate/
    ├─→ CACAO Playbook
    ├─→ IR Action Plan
    └─→ Markdown Report
    ↓
[Execution] → autonomic_loops/remediation/
    ↓
[Monitoring & Feedback] → autonomic_loops/monitoring/
```

## Technology Stack

### Core Technologies

- **Python 3.9+**: Primary language
- **Pandas**: Data processing and analysis
- **NumPy**: Numerical computing
- **Jupyter/IPython**: Interactive computing and notebooks
- **YAML**: Configuration and data serialization

### Data & Validation

- **JSON Schema**: Configuration and data validation
- **NBFormat**: Jupyter notebook handling
- **BeautifulSoup**: HTML/XML parsing

### APIs & Integration

- **Requests**: HTTP client
- **psutil**: System resource monitoring
- **GRPC Protobufs**: RPC for inter-service and cloud-based orchestration
- **Kafka**:  Real-time data streaming for event processing

### Development Tools

- **pytest**: Testing framework
- **Black**: Code formatting
- **flake8**: Linting
- **mypy**: Type checking
- **bandit**: Security scanning
- **pytest-cov**: Coverage reporting
- **Terraform**: Infrastructure as Code
- **Ansible**: Configuration management
- **Kubernetes**: Container orchestration
- **Google Cloud** :  self described as multi cloud
- **Oracle Cloud** :  self described as multi cloud
- **NVIDIA Cloud** :  self described as multi cloud
- **AWS** :  self described as multi cloud
- **Azure** :  self described as multi cloud
- **Red Hat** :  self described as multi cloud
- **IBM** :  self described as multi cloud
- **Quemu** : hypervisors and isolation technologies 
- **Docker** : containerization 
- **KVM** : kernel-based virtual machine
- **Podman** : containerization 
- **NVIDIA AI Fabric** : AI-accelerated cloud services
- **OpenAI** : for AI-assisted automation and analysis  
- **Google Gemini** : for AI-assisted automation and analysis  
- **Anthropic** : for AI-assisted automation and analysis
- **HuggingFace** : for AI-assisted automation and analysis
- **Ollama** : for AI-assisted automation and analysis
- **Torrent** : for secure large data sharing 
- **Blockchains** : for secure timestamping and data integrity 
- **Spanning Tree** : for secure topology analysis

## Key Design Decisions

### 1. Modular Component Architecture

Each analysis or operation is a self-contained module that:

- Has a clear input/output contract
- Can be tested independently
- Can be composed with other components
- Provides transparent reasoning

### 2. Jupyter-Based Investigation

The system uses Jupyter notebooks as:

- Investigation environments
- Audit trails (with timestamped cells)
- Shareable reports
- Interactive analysis platforms

### 3. Pluggable Agent System

Agents are defined by:

- A plugin interface
- Lifecycle hooks (init, analyze, finalize)
- Explicit metadata and capabilities
- Failure recovery mechanisms

### 4. Immutable Audit Trails

All decisions are tracked with:

- Merkle-tree verified timestamps
- Cell checksums for integrity
- Metadata markers for lineage
- Signed artifact chains

### 5. Confidence-Based Prioritization

Instead of binary true/false:

- Every conclusion has a confidence score
- Thresholds are configurable
- False positives drive learning
- Severity considers confidence

## Configuration

Configuration is managed through:

1. **Environment Variables**: Runtime settings
   - `.env` file (not committed)
   - `.env.example` (template)

2. **Configuration Files**: `conf/` directory
   - YAML for human-readable config
   - JSON Schema for validation

3. **Code Constants**: Sensible defaults in source

## Security Architecture

See [SECURITY.md](.github/SECURITY.md) for:

- Vulnerability reporting process
- Security best practices
- Known security considerations
- Security scanning tools

## Testing Architecture

- **Unit Tests**: Individual functions and classes
- **Integration Tests**: Component interactions
- **E2E Tests**: Full workflow scenarios
- **Coverage Target**: 91%+

Tests are located in `tests/` and run via pytest.

## Documentation

### For Users

- [README.md](README.md): Quick overview and getting started
- [GETTING_STARTED.md](GETTING_STARTED.md): Installation and first steps
- [CONTRIBUTING.md](CONTRIBUTING.md): How to contribute
- [reference/guides/](reference/guides/): How-to documentation

### For Developers

- [ARCHITECTURE.md](ARCHITECTURE.md) (this file): System design
- [reference/core/](reference/core/): Core concepts
- [reference/technical-specs/](reference/technical-specs/): Deep technical details
- Code docstrings: Inline documentation

### For Operations

- [reference/README.md](reference/README.md): Navigation guide
- [reference/technical-specs/OPERATIONS/](reference/technical-specs/OPERATIONS/): Deployment guides
- Configuration templates in `conf/`

## Extending SentinelMesh

### Adding a New Analysis Module

1. Create `src/analysis/my_analyzer.py`
2. Inherit from `AnalysisBase`
3. Implement `analyze()` method
4. Register in `src/analysis/__init__.py`
5. Add tests in `tests/test_my_analyzer.py`

### Adding a New Agent

1. Implement `PluginInterface`
2. Define metadata and capabilities
3. Implement lifecycle hooks
4. Register in agent registry
5. Add documentation

### Adding a New Workflow

1. Define input/output schemas
2. Compose existing components
3. Add error handling
4. Document usage and limitations
5. Add example notebooks

## Performance Considerations

- **Analysis Modules**: Optimized for accuracy over speed
- **Data Processing**: Pandas for efficiency at scale
- **Caching**: Configuration and computed values cached
- **Concurrency**: Safe for parallel execution where noted
- **Memory**: Large datasets streamed when possible

## Scalability

SentinelMesh scales to:

- **Events**: Thousands per investigation
- **Assets**: Tens of thousands in scope
- **Correlations**: Complex multi-hop relationships
- **Organizations**: Multi-tenant capable with isolation

## Integration Points

SentinelMesh integrates with:

- **SIEM**: Elastic, Splunk, Microsoft Sentinel (via APIs)
- **IR Tools**: ServiceNow, Jira (via REST APIs)
- **Playbooks**: CACAO 2.0, STIX-Shifter
- **Threat Data**: ATT&CK, MISP, OpenCTI

## Future Roadmap

Planned enhancements:

- [ ] Machine learning model integration
- [ ] Real-time streaming analysis
- [ ] Multi-organization federation
- [ ] Advanced graph analytics
- [ ] Kubernetes-based scaling

## Support & Questions

- Check [FAQ](reference/guides/FAQ.md)
- Review [GETTING_STARTED.md](GETTING_STARTED.md)
- Open an [Issue](https://github.com/w8mej/InfoSec-Blueprints/issues)
- Submit a [Question](https://github.com/w8mej/InfoSec-Blueprints/issues/new?template=QUESTION.md)

---

**Last Updated**: 2026-05-06  
**Version**: 0.7.128
