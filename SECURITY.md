# SuperRich Technologies — Security & Privacy Policy

SuperRich Technologies Inc. is committed to ensuring the highest standards of data integrity, infrastructure resilience, and individual privacy. This document outlines our vulnerability disclosure policies, privacy guarantees, platform defense mechanisms, and guidelines for responsible security research.

---

## 🛡️ Responsible Vulnerability Disclosure Program

We welcome security researchers, partners, and users to report potential vulnerabilities or security flaws in our systems and infrastructure. We operate a coordinated disclosure process with a firm commitment to researcher Safe Harbor.

### How to Report a Vulnerability

If you identify a security issue or vulnerability affecting SuperRich systems, please submit a detailed report to our dedicated Security Operations Center:

* **Email**: [`security@superrich.tech`](mailto:security@superrich.tech)
* **Subject Format**: `[VULNERABILITY] <Component/Subdomain> - <Brief Description>`
* **Required Details**:
  * Description of the vulnerability and its potential impact.
  * Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
  * Affected domain, endpoint, URL, or service.
  * Your contact details for coordination and acknowledgment.

Please **do not** include executable exploits or attempt to access or exfiltrate private internal data during your investigation.

### Response Timelines & Service Level Agreement (SLA)

Our security operations team adheres to the following response timeline:

| Milestone | Target SLA | Description |
| :--- | :--- | :--- |
| **Initial Acknowledgment** | **< 24 Hours** | Confirmation of receipt with an assigned incident ticket identifier. |
| **Triage & Validation** | **< 72 Hours** | Technical review by our engineering team to reproduce and severity-score the finding. |
| **Remediation Updates** | **Every 5 Business Days** | Status updates provided to the reporter throughout the patch deployment cycle. |
| **Public Disclosure** | **Coordinated** | Coordinated disclosure only after patches have been verified in production. |

---

## ⚖️ Researcher Safe Harbor

SuperRich Technologies will not initiate legal action against security researchers who conduct good-faith security evaluations, provided they adhere to the following principles:

1. **Do No Harm**: Avoid any action that could degrade system availability, impair user experience, or corrupt financial index calculations.
2. **Respect Data Integrity**: Do not attempt to access, modify, delete, or harvest non-public records, internal session secrets, or system configurations.
3. **Privacy First**: If personal information or unexpected telemetry is encountered, cease testing immediately, purge local copies, and notify `security@superrich.tech`.
4. **Coordinated Disclosure**: Give our team reasonable time to remediate any confirmed vulnerability before sharing details publicly.

---

## 🎯 Program Scope

### In-Scope Assets

The following primary endpoints and platforms are included within the responsible disclosure program:

* **Production Web Terminal**: `https://superrich.tech`
* **Public REST API Gateway**: `https://api.superrich.tech`
* **Developer Documentation Portal**: `https://docs.superrich.tech`
* **Administrative Operations Plane**: `https://admin.superrich.tech`
* All unversioned API routes: `/rankings`, `/people/:slug`, `/rtb/list`, `/rtb/profile/:slug`

### Out-of-Scope Activities & Exclusions

The following activities are strictly prohibited and outside the scope of Safe Harbor:

* Distributed Denial of Service (DDoS/DoS) attacks targeting edge networks, CDN caches, or upstream origin servers.
* Social engineering, phishing, spear-phishing, or vishing targeting SuperRich personnel, contractors, or partners.
* Physical attacks against offices, data center facilities, or hardware.
* Automated scanner output or vulnerability reports lacking a reproducible Proof of Concept demonstrating measurable impact.
* Attacks targeting third-party data providers, upstream news feeds, or external APIs.

---

## 🔒 Municipal Residence & Privacy Safeguard Standard

SuperRich enforces a foundational **Privacy-by-Design** policy designed to prevent doxxing, harassment, or physical security risks for tracked executives:

* **Strict Municipal Granularity**: Wealth holder residences are cataloged and displayed strictly at the municipality level (e.g., *Austin, United States* or *Paris, France*).
* **Prohibition of Private Addresses**: Specific street addresses, parcel numbers, neighborhood names, private estate coordinates, flight tracking paths, and telemetry are strictly forbidden from ingestion into SuperRich databases.
* **Public Court & Corporate Records Only**: Contact emails and legal dockets are sourced strictly from official public trial exhibits, public PACER filings, or verified corporate investor relations channels.
* **Immediate Privacy Redaction**: If you believe any personal, confidential, or sensitive geographical information has been inadvertently displayed, email [`privacy@superrich.tech`](mailto:privacy@superrich.tech) for expedited priority removal within 12 hours.

---

## 🛡️ Infrastructure Defense & Hardening

Our infrastructure incorporates layered defense-in-depth security controls:

* **Edge Read-Only Enforcement**: Public API requests on `api.superrich.tech` are restricted to HTTP `GET` and `OPTIONS` methods. Mutating operations (`POST`, `PUT`, `DELETE`, `PATCH`) are rejected at the edge gateway with `405 Method Not Allowed`.
* **Rate Limiting & Abuse Defense**: Edge-level token-bucket rate limiting dynamically throttles unauthenticated requests (60 req/min) and API-key-authenticated consumers (500 req/min) to prevent resource exhaustion and scraping abuse.
* **Cryptographic Standards**:
  * All HTTP communication requires **TLS 1.3** with enforced HSTS (HTTP Strict Transport Security).
  * Internal sessions utilize cryptographically signed, encrypted **HttpOnly, Secure, SameSite=Strict** cookies with high-entropy keys.
* **Data Storage Protection**: Database persistence layers are encrypted at rest using industry-standard **AES-256** and require encrypted SSL connections with minimal-privilege service accounts.
* **Zero PII Commercialization**: SuperRich does not sell, broker, or monetize visitor personal information, browsing history, or client analytics.

---

## 📬 Security Operations Contacts

* **Vulnerability Reports**: [`security@superrich.tech`](mailto:security@superrich.tech)
* **Privacy & Data Redactions**: [`privacy@superrich.tech`](mailto:privacy@superrich.tech)
* **Compliance & Legal Inquiries**: [`legal@superrich.tech`](mailto:legal@superrich.tech)

---

<div align="center">
  <small>© 2026 SuperRich Technologies Inc. • Enterprise Information Security & Privacy Charter</small>
</div>
