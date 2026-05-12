# Getting Started with SentinelMesh

Welcome to SentinelMesh! This guide will help you install and run the framework for the first time.

## Prerequisites

Before installing, ensure you have:

- **Python 3.9 or higher** (check with `python --version`)
- **pip** (Python package manager)
- **git** (for cloning the repository)
- **virtualenv** (for isolated Python environments)

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/w8mej/InfoSec-Blueprints
cd SentinelMesh
```

### Step 2: Create a Virtual Environment

```bash
# Create a virtual environment named 'venv'
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt when activated.

### Step 3: Install SentinelMesh

```bash
# Install in editable/development mode
pip install -e .

# Verify installation
python -c "from src import analysis; print('✓ SentinelMesh installed successfully')"
```

### Step 4: Install Development Tools (Optional)

If you plan to contribute or run tests:

```bash
pip install -e ".[dev]"

# Verify development tools
pytest --version
black --version
```

## Quick Start

### Run Your First Analysis

```python
# Start Python interactive shell
python

# Import the analysis module
from src.analysis.blast_radius_calculator import calculate_blast_radius

# Define some assets
assets = [
    {"id": "host1", "network": "10.0.1.0/24", "role": "workstation"},
    {"id": "host2", "network": "10.0.1.0/24", "role": "server"},
]

# Calculate blast radius for a compromised host
result = calculate_blast_radius("host1", assets)
print(f"Affected hosts: {result}")

# Exit
exit()
```

### Run Tests

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=src --cov-report=term-missing

# Run specific test file
pytest tests/test_blast_radius.py
```

### Run Code Quality Checks

```bash
# Format code with Black
black src/

# Check code style with flake8
flake8 src/

# Type checking with mypy
mypy src/

# Security scan with bandit
bandit -r src/
```

## Project Structure

```
Sentinel-Mesh/
/REDACTED
```

## Environment Configuration

### Create a Configuration File

```bash
# Copy the example env file
cp .env.example .env

# Edit with your settings
# Never commit .env to version control!
```

### Environment Variables

Key environment variables:

- `PYTHONPATH`: Set to include src/ for imports
- `SentinelMesh_CONFIG`: Path to configuration file
- Custom variables for your deployment

## Running Examples

The `reference/` folder contains comprehensive examples and documentation:

```bash
# View the reference documentation
cat reference/README.md

# Check guides
ls reference/guides/

# Review technical specifications
ls reference/technical-specs/
```

## Troubleshooting

### ModuleNotFoundError: No module named 'src'

**Problem**: Python can't find the src module

**Solution**:

```bash
# Ensure you're in the SentinelMesh directory
cd /path/to/SentinelMesh

# Install in editable mode
pip install -e .
```

### No module named 'pytest' / 'black' / etc.

**Problem**: Development tools not installed

**Solution**:

```bash
# Install development dependencies
pip install -e ".[dev]"
```

### Virtual environment not activating

**Problem**: `(venv)` doesn't appear in prompt

**Solution**:

```bash
# Try the full path
source /path/to/SentinelMesh/venv/bin/activate

# Or on Windows:
/path/to/SentinelMesh/venv/Scripts/activate

# Verify:
which python  # Should show venv path
```

### Tests failing locally but passing in CI

**Problem**: Environment differences between local and CI

**Solution**:

```bash
# Clear caches
rm -rf .pytest_cache __pycache__ .mypy_cache

# Reinstall dependencies fresh
pip install --force-reinstall -e ".[dev]"

# Run tests again
pytest
```

### Import errors in Jupyter notebooks

**Problem**: `from src.analysis import ...` doesn't work in notebook

**Solution**:

```python
# In notebook cell, add to path:
import sys
sys.path.insert(0, '/path/to/SentinelMesh')

# Or use absolute imports:
from src.analysis.blast_radius_calculator import calculate_blast_radius
```

## Next Steps

### For Users

1. Read the [README](README.md) for an overview
2. Explore [Getting Started](reference/guides/) guides
3. Review [FAQ](reference/guides/FAQ.md) for common questions
4. Check the [reference documentation](reference/)

### For Contributors

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Follow the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
3. Set up pre-commit hooks: `pre-commit install`
4. Create a branch and start developing

### For Security Researchers

1. Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
2. Check [technical-specs](reference/technical-specs/) for deep dives
3. Read [SECURITY.md](.github/SECURITY.md) for vulnerability reporting

## Learning Resources

- **System Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **API Reference**: [reference/technical-specs/](reference/technical-specs/)
- **How-To Guides**: [reference/guides/](reference/guides/)
- **FAQ**: [reference/guides/FAQ.md](reference/guides/FAQ.md)

## Development Workflow

```bash
# Create a new feature branch
git checkout -b feature/my-feature

# Make changes and test
pytest tests/

# Format code
black src/

# Commit changes
git commit -m "feat: add my feature"

# Push and create a pull request
git push origin feature/my-feature
```

## Uninstalling

To remove SentinelMesh:

```bash
# Deactivate virtual environment
deactivate

# Remove the virtual environment
rm -rf venv

# Or completely remove the project
cd ..
rm -rf SentinelMesh
```

## Getting Help

If you're stuck:

1. **Check the FAQ**: [reference/guides/FAQ.md](reference/guides/FAQ.md)
2. **Review documentation**: [reference/](reference/)
3. **Open an issue**: [GitHub Issues](https://github.com/w8mej/InfoSec-Blueprints/issues)
4. **Ask a question**: [GitHub Discussions](https://github.com/w8mej/InfoSec-Blueprints/issues/new?template=QUESTION.md)

---

**Happy analyzing!** 🔍

For more detailed information, see:

- [README.md](README.md) - Project overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide
