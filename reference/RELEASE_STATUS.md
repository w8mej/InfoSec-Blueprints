# SentinelMesh Release Status

**Date**: 2026-05-04  
**Status**: DRAFT PROPOSAL (REVISED)  
**Target Release**: Q2 2026  
**Release Model**: Documentation, Architecture, & Examples (Code Private)

## What Changed (Evolution of Proposals)

- **PUBLIC_RELEASE_PROPOSAL.md (April 26):** Initial push to release everything including code. Blockers were missing README and minor test failures.
- **PRE_RELEASE_READINESS_PROPOSAL.md (May 4):** Comprehensive plan for a fully open-source release, identifying 17 blockers (confidentiality, CI/CD, documentation, tests).
- **PRE_RELEASE_READINESS_PROPOSAL_REVISED.md (May 4):** Shifted strategy to a "Documentation + Examples Release (Code Private)" model. Python code remains proprietary. Reduced blockers to 6 documentation-focused tasks.

_Note: This document consolidates all past release proposals into a single source of truth. Original proposals have been archived to `reference/appendices/deprecated/`._

## Executive Summary

This project aims for a **reference architecture release**: publishing comprehensive documentation, architectural specifications, example playbooks, and deployment guides—while **keeping the Python & Go & Cloud Native implementations private**.

**Current status: 85% ready**  
**Estimated time to release: 2-3 weeks**

## What We're Publishing vs. Staying Private

### ✅ Publishing (Public Repo)

- Documentation (`docs/`)
- Architecture specs (MASTER-ARCHITECTURE.md, TIER-DEEP-DIVES)
- Configuration examples
- Example playbooks
- API specifications and integration guides
- SECURITY.md
- LICENSE, CODE_OF_CONDUCT, AUTHORS, CONTRIBUTING
- Deployment guides
- Analytics and dashboards

### 🔒 Staying Private (Not in Public Repo)

- `src/` directory (all Python implementation)
- Test framework
- Internal CI/CD pipelines
- `scratch/` directory

## Remaining Blockers (Prioritized)

1. **Remove `src/` and `scratch/` directories** from the public branch.
2. **Clarify Example Notebooks** (add disclaimers that code execution requires licensed runtime).
3. **Remove Hardcoded Paths** (replace with variables like `$SentinelMesh_HOME`).
4. **Fix Broken Links** across documentation.
5. **Add Deployment & Architecture Guides** setting correct expectations.
6. **Simplify Makefile** to remove internal targets.

_All original content and extensive task lists can be found in the archived proposals if needed._
