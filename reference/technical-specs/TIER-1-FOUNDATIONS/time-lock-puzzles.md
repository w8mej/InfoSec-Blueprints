# TIER 1 Deep-Dive: Time-Lock Puzzles & Administrative Delays

## Document Metadata

- **Audience**: Security Architects | Risk Managers | Cryptographers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [runtime-agentic-capabilities.md](../../appendices/2023-04-planning/runtime-agentic-superpowers.md)
- **Related Specs**: `2023-04-27-time-lock-puzzles-design.md`, `2023-04-22hitl-gate-composition-design.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/runtime/time_lock_puzzles.py`

## Quick Summary

Time-Lock Puzzles are a "Defense-in-Depth" mechanism designed to prevent **Unauthorized Rapid Remediation** by malicious actors or compromised agents. By requiring a computational "Proof of Work" (specifically a sequential square-root puzzle) before a high-risk autonomous action can be executed, the system enforces a mandatory **Administrative Delay**.

This delay provides a "Human Intervention Window" for SOC analysts to review and potentially abort a "High Impact" action (e.g., a massive data wipe or a widespread network isolation) that was proposed by the agent. Unlike simple timers, Time-Lock Puzzles cannot be bypassed by a compromised server clock.

---

## 1. Persona-Based Value Proposition

### For the Risk Manager

- **Anti-Speed Guardrail**: Prevent a "Runaway AI" from taking destructive actions across the entire enterprise in milliseconds.
- **Mandatory Review Window**: Guarantees that for specific [Blast Radius](../ANALYSIS-MODULES/blast-radius-calculator.md) scores, there is always enough time for a human to intervene.

### For the Security Architect

- **Clock-Agnostic Delays**: Delays are enforced by computation, not by the system clock. An attacker cannot "fast-forward" the delay by spoofing the NTP time on the ASO server.
- **Hardware Binding**: The puzzle difficulty can be tuned based on the [KMS HSM](../TIER-1-FOUNDATIONS/kms-schema-signer.md) performance, ensuring a consistent delay regardless of the host CPU power.

### For the Compliance Auditor

- **Provable Procedural Delay**: Every time-locked action includes a signed "Proof of Puzzle Completion," demonstrating that the mandatory wait period was strictly followed.

---

## 2. Architecture & Design: The Sequential Puzzle

### 2.1 The Square-Root Puzzle (LCS35)

SentinelMesh uses a modified version of the [Rivest-Shamir-Wagner (RSW)](https://en.wikipedia.org/wiki/Time-lock_puzzle) time-lock puzzle:

- **Operation**: The agent must compute $x^{2^t} \pmod n$ where $n$ is a product of two large primes and $t$ is the number of sequential squarings required to achieve the desired delay.
- **Sequentiality**: The squarings must be performed sequentially; they cannot be parallelized. This ensures that even an attacker with 1,000 CPUs cannot solve the puzzle faster than a single CPU.

### 2.2 Integration with the HITL Gate

1.  **Risk Detected**: The [Blast Radius Calculator](../ANALYSIS-MODULES/blast-radius-calculator.md) flags an action as "High Risk."
2.  **Puzzle Generation**: The [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) generates a Time-Lock Puzzle with a difficulty $t$ corresponding to the desired delay (e.g., 10 minutes).
3.  **Mandatory Solving**: The agent _must_ begin solving the puzzle. During this time, the [HITL Gate](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) remains in "Pending Review" status.
4.  **Completion**: Once the puzzle is solved, the agent submits the proof along with its action request.

---

## 3. Implementation Details: Puzzle Logic

### Core Puzzle Engine (`src/runtime/time_lock_puzzles.py`)

```python
REDACTED
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 Thwarting "Rapid Lateral Movement"

If an attacker attempts to use SentinelMesh to move laterally or destroy evidence, the Time-Lock Puzzle forces them to wait. This provides the "Defensive Advantage" needed for the Blue Team to detect and respond to the compromise.

### 4.2 Compliance Mapping

- **NIST 800-53 (AC-3)**: Supports "Access Enforcement" by providing a mechanism to enforce delayed authorization for sensitive actions.
- **ISO 27001 (A.12.1.1)**: Fulfills requirements for "Documented Operating Procedures" by ensuring that high-risk actions follow a predictable, non-bypassable timeline.

---

## 5. Operations & Performance Tuning

### Calibrating Difficulty

The difficulty $t$ must be calibrated periodically to account for improvements in CPU performance. The system uses a "Reference Benchmarking" job to tune $t$ every 30 days.

### User Experience

While the puzzle is being solved, the [Visual UI](../../appendices/2023-04-planning/visual-ui-superpowers.md) displays a high-visibility countdown and a "Solve Progress" bar, ensuring analysts know exactly when the action will be eligible for execution.

---

## 6. Future Growth & Opportunities

- **Quantum-Resistant Time-Locks**: Exploring the use of isogeny-based puzzles or other post-quantum primitives to ensure delays remain effective in the future.
- **Hierarchical Delays**: Linking the puzzle difficulty directly to the [Risk Score](../ANALYSIS-MODULES/blast-radius-calculator.md)—the higher the risk, the longer the mandatory delay.
- **Distributed Solving**: (Experimental) Requiring multiple independent nodes to solve segments of a "VDF" (Verifiable Delay Function) to prevent single-point-of-failure in the delay mechanism.
