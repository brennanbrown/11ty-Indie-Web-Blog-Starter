---
title: "A Guide to Forking this Starter"
date: 2026-08-11
description: "A step-by-step guide to setting up the IndieWeb 11ty Starter for your own site, from deleting demo content to updating configuration and deployment."
postType: article
tags: ["11ty", "indieweb", "tutorial", "setup"]
---

So. you've found my IndieWeb 11ty Starter and want to make it your own. This guide covers the essential setup steps to transform this starter into your personal site.

For design customization (colors, typography, layout, animations), see [Customizing Your Site's Design](/posts/customizing-your-sites-design/).

## Delete Demo Content

First, remove the placeholder content that comes with the starter:

### Remove Example Posts
Delete all posts in `src/posts/`: these are example posts that demonstrate the starter's features. You'll want to start fresh with your own content.

### Update Placeholder Pages
Either delete or update these pages:
- `src/about.md`: Replace with your own about page
- `src/contact.md`: Update with your contact information
- `src/colophon.md`: Update with your site's colophon or remove it
- `src/guestbook.md` and `src/comments.md`: Update if you're using these features

### Remove Demo Images
Delete the demo images in `src/assets/images/posts/` or replace them with your own content.

### Post Front Matter Reference

Since you're deleting all the demo posts, here's the front matter format to use for your new posts:

```yaml
---
title: "Your Post Title"
date: 2026-08-12
description: "A short description for RSS feeds and search results"
postType: article
tags: ["11ty", "indieweb", "tutorial"]
featured_image: /assets/images/posts/your-image.jpg
featured_image_alt: "Alt text describing the image for screen readers"
featured_image_caption: "Photo by [Author](https://example.com)"
---
```

**Front matter fields:**
- `title`: Your post title (required)
- `date`: Publication date in YYYY-MM-DD format (required)
- `description`: Short description for feeds and SEO (recommended)
- `postType`: Post type for IndieWeb (article, note, etc.)
- `tags`: Array of tags for categorization
- `featured_image`: Path to featured image (optional)
- `featured_image_alt`: Alt text for accessibility (required if using featured_image)
- `featured_image_caption`: Caption below image (optional, supports Markdown)

## Update Site Configuration

The heart of your site configuration lives in `src/_data/site.js`. Update these fields:

### Basic Site Identity
```javascript
title: "Your Site Title",
description: "Your site description",
url: "https://yourdomain.com",
language: "en"
```

### Your h-card (Author Information)
```javascript
author: {
  name: "Your Name",
  url: "https://yourdomain.com",
  photo: "/assets/images/author.jpg",
  email: "you@example.com",
  bio: "Your short bio",
  relMe: [
    "https://github.com/yourusername",
    "https://twitter.com/yourusername"
  ]
}
```

The `relMe` links are important for IndieWeb identity verification: they prove you own these profiles.

### SEO and Open Graph
```javascript
seo: {
  defaultImage: "/assets/images/og-default.png",
  twitterCard: true
}
```

Update the default OG image path to your own image.

### Footer Content
```javascript
license: {
  name: "CC BY-SA 4.0",
  url: "https://creativecommons.org/licenses/by-sa/4.0/"
},
credits: "Built by Your Name"
```

## Customize Navigation and Sidebar

### Navigation Links
Edit `src/_data/nav.js` to customize your main navigation:

```javascript
export default [
  { title: "Home", url: "/" },
  { title: "About", url: "/about/" },
  { title: "Blog", url: "/posts/" },
  { title: "Contact", url: "/contact/" }
];
```

### Sidebar Content
The sidebar (aside section) displays your about card, recent posts, blogroll, and webrings. You can customize each:

- **Blogroll**: Edit `src/_data/blogroll.js` with sites you want to link to
- **Webrings**: Edit `src/_data/webrings.js` with webrings you're part of
- **Disable sidebar**: Set `sidebar: false` in `src/_data/site.js` if you don't want it

## Replace Favicons

The starter includes a complete favicon set in `src/assets/images/favicon/`. To create your own:

### Generate Your Favicons
- **Easy option**: [favicon.io](https://favicon.io/emoji-favicons/): Generate emoji-based favicons quickly
- **In-depth option**: [RealFaviconGenerator.net](https://realfavicongenerator.net/): Generate a complete set from a single image

### Replace the Files
1. Generate your favicon set using one of the tools above
2. Replace all files in `src/assets/images/favicon/`
3. Update `site.webmanifest` if you change the manifest content

The favicon set includes:
- `favicon.ico`: Legacy browser support
- `favicon-16x16.png` and `favicon-32x32.png`: Standard sizes
- `apple-touch-icon.png`: iOS home screen icon
- `android-chrome-192x192.png` and `android-chrome-512x512.png`: Android support
- `site.webmanifest`: Web app manifest

## Update Guestbook and Comments

If you're using the guestbook or comments features, update the data files:

### Guestbook
Edit `src/_data/guestbooks.js` to link to your preferred guestbook service:

```javascript
export default [
  {
    name: "Your Guestbook",
    url: "https://yourguestbook.service"
  }
];
```

### Comments
Edit `src/_data/comments.js` to link to your preferred comment service:

```javascript
export default [
  {
    name: "Your Comments",
    url: "https://yourcomments.service"
  }
];
```

If you don't want these features, you can:
- Delete the data files
- Remove the guestbook and comments pages
- Remove the links from your navigation

## Set Up Webmentions (Optional)

Webmentions allow your site to send and receive mentions from other IndieWeb sites.

### Enable Webmentions
1. Sign up at [webmention.io](https://webmention.io) or [webmention.folk.zone](https://folk.zone)
2. Copy `.env.example` to `.env` and set `WEBMENTION_IO_TOKEN`
3. Set the same environment variable in your deployment platform (Netlify, Vercel, etc.)

### Disable Webmentions
If you don't want webmentions:
- Remove the webmention-related code from `src/_data/webmentions.js`
- Remove the webmention partial from `src/_includes/partials/`
- Remove the webmention link tag from `src/_includes/partials/head.njk`

## Update Deployment Configuration

### Netlify
Update `netlify.toml` with your site name if you want custom build settings:

```toml
[build]
  command = "npm run build"
  publish = "_site"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Actions
If you're using the included GitHub Actions workflows:
- Update `.github/workflows/deploy.yml` with your Netlify site details
- Add your secrets in GitHub repository settings:
 : `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
 : `NETLIFY_SITE_ID`: Your Netlify site ID

### Other Platforms
For Vercel, Cloudflare Pages, or GitHub Pages, update the respective configuration files or platform settings.

## Clean Up Demo-Specific Content

Check for any remaining demo-specific content:

### Update Feed Descriptions
Edit `src/feed.njk` and `src/feed.json.njk` to update the feed description with your own content.

### Check Template Comments
Review the templates in `src/_includes/` for any comments or references to the demo site that you might want to update.

### Update README
Update the README.md with your own project information if you're publishing your fork as a separate project.

## Test Your Build

After making all these changes, test your build:

```bash
npm run build
```

Then start the development server to preview:

```bash
npm start
```

Check that:
- All pages load correctly
- Navigation links work
- Your custom content appears
- No console errors
- Images and assets load properly

## Deploy Your Site

Once everything looks good locally, deploy to your chosen platform:

### Netlify
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy

### GitHub Actions
1. Push to your main branch
2. The workflow will automatically deploy to Netlify

### Other Platforms
Follow the platform's specific deployment instructions for Eleventy sites.

## Next Steps

After forking and setting up the starter:

1. **Write your first post**: Create a new markdown file in `src/posts/`
2. **Customize the design**: See [Customizing Your Site's Design](/posts/customizing-your-sites-design/) for colors, typography, and layout
3. **Set up your domain**: Point your custom domain to your deployment
4. **Enable webmentions**: If you want to participate in the IndieWeb conversation
5. **Join webrings**: Connect with other personal sites

## Summary

Forking this starter is about making it your own while keeping the solid foundation it provides. The steps are:

1. Delete demo content (posts, pages, images)
2. Update site configuration (`src/_data/site.js`)
3. Customize navigation and sidebar
4. Replace favicons
5. Update guestbook/comments or remove them
6. Set up webmentions (optional)
7. Update deployment configuration
8. Clean up any remaining demo references
9. Test and deploy

The starter is designed to be minimal and understandable, so don't be afraid to dive into the code and make it truly yours. The IndieWeb is about owning your space on the web: this starter just gives you a head start.
