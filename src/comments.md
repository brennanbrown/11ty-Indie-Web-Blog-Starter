---
title: Comments
---

Like the guestbook, this starter doesn't ship a custom comment system.
Here's a list of services other IndieWeb folks use instead.
The entries exist at `src/_data/comments.js`, which you can replace with the
code for your comments, if need be.

<ul>
{% for entry in comments %}
  <li>
    <a href="{{ entry.url }}">{{ entry.name }}</a>
    {% if entry.note %} — <em>{{ entry.note }}</em>{% endif %}
  </li>
{% endfor %}
</ul>
