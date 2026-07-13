# Local Processing and Privacy Commitment

> **DRAFT — Requires legal review before commercial publication.**

At TuIAlista we build our agents on a simple principle: **the work happens on your machine, and your data stays with you.** This document explains, in a verifiable way, how our architecture is designed to make that true.

---

## 1. Our commitment

TuIAlista agents process your information **locally, on your own machine**. The content of your files, documents, and data **is not sent, is not received by us, and is not stored** on our servers.

Our role is limited to validating that your license is active. All analysis —reading a contract, reviewing an invoice, querying a database, organizing an inbox— happens on the machine where you installed the agent.

This is TuIAlista's biggest differentiator: we are not a cloud service you hand your data to. We are software that runs where you decide.

---

## 2. How it works technically

- **Agents run locally.** They are installed and run on your machine. They read the files you point them to, in the folders you define, without copying or uploading them anywhere.
- **Processing is local.** Data extraction, pattern detection, and the organization of your information happen inside your machine.
- **The platform only validates the license.** The only exchange with our servers is a periodic check that your subscription is active. That check travels cryptographically signed and **does not include the content of what you process.**
- **It works offline.** Because the work is local, agents can operate even without internet during a grace period; a connection is only needed to re-validate the license.
- **AI drafting features are the limited exception.** Some optional features (for example, generating a summary) send a fragment of the text to an AI engine to draft the response. This is indicated on each feature, and the detection and organization tasks do not require it.

---

## 3. What the platform receives and what it does not

**What the platform DOES receive (the minimum to validate your license):**

- Your **license key**.
- Your **subscription status** (active, in trial, expired).
- A **technical device identifier** (a fingerprint derived from the hardware) to bind the license to your device and prevent unauthorized use.

**What it NEVER receives:**

- The content of your **files, documents, contracts, invoices, emails, or databases**.
- The **data you process** with the agent, or the results of that processing.
- Any personal or confidential information contained in the material you analyze.

In other words: we receive just enough to know you are entitled to use the software, and nothing of what the software reads or produces.

---

## 4. How you can verify it yourself

We don't ask you to trust us blindly. Because the agent runs on your machine, you can check for yourself:

- **Monitor the agent's network connections** with your operating system's tools or a traffic analyzer (for example, a firewall, `Resource Monitor` on Windows, `Little Snitch` on macOS, or `Wireshark`). You will see that connections are limited to license validation and, where applicable, the AI engine of the optional features.
- **Observe that your files are not transmitted.** The content of your documents does not appear in outbound traffic during local analysis.
- **Disconnect from the internet.** The local features (detection, extraction, organization) keep working within the grace period, confirming that processing does not depend on our servers.

Your IT team can perform these checks as part of their own security assessment.

---

## 5. Advantage for your compliance

Keeping data out of external hands supports your regulatory compliance, because it reduces the exposure surface and avoids transfers to third parties. This design helps you align with frameworks such as:

- **GDPR** (General Data Protection Regulation, European Union).
- **LFPDPPP** (Federal Law on the Protection of Personal Data Held by Private Parties, Mexico).
- **LGPD** (Lei Geral de Proteção de Dados, Brazil).
- And other local data protection regulations.

By keeping processing on your machine, **you remain the controller and custodian of your data**, with no intermediary receiving or storing it. This simplifies your impact assessments, your records of processing, and your obligations toward third parties.

This document describes an architecture; it does not constitute legal advice or a compliance certification. The responsibility to comply with the regulations applicable to your organization remains yours.

---

## 6. Legal note

This Local Processing and Privacy Commitment describes the technical design of our agents and **is complemented by our Terms and Conditions and our Privacy Policy**, which govern the full contractual relationship. In the event of any discrepancy, those documents prevail.

This commitment is a verifiable statement of architecture, not an absolute guarantee against every possible scenario. We recommend that you **validate its application according to the regulations in force in your country and sector**, and involve your legal and security teams before making compliance decisions based on this document.

If you have questions about this commitment, write to us at **privacidad@tuialista.com**.
