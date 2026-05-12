# Contributing to SentinelMesh

Thank you for your interest in contributing to the SentinelMesh framework! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

If you encounter a bug, please:

1. Check if the issue already exists on [GitHub Issues](https://github.com/w8mej/InfoSec-Blueprints/issues)
2. Use the [Bug Report](https://github.com/w8mej/InfoSec-Blueprints/issues/new?template=BUG_REPORT.md) template
3. Include:
   - Your environment (OS, Python version)
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Minimal code example

### Requesting Features

To suggest a feature:

1. Check [GitHub Issues](https://github.com/w8mej/InfoSec-Blueprints/issues) for existing requests
2. Use the [Feature Request](https://github.com/w8mej/InfoSec-Blueprints/issues/new?template=FEATURE_REQUEST.md) template
3. Describe:
   - What problem it solves
   - Proposed solution and alternatives
   - Use cases and benefits

### Asking Questions

Have a question? Use the [Question](https://github.com/w8mej/InfoSec-Blueprints/issues/new?template=QUESTION.md) template instead of opening an issue.

## Setting Up Your Development Environment

### Prerequisites

- Python 3.9 or higher
- pip and virtualenv
- Git

### Setup Steps

1. **Fork the repository**

   ```bash
   # Go to https://github.com/w8mej/InfoSec-Blueprints and click "Fork"
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/w8mej/SentinelMesh.git
   cd SentinelMesh
   ```

3. **Create a virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. **Install in development mode**

   ```bash
   pip install -e ".[dev]"
   ```

5. **Verify installation**
   ```bash
   python -c "from src import analysis; print('✓ Setup complete')"
   pytest --version  # Should show pytest version
   black --version   # Should show black version
   ```

## Development Workflow

### Creating a Branch

```bash
# Update main
git checkout main
git pull origin main

# Create a feature branch
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/your-bug-fix
```

### Running Tests

```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=src --cov-report=term-missing

# Run specific test file
pytest tests/test_analysis.py

# Run tests matching a pattern
pytest -k "test_blast_radius"
```

### Code Quality Checks

Before committing, run:

```bash
# Format code with Black
black src/

# Check for linting issues
flake8 src/ tests/

# Sort imports
isort src/ tests/

# Type checking
mypy src/

# Security scanning
bandit -r src/

# Dependency auditing
pip-audit
```

### Committing Changes

Use clear, descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>: <description>
git commit -m "feat: add JWT verification analysis module"
git commit -m "fix: correct blast radius calculation for lateral movement"
git commit -m "docs: update ARCHITECTURE.md with new component overview"
git commit -m "style: apply black formatting to analysis module"
git commit -m "test: add test coverage for edge cases in custody analyzer"
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

## Submitting a Pull Request

1. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request**
   - Go to the main repository
   - Click "New Pull Request"
   - Select your branch
   - Use the PR template (auto-populated)
   - Provide a clear title and description

3. **PR Requirements**
   - [ ] All tests passing locally
   - [ ] Code passes linting (flake8, black, mypy)
   - [ ] New features include tests
   - [ ] Documentation updated
   - [ ] Follows commit message conventions

4. **Address Feedback**
   - Respond to reviewer comments promptly
   - Push additional commits to your branch
   - Request re-review when addressed

## Code Style Guidelines

### Python Style

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) conventions
- Line length: 100 characters (enforced by Black)
- Use type hints for all public APIs
- Docstrings for all public functions/classes

### Example

```python
from typing import Optional, List

def analyze_custody_chain(
    incident_id: str,
    events: List[Dict[str, any]],
    verify_integrity: bool = True,
) -> Optional[CustodyAnalysis]:
    """Analyze the chain of custody for an incident.

    Args:
        incident_id: Unique identifier for the incident
        events: List of custody events in chronological order
        verify_integrity: Whether to verify event integrity

    Returns:
        CustodyAnalysis object or None if analysis fails
    """
```

### Naming Conventions

- Classes: `PascalCase` (e.g., `BlastRadiusCalculator`)
- Functions/Variables: `snake_case` (e.g., `analyze_custody_chain`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RECURSION_DEPTH`)
- Private: Prefix with underscore (e.g., `_internal_helper`)

## Testing Requirements

- **Minimum coverage:** 80%
- **Test file location:** `tests/` directory
- **Test naming:** `test_*.py` or `*_test.py`
- **Test function naming:** `test_<what_is_being_tested>`

## Questions?

If you have questions:

1. Check the [FAQ](reference/guides/FAQ.md)
2. Review the [Getting Started Guide](GETTING_STARTED.md)
3. Read the [Architecture](ARCHITECTURE.md) documentation
4. Open a [Question Issue](https://github.com/w8mej/InfoSec-Blueprints/issues/new?template=QUESTION.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License (see [LICENSE](LICENSE)).

Thank you for contributing to SentinelMesh! 🎉
