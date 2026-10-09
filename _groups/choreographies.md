---
title: Choreographic Autonomous Systems
short: Choreographies
order: 3
accent: violet
icon: choreographies
summary: >-
  Correct by construction: choreographic languages, types and formal models
  for coordinating fleets of autonomous, distributed agents.
topics:
  - Choreographic programming and multiparty session types
  - Coordination of autonomous agents, robots and drones
  - Formal models of concurrency and distribution (bigraphs, process calculi)
  - Type theory and semantics of programming languages
  - Mechanised proofs and certified tools with the Rocq and Lean proof assistants
---

A swarm of drones, a team of robots, a federation of microservices: when many
autonomous components must cooperate, getting the interaction right is the hard
part. Deadlocks, races and protocol violations are notoriously difficult to find
by testing alone.

In the **Choreographic Autonomous Systems** area we take a
*correct-by-construction* approach. In a *choreography* the global interaction is
written once, from the point of view of the whole system. Executable code for
each participant is then derived automatically, and is guaranteed to follow the
protocol.

We build on a long tradition of the lab in formal models of distributed systems
(process calculi, bigraphs, coalgebras, type theory) and turn these foundations
into languages and tools for real autonomous systems.
