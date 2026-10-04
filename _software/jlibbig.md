---
title: jLibBig
summary: A Java library for bigraphs and bigraphical reactive systems, extensible with attached properties and custom matchers.
language: Java
repo: https://github.com/bigraphs/jlibbig
groups: [choreographies]
redirect_from:
  - /downloads/libbig/
---

[Bigraphs and Bigraphical Reactive Systems](https://en.wikipedia.org/wiki/Bigraph)
are a graphical calculus for describing the syntax and semantics of systems in
terms of two orthogonal notions: *connectivity* and *locality*. They have also
been applied successfully in other fields, such as knowledge representation.
Robin Milner and colleagues proposed bigraphs in 2000, and they have been under
development ever since. For an introduction, see Milner's book *The Space and
Motion of Communicating Agents* or [bigraph.org](http://bigraph.org/).

jLibBig implements bigraphical reactive systems. It also provides tools and
infrastructure for extending them, and for implementing new flavours of
bigraphs for a wider range of scenarios.

Part of this extensibility comes from **attached properties**, which extend the
structure of a bigraph dynamically by attaching (possibly mutable) attributes,
for example to nodes. Properties can store concrete values such as IP addresses
or user permissions without encoding them in the bigraphical language.
Matching and rewriting can be customised to take properties into account.

## A first example

The following program defines a signature with a single control `Printer` with
two ports, and builds the bigraph pictured below.

```java
import it.uniud.mads.jlibbig.core.std.*;

public class SimpleBig {
    public static void main(String[] args) {
        SignatureBuilder signatureBuilder = new SignatureBuilder();
        signatureBuilder.add(new Control("Printer", true, 2));
        Signature signature = signatureBuilder.makeSignature();

        BigraphBuilder builder = new BigraphBuilder(signature);
        OuterName spooler = builder.addOuterName("Spooler");
        OuterName network = builder.addOuterName("Network");
        Root root = builder.addRoot();
        Node printer = builder.addNode("Printer", root, spooler, network);
        builder.addSite(root);
        builder.addSite(printer);
        builder.addInnerName("Network", network);
        Bigraph bigraph = builder.makeBigraph();

        System.out.println(bigraph);
    }
}
```

![The bigraph built by the example]({{ site.baseurl }}/assets/images/software/libbig_printer_example.png)

Attached properties add extra information at run time:

```java
printer.attachProperty(new ProtectedProperty<String>("NETWORK_ALIAS", "Lab printer"));
Paper format = printer.<Paper>getProperty("DEFAULT_FORMAT").get();
printer.<Paper>getProperty("DEFAULT_FORMAT").set(Paper.A4);
```

Matchers can be customised as well, for example to consider only access points
within range, or to compute optimal (weighted) matches:

```java
Matcher matcher = new WeightedMatcher() {
    protected int matchingWeight(Bigraph agent, Node nodeAgent, Bigraph redex, Node nodeRedex) {
        if (nodeAgent.getControl().equals(AP_C) && nodeRedex.getControl().equals(AP_C))
            return getDistance(nodeAgent);
        return super.matchingWeight(agent, nodeAgent, redex, nodeRedex);
    }
};
```

## Modules

- **Core**: the main infrastructure, the abstractions shared by bigraphs and
  their extensions, and a default implementation of BRS with abstract names.
  The `ldb` package implements *directed bigraphs*. Ordinary and weighted
  matches are solved as constraint satisfaction problems with the
  [Choco solver](https://choco-solver.org/).
- **BigMC interoperability**: import and export utilities for the text format
  of the [BigMC](http://bigraph.org/bigmc/) model checker.
- **UDLang**: tools for UDLang, a text format for encoding bigraphical reactive
  systems.

Source code, releases and documentation are on
[GitHub](https://github.com/bigraphs/jlibbig).
