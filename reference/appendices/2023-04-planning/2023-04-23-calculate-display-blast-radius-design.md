# Specification: Calculate and Display Blast Radius

## Overview

At every decision branch, the operator needs immediate visibility into the scope of impact. This specification requires automatically calculating and displaying the blast radius (number of endpoints, users, or services impacted) using context from the MITRE ATLAS graph.

## Objectives

- Quantify the risk of probabilistic playbook branches.
- Prevent over-blocking or disruptive containment.
- Tie agent actions back to broader infrastructure maps.

## Requirements

- Integrate with an asset inventory or the MITRE ATLAS context graph to resolve target entities.
- Calculate the aggregate count of impacted downstream entities.
- Display this count prominently in the UI before any decision is committed.
