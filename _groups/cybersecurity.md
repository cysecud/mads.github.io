---
title: Cybersecurity
short: Security
order: 2
accent: rose
icon: security
summary: >-
  Breaking and fixing real systems: security of protocols, networks and
  industrial devices, from formal verification to hands-on vulnerability research.
topics:
  - Formal analysis of authentication and communication protocols (ProVerif)
  - Policy languages for stateful authorization, with proofs mechanised in Lean
  - Security of Operational Technology and industrial control systems
  - Vulnerability assessment and responsible disclosure
  - Network discovery and monitoring
  - Privacy and security of IoT and embedded devices
---

Autonomous and embedded systems are now part of factories, vehicles and critical
infrastructures, where a single vulnerability can have physical consequences.
Yet their security assessment is often less mature than that of traditional IT.

Research in the **Cybersecurity** area studies how to protect resources and
information in these settings. On the formal side, we model and verify security
protocols, such as multi-factor authentication schemes, with automated tools
such as [ProVerif](https://bblanche.gitlabpages.inria.fr/proverif/) to discover
subtle flaws. We also design languages for access-control policies, such as
Strobilus, a stateful extension of the Cedar policy language, and mechanise their
theory in the [Lean](https://lean-lang.org) proof assistant. On the practical side, we analyse real devices and networks together with
industrial partners. This work has led to vulnerability disclosures such as
[CVE-2022-3203]({{ site.baseurl }}/2022/09/lord-of-the-orings/) and
[CVE-2023-40718]({{ site.baseurl }}/2023/11/cve-2023-40718/).

The MADS lab hosts the **Udine node of the [Cybersecurity National Lab](https://cybersecnatlab.it)
of CINI**, the Italian National Inter-University Consortium for Informatics.
Through the national lab we take part in training programmes for young talents,
such as [CyberChallenge.IT](https://cyberchallenge.it) and
[CyberHighSchools](https://cyberhighschools.it). These programmes gave birth to
[MadrHacks](https://madrhacks.org), the ethical hacking team of the University of Udine.

Students in this area work with real hardware and real attack scenarios, in a
lab environment and always following responsible disclosure practices.
