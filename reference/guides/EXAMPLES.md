# Real-World Examples: SentinelMesh in Action

This document walks through three realistic incident response scenarios using SentinelMesh.

---

## Example 1: Ransomware Triage & Containment (15 minutes)

### Scenario

Your organization receives an alert: "Multiple file encryption processes detected on FINANCE-01."

### Step 1: Generate Playbook

```python
REDACTED
```

**Generated notebook has 7 cells:**

### Step 2: Execute Cell 3 - Evidence Collection

````
Cell 3: Evidence Collection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agent generates evidence collection plan (asyncio-wrapped):

```python
REDACTED
````

✅ **Validation Result:** PASSED

- Syntax: Valid Python ✓
- Asyncio pattern: asyncio.run() ✓
- Error handling: Implicit via asyncio ✓
- No hallucinations detected ✓

**Evidence Collected:**

- 42 process creation events (spanning 2 hours)
- File sample: data.docx.locked (4.2MB)
- Artifacts: /var/log/auth.log, /etc/passwd, user documents

🤖 **Agent Reasoning (collapsible):**

```
The process creation chain shows:
1. explorer.exe → cmd.exe → payload.exe (suspicious)
2. payload.exe modifying files with .locked extension
3. Registry changes for persistence (HKLM\\Software\\...)

Confidence: 94%

This indicates active ransomware execution, likely Conti-group
based on the ransom note format and encryption timeline.
```

````

**Signature stored in Cell 3 metadata:**
```json
{
  "execution_signature": {
    "jws": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9...",
    "timestamp": "2023-04-26T14:30:05.123456Z",
    "algorithm": "HS256"
  }
}
````

### Step 3: Execute Cell 4 - Hypothesis Testing

Agent analyzes evidence:

```
Cell 4: Hypothesis Testing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HYPOTHESIS: Active ransomware (Conti) with network propagation risk

Evidence Supporting:
✓ Process chain matches known Conti behavior
✓ Encryption timeline: 47 minutes (2023-04-26 14:00 to 14:47)
✓ Ransom note contains "contiransomware.com"
✓ 15 additional endpoints show similar encryption

Evidence Against:
✗ No C2 callback detected (yet)
✗ No persistence mechanism confirmed

CONFIDENCE: 96%

RECOMMENDATION: ISOLATE_ENDPOINT_IMMEDIATELY
Risk of delay: Network-wide propagation in <30 minutes
```

🤖 **Agent Reasoning:**

```
The indicators strongly suggest Conti ransomware:
1. Behavior matches known Conti TTP (T1486 Impact)
2. Timeline is aggressive (47 min encryption = active NOW)
3. 15 endpoints already infected = worm spreading
4. Network exposure: Lateral movement to 50+ endpoints possible

Decision: Immediate isolation prevents estimated 10,000+ file damage
```

### Step 4: Execute Cell 5 - Containment Decision

````
Cell 5: Containment Decision
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ AUTHORIZATION CHECK:
  Role: containment_agent
  Tool: isolate_network_segment
  Phase: CONTAINMENT ✓
  RBAC: AUTHORIZED ✓

Agent executes containment code:

```python
REDACTED
````

✅ ISOLATION COMPLETE

- 15 infected endpoints isolated
- C2 domains blocked at firewall
- Admins notified

**Containment Success:** 15 endpoints protected from further spread
**Estimated damage prevented:** 10,000+ files

⚠️ **Recommendation:** Proceed to Cell 6 (Evidentiary Signing)

```

### Step 5: Execute Cell 6 - Evidentiary Signing

All evidence cells signed with HMAC-SHA256 JWS.

```

Cell 6: Evidentiary Signing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Signing cells 3, 4, 5...

Cell 3 (Evidence Collection):
Source hash: 8f2d9c1a...
Output hash: abc123...
Context hash: def456...
Timestamp: 2023-04-26T14:30:05.123456Z
JWS: eyJ...hc...signature...

Cell 4 (Hypothesis Testing):
Source hash: 1a2b3c4d...
Output hash: xyz789...
Context hash: lmn012...
Timestamp: 2023-04-26T14:35:12.654321Z
JWS: eyJ...hc...signature...

Cell 5 (Containment Decision):
Source hash: 4d5e6f7g...
Output hash: def123...
Context hash: ghi456...
Timestamp: 2023-04-26T14:40:00.123456Z
JWS: eyJ...hc...signature...

✅ All cells signed and verified
Notebook is forensically defensible

```

### Step 6: Prepare Incident Report

```

Incident Report: INC-2026-0451
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INCIDENT SUMMARY
ID: INC-2026-0451
Threat: Conti Ransomware
Severity: CRITICAL
Status: CONTAINED
Timeline: 47 minutes (Active)

EXECUTIVE SUMMARY
Conti ransomware infected 15 endpoints in the FINANCE department.
Evidence collection, analysis, and containment completed in 40 minutes.
Estimated damage prevented: 10,000+ encrypted files.

FORENSIC EVIDENCE (CRYPTOGRAPHICALLY SIGNED)
Cell 3: Evidence Collection (JWS: eyJ...hc...signature...)
Cell 4: Hypothesis Testing (JWS: eyJ...hc...signature...)
Cell 5: Containment Decision (JWS: eyJ...hc...signature...)

All signatures verified: ✅
No tampering detected: ✅
Admissible as evidence: ✅

AGENT REASONING (AUDITABLE)
[Collapsible sections with full decision rationale]

NEXT STEPS

1. Forensic imaging of 15 endpoints
2. Malware analysis on encrypted samples
3. Network segment rebuild
4. Post-incident review

Signed on: 2023-04-26T14:45:00Z
Verified: Cryptographically authentic

````

---

## Example 2: Breach Notification (GDPR 72h Window)

### Scenario

You have 72 hours to notify regulators. Must prove incident response was thorough and timely.

### Using Regulatory Timestamps

```python
REDACTED
````

**Output:**

```
GDPR BREACH NOTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Detection: 2023-04-26T14:00:00Z (UTC)
Investigation Began: 2023-04-26T14:15:00Z (15 minutes)
Threat Confirmed: 2023-04-26T14:35:00Z (35 minutes)
Containment Completed: 2023-04-26T14:45:00Z (45 minutes)

TIMELINE VERIFIED: ✅ Cryptographically signed by incident notebook
GDPR 72-HOUR DEADLINE: 2023-04-29T14:00:00Z (71 hours remaining)

AFFECTED INDIVIDUALS: 150 (Finance team members)
DATA BREACH TYPES: Personal identification, financial transaction history

FORENSIC EVIDENCE: Notebook INC-2026-0451.ipynb
  Cell 3: Evidence (signed, 2023-04-26T14:30:05Z)
  Cell 4: Analysis (signed, 2023-04-26T14:35:12Z)
  Cell 5: Containment (signed, 2023-04-26T14:40:00Z)
  All signatures verified. Notebook cryptographically authentic.

INVESTIGATOR ASSESSMENT
  Incident response was:
  ✓ Prompt (contained in 45 minutes)
  ✓ Thorough (all evidence collected and analyzed)
  ✓ Documented (full audit trail with signatures)
  ✓ Effective (damage prevented by early containment)
```

Regulatory authority receives this and can verify:

- ✅ Timeline is accurate (cryptographically verified)
- ✅ Evidence is authentic (HMAC-SHA256 signatures valid)
- ✅ Response was timely (45 minutes from alert to containment)
- ✅ Investigation was competent (agent reasoning documented)

---

## Example 3: Multi-Stage Incident (Lateral Movement)

### Scenario

Initial ransomware contained, but evidence suggests lateral movement. Trace attack path across 8 endpoints.

### Generating Extended Playbook

```python
REDACTED
```

**Multi-stage playbook structure:**

```
Cell 1: Setup (imports, config, variables)
Cell 2: Preconditions (validate that 8 endpoints are accessible)
Cell 3: Lateral Movement Trace
  └─ Query process creation across 8 endpoints
  └─ Build network communication graph
  └─ Identify infection vector (PSExec? RDP? SMB?)

Cell 4: Impact Assessment
  └─ Which systems have sensitive data?
  └─ Is data exfiltration happening?
  └─ What's the containment priority?

Cell 5: Staged Containment
  └─ Isolate high-value targets first (database servers)
  └─ Monitor for C2 communication
  └─ Block malware propagation paths

Cell 6: Evidence Signing
  └─ Cryptographically sign all findings
  └─ Generate forensic report
```

**Agent-generated investigation trace:**

```
Cell 3 Output:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LATERAL MOVEMENT ANALYSIS

Infection Chain (Timeline):
  [14:00] FINANCE-01 infected via email attachment
  [14:12] PSExec propagation to FINANCE-02, FINANCE-03
  [14:25] Lateral movement via SMB to ACCOUNTING-01
  [14:38] Database server (DB-PROD) accessed
  [14:47] Containment initiated

Attack Graph:
  FINANCE-01 (patient zero)
    ├─ FINANCE-02 (PSExec)
    ├─ FINANCE-03 (PSExec)
    ├─ ACCOUNTING-01 (SMB pass-the-hash)
    │   ├─ DB-PROD (admin account compromise)
    │   └─ ACCOUNTING-02 (lateral)
    └─ HR-01 (network enumeration)

🤖 Agent Assessment:
  "The infection pattern shows deliberate lateral movement
   targeting high-value systems (database, accounting).
   This is NOT random ransomware worm behavior.

   Likely scenario: Human-operated ransomware (HOP) gang.
   Estimated time to exfiltrate database: 2-4 hours.
   Recommended action: Immediate isolation of DB-PROD."

   Confidence: 98%
```

---

## Common Patterns Across Examples

### 1. **Asyncio Validation** ✅

```python
REDACTED
```

### 2. **Agent Reasoning** 🤖

Every decision includes collapsible reasoning section explaining:

- Why this action
- Confidence level (0-100%)
- Risk of inaction

### 3. **Forensic Signing** 🔐

Each critical cell is signed with HMAC-SHA256 JWS:

- Timestamp (immutable)
- Source hash (code that ran)
- Output hash (result that was captured)
- Signature (proves authenticity)

### 4. **Regulatory Compliance**

Built-in support for:

- GDPR 72h breach notification
- HIPAA 60d investigation
- CCPA 45d data preservation
- Custom regulatory timelines

---

## Integrating into Your SOC

### Option 1: Jupyter Notebooks (Interactive)

```bash
# Start notebook server
jupyter notebook

# Open generated playbook
# Execute Cell 3 → Cell 6 (with agent assistance)
```

### Option 2: Programmatic (Automated)

```python
REDACTED
```

### Option 3: SOAR Integration (Declarative)

```python
REDACTED
```

---

**Questions?** See [docs/FAQ.md](../README.md) or [CONTRIBUTING.md](../CONTRIBUTING.md)

**Want to run these examples?** Clone repo and check [docs/GETTING_STARTED.md](../README.md)
