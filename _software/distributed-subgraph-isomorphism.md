---
title: Distributed Subgraph Isomorphism
summary: An Akka-based distributed algorithm that lets a fleet of exploring agents find a pattern in a map that none of them knows entirely.
language: Java · Akka
repo: https://github.com/IdrissRio/DucktypeSystem
authors: Anna Becchi, Idriss Riouak
groups: [choreographies]
redirect_from:
  - /downloads/distributed-subgraph-isomorphism/
---

Consider a multi-agent system in which a fleet of communicating agents, such as
robots or drones, explores an unknown environment (a building, a territory).
Each agent gradually collects information about the topology of the place. Each
node has a subjective and incomplete view of the environment, and limits on
bandwidth, time or memory mean that no node ever holds the whole graph.

In this setting arises the **distributed subgraph isomorphism** problem: find an
isomorphism between a given pattern graph and a subgraph of the global,
distributed host graph. This can be used, for instance, to find escape routes or
ways to reach specific areas.

This student project, by Anna Becchi and Idriss Riouak, covers the problem from
its formal definition to an implementation. The implementation simulates the
physical execution environment and includes a graphical interface and a test
suite.

## Implementation

The system is implemented with [Akka](https://akka.io), a toolkit for building
concurrent and distributed systems on the JVM based on the *actor model*.
Components communicate mainly through Akka's *Distributed Publish Subscribe in
Cluster*. A sender reaches all actors subscribed to a topic without knowing
their references, which gives full location transparency between actor systems.

- **SendToAll / Publish**: the message is delivered to all subscribed actors,
  optionally excluding the sender.
- **Send**: the message is delivered to a single subscriber, optionally with
  location affinity.

Download the project from [GitHub](https://github.com/IdrissRio/DucktypeSystem)
and run it with `./dsquack`. The
[README](https://github.com/IdrissRio/DucktypeSystem/blob/master/DS-BecchiRiouak/README)
describes the source layout, testing and log messages.

## Screenshots

<div class="gallery">
  <a href="/assets/images/software/img1.jpg"><img src="/assets/images/software/img1.jpg" alt="Screenshot 1" loading="lazy"></a>
  <a href="/assets/images/software/img2.jpg"><img src="/assets/images/software/img2.jpg" alt="Screenshot 2" loading="lazy"></a>
  <a href="/assets/images/software/img3.jpg"><img src="/assets/images/software/img3.jpg" alt="Screenshot 3" loading="lazy"></a>
  <a href="/assets/images/software/img4.jpg"><img src="/assets/images/software/img4.jpg" alt="Screenshot 4" loading="lazy"></a>
</div>
