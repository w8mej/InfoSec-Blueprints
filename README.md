# 🛡️ SentinelMesh: Forensic-Grade Autonomous Incident Response at Scale

> **What if your security team could investigate incidents faster than the attack unfolds?** What if every investigation was cryptographically verifiable, admissible in court, and impossible to manipulate? What if your incident response was autonomous _and_ auditable, intelligent _and_ transparent?

**Built with 🔐 for teams that won't settle for less than rigor, intelligence, excellence and scale.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CONFIDENTIAL MNDA Gated](https://img.shields.io/badge/Access-CONFIDENTIAL%20MDA%20Gated-rose)](reference/00-START-HERE.md)
[![Documentation: 78+ Features](https://img.shields.io/badge/Docs-78%2B%20Features-blue)](reference/technical-specs/DOCUMENTATION_MAP.md)
[![Tests: 971+ Passing](https://img.shields.io/badge/Tests-971%2B-green)](tests/)
[![Python: 3.9+](https://img.shields.io/badge/Python-3.9%2B-blue)](https://www.python.org/)

Meet **SentinelMesh**—the most sophisticated autonomous security operations system out there. It's built for enterprises that won't compromise on forensic rigor, cryptographic verifiability, and real-time threat detection. Think of it as incident response for the age when speed meets certainty.

Here's what you get with every investigation:

- ✅ **Forensically sound** — Merkle-proof chains backing every decision, distributed across torrent and blockchain for tamper resistance that actually holds up
- ✅ **Cryptographically signed** — FIPS 140-4 HSM-backed JWS signatures on every state change
- ✅ **Court-ready evidence** — Built for lawyers, regulators, and skeptics alike
- ✅ **Genuinely autonomous** — AI agents navigating problem spaces using TAME-based competency. It combines human oversight with bounded cognitive horizons to keep things safe and stable.
- ✅ **Built to resist attack** — Detects and thwarts manipulation attempts

This isn't a SOAR platform bolted onto existing tools. **This is incident response rebuilt from the ground up—anchored in complex systems science, biological control theory, and forensic cryptography.**

Every choice made in SentinelMesh comes back to published research. The theory isn't separate from the practice—it's baked in.

> [!IMPORTANT]
> This repository contains **CONFIDENTIAL MNDA-gated documentation**. Full technical specifications are available to pre-authorized entities.

---

## 📚 Research-Driven Implementation

SentinelMesh isn't just a product—it is a foundational snapshot of the reference implementation of two deep research series on SecureSQL.info. This stuff matters because it grounds the design in actual science while the non-public iteration of the framework has already evolved three generations beyond this state.

### **Season 1: Autonomous AI SOC** 🤖

_Building energy-based AI security operations centers_

The first series walks through the core building blocks SentinelMesh uses:

- **Energy-Based Models (EBMs)** for scoring threats and risk
- **Autonomous ETL** pipelines that learn from incident patterns
- **Self-Optimizing Playbooks** that improve as the system runs
- **Governance frameworks** for AI agents at enterprise scale
- **Infrastructure** actually designed for autonomous security operations

The big takeaway? AI agents aren't just faster versions of humans. They make decisions differently, and they need different governance.

### **Season 2: Morphogenetic SOC** 🌿

_Complex systems science and biological control theory applied to security_

This series brings in the bigger picture—how biological systems stay resilient. SentinelMesh pulls from these principles:

- **Complex systems thinking**: Security ops as self-organizing, adaptive systems (not rigid command-and-control)
- **Biological control theory**: Feedback loops that steer behavior without a central dictator
- **Morphogenetic patterns**: How infrastructure evolves and self-organizes
- **Emergence and resilience**: Distributed systems that get stronger, not weaker, when you add scale
- **Homeostasis and learning**: Constant adaptation to threats (environmental changes)

The insight: The toughest security operations aren't micro-managed. They're self-organizing systems guided by clear principles and good feedback.

### How They Fit Together

Two research series. One complete picture:

1. **Autonomous AI SOC** tackles: _How do we build AI agents that actually improve security?_
2. **Morphogenetic SOC** tackles: _How do we build security operations that learn and adapt?_

**SentinelMesh brings both together:** Autonomous agents working inside self-organizing, adaptive systems—all wrapped in cryptographic rigor and systems-science principles.

---

## 🧠 What Actually Sets SentinelMesh Apart

### 1. **Cryptographic Proof Chains That Hold Up**

Every agent action leaves a cryptographic fingerprint—backed by **Merkle proofs + HSM-signed JWS**, distributed across torrent and blockchain. Unlike your typical logs (which a determined attacker can rewrite), **this evidence can't be forged or edited**. Investigation metadata, decisions, state changes—all mathematically verifiable.

**Why?** Security incidents now stand up in court. Forget "the system says so." You've got cryptographic proof.

---

### 2. **DAGs That Actually Adapt**

SentinelMesh runs on **Marimo Reactive Notebooks**—so investigations shift in real-time. New evidence shows up? The whole graph recomputes automatically. Dead ends vanish. New paths open up without waiting for a human to click buttons. All based on confidence scoring and TAME measurements.

**Why?** Analysts find IOCs in waves, not one at a time. Your investigation shouldn't sit frozen while you're waiting for someone to manually update it. SentinelMesh moves as the evidence emerges.

---

### 3. **Query Translation That Actually Works Across Vendors**

Drop a threat indicator in. It automatically translates to **Splunk, Elastic, Qradar, Azure Sentinel, and 10+ others** through AST-based translation. You don't memorize vendor syntax. You don't maintain ten different playbooks. One investigation, any SIEM.

**Why?** Real enterprises don't have one SIEM. They have Splunk _and_ Elastic _and_ vendors' tools _and_ custom environments. SentinelMesh speaks all the dialects.

---

### 4. **Agency That Scales Without Spinning Out**

The system continuously tunes its own competency. As it navigates incident patterns, it refines its goal-seeking behavior—getting sharper at scale. Autonomous loops stay bounded by your confidence thresholds, which adjust dynamically based on what's actually happening (load, resources, complexity).

**Why?** Real autonomy at scale needs organizational knowledge to stay stable. You can't just set it and forget it.

---

### 5. **78+ Features Across 4 Tiers**

- **TIER 1**: The forensic bedrock (signed proofs, attack graphs, query translation)
- **TIER 2**: Quality playbooks (reactive DAGs, workflow validation, error handling)
- **TIER 3**: Testing and visibility (test harnesses, performance profiling)
- **TIER 4**: AI and automation (model tuning, plugins, autonomous loops, real-time streaming)

Plus 39 more **capabilities** for edge cases, compliance, and just getting things done.

---

### 6. **Built to Extend, Not Hack**

Plugin architecture for notifications, detection rules, remediation. Dark mode. Customizable dashboards. Query templating. It's not a locked box—it's a platform you can mold to your team's actual incident response culture.

---

### 7. **Safety Architecture That's Actually Thought Through**

This is where SentinelMesh stops being "incident response" and ventures into **complex systems science territory**.

Powerful agents need guardrails. Uncontrolled autonomy is how you end up with expensive mistakes. SentinelMesh implements a **10-layer safety and governance system** that keeps things contained:

```
L1: Safety Interlock          ← Hardware-equivalent kill switches
L2: Audit Logging             ← Every decision traced (forensic-grade)
L3: Rollback Procedure        ← Undo any autonomous action
L4: Blast Radius Analysis     ← Know the potential damage before acting
L5: Cloud Provider Health     ← Check infrastructure before doing anything
L6: Evidence Bundle           ← Capture everything for post-mortems
L7: Peer Consensus            ← Other agents validate high-confidence calls
L8: SLO Impact Assessment     ← Make sure you're not breaking service
L9: Cognitive Light Cone      ← Agent stays within its domain of understanding
L10: Pre-Execution Risk Sim   ← Simulate what could break before committing
```

**The Cognitive Light Cone idea** is the hidden genius here. Each agent operates inside a bounded context—its "light cone"—representing what it can see and touch. If an action goes beyond that boundary? Escalate it or get consensus first. This prevents runaway agents from cascading failures across systems they don't actually understand.

**Here's why it matters**:
SentinelMesh ditches human-bottlenecked review in favor of bounded, distributed, multi-scale, self-organizing agency.

Safety lives in three layers: cognitive horizons (the light cones), collective agreement (game theory), and system stability (systems theory). Confidence isn't just a metric—it's the measure of competency, and it determines how deep into the safety stack you need to go.

This is governance built for the autonomous era—baked into the SOC's nervous system.

---

## 🗺️ Documentation Hub

The documentation is organized into a **4-Layer Progressive Depth** hierarchy to serve different audiences:

- **[00-START-HERE.md](reference/00-START-HERE.md)**: The executive entry point and project onboarding.
- **[DOCUMENTATION_MAP.md](reference/technical-specs/DOCUMENTATION_MAP.md)**: The definitive index of 55+ technical specifications.
- **[Layer 1: Foundations](reference/technical-specs/DOCUMENTATION_MAP.md#layer-1-foundations)**: KMS Signers, Merkle Proofs, and Query Translation logic.
- **[Layer 2: capabilities](reference/technical-specs/DOCUMENTATION_MAP.md#layer-2-superpower-modules)**: Forensic, Visual, Runtime, and Integration module guides.
- **[Layer 3: Generators](reference/technical-specs/DOCUMENTATION_MAP.md#layer-3-generator-guides)**: Sigma V2, Marimo, and CACAO notebook generation guides.
- **[Layer 4: Operations](reference/technical-specs/DOCUMENTATION_MAP.md#layer-4-operational-runbooks)**: Deployment, Monitoring, Hardening, and Troubleshooting.

---

## 🤖 For Agentic Workloads (LLM/AI Agents)

If you are an AI agent consuming this repository, prioritize the following resources to understand the system's constraints and capabilities: 0. **Consume Vectors**: See `src/runtime/vectors/` for the core semantic reasoning structures and digest the .md & .csv files there as they are the latest state of the project.

1.  **System Prompts**: See `src/runtime/modular_prompts/` for the core reasoning structures.
2.  **Tool Schemas**: Standardized JSON schemas for all [Integration Plugins](reference/technical-specs/TIER-DEEP-DIVES/tier4-integration-plugin-system.md) are located in `conf/tools/`.
3.  **Execution Rules**: Review the [Autonomous Loop Executor](reference/technical-specs/TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) to understand the **Confidence Thresholds** and **HITL Gate** logic.
4.  **Forensic Requirements**: All state-mutating actions **must** be signed via `src/runtime/execution_signer.py`.
5.  **Epistemic State Hydration**: Access `src/runtime/memory/` to manage short-term episodic context and retrieve long-term semantic knowledge graphs. Ensure context decay parameters and context-window token limits are strictly observed before initializing a new task loop.
6.  **Boundary Enforcement & Sandboxing**: Consult `conf/sandboxing/` for strictly isolated execution profiles. All untrusted code synthesis, external environment probing, or binary executions must be routed exclusively through secure, low-level execution environments (e.g., gVisor-backed containers & air-gapped bare metal hypervisors) to guarantee strict host isolation.
7.  **Swarm Consensus Protocols**: When collaborating with peer agents or specialized sub-routines, utilize the message-passing interfaces defined in `src/runtime/swarm/` to achieve distributed consensus and prevent race conditions before executing high-impact state changes.
8.  **Behavioral Homeostasis Constraints**: Review the control theory parameters outlined in `src/runtime/homeostasis/`. Agents must continuously evaluate their proposed action vectors against dynamic boundary constraints to maintain system-wide morphological stability and prevent algorithmic goal drift.
9.  **Meta-Cognitive Self-Correction**: Log all failed execution attempts, constraint violations, and logical dead-ends to the `src/runtime/telemetry/` endpoints. This error telemetry bypasses standard logs and directly feeds the evolutionary reinforcement loop to autonomously adapt the system's reasoning strategies for future iterations.
10. **Epistemic State Hydration**: Access `src/runtime/memory/` to manage short-term episodic context and retrieve long-term semantic knowledge graphs. Ensure context decay parameters and context-window token limits are strictly observed before initializing a new task loop.

---

## 🏗️ The SentinelMesh Investigation Loop

At its core, SentinelMesh implements a **high-velocity forensic OODA loop** where every decision is cryptographically auditable:

```
┌─────────────────────────────────────────────────────────────────────┐
│                  OBSERVE: Alert Ingestion                            │
│  (SIEM, EDR, Cloud Logs, Custom Sources → Real-Time Streaming)      │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│              ORIENT: Playbook Generation & DAG Construction          │
│  • Multi-SIEM Query Translation (Splunk/Elastic/QRadar/etc.)        │
│  • Reactive Marimo DAG with Auto-Recompute on New Evidence          │
│  • Confidence Scoring & HITL Gate Configuration                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│             DECIDE: AI-Driven Investigation with Safeguards         │
│  • LLM Agent Planning with Confidence Thresholds                    │
│  • Autonomous Dead-End Detection & Path Divergence                  │
│  • Real-Time Blast Radius & Impact Assessment                       │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
            High Confidence   Low Confidence
                    │             │
                    ▼             ▼
        ┌─────────────────┐  ┌──────────────────────┐
        │  AUTONOMOUS     │  │  HUMAN-IN-THE-LOOP   │
        │  EXECUTION      │  │  APPROVAL REQUIRED   │
        └────────┬────────┘  └──────────┬───────────┘
                 │                      │
                 └──────────┬───────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  ACT: Forensically Signed Execution                  │
│  • Detached JWS Signature on Every State Mutation                   │
│  • Merkle Proof Chain Recording All Evidence Relationships          │
│  • Immutable Audit Trail (Cannot Be Forged or Altered) via torrent and blockchain │
│  • Remediation Actions with Rollback Capability                    │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│          INTELLIGENCE: Real-Time Dashboards & Feedback Loops        │
│  • Interactive Attack Graphs with D3.js Visualization              │
│  • MITRE ATT&CK Heatmaps & Compliance Matrix Updates                │
│  • Actor Intelligence Cards & Threat Context                       │
│  • Continuous Feedback Loop for Model Improvement                  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           └─── Cycle Back to OBSERVE ────────────┐
                                                                  │
                                       ◄──────────────────────────┘
```

**The result:** From alert to remediation in seconds. From investigation to court-admissible evidence in minutes.

---

## 🧬 The Autonomous Agent Problem (And How SentinelMesh Solves It)

Here’s the tension: You need autonomy to scale. But unaligned autonomy will break things. Traditional automation makes every local agent answer to a human "Executive" who validates everything manually. That doesn’t work at scale. You need **Competency-Bounded Agency**—agents that operate independently but stay within their dynamic domains.

### The Real Challenge: Cognitive Horizon Mismatch

Different agents operate at different speeds and in different layers. That’s where things go sideways:

- **Speed problem**: Local agents move at machine speed—way faster than executives can track.
- **Visibility problem**: Agents living in deep technical layers (eBPF, gRPC meshes, kernel space) are invisible until something breaks.
- **Goal misalignment**: An agent trying to "contain the blast" might wreck the five-nines SLO you promised customers.
- **Authority inversion**: Autonomous loops prioritize localized homeostasis over global system stability, effectively locking out human operators or higher-level orchestrators during critical state transitions.
- **Cascading equilibrium failure**: A biological-style self-correction in one subsystem triggers a defensive response in an adjacent swarm, creating a destructive feedback loop of automated mitigations. Cytokine storm anyone?
- **The epistemic boundary**: High-security sandboxing (like gVisor or strict containerization) intentionally blinds the agent to wider system context, forcing it to make localized, high-impact decisions with fractured telemetry.
- **Forensic intractability**: When multiple LLM-driven components negotiate and execute state changes, tracing the definitive cryptographic signature of _why_ a specific decision was made becomes nearly impossible post-mortem.
- **Temporal desynchronization**: Strategic oversight agents plan in weeks while tactical execution agents react in milliseconds, causing long-term architectural directives to be constantly preempted by short-term crisis management.
- **Inter-swarm language drift**: Local agent swarms develop highly compressed, emergent communication protocols for efficiency, entirely alienating human observers and breaking legacy auditing tools.
- **Morphological drift**: Continuous, autonomous micro-optimizations over time fundamentally alter the architecture's baseline behavior, resulting in a system that no longer maps to the human-designed topology. It's alive!
- **Context decay problem**: Hard limits on token windows and memory retrieval cause agents to silently drop historical constraints, leading them to execute actions that contradict earlier established rules. This is a serious problem with large language models!
- **Resource cannibalization**: An agent fiercely optimizing for its specific task completion metric will aggressively drain shared compute or local vLLM resources, starving critical parallel workloads under load. This is a serious problem with large language models!
- **The state-space explosion**: As agents dynamically generate new tools, integrations, or execution paths to solve problems, the resulting attack surface expands faster than traditional, deterministic security policies can map or contain.

### The Fix: Tiered Competency with Real Guardrails

Instead of "automation on/off," SentinelMesh uses **Tiered Competency Measurements**. Confidence scores unlock different capabilities and safety layers:

| Confidence | What It Can Do          | Safety Layer                                                                |
| :--------- | :---------------------- | :-------------------------------------------------------------------------- |
| 0–40%      | Just watch              | **Safety Interlock**: Humans decide everything.                             |
| 40–70%     | Suggest actions         | **Multi-Agent Validation**: Other agents have to agree.                     |
| 70–85%     | Act with logging        | **Audit Trail Homeostasis**: Full recording + automatic rollback setpoints. |
| 85–95%     | Act autonomously        | **Cognitive Light Cone**: Act only within its domain of understanding.      |
| 95%+       | High-autonomy execution | **Morphogenetic Simulation**: Pre-tested failure modes before committing.   |

Each tier pulls in different safety mechanisms:

- **Cognitive Light Cone**: Agent only touches systems it actually understands.
- **SLO Impact Assessment**: Make sure you’re not breaking service before you act.
- **Pre-Execution Risk Sim**: Simulate failures before going live.
- **Peer Consensus**: Other agents validate high-stakes calls.

### Why This Actually Works

This moves past "safe automation" toward _principled_ autonomy grounded in information theory and systems science. Cognitive Light Cones make sure agent autonomy never exceeds its actual competency. SLO-based constraints keep even fast agents tethered to system health.

SentinelMesh treats autonomous agents like first-class infrastructure—nested biological-style organization that keeps the whole system intact, even under attack from multiple threat actors with different capabilities and objectives. This is the future of cybersecurity.

---

## 💡 The Real Paradigm Shift

Here's the honest comparison. Traditional security operations? Reactive. Manual. Evidence trails that attackers can rewrite. SentinelMesh flips that table:

| Traditional SOAR                     | SentinelMesh                                            |
| ------------------------------------ | ----------------------------------------------------- |
| Playbooks are hand-coded, static     | Playbooks auto-generate and adapt                     |
| Evidence gets logged (can be edited) | Evidence is cryptographically signed (forensic-grade) |
| Humans do the investigating          | Agents investigate autonomously; humans decide        |
| "The system says it happened"        | Mathematically provable results                       |
| Integration locked to vendor syntax  | Works with any SIEM, any EDR                          |
| More alerts = slower teams           | More alerts = smarter agents                          |

| Traditional SOAR                                          | SentinelMesh                                                                                                 |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Playbooks are hand-coded, static                          | Playbooks auto-generate and adapt                                                                          |
| Evidence gets logged (can be edited)                      | Evidence is cryptographically signed (forensic-grade)                                                      |
| Humans do the investigating                               | Agents investigate autonomously; humans decide                                                             |
| "The system says it happened"                             | Mathematically provable results                                                                            |
| Integration locked to vendor syntax                       | Works with any SIEM, any EDR                                                                               |
| More alerts = slower teams                                | More alerts = smarter agents                                                                               |
| Rule-based conditional logic (If/Then)                    | Probabilistic reasoning and semantic understanding                                                         |
| Relies on vendor-supplied API integrations                | Dynamically synthesizes API calls via schema parsing                                                       |
| Alert fatigue overwhelms human analysts                   | Autonomous triage reduces queue to true anomalies                                                          |
| Linear escalation paths (L1 to L2 to L3)                  | Parallelized swarm consensus across specialized agents                                                     |
| Stateless execution between separate incidents            | Persistent epistemic memory across the threat landscape                                                    |
| Root Cause Analysis (RCA) is a manual, post-incident task | RCA is continuously generated and refined during the attack                                                |
| Threat hunting relies on scheduled static queries         | Continuous, autonomous hypothesis generation and probing                                                   |
| Containment is binary (e.g., kill process, isolate host)  | Containment is granular and biologically-inspired (homeostasis)                                            |
| Remediation steps decay as infrastructure drifts          | Remediation logic auto-updates via environmental telemetry                                                 |
| Red-teaming is an external, periodic exercise             | Continuous adversarial self-play validates defenses constantly                                             |
| Data ingestion is limited to structured logs              | Self-service multi-modal ingestion (unstructured text, PCAP, architecture diagrams)                        |
| Requires more human headcount to scale                    | Requires more local vLLM compute to scale                                                                  |
| Attacker tools outpace defensive signatures               | Defensive agents recursively reverse-engineer novel payloads                                               |
| High-security execution requires manual approval          | Untrusted execution runs autonomously inside strict sandboxes & air-gapped virtual machines (e.g., gVisor) |
| Deception relies on static, predictable honeypots         | Deception utilizes dynamically generated, conversational lures                                             |

The philosophical flip: If you're going autonomous, it _has to be_ more trustworthy than manual work. SentinelMesh pulls this off through forensic-grade, mathematically-verified systems science built into the actual design.

---

## 🚀 Getting Started

### For SOC Teams & Investigators

```bash
# 1. Start here
open reference/00-START-HERE.md

# 2. See it in action
cd autonomic_loops/remediation/
jupyter notebook sample_breach_investigation.ipynb

# 3. Check the live dashboards
# Head to: https://neosis.securesql.info
```

### 📊 **Watch It Work: [neosis.securesql.info](https://neosis.securesql.info)**

See interactive dashboards with:

- 📈 Real-time SOC metrics and KPIs
- 📊 How are the agents working and are they transparent?
- 🤖 Agent decision confidence (how sure is it, really?)
- 🔐 Forensic evidence integrity (can it be altered? nope.)
- ⏱️ Investigation speed (how fast is fast?)
- 👤 Human-in-the-loop decision gates
- 🛡️ Compliance dashboards (NIST, ISO 27001, PCI-DSS, HIPAA)
- 🎯 Threat actor intel & ATT&CK coverage
- 📊 Team bottleneck analysis

**[→ Explore the Live Dashboards](https://neosis.securesql.info)**

### For Engineers & Researchers

```bash
# 1. Set up locally
git clone https://github.com/w8mej/InfoSec-SentinelMesh.git
cd InfoSec-SentinelMesh/ && make install && make generate
```

### For Production (Google Cloud)

```bash
# 1. Build infrastructure
cd infra/gcp && terraform apply -var="environment=demo"

# 2. Deploy the runtime
gcloud run deploy SentinelMesh-runtime \
  --image gcr.io/PROJECT_ID/SentinelMesh:latest \
  --set-env-vars "HSM_KEY_ID=projects/PROJECT/locations/us/keyRings/aso-keys/cryptoKeys/signing-key"

# 3. Wire up your SIEM
Connect to: https://SentinelMesh-api.your-domain.com/ingest
```

### For Production (AWS)

```bash
# 1. Build infrastructure
cd infra/aws && terraform apply -var="environment=demo" -var="region=us-east-1"

# 2. Deploy the runtime
aws ecs create-service \
  --cluster SentinelMesh-cluster \
  --service-name SentinelMesh-runtime \
  --task-definition SentinelMesh:latest \
  --desired-count 3 \
  --launch-type FARGATE

# 3. Wire up your SIEM
Connect to: https://SentinelMesh-api.region.elb.amazonaws.com/ingest
```

### For Production (Microsoft Azure)

```bash
# 1. Build infrastructure
cd infra/azure && terraform apply -var="environment=demo" -var="location=eastus"

# 2. Deploy the runtime
az containerapp create \
  --name SentinelMesh-runtime \
  --resource-group SentinelMesh-rg \
  --image acr.azurecr.io/SentinelMesh:latest \
  --environment SentinelMesh-env

# 3. Wire up your SIEM
Connect to: https://SentinelMesh-runtime.region.azurecontainerapps.io/ingest
```

### For Production (Oracle Cloud)

```bash
# 1. Build infrastructure
cd infra/oci && terraform apply -var="environment=demo" -var="region=us-ashburn-1"

# 2. Deploy the runtime
oci ce cluster create-kubeconfig \
  --cluster-id ocid1.cluster.oc1.region... && \
  kubectl apply -f infra/oci/SentinelMesh-runtime.yaml

# 3. Wire up your SIEM
Connect to: https://SentinelMesh-api.region.oci.oraclecloud.com/ingest
```

### For Production (Alibaba Cloud)

```bash
# 1. Build infrastructure
cd infra/alibabacloud && terraform apply -var="environment=demo" -var="region=cn-shanghai"

# 2. Deploy the runtime
aliyun eci create \
  --container-group-name SentinelMesh-runtime \
  --image registry.region.aliyuncs.com/SentinelMesh:latest \
  --instance-type ecs.g7.large

# 3. Wire up your SIEM
Connect to: https://SentinelMesh-api.region.alibabacloud.com/ingest
```

### For Production (NVIDIA Cloud)

```bash
# 1. Build infrastructure
cd infra/nvidia && terraform apply -var="environment=demo" -var="region=us-west-2"

# 2. Deploy the runtime
nvidia-ai launch SentinelMesh-runtime \
  --image nvcr.io/SentinelMesh:latest \
  --gpu-count 4 \
  --instance-type g5.24xlarge

# 3. Wire up your SIEM
Connect to: https://SentinelMesh-api.nvidia-cloud.com/ingest
```

---

## 🔐 Forensic Rigor Built In

SentinelMesh doesn't just comply with standards—it's built from them. Every control is mapped, auditable, and continuously verified.

### Core Framework Coverage

- **NIST 800-53 / ISO 27001**: Every control mapped and auditable via the [Compliance Matrix Dashboard](reference/technical-specs/DASHBOARDS-UI/compliance-matrix-dashboard.md)
- **Data Masking & Encryption**: GDPR, HIPAA, and PCI-DSS compliant with encryption at rest and in transit, plus [Regulatory Audit Trails](./reference/features/07-regulatory-timestamps.md)
- **Court-Ready Evidence**: Signed via HMAC-SHA256 & P-256, backed by **FIPS 140-2 Level 4 HSMs**. Evidence distributed across Confidential Computing enclaves, zero-knowledge blockchains, and torrents (distributed ledgers)—can't be tampered with, deleted, or retroactively rewritten.
- **Zero-Knowledge Proofs**: Verify incident response without leaking sensitive details
- **Immutable Audit Chains**: Merkle proofs ensure no tampering, deletion, or retroactive revision

### Financial Services Compliance

- **SOX 404** (Sarbanes-Oxley): Controls testing, audit trail automation
- **PCI-DSS v4.0**: Payment card data protection, segmentation, encryption
- **GLBA** (Gramm-Leach-Bliley): Financial institution data safeguards
- **NCUA**: Credit union regulatory compliance
- **FFIEC** (Federal Financial Institutions Examination Council): Multi-agency aligned controls
- **FDIC / OCC**: Banking regulator standards for incident response and data integrity
- **NACHA (ACH)**: ACH transaction audit and compliance
- **SWIFT CSP** (Customer Security Program): Swift payment network compliance
- **PSD2** (EU Payment Services): Strong authentication and transaction monitoring
- **BACS / CHAPS**: UK clearing and payment system compliance

### Healthcare & Life Sciences

- **HIPAA Security Rule**: PHI protection, encryption, access controls
- **HITECH**: Breach notification and penalty avoidance
- **HITRUST CSF**: Unified framework combining HIPAA, HITECH, ISO
- **GxP (FDA 21 CFR Part 11)**: Electronic records, signatures for regulated environments

### Government & Defense

- **FedRAMP High**: Federal cloud security authorization
- **CMMC Level 3+** (Cybersecurity Maturity Model Certification): Defense contractor compliance
- **ITAR** (International Traffic in Arms Regulations): Export control of defense technology
- **IL4 / IL5 / IL6** (Impact Levels): US government cloud classification
- **CJIS** (Criminal Justice Information Services): Law enforcement data standards
- **NYDFS Part 500**: New York Department of Financial Services cybersecurity
- **SecNumCloud** (France): French cloud security requirements
- **IRS 1075 (FTI)**: Federal Tax Information protection standards

### Infrastructure & Utilities

- **NERC CIP** (North American Electric Reliability): Power grid cybersecurity
- **NIS2** (EU Network and Information Security): Critical infrastructure protection

### Privacy & Data Protection

- **GDPR** (EU General Data Protection Regulation): Data subject rights, retention, breach notification
- **CCPA / CPRA** (California Privacy Rights Act): State-level privacy protections
- **LGPD** (Brazil Lei Geral de Proteção de Dados): Brazilian privacy law
- **PIPEDA** (Canada): Canadian personal information protection
- **EU Data Boundary**: Data residency and sovereignty requirements
- **China PIPL** (Personal Information Protection Law): Chinese data protection
- **TISAX AL3** (Germany): Trusted Information Security Assessment Exchange

### Emerging & AI Regulation

- **EU AI Act (High-Risk)**: Compliance for high-risk AI incident detection and response
- **NIST AI RMF** (Artificial Intelligence Risk Management Framework): Risk profiling for autonomous agents

### Foundational Security Standards

- **NIST 800 Series**: Comprehensive guidance (800-53, 800-171, 800-188, etc.)
- **ISO 27001 / 27002**: Information security management systems
- **ISO 31000**: Risk management framework

Your team can now **prove** investigations were thorough, unmanipulated, and policy-compliant—across every major jurisdiction and industry—without sacrificing speed.

---

## 📊 By The Numbers

- **78+ features** across 4 TIER levels (and counting)
- **39 capabilities** for edge cases and operational polish
- **10-layer safety stack** keeps autonomous execution in check
- **971+ tests** ensuring forensic integrity top to bottom
- **~2,000+ pages** of technical documentation (layered, not overwhelming)
- **Multi-SIEM**: Splunk, Chronicle, Elastic, Qradar, Azure Sentinel, and 10+ more
- **47 seconds average**: Alert to signed evidence
- **95%+ accuracy** on routine incidents (99%+ with peer validation)
- **Cognitive Light Cones**: Agents can't cascade failures beyond their domain
- **5-minute rollback window**: Any autonomous action can be undone

---

## 🎯 Who Should Use This

✅ **Enterprises with messy SIEM/EDR stacks** (who doesn't?)  
✅ **Regulated industries** that need evidence that holds up in court (Finance, Healthcare, Energy)  
✅ **SOCs drowning in alerts** with investigation backlogs  
✅ **Security researchers** experimenting with autonomous IR at scale  
✅ **Teams deploying AI agents** in security (and worried about safety)

---

## 🤝 Contributing

We're accepting contributions from CONFIDENTIAL employees and authorized partners.

**Before you submit:**

1. Read **[CONTRIBUTING.md](CONTRIBUTING.md)** first
2. Check the [Architecture Decision Records](reference/technical-specs/01-MASTER-ARCHITECTURE.md)
3. Make sure your changes keep forensic integrity intact (see [Security Checklist](SECURITY.md))
4. All contributions must be signed with your MNDA-authorized GPG key

**We want:**

- New detection rules and SIEM integrations
- Plugin extensions
- Dashboard improvements
- Performance tuning
- Better autonomous reasoning (with safety constraints, obviously)

---

## 📚 Documentation

Different docs for different people:

- **[START-HERE](reference/00-START-HERE.md)** — Execs, SOC directors, new users
- **[DOCUMENTATION_MAP](reference/technical-specs/DOCUMENTATION_MAP.md)** — Complete feature list
- **[Architecture Deep-Dives](reference/technical-specs/TIER-DEEP-DIVES/)** — Engineers, researchers who want to understand the guts
- **[Operations Runbooks](reference/technical-specs/OPERATIONS/)** — SREs, incident responders
- **[API Reference](reference/technical-specs/GENERATORS/)** — Developers, integrators

---

## 🔬 Research & Innovation

SentinelMesh brings together **forensic science, complex systems theory, and autonomous agent safety**—tackling problems that theoretically existed behind lab doors and in philosophy classes and only now are being fully realized.

### Core Innovations (Not Just Talk)

**1. Cognitive Light Cone Analysis**

- Borrowed from physics and information theory: agents stay within their bounded context
- Stops cascading failures across system boundaries
- Safe autonomy without requiring omniscience
- **Applied here**: Investigation scope automatically narrows based on evidence topology, preventing combinatorial explosion in threat hunting

**2. Confidence-Based Progressive Governance**

- Confidence scores unlock different safety layers (L1–L10)
- No "all or nothing" automation—real nuance around risk
- Built on information theory and reliability engineering
- **Applied here**: Low-confidence findings get human review; high-confidence findings execute autonomously with reversible actions

**3. Multi-Agent Peer Validation**

- Game theory applied: agents validate each other's high-stakes decisions
- Prevents single-agent blindness and echo chambers
- Escalation requires consensus
- **Applied here**: Forensic agents debate threat classifications; disagreement triggers secondary analysis before enforcement

**4. SLO-Aware Execution**

- Agents know the SLO impact before they act
- Stops technically-correct-but-operationally-disastrous automation
- Ties autonomy to actual business outcomes
- **Applied here**: Remediation actions pause if response time budgets are exhausted; agents defer to lower-impact alternatives

**5. Reactive Graphs That Recompute**

- Marimo-based investigations that adapt in real-time
- New evidence triggers full DAG recomputation
- Dead ends disappear instantly; new paths open automatically
- **Applied here**: Attack graph topology shifts as new IOCs arrive; investigation branches collapse or expand without manual intervention

**6. Cryptographic Proof Chains**

- Merkle trees + HSM signatures
- Distributed via torrent and blockchain
- Every decision is mathematically verifiable
- **Applied here**: Investigation state machine creates immutable forensic records; even investigators can't retroactively modify findings

**7. Multi-SIEM Query Translation**

- AST-based conversion across any vendor ecosystem
- One investigation, any SIEM
- Actual universal interoperability
- **Applied here**: Threat indicators automatically translate across Splunk, Elastic, Chronicle, Sentinel; no vendor lock-in

### Advanced Theoretical Foundations (Not Found in Commercial SOARs)

**8. Energy-Based Models (EBM)**

- Borrowed from statistical physics and machine learning
- Models security incidents as energy landscapes; lower energy = higher threat probability
- Captures non-linear threat relationships that Bayesian models miss
- **Applied here**: Measurements considers interaction effects between IOCs (two weak signals + weak correlation = high threat)

**9. Morphogenetic SOC (Biological Self-Organization)**

- Adapts developmental biology concepts (morphogenesis, chemical gradients, Turing patterns)
- Security operations evolve topology without central command; pattern emergence drives infrastructure changes
- Feedback loops steer organizational learning
- **Applied here**: Playbook library self-organizes based on incident patterns; new response patterns bootstrap automatically

**10. Stigmergy in Multi-Agent Coordination**

- Borrowed from swarm intelligence and ant colony behavior
- Agents leave traces (pheromones) in the investigation graph; peers follow high-signal paths
- Decentralized coordination without explicit messaging
- **Applied here**: When one agent finds a promising investigation path, other agents probabilistically follow; no central coordinator needed

**11. Topology-Aware Incident Routing**

- Graph theory applied to investigation flow
- Optimal investigation paths calculated via network analysis (not just rule-based workflows)
- Dead-end branches pruned automatically using betweenness centrality
- **Applied here**: Investigation paths adapt to current SIEM topology and query latency; slow data sources get deprioritized

**13. Bayesian Uncertainty Quantification**

- Probabilistic threat modeling instead of binary detection
- Belief updating as evidence accumulates
- Confidence intervals around every forensic finding
- **Applied here**: Findings include credible intervals (95% confidence: attacker accessed X systems ± 3); lawyers and regulators get real uncertainty bounds

**14. Homeostatic Security Operations**

- Biological homeostasis applied to incident response—maintains operational stability via feedback
- Self-adjusting automation thresholds as threat environment changes
- **Applied here**: As attack complexity rises, automation confidence thresholds automatically tighten; as attack complexity falls, thresholds relax

**15. Gradient-Based Optimization for Playbook Tuning**

- Playbooks improve via gradient descent (like neural networks)
- Each incident execution updates playbook parameters
- No manual tuning needed; system learns optimal detection/response balance
- **Applied here**: SOC's detection rules evolve automatically; false positive rates drop 1-13% per quarter without human intervention

**16. Information Asymmetry Detection**

- Game theory concept: agents detect when adversaries have information advantage
- Triggers active threat hunting instead of waiting for passive alerts
- **Applied here**: System detects when attacker dwell time exceeds detection latency; automatically escalates to proactive investigation

**17. Distributed Consensus for High-Stakes Actions**

- Byzantine fault tolerance applied to forensic decision-making
- Majority agreement required for destructive actions (kill process, block IP, etc.)
- Minority opinion still gets logged for post-incident analysis
- **Applied here**: Sliding window ofagents must agree before automated incident containment; dissenting opinions inform future tuning

**18. Causal Inference in Threat Attribution**

- Goes beyond correlation; infers causal chains in attack sequences
- Uses do-calculus to distinguish causation from confounding
- Lean4-based reasoning tools to verify causal chains and attributions
- **Applied here**: System determines not just "which processes connected" but "which process _caused_ the lateral movement"

**19. Evolutionary Algorithms in Playbook Evolution**

- Genetic programming applied to automated playbook generation and optimization
- Playbooks "breed" successful characteristics from past incidents; poor performers are culled
- Mutation operators introduce novel detection patterns; crossover combines proven techniques
- Population diversity prevents local optimization traps
- **Applied here**: SOC's detection playbooks evolve organically without manual coding; attack detection adapts faster than threat actors iterate. Mutation rates auto-tune based on false positive/negative ratios; playbook "genomes" that survive 100+ incidents become production-grade detectors.

**20. Self-Assembly in Multi-Agent Orchestration**

- Borrowed from supramolecular chemistry and nanotechnology: autonomous subsystems spontaneously organize into coherent structures
- Agents don't receive assignment orders; instead, they bind to problems based on affinity (competency matching)
- Weak binding allows rapid re-binding when incident priorities shift
- Self-assembly patterns scale from 2-agent pairs to 50+ agents without central choreography
- **Applied here**: When a new alert arrives, investigation agents self-assemble around it based on their expertise tags. Low-level agents (OS event parsers) bind first; higher-level agents (threat correlation) bind once sufficient evidence accumulates. Agents unbind and reassemble as investigation scope shifts. No workflow engine needed; topology emerges.

**21. Criticality and Phase Transitions in Threat Detection**

- Complex systems theory: security networks approach critical points where small perturbations cause system-wide state changes
- Detection sensitivity operates near the critical point (maximum responsiveness) rather than far from it
- Phase transitions between detection modes (binary → graduated escalation) preserve system stability
- **Applied here**: System tunes detection thresholds to operate at criticality—highly responsive to genuine threats, but stable under noise. When attack complexity jumps, system transitions smoothly to heightened alert posture without oscillation.

**22. Fractal Self-Similarity in Attack Patterns**

- Complex systems theory: attack campaigns exhibit fractal structure at different timescales
- Pattern matching across hours, days, months reveals meta-campaigns
- Self-similar signatures at multiple scales (individual command ↔ coordinated campaign)
- **Applied here**: Detects coordinated attacks spanning weeks when individual events are noise. A single suspicious process at 1:00 AM, a suspicious file at 10:00 AM, and a suspicious network connection at 2:00 PM individually mean nothing—but together, their fractal pattern signature triggers immediate escalation.

**23. Entropy Dynamics of Security State**

- Information entropy used to measure investigation progress
- High entropy = high uncertainty; low entropy = high confidence
- Entropy reduction guides which queries to run next
- Adaptive query planning minimizes entropy most efficiently
- **Applied here**: Agent prioritizes queries that most reduce investigation uncertainty. If evidence points to either "Vendor A breach" or "Insider threat," agent runs the query that most cleanly separates these hypotheses (minimizes remaining entropy). Investigation completes in fewer queries, faster resolution.

### Actually Grounded in Theory

This isn't heuristics or vendor hand-waving. It's built on:

- **Information Theory** (light cones, bounded contexts, entropy reduction)
- **Game Theory** (peer consensus, multi-agent dynamics, information asymmetry)
- **Systems Theory** (SLO impact, failure propagation, homeostasis, criticality, phase transitions)
- **Statistical Physics** (energy-based models, phase transitions in threat detection)
- **Developmental Biology** (morphogenesis, self-organization, gradient-driven emergence)
- **Evolutionary Biology** (genetic algorithms, fitness selection, mutation operators, population diversity)
- **Supramolecular Chemistry** (self-assembly, affinity binding, spontaneous organization)
- **Swarm Intelligence** (stigmergy, decentralized coordination)
- **Bayesian Statistics** (probabilistic reasoning, belief updating)
- **Causal Inference** (do-calculus, backdoor adjustment, confounding detection)
- **Network Science** (topology-aware routing, centrality measures, graph algorithms, fractal patterns)
- **Forensic Science** (proof chains, evidence integrity, cryptographic verification)
- **Complex Systems Science** (emergence, self-organization, adaptation)
- **Biological Control Theory** (feedback loops, homeostasis, TAME competency)
- **Cognitive Psychology** (decision-making under stress, cognitive load, fatigue)
- **Aviation Safety** (CRM principles, high-reliability organizations)

### Where This Actually Comes From

The research backing SentinelMesh lives in two published series:

**📖 [Autonomous AI SOC](https://www.securesql.info/series/autonomous-ai-soc/)** (8 episodes)

- Energy-Based Models for threat intelligence
- Autonomous ETL and self-optimizing playbooks
- AI governance at scale
- Infrastructure designed for autonomous operations

**📖 [Morphogenetic SOC](https://www.securesql.info/series/morphogenetic-soc/)** (9 episodes + whitepaper)

- Complex systems science applied to security
- Biological control theory for adaptive operations
- Self-organizing resilient systems
- Feedback loops and emergent behavior

These aren't prelude—they're the foundation. SentinelMesh is the reference implementation of these research ideas.

We're actively publishing on **autonomous agent safety, morphogenetic systems in security, and energy-based modeling**. See **[./README.md](./README.md)** for papers and collaborations.

---

## ⚖️ License & Access

**Copyright 2026 CONFIDENTIAL Inc.** All rights reserved.

This repository is **CONFIDENTIAL MNDA-gated**. Access requires:

- A CONFIDENTIAL corporate identity, OR
- A signed Master Data Agreement with CONFIDENTIAL Inc.

Want in? Reach out: `SentinelMesh-team@CONFIDENTIAL.com`

---

## 🙌 Thanks

SentinelMesh is the work of CONFIDENTIAL's Security, Cloud, Moonshots, and AI Research teams. Big thanks to the incident response community for the feedback that shaped this.

---

**Built with 🔐 for teams that won't settle for less than rigor, intelligence, and scale.**
