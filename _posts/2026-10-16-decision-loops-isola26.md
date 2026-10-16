---
title: "Reliable decision loops in socio-technical collective adaptive systems at ISoLA 2026"
date: 2026-10-16 09:00:00
excerpt: "The paper Reliable Decision Loops in Socio-Technical Collective Adaptive Systems, by Marino Miculan, has been published in the proceedings of ISoLA 2026: a formal framework for systems where software controllers, humans and generative AI take decisions together."
tags: ["Research", "Choreographies"]
---

The paper *Reliable Decision Loops in Socio-Technical Collective Adaptive Systems*, by
Marino Miculan, has been published in the
[proceedings](https://doi.org/10.1007/978-3-032-40108-3_5) of
[ISoLA 2026](https://2026-isola.isola-conference.org/), in the volume *Rigorous
Engineering of Collective Adaptive Systems* (Springer, Lecture Notes in Computer Science).

The paper proposes a formal framework for reasoning about *decision loops* in
collective adaptive systems where software controllers, human operators and
generative AI modules take decisions together. Its main findings:

- **Reliability depends on correlated failures**, not on isolated errors: adding human
  supervision or AI support does not automatically make a system more reliable, since
  the effect depends on how the failures of the components are correlated.
- **A guarded architecture**, which separates decision generation from verification:
  uncertain generators, such as LLMs, propose candidate actions, and a separate layer
  checks that they are admissible before they are executed. The paper proves safety and
  monotonicity properties of this pattern.
- **A pilot study on five state-of-the-art LLMs**, measuring their individual and joint
  failure probabilities. The results confirm the central role of joint failures, and show
  that failure diversity must be measured rather than assumed from vendor labels.

This work is part of our research on how to integrate AI-based agents
[safely into critical systems]({{ site.baseurl }}/research/).
