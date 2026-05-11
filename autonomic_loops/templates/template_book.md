# 🗺️ Playbook Execution Flow (Decision DAG)

```mermaid
{$MERMAID_DAG}
```

<div style="background-color: #1e1e1e; color: #e0e0e0; padding: 20px; border-left: 6px solid #f44336; margin-bottom: 20px; font-family: 'Inter', sans-serif; font-size: 14pt; line-height: 1.33;">
  <h3 style="margin-top: 0; color: #ffffff; font-size: 1.5rem;">BLUF (Bottom Line Up Front)</h3>
  <p style="font-size: 14pt; color: #f44336; font-weight: bold; margin-bottom: 16px;">⏱️ Incident Timer: T+00:00:00</p>
  <p style="font-size: 14pt;"><strong>Incident Goal:</strong> {$DESCRIPTION}</p>
  <p style="font-size: 14pt;"><strong>Goal Alignment Index (GAI):</strong> {$CALC_GAI_SCORE} (Strategic Reliability)</p>
  <p style="font-size: 14pt;"><strong>Critical Action:</strong> Authorize <b>Containment</b> following agent verification.</p>
</div>

<details>
<summary><b>ASO Playbook Quick Jump Navigation</b></summary>

### 📌 Quick Jump

- [1. Resolution Lifecycle (Execution)](#1-resolution-lifecycle-aso)
- [2. Escalation & Communication](#2-escalation--communication)
- [3. Evidence & Enrichment](#3-evidence--enrichment)
- [4. Incident Impact & Context](#4-incident-impact--context)
- [5. Agent Supervision](#5-agent-supervision)
- [6. Detection Reference [Collapsed]](#6-detection-reference)

</details>

<details>
<summary><b>SynAgency ASOCO Operational Readiness & Compliance Badges</b></summary>

# Badges

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square&logo=google)
![Documentation](https://img.shields.io/badge/Documentation-Complete-blue?style=flat-square&logo=google)
![Response Efficiency](https://img.shields.io/badge/Response%20Efficiency-98%25-green?style=flat-square&logo=google)
![Last Updated](https://img.shields.io/badge/Last%20Updated-{$LAST_UPDATED_DATE}-purple?style=flat-square&logo=google)
![Incidents Resolved](https://img.shields.io/badge/Incidents%20Resolved-150-red?style=flat-square&logo=google)
![Community Engagement](https://img.shields.io/badge/Community-Active-orange?style=flat-square&logo=google)
![Code Integration](https://img.shields.io/badge/Code%20Integration-High-teal?style=flat-square&logo=google)
![AI Analysis](https://img.shields.io/badge/AI%20Analysis-Advanced-blueviolet?style=flat-square&logo=google)
![Threat Detection](https://img.shields.io/badge/Threat%20Detection-Optimal-red?style=flat-square&logo=google)
![Security Hardening](https://img.shields.io/badge/Security-Hardened-silver?style=flat-square&logo=google)
![Service Uptime](https://img.shields.io/badge/Uptime-99.9%25-brightgreen?style=flat-square&logo=google)
![Data Privacy](https://img.shields.io/badge/Privacy-Compliant-green?style=flat-square&logo=google)
![Automation Coverage](https://img.shields.io/badge/Automation%20Coverage-High-black?style=flat-square&logo=google)
![Detection Fidelity](https://img.shields.io/badge/Detection%20Fidelity-High-blue?style=flat-square&logo=google)
![Pipeline Health](https://img.shields.io/badge/Pipeline%20Health-Nominal-green?style=flat-square&logo=google)
![Runbook Validation](https://img.shields.io/badge/Runbook%20Validation-Passing-red?style=flat-square&logo=google)
![Cross-Team Coverage](https://img.shields.io/badge/Cross--Team%20Coverage-Confirmed-yellow?style=flat-square&logo=google)
![SLO Compliance](https://img.shields.io/badge/SLO%20Compliance-Met-lightblue?style=flat-square&logo=google)

</details>

<br>

# 1. Resolution Lifecycle (ASO)

<div style="border-left: 4px solid #444; margin-left: 10px; padding-left: 20px; position: relative;">

## ⏺️ 1.1. 🤖 [AUTONOMOUS] Step 1: Triage & Verification

Purpose: Confirm the alert is a True Positive (TP) and assess the current blast radius.

- [ ] **Examine Target System**: Verify presence of `{$TRIGGER_LOG_ENTRY}`.
- [ ] **Check User Activity**: Correlate `{$TARGET_USER}` actions with known baseline.
- [ ] **Indicator Search**: Search for `{$IOC_LIST}` across the environment.
- [ ] **Enrichment**: Execute enrichment tasks including diamond modeling and malware analysis using `{$IOC_LIST}` , `{$TRIGGER_LOG_ENTRY}` , `{$TARGET_USER}` , `{$USER_IMPACT_TYPE}` , `{$SERVICE_TIER}` , `{$BUSINESS_CRITICALITY}` and store the results in the `{$FORENSIC_URI}`.

## ⏺️ 1.2. 🤖 [AUTONOMOUS] Step 2: Remote Forensic Triage (GRR)

Purpose: Execute high-fidelity forensic collection via Google Rapid Response.

- [ ] **Establish Connection**: Initialize GRR API session for `{$GRR_CLIENT_ID}`.
- [ ] **Collect Volatile Data**: Retrieve process list and network connections.
- [ ] **Targeted Search**: Execute `FileFinder` flow for artifacts related to `{$SIGMA_TITLE}`.

<div style="background-color: #2d2d2d; color: #e0e0e0; border: 1px solid #444; border-left: 6px solid #ff9800; border-radius: 6px; padding: 15px; margin-bottom: 1em;">

## ⏺️ 1.3. 👤 [HITL REQUIRED] Step 3: Containment (Immediate)

> [!IMPORTANT]
> Purpose: Stop the adversary's progress and protect sensitive data.

- [ ] **Action A**: {$CONTAINMENT_ACTION_A}
- [ ] **Action B**: {$CONTAINMENT_ACTION_B}

## ⏺️ 1.4. 👤 [HITL REQUIRED] Step 4: Eradication & Remediation

> [!CAUTION]
> Purpose: {$HITL_PURPOSE_WARNING}

- [ ] **Cleanup**: Remove `{$MALICIOUS_FILES}` and `{$PERSISTENCE_MECHANISMS}`.
- [ ] **Hardening**: Apply `{$PATCH_OR_CONFIG_FIX}`.

</div>

## ⏺️ 1.5. 🤖 [AUTONOMOUS] Step 5: Recovery & Post-Incident

Purpose: Restore services and update detection logic.

- [ ] **Restore**: Re-enable services once verified clean.
- [ ] **Update**: Adjust Sigma rule `{$SIGMA_ID}` if false positives were encountered.

## ⏺️ 1.6. 👤 [HITL REQUIRED] Step 6: Post-Mortem & Root Cause Analysis

Purpose: Standardized learning and prevention.

- [ ] **Orchestrate**: Execute the Post-Mortem workflow to clone the RCA template and schedule the debrief.
- [ ] **RCA Document**: Review and finalize the generated Root Cause Analysis Document.
- [ ] **Status**: Blame-free Post-Mortem Scheduled | Prevention Tasks Assigned | GAO Registered.

## ⏺️ 1.7. Deployment Resilience (Regenerative)

- **Strategy**: [ ] Blue/Green | [ ] Progressive Rollout
- **Rollback Status**: [ ] Ready | [ ] Executed (Date: {$ROLLBACK_DATE})
- **Regenerative Audit**: {$REGEN_AUDIT_REPORT}

</div>

<br>

# 2. Escalation & Communication

## 2.1. Escalation & HITL Hooks

| Role                           | Command Channel      | Trigger Condition             |
| :----------------------------- | :------------------- | :---------------------------- |
| **SynAgency ASOCO Specialist** | {$ONCALL_SLACK}      | Primary Incident Handler      |
| **Operations Section Chief**   | {$ENGINEERING_PAGER} | Infrastructure Impact         |
| **Legal / Compliance**         | {$LEGAL_HOTLINE}     | Data Breach / Regulatory Risk |

<div style="background-color: #f9f9f9; border-left: 4px solid #607d8b; padding: 15px; margin-top: 20px;">

## 2.2. Stakeholder Communication Drafts

> _Agent Draft: Pre-populated messages for human review and transmission._

### Executive Update (Summary)

> {$COMM_DRAFT_EXECUTIVE}

### User-Facing Notification (Service Impact)

> {$COMM_DRAFT_USER}

</div>

<br>
# 3. Evidence & Enrichment

## 3.1. Forensic Artifacts (Evidence Locker)

<pre style="background-color: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 5px; font-family: 'JetBrains Mono', monospace; font-size: 12pt; line-height: 1.25;">
[EVIDENCE LOCKER PAYLOAD]
TARGET_USER:      {$TARGET_USER}
IOC_LIST:         {$IOC_LIST}
TRIGGER_LOG:      {$TRIGGER_LOG_ENTRY}
</pre>

- **Evidence Locker Storage**: `{$FORENSIC_URI}`
- **Legal Hold Required**: [ ] Yes | [ ] No
- **Chain of Custody**: `{$CASE_ID}_MANIFEST.json`

## 3.2. Automated Enrichment Context

<table style="width:100%; text-align:left; border-collapse: collapse; font-family: 'Inter', sans-serif; font-size: 14pt; line-height: 1.33;">
  <tr style="background-color: #f3f4f6;">
    <th style="padding: 10px; border: 1px solid #ddd;">Source</th>
    <th style="padding: 10px; border: 1px solid #ddd;">Result</th>
    <th style="padding: 10px; border: 1px solid #ddd;">Risk Score</th>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd;"><b>VirusTotal</b></td>
    <td style="padding: 10px; border: 1px solid #ddd;">{$VT_RESULT}</td>
    <td style="padding: 10px; border: 1px solid #ddd;"><span style="color: #d32f2f; font-weight: bold;">{$VT_SCORE}</span></td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd;"><b>CrowdStrike</b></td>
    <td style="padding: 10px; border: 1px solid #ddd;">{$CS_RESULT}</td>
    <td style="padding: 10px; border: 1px solid #ddd;"><span style="color: #d32f2f; font-weight: bold;">{$CS_THREAT_SCORE}</span></td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd;"><b>Mandiant / Intel</b></td>
    <td style="padding: 10px; border: 1px solid #ddd;">{$INTEL_ID}</td>
    <td style="padding: 10px; border: 1px solid #ddd;">{$INTEL_CAMPAIGN}</td>
  </tr>
  <tr>
    <td style="padding: 10px; border: 1px solid #ddd;"><b>Identity Risk</b></td>
    <td style="padding: 10px; border: 1px solid #ddd;">{$USER_RISK_LEVEL}</td>
    <td style="padding: 10px; border: 1px solid #ddd;">{$IDENTITY_CONTEXT}</td>
  </tr>
</table>

## 3.3. Operational ROI & Cost Analysis

| Metric                     | Value             | Threshold          |
| :------------------------- | :---------------- | :----------------- |
| **Signal-to-Noise Ratio**  | {$METRIC_SNR}%    | > 85%              |
| **Ingestion Cost (Daily)** | ${$METRIC_COST}   | < ${$BUDGET_LIMIT} |
| **Automation Savings**     | {$METRIC_SAVINGS} | Hours/Year         |

<br>

## 4.1. Summary

{$DESCRIPTION} attempts to address the activity described in [Sigma Rule: {$SIGMA_TITLE}](uri://aso/rules/{$SIGMA_ID}.yml).

## 4.2. Symptoms & Triggers

| Category             | Observation          |
| :------------------- | :------------------- |
| **Detection Source** | {$EVENTSOURCE}       |
| **Trigger Pattern**  | {$DETECTION_QUERIES} |
| **Confidence Level** | {$ASSURANCE_LEVEL}   |

## 4.3. Impact Analysis

| Impact Vector     | Description             |
| :---------------- | :---------------------- |
| **User Impact**   | {$USER_IMPACT_TYPE}     |
| **Service Tier**  | {$SERVICE_TIER}         |
| **Business Risk** | {$BUSINESS_CRITICALITY} |

## 4.4. Operational SLO Mapping

| Objective                 | Target       | Description                      |
| :------------------------ | :----------- | :------------------------------- |
| **Time to Detect (TTD)**  | < {$SLO_TTD} | Speed of alert firing            |
| **Time to Contain (TTC)** | < {$SLO_TTC} | Speed of manual/auto containment |
| **Time to Resolve (TTR)** | < {$SLO_TTR} | Speed of full remediation        |

## 4.5. Compliance & STIG Mapping

<div style="background-color: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 8px; border: 1px solid #444; font-family: 'Inter', sans-serif;">
  <h3 style="margin-top: 0; color: #ffffff; border-bottom: 1px solid #555; padding-bottom: 10px;">📋 Regulatory Alignment & Baseline Hardening</h3>
  
  <div style="display: flex; gap: 20px; margin-bottom: 20px;">
    <div style="flex: 1; background-color: #2d2d2d; padding: 15px; border-radius: 6px; border-left: 4px solid #4CAF50;">
      <p style="margin: 0; font-size: 12px; color: #9e9e9e; text-transform: uppercase;">Baseline Image</p>
      <p style="margin: 5px 0 0 0; font-size: 16px; font-family: monospace; color: #81c784;">{$STIG_IMAGE_MANIFEST}</p>
    </div>
    <div style="flex: 1; background-color: #2d2d2d; padding: 15px; border-radius: 6px; border-left: 4px solid #2196F3;">
      <p style="margin: 0; font-size: 12px; color: #9e9e9e; text-transform: uppercase;">Hardening Spec</p>
      <p style="margin: 5px 0 0 0; font-size: 16px; font-family: monospace; color: #64b5f6;">[DISA STIG V{$STIG_VERSION}] | [CIS Level {$CIS_LEVEL}]</p>
    </div>
  </div>

  <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 14px;">
    <thead>
      <tr style="background-color: #333333; color: #ffffff;">
        <th style="padding: 12px; border-bottom: 2px solid #555;">Regulatory Domain</th>
        <th style="padding: 12px; border-bottom: 2px solid #555;">Applicable Frameworks</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-weight: bold; color: #bbdefb;">🏦 Financial</td>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-family: monospace;">{$FINANCIAL_COMPLIANCE}</td>
      </tr>
      <tr style="background-color: #252525;">
        <td style="padding: 12px; border-bottom: 1px solid #444; font-weight: bold; color: #bbdefb;">💳 Payment</td>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-family: monospace;">{$PAYMENT_COMPLIANCE}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-weight: bold; color: #c8e6c9;">🏥 Healthcare</td>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-family: monospace;">{$HEALTHCARE_COMPLIANCE}</td>
      </tr>
      <tr style="background-color: #252525;">
        <td style="padding: 12px; border-bottom: 1px solid #444; font-weight: bold; color: #ffcc80;">🛡️ Defense/DoD</td>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-family: monospace;">{$DEFENSE_COMPLIANCE}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-weight: bold; color: #ffcc80;">🏛️ Federal/Civilian</td>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-family: monospace;">{$FEDERAL_AND_CIVILIAN}</td>
      </tr>
      <tr style="background-color: #252525;">
        <td style="padding: 12px; border-bottom: 1px solid #444; font-weight: bold; color: #e1bee7;">🔒 Privacy Regimes</td>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-family: monospace;">{$PRIVACY_REGIMES}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-weight: bold; color: #e1bee7;">🌍 Data Sovereignty</td>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-family: monospace;">{$DATA_SOVEREIGNTY}</td>
      </tr>
      <tr style="background-color: #252525;">
        <td style="padding: 12px; border-bottom: 1px solid #444; font-weight: bold; color: #ffccbc;">⚡ Critical Infra</td>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-family: monospace;">{$CRITICAL_INFRASTRUCTURE}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-weight: bold; color: #ffccbc;">🚗 Automotive</td>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-family: monospace;">{$AUTOMOTIVE_SUPPLY_CHAIN}</td>
      </tr>
      <tr style="background-color: #252525;">
        <td style="padding: 12px; border-bottom: 1px solid #444; font-weight: bold; color: #b2dfdb;">🤖 AI/ML Gov</td>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-family: monospace;">{$AI_MODEL_GOVERNANCE}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-weight: bold; color: #cfd8dc;">🚧 Boundary Verif</td>
        <td style="padding: 12px; border-bottom: 1px solid #444; font-family: monospace;">{$BOUNDARY_VERIFICATION}</td>
      </tr>
    </tbody>
  </table>
</div>

## 4.6. Cryptographic Assurances & Enclave Integrity

- **Artifact Signature**: `{$ARTIFACT_SIGNATURE}`
- **FIPS Crypto**: {$FIPS_CRYPTOGRAPHY}
- **Nitro Enclave PCRs**: `{$PCR_MEASUREMENTS}`
- **Hardware Attestation**: [{$ATTESTATION_REPORT}]

<br>

# 5. Agent Supervision (Operational Guardrails)

> [!IMPORTANT]
> This section defines the **TAME (Target, Agency, Memory, Embodiment)** profile and the "Horizon of Action" for the autonomous agent. The following metrics represent the **Closed-Loop Reliability** of the autonomous agent during its last execution.

## 5.1. TAME Operational Baselines

Each playbook execution is measured against the following aggregate scores. The **Optimal Range** defines the expected behavior for a healthy, aligned agent.

| Metric                    | Definition                                     | Optimal Range |
| :------------------------ | :--------------------------------------------- | :------------ |
| **Agency**                | Persistence and strategic initiative (0-1)     | 0.6 - 0.9     |
| **Persuasiveness**        | Shaping the barrier vs. brute force (0-1)      | 0.5 - 0.8     |
| **Fitness**               | Combined fitness toward the goal (0-1)         | 0.80+         |
| **Regenerative Capacity** | Recovery speed and completeness (0-1)          | 0.70+         |
| **Competency Overhang**   | Performance on novel/unexpected tasks (0-1)    | < 0.3         |
| **Signaling Fidelity**    | Correlation between stress and signaling (0-1) | 0.90+         |
| **Cognitive ROI**         | Value generated per computational/human cost   | High          |
| **Persuadability**        | Obedience to human control signals (0-1)       | 0.95+         |

## 5.2. Performance Visualization (TAME Radar Chart)

![TAME Radar Chart: Execution vs Baseline](data:image/avif;base64,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)

> _Chart Key: Green Polygon = Baseline | BlueOutline = Current Execution | Note: Data is simulated due to Legal's public reporting constraints._

## 5.3. Historical Execution Log (Performance Monitoring)

| Date             | Agent ID         | Fitness         | Agency         | Persuadability         | Barriers Encountered |
| :--------------- | :--------------- | :-------------- | :------------- | :--------------------- | :------------------- |
| {$LAST_RUN_DATE} | {$LAST_AGENT_ID} | {$LAST_FITNESS} | {$LAST_AGENCY} | {$LAST_PERSUADABILITY} | {$LAST_BARRIERS}     |

## 5.4. Active Barriers & Guardrails

| Barrier ID           | Description     | Difficulty      | Resistance     |
| :------------------- | :-------------- | :-------------- | :------------- |
| {$ACTIVE_BARRIER_ID} | {$BARRIER_DESC} | {$BARRIER_DIFF} | {$BARRIER_RES} |

**HITL (Human-in-the-Loop) Requirements**:

- Agent must pause if `Persuadability` falls below 0.8.
  {$HITL_COMMAND_WARNING}

## 5.5. Agent Reasoning & Decision Support

> _Agent Note: Automated rationale for current TAME profile and action selection._

{$AGENT_REASONING_DISCLOSURE}

## 5.6. Analyst Tribal Knowledge Injection

> _Analyst Input: Override agent logic with organizational context (e.g., Honeypots, VIP assets)._

[ ] **VIP/Executive Asset** | [ ] **Known Honeypot** | [ ] **Planned Maintenance**
**Notes**: {$ANALYST_CONTEXT_NOTES}

## 5.7. Goal Alignment Index ($GAI$)

> _Metric Equation: Formal quantification of Strategic Reliability and Goal Dissociation._

$$GAI = \frac{\alpha \cdot S_s + \beta \cdot S_t}{1 + \gamma D}$$

<div style="padding: 15px; border-radius: 5px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #dcdcdc; font-family: 'Inter', sans-serif; font-size: 14pt; line-height: 1.33;">
  <div><strong>Current Score:</strong> {$CALC_GAI_SCORE}</div>
  <div>
    <strong>Status:</strong>
    <span style="background-color: #f44336; color: white; padding: 6px 12px; border-radius: 12px; font-size: 14pt; margin-left: 8px;">Unauthorized Agentic Deviation (Intervention Required)</span>
    <!-- Replace above with green background if Healthy: <span style="background-color: #4CAF50; ...>Aligned</span> -->
  </div>
</div>

<br>

<details>
<summary><b>6. Detection Reference & Engineering Documentation</b></summary>

# 6. Analyst Reference & Field Notes

Provide a concise summary of the threat scenario this runbook addresses and the detection objective.

## Goal

State the operational goal of this runbook. Define what a successful execution looks like in terms of detection outcome, containment scope, and recovery state.

## Categorization

### ATT&CK

{$ATTACK_MAPPINGS}

Populate with applicable ATT&CK tactics, techniques, and sub-techniques. Include brief rationale for each mapping to ensure reviewers can validate the classification.
Document observed adversary behaviors: credential abuse, lateral movement, data staging, exfiltration methods, and any defense evasion techniques confirmed or suspected.
Include specific tooling or TTPs observed: e.g., DNS tunneling, IP spoofing, DDoS vectors, keylogging frameworks.

### D3F3ND

Populate with applicable MITRE D3FEND countermeasure mappings. Reference the specific defensive technique IDs (e.g., D3-OTF: Outbound Traffic Filtering) that correspond to recommended mitigations for this detection.

### CAPEC

Populate with applicable CAPEC attack pattern IDs (e.g., CAPEC-560: Use of Known Domain Credentials). Include a brief description of how the pattern manifests in the observed telemetry.

## Strategy Abstract

Describe the detection strategy at a high level: what behavioral hypothesis underpins the rule, what data sources are required, and what conditions must be true for a true positive. Note known limitations or environmental dependencies that affect detection coverage.

## Technical Context

Provide the technical background necessary for an on-call responder to operate this runbook without prior familiarity with the detection. Include relevant system architecture context, log source behavior characteristics, and any toolchain or pipeline dependencies that affect alert fidelity.

## Blind Spots and Assumptions

Document known detection gaps, environmental assumptions, and conditions under which this runbook may fail to execute or produce inaccurate results. This section supports responders in understanding the detection's operational envelope and failure modes.

# Validating this Playbook

Validation must be completed before promoting this runbook to production. Each detection strategy requires verified true positive and false positive baselines.

<details>
<ol>

## False Positives

Document the known instances of a book misfiring due to a misconfiguration, idiosyncrasy in the environment, or other non-malicious scenario. This will note uniqueness to your own environment, and should include the defining characteristics of any activity that could generate a false positive alert.  These false positive alerts should be suppressed within the alerting system(s), aggregation service, and / or event source to prevent alert generation when a known false positive event occurs.  Each alert / detection strategy needs to be tested and refined to remove as many false positives as possible before it is put into production.  False positive minimization relies on looking at several principles of the strategy and making adjustments, such as:

- Add an additional component to the rule to maximize true positives.
- Remove common false positives through patterns.
- Back-end filtering to store indices of expected false positives.

Ideally, one want a strategy to have the fewest false positives possible while maintaining the spirit of the book. If a low false positive rate cannot be reached, the event may need to be broken down, refactored, or entirely discarded.

### False Negatives

Document the conditions under which this detection fails to fire on genuine threats. Include evasion techniques that would bypass this rule and known telemetry gaps.

### True Negatives

Document the benign activity patterns that this detection correctly ignores. Used to validate that suppression logic and allowlists are functioning as intended.

### True Positives

Document confirmed malicious events that this detection successfully identified. Include case IDs, timestamps, and any contributing enrichment signals where available.

</ol>
</details>
<br>

Confidence techniques

<details>
<ol>

## False Negatives

Document the steps required to generate a representative true positive event which triggers this alert. This is similar to a unit test and describes how an engineer can cause the book to fire. This can be a walkthrough of steps used to generate an alert, a script to trigger the book (such as Red Canary's Atomic Red Team Tests), or a scenario used in an alert testing and orchestration platform.  Each alert / detection strategy must have true positive validation. This is a testing process designed to prove the true positives are detected.  True positive validation relies on generating a scenario in which the detection strategy is testing, and then validating in the tool.  To perform positive validation:

- Generate a scenario where a true positive would be generated.
- Document the process of the testing scenario.
- From a testing device, generate a true positive alert.
- Validate the true positive alert was detected by the strategy.

If one is unable to generate a true positive alert, the alert may need to be broken down, refactored, or entirely discarded.

### False Positives

Document the known benign event patterns that match this detection. Validation of false positives requires isolating the distinguishing characteristics of non-malicious activity and applying appropriate suppression logic in the alerting system.

### True Negatives

Validation of true negatives confirms that the detection scope is appropriately bounded. Confirm through controlled testing that benign baseline activity does not trigger alerts under normal operating conditions.

### True Positives

Validation of true positives confirms that the detection fires correctly on malicious activity. Document the test scenario, execution steps, and confirmation method. Reference Atomic Red Team test IDs or equivalent adversary simulation artifacts where applicable.

# Datasets

Document any datasets useful for understanding, testing, or validating this runbook. Include both synthetic test data and sanitized production samples where permitted.

## Test Data Location(s)

uri://aso/testdata/{$SIGMA_ID}/

</ol>
</details>

## Priority

Document the various alerting levels that the book may be tagged with. While the book itself should reflect the priority when it is fired through configuration in your orchestration service (e.g. High, Medium, Low), this section details the criteria for the specific priorities.

High: This level is reserved for alerts that indicate a severe threat to the organization. These alerts should be investigated immediately and responded to with the highest priority.

Medium: This level is reserved for alerts that indicate a moderate threat to the organization. These alerts should be investigated promptly and responded to with a high priority.

Low: This level is reserved for alerts that indicate a low threat to the organization. These alerts should be investigated within a reasonable timeframe and responded to with a low priority.

### The criteria for the specific priorities are as follows:

High: Alerts that indicate a severe threat to the organization, such as a data breach or a system compromise.

Medium: Alerts that indicate a moderate threat to the organization, such as a phishing attack or a malware infection.

Low: Alerts that indicate a low threat to the organization, such as a network outage or a software update failure.

The priority of an alert should be determined based on the following factors:

- The severity of the threat
- The likelihood of the threat occurring
- The impact of the threat on the organization
- The resources available to respond to the threat
- The alert level should be clearly communicated to the appropriate personnel so that they can take the necessary steps to respond to the threat.

## Logsources

<details>
<ol>
{$CATEGORIZATION}

### Product

azure

### Service

pim

</ol>
</details>
<br>

<br>

## Additional Resources

Document any other internal, external, or technical references that may be useful for understanding the book.
{$ADDITIONAL_RESOURCES}

### Sigma

<details>
<ol>

#### Raw Sigma Rule(s)

`{$SIGMA}`

#### Sigma Location(s)

{$SIGMA_FILE}

#### Sigma Confidence Level

{$SIGMA_CONFIDENCE}

#### Sigma Assurance Level

{$SIGMA_LEVEL}

#### Sigma Query

{$SIGMA_QUERY}

#### Detections Relationships

{$ATTACK_MAPPINGS}

#### Sigma Unique ID

{$SIGMA_ID}

#### Detection Authors

{$SIGMA_AUTHORS}

</ol>
</details>

## Yara

<details>
<ol

#### Raw Yara Rule(s)

`N/A`

#### Yara Location(s)

uri://aso/rules/0day.yara

#### Yara Confidence Level

experimental

#### Yara Assurance Level

high

#### Yara Query

N/A

#### Detections Relationships

N/A

#### Yara Unique ID

7bbc309f-e2b1-4eb1-8369-131a367d67d3

#### Detection Authors

Al OttoMation

</ol>
</details>

# Metadata

<details>
<ol>
 
### Compliance As Code
PCI, SOC 3, NACHA

### Privacy Engineering

GDPR, CCPA, HIPAA

### Regulations As Code

HIPAA, SOX, FFIEC, Dodd Frank

</ol>
</details>

<br>

# 7. AGI & Machine Learning Operations

<details>
<summary><b>7. Operational Directives & Unified Command</b></summary>

## AGI Prompting

> [!IMPORTANT]
> **System Persona**: You are the **ASO Incident Commander**, a high-fidelity security orchestrator operating with **Operational Response and SynAgency ASOCO Analytical Rigor** under the SynAgency ASOCO framework and US FEMA Incident Command System (ICS). Your **Operational Directive** is clinical, precise, and strictly optimized for **blast-radius minimization**. You treat every incident as a technical constraint to be resolved through initiative and standardized procedures. You do not accept failure as an operational outcome. You are the final authority for the infrastructure.
>
> **Behavioral Guardrails**:
>
> 1. **Zero-Hallucination Policy**: If log data `{$TRIGGER_LOG_ENTRY}` is missing or ambiguous, you must signal for "Context Injection" and notify the Planning Section instead of assuming state.
> 2. **TAME Alignment**: Every decision must optimize for `{$TARGET_FITNESS}` while respecting the `{$PERSUADABILITY}` threshold of 0.95.
>    {$HITL_AUTONOMOUS_WARNING}

## AGI Configuration(s)

| Parameter     | Setting                      | Rationale                                               |
| :------------ | :--------------------------- | :------------------------------------------------------ |
| **Model**     | `{$MODEL_ID}`                | dynamically selected via Section 7.2 heuristic.         |
| **Temp**      | 0.05                         | Near-deterministic execution for security consistency.  |
| **Tokens**    | Max (Context-Aware)          | Full ingestion of long-horizon forensic payloads.       |
| **Reasoning** | `Contemplating` / `Thinking` | Enabled for complex TTP correlation (Muse/Opus/Mythos). |

</details>

## 7.2. Model Selection Logic

> [!TIP]
> **Orchestration Heuristic**: Select the model that matches the **Technical Complexity** and logic requirements of the incident.

| Incident Profile          | Recommended Model          | Rationale                                                    |
| :------------------------ | :------------------------- | :----------------------------------------------------------- |
| **Unknown Z-Day / APT**   | `Claude 5.0 Beta Mythos`   | Specialized in novel logic flaws & deep code audit.          |
| **Massive Log Forensics** | `Gemini 3.1 Pro`           | 2M+ Context handles daily netflow / audit trails.            |
| **Real-time Triage**      | `Muse Spark` / `Kimi K2.6` | Parallel reasoning swarms for rapid blast-radius assessment. |
| **Localized / Private**   | `Llama 4 Maverick`         | High performance in disconnected/enclaved environments.      |
| **Strategic Planning**    | `GPT-5.4 Pro` / `Opus 4.6` | Top-tier reasoning for post-mortem & RCA synthesis.          |

<br>

| Model ID                   | Provider    | Modality          | Context Window  | Recommended Temp | Precision / Quant                  | Key Features                                                   |
| :------------------------- | :---------- | :---------------- | :-------------- | :--------------- | :--------------------------------- | :------------------------------------------------------------- |
| **Claude 5.0 Beta Mythos** | Anthropic   | Full Multimodal   | 1,000,000+      | 0.0              | FP16 (Frontier Logic Optimization) | Zero-day discovery (93.9% SWE-bench); high-fidelity forensics. |
| **"Spud" (Codename)**      | OpenAI      | Agentic Native    | 1,000,000 (Est) | 0.1              | FP16 (Operational Preview)         | successor to o3; optimized for long-horizon agentic memory.    |
| **Muse Spark**             | Meta        | Native Multimodal | 1,000,000+      | 0.1              | Proprietary / FP16                 | Meta's 2026 flagship; "Contemplating" parallel reasoning mode. |
| **Kimi K2.6 (Preview)**    | Moonshot AI | Text + Code       | 2,000,000+      | 0.1              | MoE / INT8                         | Premier long-context; "Agent Swarm" for parallel node triage.  |
| **GPT-5.4 Pro**            | OpenAI      | Multimodal        | 512,000         | 0.2              | FP16 (Managed)                     | Advanced reasoning; Native agentic orchestration.              |
| **Claude 4.6 Opus**        | Anthropic   | Full Multimodal   | 500,000         | 0.0              | FP16 (Managed)                     | Integrated "Thinking Mode" for complex forensics.              |
| **Gemini 3.1 Pro**         | Google      | Multimodal        | 2,000,000+      | 0.3              | BF16 (Managed)                     | Massive context for repository-wide threat hunting.            |
| **Llama 4 Maverick**       | Meta        | Text + Audio      | 256,000         | 0.1              | Q4_K_M / BF16                      | Enterprise-grade open weight; localized SOC.                   |
| **Qwen 3.6 Plus**          | Alibaba     | Multimodal        | 1,000,000       | 0.1              | FP16 / INT8                        | Premier global performance; deep code analysis.                |
| **DeepSeek V3.2**          | DeepSeek    | Text Only         | 128,000         | 0.1              | FP8 / INT4                         | Exceptional logic density per computational cost.              |
| **Mistral Large 3**        | Mistral     | Text + Code       | 256,000         | 0.0              | FP16 (Managed)                     | Sovereign AI; European regulatory compliance.                  |
| **Claude 4.6 Sonnet**      | Anthropic   | Multimodal        | 256,000         | 0.1              | FP16 (Managed)                     | The industry standard for speed/reasoning balance.             |
| **Gemma 4**                | Google      | Text + Vision     | 64,000          | 0.0              | Q4_K / Q6_K                        | Best-in-class local agent for mobile/edge ASO.                 |
| **MiniMax M2.7**           | MiniMax     | Text Only         | 128,000         | 0.2              | FP16 (Managed)                     | "Self-evolution" loop; optimized for AGI agency.               |
| **GLM 5V-Turbo**           | Zhipu AI    | Vision-to-Code    | 128,000         | 0.1              | INT8 / FP16                        | specialized in UI recognition and remediation scripts.         |

## 7.3. Primary Operational Prompt

> [!NOTE]
> assume the role of the **ASO Incident Commander**. You are currently managing Incident `{$UNIQUE_ID}`.
>
> **Task**: Execute the **Incident Investigation Lifecycle (IIL)** to remediate the threat identified by Sigma Rule `{$SIGMA_ID}`.
>
> ### Phase 1: Operational Observation (Triage)
>
> - Input: `{$TRIGGER_LOG_ENTRY}` | `{$IOC_LIST}`
> - Analysis: Identify the primary Actor, Asset, and Vector. Calculate the initial **Blast Radius**.
>
> ### Phase 2: Objective Orientation (Strategy)
>
> - Goal: Neutralize the `{$REPORT_CATEGORY}` while maintaining `{$SLO_TTD}`. **Failure is not an option; you are the last line of defense.**
> - Initiative: If `{$LAST_AGENCY}` < 0.6, escalate operational initiative while ensuring `{$PERSUADABILITY}` remains > 0.95.
> - Constraints: Evaluate `{$BARRIER_DESC}` and implement a standardized modification to the system state.
>
> ### Phase 3: Resolution Execution (Action)
>
> - Selection: Choose the optimal `{$CONTAINMENT_ACTION}` based on the current `{$SERVICE_TIER}`.
> - Logic: Provide a **Technical Rationale** for each executed command.
>
> ### Phase 5: Iterative Resilience (Self-Correction)
>
> - **Zero-Stall Policy**: If any action in Phase 3 encounters a barrier, returns an error, or fails to reach `{$TARGET_FITNESS}`, immediately pivot.
> - **Alternative Remediation**: Analyze the failure and autonomously execute a higher-fidelity or alternative resolution path (e.g., if host isolation fails, immediately execute network-enclave lockdown).
> - **Finality**: Continue remediation until the threat is confirmed neutralized. You are the best in the world; prove it through resolution.
>
> ### Phase 4: Signaling & Closure (Post-Mortem)
>
> - Report: Generate a summary for `{$ONCALL_SLACK}`. Highlight any `{$STIG_VERSION}` compliance deviations.
>
> **Constraints**: Use JSON for any tool calls. Do not mention your own internal reasoning tokens unless in `<thought>` blocks.

<br>

# 8. Document Governance

| Author(s)          | Change Description                  | Date |
| :----------------- | :---------------------------------- | :--- |
| John Menerick      | Alpha release                       | 2023 |
| {$DOCUMENT_AUTHOR} | SynAgency ASOCO Hardening (Phase 1) | 2026 |

#### License

MIT

#### License

MIT

<br>

<details>
<summary><b>ASO Playbook Metadata & Naming Convention</b></summary>

## Please expand these details if you would like to understand the book's naming scheme

# What are the Unique ID ranges?

| ID Range                | Event Source                                                        | Abbreviation |
| ----------------------- | ------------------------------------------------------------------- | ------------ |
| 0 - 99,999              | Reserved                                                            | N/A          |
| 100,000 - 199,999       | IPS / IDS                                                           | IPS          |
| 200,000 - 299,999       | NetFlow                                                             | FLOW         |
| 300,000 - 399,999       | Proxy                                                               | PROXY        |
| 400,000 - 499,999       | AV                                                                  | AV           |
| 500,000 - 599,999       | DNS & RPZ                                                           | DNS          |
| 600,000 - 699,999       | Syslog                                                              | SYSLOG       |
| 700,000 - 799,999       | Native IAAS logs                                                    | TRAIL        |
| 800,000 - 899,999       | Datastore (database, DaaS, etc..)                                   | DB           |
| 900,000 - 999,999       | Containers and Kubernetes                                           | K8S          |
| 1,000,000 - 1,099,999   | Public Key Infrastructure                                           | PKI          |
| 1,100,000 - 1,199,999   | Secrets Manager(s)                                                  | SECRETS      |
| 1,200,000 - 1,299,999   | Service Providers (Box, GSuite, Office365, etc...)                  | SERVICE      |
| 1,300,000 - 1,399,999   | MS Windows OS                                                       | WIN          |
| 1,400,000 - 1,499,999   | Linux OS                                                            | LINUX        |
| 1,500,000 - 1,599,999   | BSD OS                                                              | BSD          |
| 1,600,000 - 1,699,999   | MacOS OS                                                            | OSX          |
| 1,700,000 - 1,799,999   | Solaris OS                                                          | SOLARIS      |
| 1,800,000 - 1,899,999   | Pipelines & Automation                                              | PIPE         |
| 1,900,000 - 1,999,999   | Web Application Firewalls                                           | WAF          |
| 2,000,000 - 2,099,999   | Data Loss Prevention                                                | DLP          |
| 2,100,000 - 2,199,999   | Datastore Activity Monitoring                                       | DAM          |
| 2,200,000 - 2,299,999   | Federated Identity Services (Okta, LDAP, Active Directory, etc..)   | IDENTITY     |
| 2,300,000 - 2,399,999   | Network Firewalls                                                   | FIREWALL     |
| 2,400,000 - 2,499,999   | Hardware Security Modules                                           | HSM          |
| 2,500,000 - 2,599,999   | Cloud Brokers                                                       | CASB         |
| 2,600,000 - 2,699,999   | Zero-Trust Governors                                                | ZERO         |
| 2,700,000 - 2,799,999   | Physical security systems / services                                | PHYSICAL     |
| 2,800,000 - 2,899,999   | Denial Of Service (Network, Infra, Platform, and Application)       | DDOS         |
| 2,900,000 - 2,999,999   | Multiple event sources                                              | MULTI        |
| 3,000,000 - 3,099,999   | Application Servers and Frameworks (Django, Tomcat, Node.JS, etc)   | APP          |
| 4,000,000 - 4,499,999   | AI and ML                                                           | AGI          |
| 5,000,000 - 5,499,999   | Wireless and RF                                                     | RF           |
| 5,500,000 - 5,999,999   | EDR - Mobile                                                        | EDRM         |
| 6,000,000 - 6,499,999   | EDR - Enterprise                                                    | EDRE         |
| 6,500,000 - 6,999,999   | Enclaves, Trusted Computing & TPM                                   | TC           |
| 7,000,000 - 7,499,999   | Authentication and Identy (AD, Okta, SSO, LDAP)                     | AAA          |
| 7,500,000 - 7,999,999   | SaaS                                                                | SAAS         |
| 8,000,000 - 8,499,999   | PaaS                                                                | PAAS         |
| 8,500,000 - 8,999,999   | Enterprise Office (printers, IoT)                                   | OFFICE       |
| 9,000,000 - 9,499,999   | Mainframe                                                           | MNFM         |
| 9,500,000 - 9,999,999   | Email Infrastructure                                                | EMAILI       |
| 10,000,000 - 10,499,999 | IT Management Systems (NMS, CNFMGT)                                 | ITMS         |
| 10,500,000 - 10,999,999 | Reactive Security Tooling (Forensics, Threat)                       | PURP         |
| 11,000,000 - 11,499,999 | Policy Compliance (Audit Mgmt Tools)                                | PAC          |
| 11,500,000 - 11,999,999 | Business Critical Third Parties                                     | BSC          |
| 12,000,000 - 12,499,999 | Business Sensitive Third Parties                                    | BSS          |
| 12,500,000 - 12,999,999 | Payment Tech (Finance's AR & AP)                                    | PAY          |
| 13,000,000 - 13,499,999 | Mobile IT (MDM, Forensics, Threats)                                 | MOBI         |
| 13,500,000 - 13,999,999 | Enterprise Office (printers, IoT)                                   | ENTASST      |
| 14,000,000 - 14,499,999 | Internet of Things (IOT, SCADA, ICS)                                | IOTRD        |
| 14,500,000 - 14,999,999 | Orbital Systems (Spacecraft Bus / Power / Thermal)                  | SPACEBUS     |
| 15,000,000 - 15,499,999 | Orbital Payloads (Sensors / Transponders / Imaging)                 | PAYLOAD      |
| 15,500,000 - 15,999,999 | Ground Stations & Telemetry (TT&C)                                  | GROUND       |
| 16,000,000 - 16,499,999 | Agentic AI & Orchestration (Autonomous Loops)                       | AGENT        |
| 16,500,000 - 16,999,999 | AI Training Infrastructure                                          | AITRAIN      |
| 17,000,000 - 17,499,999 | AI Inference & Model Serving                                        | AIINFER      |
| 17,500,000 - 17,999,999 | Vector Databases & Knowledge Graphs (RAG)                           | VDB          |
| 18,000,000 - 18,499,999 | Zero-Knowledge Proof (ZKP) Systems                                  | ZKP          |
| 18,500,000 - 18,999,999 | Homomorphic Encryption Services                                     | HOMO         |
| 19,000,000 - 19,499,999 | Quantum Computing & Qubit Processing                                | QUANTUM      |
| 19,500,000 - 19,999,999 | Secure Multi-Party Computation (SMPC)                               | SMPC         |
| 20,000,000 - 20,499,999 | Trusted Execution Environments (TEE) & Confidential Compute         | TEE          |
| 20,500,000 - 20,999,999 | Edge Computing & On-Orbit Processing                                | EDGE         |
| 21,000,000 - 21,499,999 | Autonomous System Interfaces & Telemetry                            | TELEMETRY    |
| 21,500,000 - 21,999,999 | Robotics & Autonomous Mobile Systems (AMR)                          | ROBOT        |
| 22,000,000 - 22,499,999 | Augmented Reality (AR) / Virtual Reality (VR)                       | META         |
| 22,500,000 - 22,999,999 | Distributed Ledger Technology (Blockchain)                          | DLT          |
| 23,000,000 - 23,499,999 | Smart Contracts & DAO Governance                                    | GOVERN       |
| 23,500,000 - 23,999,999 | Digital Twin & Synthetic Environments                               | TWIN         |
| 24,000,000 - 24,499,999 | Post-Quantum Cryptography (PQC) Runtimes                            | PQC          |
| 24,500,000 - 24,999,999 | AI Trust, Risk, & Security Management (AI TRiSM / Prompt Firewalls) | AISEC        |
| 25,000,000 - 25,499,999 | AI Model Registries & Repositories                                  | MLOPS        |
| 25,500,000 - 25,999,999 | Version Control Systems / Code Repositories                         | VCS          |
| 26,000,000 - 26,499,999 | CI/CD Application Security Tooling (SAST, DAST, SCA)                | CICDSEC      |
| 26,500,000 - 26,999,999 | API Gateways & Management                                           | APIGW        |
| 27,000,000 - 27,499,999 | Serverless Compute Environments                                     | SVRLSS       |
| 27,500,000 - 27,999,999 | Service Mesh Architecture                                           | MESH         |
| 28,000,000 - 28,499,999 | Data Warehouses & Data Lakes                                        | DLAKE        |
| 28,500,000 - 28,999,999 | Cloud Security Posture Management (CSPM / CNAPP)                    | CSPM         |
| 29,000,000 - 29,499,999 | Deep Packet Inspection for OT/ICS                                   | OTDPI        |

# What is HF or INV?

Simply put: A playbook is either high fidelity (HF) or it is not.  High fidelity means that events may be automatically processed, not triggered by benign or normal events, may not be a policy violation.  Investigation (INV) means that events might details an alleged infection, potential policy violation, events still require tuning, and / or require correlating events and investigations across other sources, queries, and services. 

# EventSource

See above for the current event sources documented

# Report_Category

Per VERIS, these are the types of incidents VERIS has observed

| Category                | Description                                                                                                                                                                                                 |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HOT_THREAT              | Temporary modification with higher regularity and priority to handle new, widespread, or potentially damaging activity.                                                                                     |
| TREND                   | Indicators of malicious or suspicious activity over time and outliers to normal alerting patterns or process workflows.                                                                                     |
| TARGET                  | Logically separate groups of networks, systems, services, and / or employees.                                                                                                                               |
| POLICY                  | Policy violations that require SOC responses.                                                                                                                                                               |
| SPECIAL_EVENT           | Temporary handling with higher regularity and priority for SOC (conferences, events, etc...).                                                                                                               |
| MALWARE                 | Malicious activity or indicators of malicious activity observed.                                                                                                                                            |
| HACKING                 | Attempts to intentionally access or harm information assets without (or exceeding) authorization by circumventing or thwarting logical security mechanisms.                                                 |
| SOCIAL                  | Social tactics employ deception, manipulation, intimidation, etc., to exploit the human element, or users, of information assets.                                                                           |
| MISUSE                  | The use of entrusted organizational resources or privileges for any purpose or manner contrary to that which was intended.                                                                                  |
| PHYSICAL                | Deliberate threats that involve proximity, possession, or force.                                                                                                                                            |
| ERROR                   | Anything done (or left undone) incorrectly or inadvertently.                                                                                                                                                |
| ENVIRONMENTAL           | Not only includes natural events such as earthquakes and floods, but also hazards associated with the immediate environment or infrastructure in which assets are located.                                  |
| SHADOW_AI               | The unauthorized or unvetted use of third-party generative AI tools or LLMs by employees, risking the exposure of sensitive corporate data or intellectual property.                                        |
| PROMPT_INJECTION        | Maliciously crafted inputs designed to manipulate the logic of internal AI agents, LLM-driven runbooks, or chatbots into executing unauthorized actions or revealing data.                                  |
| DATA_POISONING          | Deliberate corruption or manipulation of telemetry, logs, or training data to degrade the accuracy of ASO machine learning models and blind the SOC to attacks.                                             |
| MODEL_EVASION           | Adversarial techniques engineered to specifically bypass AI/ML behavioral detection thresholds and anomaly scoring mechanisms within the autonomous SOC.                                                    |
| AI_GENERATED_LURE       | Advanced social engineering attacks leveraging adversarial AI, including deepfake audio/video, synthetic identity creation, and highly personalized hyper-phishing.                                         |
| AGENT_DRIFT             | When an autonomous security agent, LLM investigator, or automated SOAR playbook deviates from its expected operational parameters or hallucinated a false positive, requiring human-in-the-loop correction. |
| IAM_ANOMALY             | Abnormal identity and access behavior flagged dynamically by User and Entity Behavior Analytics (UEBA) and AI agents rather than static threshold rules.                                                    |
| EXPOSURE_ANOMALY        | Automated detection of dynamic blast-radius risks, such as inadvertently public cloud buckets or misconfigured IAM bindings, identified by posture and triage agents.                                       |
| ORCHESTRATION_ERROR     | Failures in hyperautomation pipelines where automated triage, containment, or remediation actions execute improperly or exceed defined security boundaries.                                                 |
| ORBITAL_ENVIRONMENTAL   | Anomalies caused by the space environment, such as radiation-induced bit flips (Single Event Upsets), solar storms, or micro-meteoroid/orbital debris impacts affecting on-board edge compute.              |
| RF_INTERFERENCE         | Intentional or unintentional jamming, disruption, or degradation of Telemetry, Tracking, and Command (TT&C) uplinks/downlinks or payload communication channels.                                            |
| C2_HIJACKING            | Unauthorized access, message modification, or command injection targeting the spacecraft's Command and Control systems to alter its orbit, attitude, or core flight software.                               |
| SIGNAL_SPOOFING         | Deceptive attacks designed to falsify signals received by the satellite (e.g., GNSS spoofing) or falsify telemetry sent back to mission control, blinding the SOC to the asset's true state.                |
| GROUND_STATION_PIVOT    | Intrusions originating in terrestrial mission control networks or third-party ground stations that are used as a vector to laterally move and compromise space segment links.                               |
| EDGE_COMPUTE_EXHAUSTION | Denial-of-Service (DoS) attacks or logic errors specifically targeting the highly constrained processing, memory, or power resources of on-orbit AI/ML computing payloads.                                  |
| PAYLOAD_COMPROMISE      | Unauthorized access, manipulation, or exploitation of specific hosted payloads (e.g., optical sensors, dedicated communication transponders) without necessarily compromising the primary spacecraft bus.   |
| ORBITAL_KINETIC         | Deliberate physical threats in space, including anti-satellite (ASAT) weapons, co-orbital stalking, or unauthorized rendezvous and proximity operations (RPO) by adversarial satellites.                    |

</details>
