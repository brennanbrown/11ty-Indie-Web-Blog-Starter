# IndieWeb 11ty Starter

![Screenshot](https://raw.githubusercontent.com/brennanbrown/11ty-Indie-Web-Blog-Starter/refs/heads/main/src/assets/images/og-default.png)

**Demo:** [indieweb-blog-starter.netlify.app](https://indieweb-blog-starter.netlify.app/)

A minimal [Eleventy](https://11ty.dev) starter for people
getting into the [IndieWeb](https://indieweb.org) for the first time. Files
that matter are commented, conventions are visible in the file
tree, and nothing meaningful is hardcoded into templates. It lives in
`src/_data/site.js` or another data file instead.

This starter includes IndieWeb microformats and webmentions because they're useful and fun to explore. However, I don't believe a site needs these to be "IndieWeb." The IndieWeb is about principles, not specs.

**[My IndieWeb principles](https://brennan.day/indieweb/):**

1. **Good faith code. Good faith writing.** No invasive trackers, ads, or a11y-hostile design. Write from a place of good faith, believing the internet can still be good.
2. **A pro-social attitude.** The web is meant to be social. Your site should have some social element, even if it's just contact information.
3. **Be fun. Be accessible. Be small.** Express yourself. Follow WCAG guidelines. Keep your site performant. Make it work without JavaScript.

The IndieWeb is a spectrum. There's no "perfect" IndieWeb site. This starter is one path into the IndieWeb, not the only one.

**Note:** This is a complete overhaul of the original starter. If you prefer the previous version with different features (multiple content types, related posts, social sharing, enhanced tag colors, testing infrastructure), you can still use the [v1 branch](https://github.com/brennanbrown/11ty-Indie-Web-Blog-Starter/tree/v1).

## 1. Who this is for

You want a blog that:

- uses IndieWeb microformats ([h-card](https://indieweb.org/h-card),
  [h-entry](https://indieweb.org/h-entry)) by default
- sends and receives [webmentions](https://indieweb.org/webmention)
- uses almost no client-side JavaScript
- doesn't lock you into a specific comment or guestbook system
- you can understand by reading the comments in this repo

## 2. Features

- Eleventy 3.x, ESM config (`eleventy.config.js`)
- Nunjucks layouts/partials, Markdown content
- [chota.css](https://jenil.github.io/chota/), vendored, with your own
  overrides layered on top
- Inline SVG icons via [`@11ty/font-awesome`](https://github.com/11ty/eleventy-plugin-font-awesome)
  . Zero icon-font requests
- Responsive images via [`@11ty/eleventy-img`](https://www.11ty.dev/docs/plugins/image/)
- RSS + JSON feeds
- Webmentions: sending (passive `<link>` tag) and receiving (build-time
  fetch, cached)
- CSS-only dark mode (`prefers-color-scheme`)
- Build-time search via [Pagefind](https://pagefind.app/). No server,
  no API keys (see [Search](#8-search) for why this starter ships
  Pagefind instead of a hosted search engine)
- Guestbook and comments pages that link out to existing services,
  not a bespoke system you have to maintain

## 3. Performance & Accessibility

This starter is designed for optimal performance and accessibility out of the box:

**Lighthouse Scores:**
- Performance: 99/100
- Accessibility: 100/100
- Best Practices: 100/100
- SEO: 100/100

## 4. Quickstart

```bash
git clone <this-repo>
cd <this-repo>
npm install
npm start        # dev server at http://localhost:8080
npm run build     # production build to _site/, then indexes it with Pagefind
```

**For detailed setup and customization instructions, see [GUIDE.md](./GUIDE.md).**

## 5. Folder structure

```
├── eleventy.config.js        # Eleventy config entry point, commented
├── config/                   # filters.js, markdown.js, shortcodes.js, collections.js
├── netlify.toml              # Configuration file for Netlify
├── robots.txt                # Denying genAI crawlers
├── src/
│   ├── _data/                # site.js (central config), nav.js, guestbooks.js, comments.js, blogroll.js, webrings.js, webmentions.js
│   ├── _includes/
│   │   ├── layouts/          # base.njk, post.njk, page.njk
│   │   └── partials/         # head, header, nav, aside, footer, h-card, webmentions
│   ├── assets/
│   │   ├── css/              # vendor/chota.css, 01-variables.css, 02-15 split CSS files
│   │   └── images/
│   ├── posts/                # your posts live here
│   ├── about.md, contact.md, colophon.md, guestbook.md, comments.md, search.md, etc.
│   ├── index.njk, posts.njk, feed.njk, feed.json.njk, etc.
```

## 6. Configuration reference (`src/_data/site.js`)

Configuration a beginner should touch lives in this one file:

| Field | What it does |
|-------|--------------|
| `title`, `description`, `url`, `language` | Basic site identity |
| `author.*` | Your [h-card](https://indieweb.org/h-card): name, url, photo, email, bio, `relMe` links |
| `seo.*` | Default OG image, whether to also emit Twitter Card tags |
| `nav` | Whether the nav (driven by `nav.js`) renders |
| `sidebar` | Whether the optional `<aside>` renders (about card, stats, recent posts, elsewhere, blogroll, webrings. See `partials/aside.njk`) |
| `homepagePostsLimit` | Number of posts to show on the homepage |
| `webmention.*` | Endpoint URLs and your token (from the environment, never hardcoded) |
| `feed.*` | Which feed formats to emit |
| `fonts.*` | Font stacks. Mirror any change into `assets/css/01-variables.css` too |
| `license.*`, `credits.*` | Rendered in the footer |

## 6.1 Post front matter

Posts support optional featured images with alt text and captions:

| Field | What it does |
|-------|--------------|
| `featured_image` | Path to the featured image (e.g., `/assets/images/posts/example.jpg`) |
| `featured_image_alt` | Alt text for the image (required for accessibility) |
| `featured_image_caption` | Caption displayed below the image (supports Markdown links) |

Example:
```yaml
---
title: "My Post"
date: 2026-03-01
featured_image: /assets/images/posts/example.jpg
featured_image_alt: "Description of the image for screen readers"
featured_image_caption: "Photo by [Author](https://example.com)"
---
```

## 7. Fonts

The default fonts are system font stacks. Zero font loading, zero layout
shift. The tradeoff is not controlling exact rendering across devices. To
swap in a Google Fonts or [Bunny Fonts](https://fonts.bunny.net/) stack
instead:

1. Add the `<link>` tag to `src/_includes/partials/head.njk`
2. Update `--font-family-sans` / `--font-family-heading` in
   `src/assets/css/01-variables.css`
3. Update `site.fonts` in `src/_data/site.js` to match (used for
   documentation purposes / future automation)

## 7.1 Favicons

The starter includes a comprehensive favicon set in `src/assets/images/favicon/`:
- `favicon.ico`: Legacy browser support
- `favicon-16x16.png`: Small icon for older browsers
- `favicon-32x32.png`: Standard favicon size
- `apple-touch-icon.png`: iOS home screen icon
- `android-chrome-192x192.png`: Android home screen
- `android-chrome-512x512.png`: Android splash screen
- `site.webmanifest`: Web app manifest

To generate your own favicon set:
- **Easy option**: [favicon.io](https://favicon.io/emoji-favicons/): Generate emoji-based favicons quickly
- **Comprehensive option**: [RealFaviconGenerator.net](https://realfavicongenerator.net/): Generate a complete favicon set from a single image with PWA support

To replace the favicons:
1. Generate your favicon set using one of the tools above
2. Replace the files in `src/assets/images/favicon/`
3. Update `site.webmanifest` if you change the manifest content

## 7.3 Templating languages

Eleventy supports many templating languages: HTML, Markdown, WebC, JavaScript (.11ty.js), Liquid, Nunjucks, Handlebars, Mustache, EJS, Haml, Pug, and more. Each has its own syntax and tradeoffs.

This starter uses Nunjucks (`.njk` files) for layouts and partials. Nunjucks offers:
- Template inheritance (extending base layouts)
- Includes (reusable partials)
- Filters (data transformation)
- Macros (reusable template functions)
- Async support

To learn Nunjucks:
- [Official Nunjucks Documentation](https://mozilla.github.io/nunjucks/)
- [Nunjucks Getting Started](https://mozilla.github.io/nunjucks/getting-started.html)
- [Nunjucks Template Engine Tutorial](https://tutorial.techaltum.com/nunjucks.html)

If you prefer another language, you can switch by updating `eleventy.config.js` and renaming your template files. See [Eleventy's template language documentation](https://www.11ty.dev/docs/languages/) for details.

## 8. Webmentions

Register your domain at [webmention.io](https://webmention.io) (or my mirror, [webmention.folk.zone](https://folk.zone). The API is identical), then:

1. Copy `.env.example` to `.env` and set `WEBMENTION_IO_TOKEN`
2. In production (Netlify), set the same env var in the site's dashboard.
   Never commit it

Sending a webmention needs no JS or build step. The
`<link rel="webmention">` tag in `<head>`. Receiving them involves a build-time
fetch in `src/_data/webmentions.js`, cached for 12 hours so repeated builds
don't hit rate limits.

For a detailed walkthrough of how webmentions work in practice, see [my guide on how webmentions work on brennan.day](https://brennan.day/how-webmentions-work-on-brennan-day/).

## 9. Search

This starter ships [Pagefind](https://pagefind.app/). It indexes your
built `_site/` at build time and needs no running server or API
credentials. `npm run build` handles it, and `/search.md` wires up the
UI. A hosted engine like Elasticsearch is an alternative. It needs
a running server somewhere (Elastic Cloud, Bonsai, self-hosted) plus API
credentials. Usually proxied through a serverless function so the key
never reaches the client. Pagefind ships as the default here
instead.

## 10. Build performance

This starter is designed to be fast. A typical build takes under a second:

- **Starter build:** ~0.7 seconds (19 files, 29 assets)
- **brennan.day comparison:** ~14.7 seconds (593 files, 649 assets)

My site [brennan.day](https://brennan.day) has hundreds more posts, tag pages, and features. This starter keeps the essentials while staying performant.

For optimizing your own Eleventy build times, see:
- [My guide on cutting Eleventy build times in half](https://brennan.day/300-minutes-a-month-cutting-my-eleventy-netlify-build-time-in-half/)
- [My post on making Eleventy builds 5x faster](https://brennan.day/i-made-my-eleventy-build-5-faster-with-five-changes/)

## 11. Deploying

### Netlify (recommended)

`netlify.toml` is set up for [Netlify](https://netlify.com):

1. Fork/clone the repo
2. `npm install`
3. Connect the repo in Netlify (or `netlify deploy` via CLI)
4. Set `WEBMENTION_IO_TOKEN` (and any other secrets) in Netlify's
   dashboard
5. Deploy

### GitHub Actions to Netlify

The starter includes GitHub Actions workflows:
- `.github/workflows/ci.yml`: Runs on every push/PR to verify the build succeeds
- `.github/workflows/deploy.yml`: Deploys to Netlify on main branch pushes

To enable Netlify deployment via GitHub Actions:
1. Fork the repo
2. In your fork's Settings → Secrets and variables → Actions, add:
  : `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
  : `NETLIFY_SITE_ID`: Your Netlify site ID
3. Push to main to trigger deployment

### Other platforms

Vercel, Cloudflare Pages, GitHub Pages, or self-hosting all work with a standard Eleventy build. `netlify.toml` represents the path of least resistance here.

## 12. Learning resources

If you're new to the technologies this starter uses, here are beginner-friendly resources to get you started:

- **This starter**: [GUIDE.md](./GUIDE.md): Comprehensive setup and user guide
- **Markdown**: [Markdown Guide](https://www.markdownguide.org/) or [CommonMark Tutorial](https://commonmark.org/help/tutorial/)
- **JavaScript**: [The Modern JavaScript Tutorial](https://javascript.info/) or [LearningJavaScript.org](https://learningjavascript.org/lessons)
- **Eleventy**: [Official Getting Started](https://www.11ty.dev/docs/) or [Learn Eleventy](https://learneleventy.dev/)
- **Nunjucks**: [Official Documentation](https://mozilla.github.io/nunjucks/) or [Getting Started](https://mozilla.github.io/nunjucks/getting-started.html)
- **Git**: [Git for Beginners Tutorial](https://deployn.de/en/blog/git-tutorial/) or [freeCodeCamp Git Handbook](https://www.freecodecamp.org/news/learn-how-to-use-git-and-github-a-beginner-friendly-handbook/)
- **GitHub**: [GitHub Hello World](https://docs.github.com/en/get-started/using-github/hello-world) or [GitHub for Beginners](https://github.blog/developer-skills/github/github-for-beginners-your-roadmap-to-mastering-the-github-essentials/)
- **Netlify**: [Netlify Quickstart](https://docs.netlify.com/start/overview/) or [How to Deploy on Netlify](https://dev.to/md-mostafa-niloy/how-to-deploy-a-website-on-netlify-5fh2)

## 13. Extending this starter

This starter is intentionally minimal to provide a solid foundation without unnecessary complexity. However, it's designed to be easily extended. Here are common features you can add yourself:

### Additional Content Types
Add new collections in `config/collections.js` for:
- Notes, journal entries, poetry, microformats, etc.
- Create corresponding layouts in `src/_includes/layouts/`
- Add content directories in `src/` (e.g., `src/notes/`, `src/journal/`)

### Tag Archive Pages
The `tagList` collection already exists in `config/collections.js`. To create individual tag pages:
1. Create `src/tags.njk` with pagination
2. Use `pagination.data: tagList` and `pagination.size: 1`
3. Template will render one page per tag

### Custom Comments/Guestbook
Currently links out to hosted services (`src/_data/comments.js` and `guestbooks.js`). To build your own:
- Add a form (Netlify Forms, Formspree, or similar)
- Add a backend (Netlify Function + database, or Supabase)
- Implement moderation and spam protection
- See the IndieWeb comments specification for guidance
- For a detailed guide on building an IndieAuth comment system, see [my post on building an IndieAuth comment system](https://brennan.day/building-an-indieauth-comment-system-for-your-static-site/)
- For bringing back the classic guestbook experience, see [my guide on 90s guestbooks with JAMstack](https://brennan.day/bring-back-the-90s-guestbook-with-jamstack-how-i-added-dynamic-comments-to-my-static-11ty-site/)

### Analytics
Add privacy-friendly analytics to `src/_includes/partials/head.njk`:
- Plausible Analytics: `<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>`
- Fathom Analytics: `<script src="https://cdn.usefathom.com/script.js" data-site="YOUR_ID" defer></script>`
- Simple Analytics: `<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>`

### Sitemap.xml
Add a `sitemap.njk` template:
```njk
---
permalink: /sitemap.xml
eleventyExcludeFromCollections: true
---
<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {% for item in collections.all %}
  <url>
    <loc>{{ site.url }}{{ item.url }}</loc>
    <lastmod>{{ item.date | htmlDateString }}</lastmod>
  </url>
  {% endfor %}
</urlset>
```

### IndieAuth / Self-Hosted Auth
Not included in this starter. If you need it, reference implementations like:
- [IndieAuth.com](https://indieauth.com/)
- Existing implementations on personal IndieWeb sites

### Post-Type Discovery
This starter uses manual categorization. For automatic post-type discovery based on `in-reply-to`, `like-of`, `repost-of`, etc., implement the [IndieWeb post-type discovery algorithm](https://indieweb.org/post-type-discovery).

### Badges & Webrings
Add 88×31 buttons or webring navigation to your footer or sidebar for that classic web feel:
- [88×31 button gallery](https://cyber.dabamos.de/88x31/)
- [XXIIVV Webring](https://webring.xxiivv.com/)

### Advanced Configuration & Deployment
For more advanced Eleventy configuration and deployment options:
- [My guide on refactoring Eleventy config into modules](https://brennan.day/cleaning-house-refactoring-my-eleventy-config-into-modules/)
- [My tutorial on deploying Eleventy to Neocities with GitLab CI/CD](https://brennan.day/deploying-an-eleventy-site-to-neocities-with-gitlab-ci-cd/)

## 14. More IndieWeb resources

Once you've got this running, there's a much bigger world of personal-web
tools, communities, and ideas worth exploring. A jumping-off point
is this [resources list for the personal web](https://discourse.32bit.cafe/t/resources-list-for-the-personal-web/).

## 15. Acknowledgements & Attributions

This starter was inspired by and built with the help of many people and resources:

- **Adam Newbold** ([omg.lol](https://omg.lol)): Mentorship and inspiration, with [weblog.lol](https://weblog.lol/) as original design inspiration
- **Kat/Melo** ([girlonthemoon.xyz](https://girlonthemoon.xyz/)): Friend and fellow sysadmin
- **Coyote** ([osteophage.neocities.org](https://osteophage.neocities.org/)): Friend and resource sharing
- **[Modern Font Stacks](https://modernfontstacks.com/)**: Good typefaces without bloat
- **Zach Leatherman** ([zachleat.com](https://www.zachleat.com/)): For creating Eleventy
- **[Brutalist Websites](https://brutalistwebsites.com/)**: Design inspiration
- **Xandra** ([goodinternetmagazine.com](https://www.goodinternetmagazine.com/)): Inspiration
- **[Cool URIs don't change](https://www.w3.org/Provider/Style/URI)**: W3C URI style guide
- **[Sublime Text](https://www.sublimetext.com/)**: For never changing or adding genAI features

## 16. License & credits

[AGPL-3.0-or-later](./LICENSE). Built by [Brennan Kenneth Brown](https://brennan.day) of [Berry House](https://berryhouse.ca).

**Demo:** [indieweb-blog-starter.netlify.app](https://indieweb-blog-starter.netlify.app/)
