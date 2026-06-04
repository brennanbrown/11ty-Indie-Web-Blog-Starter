---
title: Guestbook
---

Sign a guestbook! This starter doesn't ship a custom one. Instead, here's
a list of hosted and self-hostable options other IndieWeb folks use. 
The entries exist at `src/_data/guestbooks.js`, which you can replace with the
code for your guestbook, if need be.

<ul>
{% for entry in guestbooks %}
  <li>
    <a href="{{ entry.url }}">{{ entry.name }}</a>
    {% if entry.note %} — <em>{{ entry.note }}</em>{% endif %}
  </li>
{% endfor %}
</ul>
