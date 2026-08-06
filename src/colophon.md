---
title: Colophon
---

The "more meta" page: what this site is built with, and why.

- **Static site generator:** [Eleventy](https://11ty.dev) (ESM config)
- **Templating:** Nunjucks for layouts/partials, Markdown for content
- **CSS:** [chota.css](https://jenil.github.io/chota/), vendored, with overrides layered on top
- **Icons:** [`@11ty/font-awesome`](https://github.com/11ty/eleventy-plugin-font-awesome), inline SVG at build time
- **Images:** [`@11ty/eleventy-img`](https://www.11ty.dev/docs/plugins/image/), responsive `<picture>` output
- **Feeds:** hand-rolled RSS and JSON feed templates
- **Webmentions:** [webmention.io](https://webmention.io) (or a self-hosted mirror), fetched at build time via [`@11ty/eleventy-fetch`](https://www.11ty.dev/docs/plugins/fetch/)
- **Deployment:** [Netlify](https://netlify.com), though any static host works

## Build performance

This starter is designed to be fast. A typical build takes under a second:

- **Starter build:** ~0.7 seconds (19 files, 29 assets)
- **brennan.day comparison:** ~14.7 seconds (593 files, 649 assets)

The difference comes from complexity: brennan.day has hundreds more posts, tag pages, and features. This starter keeps the essentials while staying performant.

This site started from the [IndieWeb 11ty Starter]({{ site.repoUrl }}).
See its README for the full feature list and setup notes.

## Acknowledgements

This starter was inspired by and built with the help of many people and resources:

- **Adam Newbold** ([omg.lol](https://omg.lol)): Mentorship and inspiration, with [weblog.lol](https://weblog.lol/) as a design inspiration
- **Kat/Melo** ([girlonthemoon.xyz](https://girlonthemoon.xyz/)): Friend and fellow sysadmin
- **Coyote** ([osteophage.neocities.org](https://osteophage.neocities.org/)): Friend and resource sharing
- **[Modern Font Stacks](https://modernfontstacks.com/)**: Good typefaces without bloat
- **Zach Leatherman** ([zachleat.com](https://www.zachleat.com/)): For creating Eleventy
- **[Brutalist Websites](https://brutalistwebsites.com/)**: Design inspiration
- **Xandra** ([goodinternetmagazine.com](https://www.goodinternetmagazine.com/)): Inspiration
- **[Cool URIs don't change](https://www.w3.org/Provider/Style/URI)**: W3C URI style guide
- **[Sublime Text](https://www.sublimetext.com/)**: For never changing or adding genAI features
