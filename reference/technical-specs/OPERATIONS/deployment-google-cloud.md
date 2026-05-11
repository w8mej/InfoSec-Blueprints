# Operations: Google Cloud Deployment Guide

## Document Metadata

- **Audience**: SREs | DevOps Engineers | Cloud Architects | Security Engineers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md), [security-hardening.md](./security-hardening.md)
- **Related Specs**: `2023-04-27-operations-deployment-google-cloud.md`
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Terraform Module**: `infra/gcp-aso/`

## Quick Summary

The Google Cloud Deployment Guide provides the definitive instructions for provisioning and configuring the SentinelMesh platform on Google Cloud Platform (GCP). The architecture is designed for **Serverless Scalability, High Availability, and Zero-Trust Isolation**, utilizing managed services like Cloud Run, Pub/Sub, Cloud KMS, and Secret Manager.

This guide ensures that the deployment is consistent across Development, Staging, and Production environments, while adhering to CONFIDENTIAL's strict security and compliance standards for MNDA-gated infrastructure.

---

## 1. Persona-Based Value Proposition

### For the SRE / DevOps Engineer

- **Infrastructure as Code (IaC)**: Deploy the entire stack in minutes using the provided Terraform modules.
- **Automated CI/CD**: Seamless integration with Google Cloud Build for automated testing, signing, and deployment.

### For the Cloud Architect

- **Resilient Design**: Multi-region deployment support for high availability and disaster recovery.
- **Cost Efficiency**: Serverless compute (Cloud Run) ensures that costs scale linearly with alert volume, with zero idle cost.

### For the Security Engineer

- **Confidential Computing**: Option to run the ALE runtime in [Confidential VMs](https://cloud.google.com/confidential-computing) to protect data-in-use.
- **VPC Service Controls**: Strict network perimeters to prevent data exfiltration.

---

## 2. Architecture & Components

### 2.1 Compute (Cloud Run)

The [Autonomous Loop Executor](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) and [Playbook Generator](../TIER-DEEP-DIVES/tier4-playbook-templating-system.md) run as containerized services on Cloud Run.

- **Concurrency**: Set to `80` to allow high throughput.
- **CPU Allocation**: "Always allocated" for production to minimize cold-start latency.

### 2.2 Storage & State

- **GCS (Artifacts)**: Versioned buckets for storing signed playbooks and forensic artifacts.
- **Firestore (State)**: Serverless NoSQL database for tracking active incident metadata and [Autonomous Loop](../TIER-DEEP-DIVES/tier4-autonomous-loop-executor.md) state.
- **Secret Manager**: Secure storage for API keys and integration credentials.

### 2.3 Identity & Trust

- **Cloud KMS**: Hardware-backed (HSM) keys for [Detached JWS Signing](../TIER-1-FOUNDATIONS/kms-schema-signer.md).
- **Service Accounts**: Discrete, least-privilege identities for each component (e.g., `aso-signer`, `aso-executor`).

---

## 3. Deployment Steps

### 3.1 Initializing Infrastructure

```bash
cd infra/gcp-aso/
terraform init
terraform apply -var="project_id=aso-prod-001" -var="region=us-central1"
```

### 3.2 Building and Pushing Images

```bash
gcloud builds submit --tag gcr.io/aso-prod-001/aso-runtime:v2.1 .
```

### 3.3 Deploying Services

```bash
gcloud run deploy aso-runtime \
  --image gcr.io/aso-prod-001/aso-runtime:v2.1 \
  --service-account aso-executor@aso-prod-001.iam.gserviceaccount.com \
  --vpc-connector aso-vpc-conn \
  --set-env-vars "KMS_KEY_ID=projects/.../cryptoKeys/aso-signer"
```

---

## 4. Security & Compliance Deep-Dive

### 4.1 VPC Service Controls (VPC-SC)

Deploy the entire project inside a VPC-SC perimeter. This prevents the ASO runtime from sending data to unauthorized external APIs and ensures that alert data from SCC cannot be leaked.

### 4.2 Compliance Mapping

- **NIST 800-53 (SA-9)**: Fulfills requirements for "External Information System Services."
- **SOC2 (Common Criteria)**: Supports the "Infrastructure" and "Operations" criteria through standardized deployment patterns.

---

## 5. Operations & Performance Tuning

### Monitoring Deployment Health

Use the [Monitoring & Observability Guide](./monitoring-observability.md) to track deployment success rates and resource utilization.

### Scaling Strategies

- **Auto-scaling**: Cloud Run automatically scales from 0 to 1,000+ instances based on incoming alert volume.
- **Pre-warming**: (Optional) Use "Min Instances" to eliminate cold-starts for critical triage services.

---

## 6. Future Growth & Opportunities

- **Cross-Cloud Deployment (Anthos)**: Using Google Anthos to deploy the SentinelMesh runtime on-prem or in other cloud environments (AWS/Azure) while maintaining a central control plane.
- **Terraform Drift Detection**: Implementing automated drift detection to ensure production infrastructure always matches the authorized Git configuration.
- **Binary Authorization**: Enforcing a policy that only container images signed by the CI/CD pipeline and [KMS Signer](../TIER-1-FOUNDATIONS/kms-schema-signer.md) can be deployed to Cloud Run.
