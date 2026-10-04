---
title: Contact
eyebrow: Where we are
lead: Department of Mathematics, Computer Science and Physics, University of Udine.
permalink: /contact/
wide: true
redirect_from:
  - /contacts/
---

<div class="contact-grid">
  <div class="contact-cards">
    <a class="contact-card" href="mailto:{{ site.email }}">
      <span class="group-icon">{% include icon.html name="mail" %}</span>
      <span><small>Email</small>{{ site.email }}</span>
    </a>
    <a class="contact-card" href="tel:{{ site.phone | remove: ' ' }}">
      <span class="group-icon">{% include icon.html name="phone" %}</span>
      <span><small>Phone</small>{{ site.phone }}</span>
    </a>
    <a class="contact-card" href="https://www.openstreetmap.org/?mlat=46.080695&amp;mlon=13.212497#map=17/46.080695/13.212497">
      <span class="group-icon">{% include icon.html name="pin" %}</span>
      <span><small>Address</small>{% for l in site.address %}{{ l }}{% unless forloop.last %}<br>{% endunless %}{% endfor %}</span>
    </a>
  </div>
  <div class="map-frame">
    <iframe title="Map of the MADS Lab location" loading="lazy"
      src="https://www.openstreetmap.org/export/embed.html?bbox=13.2055%2C46.0775%2C13.2195%2C46.0840&amp;layer=mapnik&amp;marker=46.080695%2C13.212497"></iframe>
  </div>
</div>

## Getting here

The lab is located in the *Rizzi* scientific campus of the University of Udine,
in the northern part of the city, a short bus ride from the railway station.
Visitors are welcome: please [write to us](mailto:{{ site.email }}) to arrange a meeting.
