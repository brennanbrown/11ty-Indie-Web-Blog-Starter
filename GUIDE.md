# IndieWeb 11ty Starter: Setup & User Guide

This guide helps you get your IndieWeb blog running quickly and understand how to make it yours. This starter is designed to be minimal, opinionated, and focused on IndieWeb principles.

## 1. What this is

- Your own blog you control. No algorithm, no lock-in.
- Write posts in plain text (Markdown).
- Deploy to the open web with one click.
- Built with IndieWeb principles: microformats, webmentions, and owning your content.

If you can edit a text file, you can publish.

## 2. Quick Setup (5 minutes)

### Step 1: Clone & Install

```bash
git clone https://github.com/yourusername/indieweb-11ty-starter.git
cd indieweb-11ty-starter
npm install
```

### Step 2: Configure Your Site

Edit `src/_data/site.js`: this is the **main configuration file**:

```javascript
export default {
  title: "Your Blog Name",
  description: "Your blog description",
  url: "https://yourdomain.com",
  language: "en",
  author: {
    name: "Your Name",
    url: "https://yourdomain.com",
    email: "your@email.com",
    bio: "A short bio about yourself"
  },
  // ... see the file for all options
};
```

### Step 3: Start Writing

```bash
npm start        # dev server at http://localhost:8080
```

### Step 4: Add Your First Post

Create a new file in `src/posts/` with this format:

```markdown
---
title: "My First Post"
date: 2024-01-01
tags: ["hello", "blogging"]
Hello world! This is my first post on my new blog.

I'm excited to own my content and join the IndieWeb community.
```

### Step 5: Deploy

```bash
npm run build     # production build to _site/
```

Upload the `_site/` folder to your host or use Netlify/Vercel/GitHub Pages.

## 3. IndieWeb Features

### Microformats

This starter includes IndieWeb microformats by default:

- **h-card**: Your author information (in the footer/about section)
- **h-entry**: Your blog posts (automatically included in post layout)

These help other sites understand your content and enable features like webmentions.

### Webmentions

Webmentions let other sites reply/like/bookmark your posts—across the web.

**To enable webmentions:**

1. Register your domain at [webmention.io](https://webmention.io)
2. Copy `.env.example` to `.env` and set `WEBMENTION_IO_TOKEN`
3. In production (Netlify/Vercel), set the same env var in your dashboard
4. Never commit the token

The starter handles:
- **Sending**: Automatic via `<link rel="webmention">` tag in `<head>`
- **Receiving**: Build-time fetch in `src/_data/webmentions.js`, cached for 12 hours

### RSS + JSON Feeds

Feeds are automatically generated:
- RSS: `/feed.xml`
- JSON: `/feed.json`

## 4. Configuration Reference (`src/_data/site.js`)

Configuration lives in this one file. Here are the key fields:

| Field | What it does |
|-------|--------------|
| `title`, `description`, `url`, `language` | Basic site identity |
| `author.*` | Your h-card: name, url, photo, email, bio, relMe links |
| `seo.*` | Default OG image, whether to emit Twitter Card tags. See below for customization. |
| `nav` | Whether the nav (driven by `nav.js`) renders |
| `sidebar` | Whether the optional `<aside>` renders |
| `homepagePostsLimit` | Number of posts to show on homepage |
| `webmention.*` | Endpoint URLs and your token (from environment) |
| `feed.*` | Which feed formats to emit |
| `fonts.*` | Font stacks (mirror changes to CSS variables too) |
| `license.*`, `credits.*` | Rendered in the footer |

### Open Graph Image

The default Open Graph image is set in `seo.ogImageDefault` and defaults to `/assets/images/og-default.png`. This image is used when sharing your site on social media platforms (Twitter/X, Facebook, LinkedIn, etc.).

**To customize it for your site:**

1. Replace `/assets/images/og-default.png` with your own image (recommended size: 1200x630px for optimal display)
2. Or update the path in `src/_data/site.js`:
   ```javascript
   seo: {
     ogImageDefault: "/assets/images/your-custom-image.png"
   }
   ```

Posts can also have their own featured images by adding `featured_image` to their front matter, which will override the default for that specific post.

## 5. Post Front Matter

Posts support optional featured images:

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

## 6. Customization

### Changing Colors & Fonts

Edit CSS variables in `src/assets/css/01-variables.css`:

```css
:root {
  --color-primary: #3b82f6;
  --color-text: #1f2937;
  --font-family-sans: system-ui, -apple-system, sans-serif;
  --font-family-heading: system-ui, -apple-system, sans-serif;
}
```

Then update `site.fonts` in `src/_data/site.js` to match.

### Adding Pages

Create a new file in `src/` (e.g., `about.md`):

```markdown
---
title: "About"
layout: layouts/page.njk
# About Me

This is the about page.
```

### Modifying Navigation

Edit `src/_data/nav.js` to add/remove navigation links.

### Adding Assets

Put images in `src/assets/images/` and reference with `/assets/images/...` URLs.

## 7. Search

This starter uses [Pagefind](https://pagefind.app/) for search:

- Build-time indexing (no server needed)
- No API keys required
- Runs automatically with `npm run build`
- Search UI at `/search.md`

## 8. Fonts

The default fonts are system font stacks. Zero font loading, zero layout shift.

**To use Google Fonts or Bunny Fonts:**

1. Add the `<link>` tag to `src/_includes/partials/head.njk`
2. Update `--font-family-sans` / `--font-family-heading` in `src/assets/css/01-variables.css`
3. Update `site.fonts` in `src/_data/site.js` to match

## 8.1 Favicons

The starter includes a in-depth favicon set in `src/assets/images/favicon/`:
- `favicon.ico`: Legacy browser support
- `favicon-16x16.png`: Small icon for older browsers
- `favicon-32x32.png`: Standard favicon size
- `apple-touch-icon.png`: iOS home screen icon
- `android-chrome-192x192.png`: Android home screen
- `android-chrome-512x512.png`: Android splash screen
- `site.webmanifest`: Web app manifest

To generate your own favicon set:
- **Easy option**: [favicon.io](https://favicon.io/emoji-favicons/): Generate emoji-based favicons quickly
- **In-depth option**: [RealFaviconGenerator.net](https://realfavicongenerator.net/): Generate a complete favicon set from a single image with PWA support

To replace the favicons:
1. Generate your favicon set using one of the tools above
2. Replace the files in `src/assets/images/favicon/`
3. Update `site.webmanifest` if you change the manifest content

## 10. Deployment

### Netlify (recommended)

1. Fork/clone the repo
2. Connect the repo in Netlify
3. Set `WEBMENTION_IO_TOKEN` (and any other secrets) in Netlify's dashboard
4. Deploy

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

### Vercel

1. Import the repo in Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### GitHub Pages

1. Push to GitHub
2. Enable Pages in repository settings
3. Configure build settings: `npm run build`, output directory `_site`

### Advanced Deployment Options
For alternative deployment methods and CI/CD setups:
- [Deploying Eleventy to Neocities with GitLab CI/CD](https://brennan.day/deploying-an-eleventy-site-to-neocities-with-gitlab-ci-cd/)
- [Refactoring Eleventy config into modules](https://brennan.day/cleaning-house-refactoring-my-eleventy-config-into-modules/)

## 11. Environment Variables

Copy `.env.example` to `.env` for local development:

```bash
cp .env.example .env
```

Required for webmentions:
- `WEBMENTION_IO_TOKEN`: Your webmention.io token

## 13. Templating

This starter uses Nunjucks (`.njk` files) for layouts and partials:

- **Layouts**: `src/_includes/layouts/` (base.njk, page.njk, post.njk)
- **Partials**: `src/_includes/partials/` (head, header, footer, etc.)
- **Data**: `src/_data/` (site.js, nav.js, etc.)

To learn Nunjucks:
- [Official Nunjucks Documentation](https://mozilla.github.io/nunjucks/)
- [Nunjucks Getting Started](https://mozilla.github.io/nunjucks/getting-started.html)

## 15. Extending the Starter

This starter is intentionally minimal. Here are common extensions you can add:

### Additional Content Types
Add new collections in `config/collections.js` for:
- Notes, journal entries, poetry, etc.
- Create corresponding layouts in `src/_includes/layouts/`

### Tag Archive Pages
The `tagList` collection already exists. Add a `src/tags.njk` pagination template to render one page per tag.

### Custom Comments/Guestbook
Currently links out to hosted services. To build your own:
- Add a form (Netlify Forms or similar)
- Add a backend (Netlify Function + database, or Supabase)
- Implement moderation
- For a detailed guide, see [Building an IndieAuth comment system](https://brennan.day/building-an-indieauth-comment-system-for-your-static-site/)
- For the classic guestbook experience, see [Bring back the 90s guestbook with JAMstack](https://brennan.day/bring-back-the-90s-guestbook-with-jamstack-how-i-added-dynamic-comments-to-my-static-11ty-site/)

### Analytics
Add privacy-friendly analytics to `src/_includes/partials/head.njk`:
- Plausible Analytics
- Fathom Analytics
- Simple Analytics

### Sitemap.xml
Add a `sitemap.njk` template looping through `collections.all`.

### Badges & Webrings
Add 88×31 buttons or webring navigation to your footer or sidebar.

## 16. IndieWeb Philosophy

This starter is built on these principles:

1. **Good faith code. Good faith writing.** No invasive trackers, ads, or a11y-hostile design.
2. **A pro-social attitude.** The web is meant to be social. Your site should have some social element.
3. **Be fun. Be accessible. Be small.** Express yourself. Follow WCAG guidelines. Keep your site performant.

The IndieWeb is a spectrum. There's no "perfect" IndieWeb site. This starter is one path, not the only one.

## 18. Learning Resources

If you're new to these technologies:

- **Markdown**: [Markdown Guide](https://www.markdownguide.org/)
- **JavaScript**: [The Modern JavaScript Tutorial](https://javascript.info/)
- **Eleventy**: [Official Docs](https://www.11ty.dev/docs/)
- **Nunjucks**: [Official Documentation](https://mozilla.github.io/nunjucks/)
- **IndieWeb**: [Getting Started](https://indieweb.org/Getting_Started)
- **Webmentions**: [Webmention.io](https://webmention.io/)

## 20. Troubleshooting

### Build fails
- Run `npm run clean` then `npm run build`
- Check that Node version is >=18

### Webmentions not appearing
- Verify `WEBMENTION_IO_TOKEN` is set correctly
- Check that your domain is registered on webmention.io

### Assets not loading
- Check file paths in `src/assets/images/`
- Verify passthrough copy in `eleventy.config.js`

### Search not working
- Ensure `npm run build` completed successfully
- Check that `pagefind` indexed the `_site/` folder

### Build performance issues
- Run `npm run clean` before building
- For optimizing build times, see [Cutting Eleventy build times in half](https://brennan.day/300-minutes-a-month-cutting-my-eleventy-netlify-build-time-in-half/)
- For developer experience improvements, see [Making Eleventy builds 5x faster](https://brennan.day/i-made-my-eleventy-build-5-faster-with-five-changes/)

## 21. Folder Structure

```
├── eleventy.config.js        # Eleventy config entry point
├── config/                   # filters.js, markdown.js, shortcodes.js, collections.js
├── netlify.toml              # Configuration for Netlify
├── robots.txt                # Denying genAI crawlers
├── src/
│   ├── _data/                # site.js (central config), nav.js, webmentions.js
│   ├── _includes/
│   │   ├── layouts/          # base.njk, post.njk, page.njk
│   │   └── partials/         # head, header, footer, h-card, webmentions
│   ├── assets/
│   │   ├── css/              # chota.css + your custom CSS
│   │   └── images/           # Your images
│   ├── posts/                # Your blog posts
│   └── *.md, *.njk           # Pages (index, about, contact, etc.)
```

You've got this. The web needs more personal, thoughtful, welcoming spaces.
