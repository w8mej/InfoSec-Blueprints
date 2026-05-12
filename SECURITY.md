# Security Policy

**SentinelMesh/SentinelMeshs** is an enterprise-grade autonomous incident response platform designed for forensic rigor and cryptographic verifiability. We take security seriously and appreciate responsible vulnerability disclosure.

---

## 1. Supported Versions

SentinelMesh development is active on the `main` branch. We primarily support the latest version of the codebase.

| Version | Supported          | Notes                                  |
| :------ | :----------------- | :------------------------------------- |
| Main    | :white_check_mark: | The latest commit on the `main` branch |
| Older   | :x:                | Please upgrade to the latest version   |

---

## 2. Project Scope & Security Considerations

### 2.1 In Scope

The following are within the scope of this vulnerability disclosure policy:

- **Core platform code** (autonomous loop executor, forensic signer, query translator)
- **Cryptographic components** (FIPS 140-2 HSM integration, JWS signature generation, Merkle proof chains)
- **SIEM integrations** (Splunk, Elastic, Chronicle, Qradar, Azure Sentinel translation layers)
- **Configuration defaults** and deployment artifacts
- **Build, packaging, and container configurations** published by this repository
- **Installation and setup scripts**
- **Dashboard and frontend security** (XSS, CSRF, authentication)
- **API endpoints and data handling** for alert ingestion and evidence retrieval

### 2.2 Out of Scope

The following are generally **not** in scope:

- Third-party SIEM/EDR products (report to their respective vendors)
- Vulnerabilities in upstream dependencies that don't materially affect SentinelMesh usage
- Issues requiring physical access to deployed infrastructure
- Social engineering attacks against SOC personnel
- Issues in MDA-gated documentation or confidential materials (report privately)

### 2.3 Special Considerations

**Forensic Integrity**: SentinelMesh is designed to produce court-admissible evidence. Vulnerabilities affecting the integrity of cryptographic signatures, Merkle proofs, or audit trails are **CRITICAL** and warrant immediate attention.

**Autonomous Execution Safety**: Issues related to the 10-layer governance stack (safety interlocks, cognitive light cone validation, confidence scoring, rollback procedures) are **HIGH** priority.

**Multi-SIEM Query Translation**: Vulnerabilities allowing query injection or bypass of query translation safeguards are **HIGH** priority.

---

## 3. Security Contact

For vulnerability reports, use **GitHub Private Vulnerability Reporting** (preferred) or email.

**Primary Contact**: John Menerick  
**Email**: coding@haxx.ninja  
**GitHub**: https://github.com/w8mej/InfoSec-Blueprints/security/advisories/new

---

## 4. Reporting a Vulnerability

> **PLEASE DO NOT** open a public GitHub Issue for security vulnerabilities before private coordination.

### 4.1 Reporting Channels (in order of preference)

#### Primary: GitHub Private Vulnerability Reporting

- **URL**: https://github.com/w8mej/InfoSec-Blueprints/security/advisories/new
- **Expected acknowledgment**: Within 7 days
- **Advantages**: Structured submission, secure communication, CVE assignment support

#### Secondary: Encrypted Email

- **Address**: coding@haxx.ninja
- **Subject line**: Start with `[SECURITY]` for visibility

### 4.2 What to Include in Your Report

**Required**:

- **Vulnerability type** (e.g., SQL injection, cryptographic weakness, authentication bypass, unsafe autonomous execution, XSS)
- **Affected component(s)** (e.g., `execution_signer.py`, query translator, HITL gate logic)
- **Affected version(s)** (commit hash or branch)
- **Description** of how the vulnerability manifests
- **Steps to reproduce** (minimal proof-of-concept preferred)
- **Impact assessment** (what can an attacker achieve? Does it compromise forensic integrity?)

**Optional but helpful**:

- **Severity assessment** (your CVSS v3.1 estimate: Critical/High/Medium/Low)
- **Suggested remediation** or mitigation
- **Disclosure preferences** (embargo duration, anonymity preferences)

### 4.3 Sensitive Data Handling

**Avoid including**:

- Production API keys, HSM credentials, or signing keys
- Real IP addresses, domain names, or deployment details from live systems
- Sensitive SOC data or investigation logs
- Personal information of SOC personnel

If sensitive data is **absolutely necessary**:

- Redact or pseudonymize it
- Explain clearly why it's needed for reproduction
- Offer to provide details over secure side-channel

### 4.4 Language

Reports may be submitted in **English** (preferred) or other languages. We will make reasonable efforts to respond.

---

## 5. Vulnerability Handling Process

### 5.1 Lifecycle

Each reported vulnerability is tracked and progresses through these states:

| State           | Description                              | Typical Duration |
| --------------- | ---------------------------------------- | ---------------- |
| **RECEIVED**    | Report received, awaiting initial review | 0-7 days         |
| **ASSIGNED**    | Vulnerability assigned for analysis      | 1-14 days        |
| **CONFIRMED**   | Vulnerability validated and reproduced   | -                |
| **REMEDIATION** | Fix in development and testing           | 7-90 days        |
| **VENDOR-FIX**  | Fix ready, coordinating disclosure       | 0-14 days        |
| **PUBLIC**      | Public disclosure via GitHub Advisory    | Terminal state   |
| **REJECTED**    | Not a vulnerability or out of scope      | Terminal state   |

### 5.2 Response Timelines

- **Initial acknowledgment**: Within **7 calendar days** of receipt
- **Preliminary assessment**: Within **14 calendar days** of receipt
- **Regular updates**: At least every **14 calendar days** while active
- **Target remediation**: Within **90 days** for Critical/High severity issues

> Complex issues or multi-party coordination may extend timelines. We will communicate delays proactively.

### 5.3 Severity Classification (CVSS v3.1)

| Severity     | CVSS Score | Response Priority | Typical Fix Timeline |
| ------------ | ---------- | ----------------- | -------------------- |
| **Critical** | 9.0 - 10.0 | Immediate         | 7-30 days            |
| **High**     | 7.0 - 8.9  | Urgent            | 30-60 days           |
| **Medium**   | 4.0 - 6.9  | Normal            | 60-90 days           |
| **Low**      | 0.1 - 3.9  | Best effort       | Next release cycle   |

**Critical/High examples**:

- Bypass of autonomous execution safety gates
- Compromise of cryptographic signing or Merkle proof integrity
- SIEM query injection enabling data exfiltration
- Authentication/authorization bypass in API endpoints

---

## 6. Coordinated Disclosure

We follow a **90-day coordinated disclosure** timeline by default:

- **Day 0**: Vulnerability reported
- **Day 7**: Initial acknowledgment
- **Day 14-90**: Remediation development and testing
- **Day 90**: Public disclosure via GitHub Security Advisory

We may disclose **earlier** if:

- Fix is ready and tested
- Reporter agrees
- Active exploitation is detected

We may extend the timeline if:

- Complex remediation is required (negotiated with reporter)
- Multi-party coordination needed
- Affected upstream dependencies are being patched

**Maximum embargo**: 180 days from initial report, except in exceptional circumstances.

---

## 7. Remediation & Deployment

Fixes may take the form of:

1. **Code patch**: Applied to main branch and released
2. **Configuration change**: Secure defaults, deployment updates
3. **Workaround**: Interim mitigation until full fix available
4. **Risk acceptance**: Issue accepted as limitation (documented)

All fixes are tested internally before release. Critical issues may request reporter verification.

---

## 8. Public Disclosure Content

Our security advisories include:

- Vulnerability description (summary + technical details)
- Affected versions and components
- CVE identifier (if assigned)
- CVSS score and severity
- Impact and exploit conditions
- Remediation steps (upgrade path, workarounds, config changes)
- Credit to reporter (unless anonymity requested)
- Timeline of disclosure

**Disclosure channels**:

- GitHub Security Advisory (primary)
- Project CHANGELOG.md and release notes
- Project README and documentation

---

## 9. Contributing & Security Reviews

All contributions to SentinelMesh undergo security review:

1. **Before submitting a PR**:
   - Read [CONTRIBUTING.md](CONTRIBUTING.md)
   - Review the [Architecture Decision Records](docs/technical-specs/01-MASTER-ARCHITECTURE.md)
   - Ensure changes maintain **forensic integrity** (see checklist below)
   - Verify no secrets are hardcoded (see §10)

2. **Security Checklist for Contributors**:
   - [ ] No hardcoded secrets (API keys, HSM credentials, tokens)
   - [ ] All user inputs are validated and sanitized
   - [ ] Cryptographic operations use approved algorithms (no homegrown crypto)
   - [ ] Autonomous execution respects safety gates (confidence thresholds, HITL gates)
   - [ ] Query translation outputs are validated before SIEM execution
   - [ ] Audit logging is intact for all state-mutating operations
   - [ ] Signature generation/verification is properly tested
   - [ ] No side-channel vulnerabilities in timing-sensitive code
   - [ ] Tests verify security properties (not just functional behavior)

3. **Forensic Integrity Requirements**:
   - State mutations are signed via `execution_signer.py`
   - Merkle proofs are correctly maintained
   - Evidence chains are immutable
   - Rollback procedures are tested

4. **Autonomous Execution Safety**:
   - Confidence scoring is accurate
   - HITL gates function correctly
   - Cognitive light cone boundaries are enforced
   - Blast radius assessments are conservative

---

## 10. Secret Management

**NEVER hardcode secrets in source code**, configuration files, or test data:

- API keys, signing keys, HSM credentials
- Database passwords, service tokens
- OAuth secrets, JWT signing keys
- Third-party service credentials

**DO**:

- Use environment variables or a secrets manager
- Document required secrets in `.env.example`
- Add secrets to `.gitignore` and local configs
- Rotate any secrets that may have been exposed
- Use FIPS 140-2 HSM for production signing keys

**Pre-commit checks**:

```bash
# Check for common secret patterns
grep -r "PRIVATE KEY\|SECRET\|PASSWORD\|API_KEY" --include="*.py" --include="*.js" --include="*.json" src/
```

---

## 11. Safe Harbor & Legal Protections

We welcome and support **good-faith security research** in accordance with this policy. We will not pursue legal action against researchers who:

- Act in good faith to identify and report vulnerabilities
- Make reasonable efforts to avoid privacy violations, data destruction, and service disruption
- Do not exploit vulnerabilities beyond minimal proof-of-concept
- Do not access, modify, or exfiltrate data beyond what's necessary to demonstrate the issue
- Report findings privately and promptly
- Respect the coordinated disclosure timeline

### Testing Guidelines

When testing for vulnerabilities:

- **Use your own infrastructure**: Test against your own SentinelMesh deployment
- **Do not test production systems** operated by others without explicit written permission
- **Avoid service disruption**: No DoS attacks, resource exhaustion, or brute-forcing
- **Respect privacy**: Do not access other users' investigations, evidence, or logs
- **No unauthorized automated scanning** of public instances

---

## 12. Deployment Security Best Practices

For organizations deploying SentinelMesh:

1. **HSM Integration**:
   - Use FIPS 140-2 Level 3+ HSM for production
   - Rotate signing keys regularly
   - Enable audit logging on HSM operations
   - Backup HSM recovery keys securely

2. **SIEM Integration**:
   - Validate all SIEM credentials and API keys
   - Use minimum-privilege service accounts
   - Monitor query execution for anomalies
   - Implement rate limiting on SIEM queries

3. **Network Security**:
   - Deploy SentinelMesh behind TLS/reverse proxy
   - Use authenticated API keys for all integrations
   - Restrict alert ingestion endpoints to trusted sources
   - Implement network segmentation

4. **Data Handling**:
   - Encrypt evidence at rest
   - Encrypt evidence in transit (TLS)
   - Implement data retention policies
   - Log all evidence access

5. **Access Control**:
   - Implement role-based access control (RBAC)
   - Use multi-factor authentication (MFA) for admin accounts
   - Audit all user actions
   - Implement principle of least privilege

6. **Monitoring**:
   - Monitor for unauthorized autonomous execution
   - Alert on confidence score anomalies
   - Track rollback procedure invocations
   - Review audit trails regularly

---

## 13. Incident Response

If we discover a security vulnerability:

1. **Immediate actions**:
   - Assess severity and impact
   - Determine if active exploitation exists
   - Identify affected users/deployments

2. **Notification**:
   - Contact affected parties via GitHub Security Advisories
   - Provide interim workarounds if available
   - Publish preliminary patch

3. **Resolution**:
   - Complete comprehensive fix
   - Verify fix through security testing
   - Publish final release with security advisory

4. **Post-Incident**:
   - Conduct root cause analysis
   - Update threat model if needed
   - Publish lessons learned (if appropriate)

---

## 14. Security Questions & Policy Clarifications

For questions about this policy (not vulnerability reports):

- **GitHub Discussions**: Open a discussion in the repository
- **Email**: coding@haxx.ninja (mark as non-sensitive)

For **vulnerability reports**, use the channels in **§3**.

---

## 15. Policy Review

This policy will be reviewed and updated:

- **Annually** (or as needed)
- When processes change materially
- After significant security incidents
- To align with evolving standards

**Document version**: 1.0  
**Last updated**: 2026-05-04  
**Next review**: 2027-05-04

---

## 16. Acknowledgments

We thank the security research community for helping protect SentinelMesh users and the broader incident response ecosystem. Your responsible disclosures strengthen the platform and safeguard the organizations that depend on it.

---

**Built with 🔐 for security teams that demand forensic rigor, intelligent autonomy, and verifiable evidence.**
