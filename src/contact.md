---
title: Contact
---

Reach me at [{{ site.author.email }}](mailto:{{ site.author.email }}), or find me
elsewhere:

<ul>
{% for url in site.author.relMe %}
  <li><a href="{{ url }}" rel="me">{{ url }}</a></li>
{% endfor %}
</ul>

Want a contact form instead? [Netlify Forms](https://docs.netlify.com/manage/forms/setup/)
works without any extra JavaScript or backend. Add it as a documented
extension if you prefer not to expose an email address directly.
