![IndieWeb Blog Starter preview](./screenshot.png)

# IndieWeb Blog Starter

A modern, feature-complete blog template built with Eleventy and Tailwind CSS. Designed for writers who want to own their content and participate in the IndieWeb.

> New to this? Read the non-technical guide: [GUIDE.md](./GUIDE.md)

## Features

- **Simple setup** - Edit one config file and you're ready to publish
- **IndieWeb ready** - Microformats, webmentions, and RSS built-in
- **Modern design** - Clean, accessible, mobile-first interface
- **Privacy focused** - No tracking by default, optional ethical analytics
- **Full-featured** - Search, tags, dark mode, and more

## ⚡ Quick Start

1. **Clone and install**:
   ```bash
   git clone https://github.com/yourusername/indieweb-blog-starter.git
   cd indieweb-blog-starter
   npm install
   ```

2. **Configure your site** (most important step!):
   Edit `src/_data/site.json` with your information:
   ```json
   {
     "name": "Your Blog Name",
     "author": "Your Name", 
     "email": "your@email.com",
     "url": "https://yourdomain.com",
     "bio": {
       "short": "Your tagline",
       "long": "Your longer bio..."
     },
     "social": {
       "github": "yourusername",
       "mastodon": "@you@mastodon.social"
     }
   }
   ```

3. **Start writing**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:8080` and start creating!

4. **Deploy**:
   ```bash
   npm run build
   ```

## 🎯 Features

- 🚀 **Zero Config**: Just edit one file and you're ready
- 🌙 **Dark Mode**: Automatic system detection + manual toggle
- ♿ **Accessible**: WCAG 2.1 AA compliant with accessibility controls
- 🔍 **Smart Search**: Client-side FlexSearch with live results
- 🕸️ **IndieWeb Ready**: Microformats2, Webmentions, h-card
- 📡 **RSS Feed**: Automatic feed generation
- 🎨 **Tag Colors**: Automatic color mapping for tags
- 📱 **Mobile First**: Responsive design that works everywhere
- 🔒 **Privacy Focused**: Optional analytics (Plausible/Fathom)
- 🎪 **Easter Eggs**: Hidden interactions for fun

## 🛠️ Easy Configuration

Unlike other templates that require editing dozens of files, this template uses a single configuration file (`src/_data/site.json`) for most customization:

### Indie Creator Guide

See the in-depth post: [Guide to Making It as an Indie Creator](/blog/guide-to-making-it-as-an-indie-creator/) for practical steps to grow an audience, accept support, and keep a simple workflow using this template.

Quick reference (matches the code in `src/_includes/layouts/post.njk`, `src/contact.njk`, and `src/donate.njk`):

- **Newsletter** (renders on posts when enabled):
  ```json
  {
    "newsletter": {
      "enabled": true,
      "provider": "buttondown",
      "action": "https://buttondown.email/api/emails/embed-subscribe/yourusername",
      "title": "Join the Newsletter",
      "description": "Get thoughtful updates delivered to your inbox."
    }
  }
  ```
  Use any provider by swapping the `action` with a POST endpoint.

- **Contact form** (configure a backend):
  In `src/contact.njk`, wire up Netlify Forms or a service like Formspree/Basin by adding provider attributes, e.g.:
  ```html
  <form name="contact" method="POST" data-netlify="true">
    <input type="hidden" name="form-name" value="contact">
    <!-- fields -->
  </form>
  ```

- **Donations/Sponsorship** (renders on `/donate/`):
  ```json
  {
    "donate": {
      "enabled": true,
      "kofi": "yourusername",
      "buymeacoffee": "yourusername",
      "github": "yourusername",
      "message": "If you find value in my writing, consider supporting my work."
    }
  }
  ```

### Essential Settings
- **Site info**: Name, description, URL, author
- **Social links**: GitHub, Mastodon, Twitter (all optional)
- **Bio**: Short tagline and longer description
- **Contact**: Email and location

### Optional Features
- **Newsletter**: Buttondown, ConvertKit, or custom integration
- **Donations**: Ko-fi, Buy Me a Coffee, GitHub Sponsors
- **Analytics**: Plausible, Fathom, or Simple Analytics
- **Webmentions**: Automatic setup with webmention.io

### Quick Setup Examples

**Minimal setup** (just the essentials):
```json
{
  "name": "My Blog",
  "author": "Jane Doe",
  "email": "jane@example.com",
  "url": "https://janedoe.blog"
}
```

**Full setup** with all features:
```json
{
  "name": "Jane's Digital Garden",
  "author": "Jane Doe",
  "email": "jane@example.com", 
  "url": "https://janedoe.blog",
  "bio": {
    "short": "Writer & digital minimalist",
    "long": "I write about technology, minimalism, and intentional living."
  },
  "social": {
    "github": "janedoe",
    "mastodon": "@jane@mastodon.social"
  },
  "newsletter": {
    "enabled": true,
    "provider": "buttondown",
    "action": "https://buttondown.email/api/emails/embed-subscribe/jane"
  },
  "analytics": {
    "enabled": true,
    "provider": "plausible"
  }
}
```

## 📁 Template Structure

```
src/
├── _data/
│   ├── site.json       # 🎯 Main config file (edit this!)
│   └── tagColors.json  # Tag color mappings
├── _includes/
│   ├── layouts/        # Page layouts
│   └── partials/       # Reusable components
├── assets/
│   ├── css/           # Tailwind CSS
│   └── js/            # Interactive features
├── blog/              # 📝 Your blog posts go here
├── about.njk          # About page
├── contact.njk        # Contact page  
├── uses.njk           # Tools & setup page
├── now.njk            # What you're up to now
├── blogroll.njk       # Recommended blogs
├── archive.njk        # Post archive
└── style.njk          # Living style guide
```

## 🖼️ Configurable Placeholder Assets

This template includes a tiny build helper that fetches placeholder images so your site looks complete out‑of‑the‑box without committing binaries. Files are saved to `src/assets/` and passed through to `/assets/` at build time.

What gets fetched by default:

- **profile.jpg** — used on `about` page
- **og-default.png** — fallback Open Graph image
- **retro-stars.png** — background tile used in one demo post

How to customize:

- **Drop in your own files**: place files with the same names in `src/assets/` and the fetcher will skip downloading.
- **Environment variables**: set any of these to your own URLs
  - `PROFILE_IMAGE_URL`
  - `OG_DEFAULT_URL`
  - `RETRO_STARS_URL`
  - Example: `PROFILE_IMAGE_URL=https://example.com/me.jpg npm run build`
- **site.json config**: add an optional `assets` section to `src/_data/site.json`:
  ```json
  {
    "assets": {
      "profileUrl": "https://example.com/me.jpg",
      "ogDefaultUrl": "https://example.com/og.png",
      "retroStarsUrl": "https://example.com/retro-stars.png"
    }
  }
  ```
- **Skip entirely**: set `SKIP_FETCH_ASSETS=1` (or `true`) to bypass downloading (useful for offline/CI).

The fetcher runs as part of the build (`npm run build`), before CSS and Eleventy.

## 🚀 Deployment

### Netlify (One-Click Deploy)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/indieweb-blog-starter)

### GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. The included workflow will build and deploy automatically

### Manual Netlify
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `_site`

### Manual Deployment
```bash
npm run build
# Upload _site/ folder to your web server
```

## 🌐 IndieWeb Setup

This template includes IndieWeb features out of the box:

### Webmentions
1. Sign up at [webmention.io](https://webmention.io)
2. Add your domain to `site.json`:
   ```json
   "webmentions": {
     "enabled": true,
     "domain": "yourdomain.com"
   }
   ```

### Microformats
- h-card for your identity
- h-entry for blog posts  
- h-feed for your blog listing
- All automatically included!

## 🎨 Customization

### Colors & Styling
- Edit `tailwind.config.cjs` for theme colors
- Modify `src/assets/css/build.css` for custom styles
- Update `src/_data/tagColors.json` for tag colors

### Adding Pages
1. Create a new `.njk` file in `src/`
2. Add front matter with layout and permalink
3. Add navigation link in `src/_includes/layouts/base.njk`

### Newsletter Integration
Supports multiple providers:
- **Buttondown**: Set `newsletter.provider` to `"buttondown"`
- **ConvertKit**: Set to `"convertkit"` 
- **Custom**: Use any form action URL

## 🗺️ Roadmap

The following improvements are planned to keep this template modern, accessible, and fun to use:

- [ ] __Themes__: additional vibrant code themes and optional color presets
- [ ] __PWA/Offline__: add service worker for basic offline reading
- [ ] __i18n__: language switcher and localized date formatting
- [ ] __Webmentions UI__: simple moderation/preview UI and richer templates
- [ ] __SEO__: JSON-LD schema and improved link previews
- [ ] __Accessibility__: periodic audits and keyboard interaction tests
- [ ] __Testing__: expand Playwright e2e coverage (mobile and dark mode)
- [ ] __Content Starter__: more sample posts and page templates

Have suggestions? Open an issue or PR.

## 🤝 Contributing

Found a bug or want to improve something? Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this template for any project!

## 🙏 Acknowledgments

Built with:
- [Eleventy](https://11ty.dev) - Static site generator
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [FlexSearch](https://github.com/nextapps-de/flexsearch) - Client-side search
- IndieWeb principles and community wisdom

---

**Ready to break free from social media?** Clone this template and start building your corner of the independent web! 🌱
