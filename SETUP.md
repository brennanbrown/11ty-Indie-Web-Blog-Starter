# Quick Setup Guide

**Get your IndieWeb blog running in 5 minutes!**

## Step 1: Clone & Install

```bash
git clone https://github.com/yourusername/indieweb-blog-starter.git
cd indieweb-blog-starter
npm install
```

## Step 2: Configure Your Site

Edit `src/_data/site.json` - this is the **only file you need to edit** to get started:

```json
{
  "name": "Your Blog Name",
  "description": "Your blog description",
  "url": "https://yourdomain.com",
  "author": "Your Name",
  "email": "your@email.com",
  "bio": {
    "short": "Your one-line bio",
    "long": "A longer description about yourself and your blog"
  },
  "social": {
    "github": "yourusername",
    "mastodon": "@you@mastodon.social"
  }
}
```

## Step 3: Start Writing

```bash
npm run dev
```

Visit `http://localhost:8080` and you're ready to go!

## Step 4: Add Your First Post

Create a new file in `src/blog/` with this format:

```markdown
---
title: "My First Post"
date: 2024-01-01
tags: ["hello", "blogging"]
description: "My journey into the IndieWeb"
---

Hello world! This is my first post on my new blog.

I'm excited to own my content and join the IndieWeb community.
```

## Optional: Enable Features

### Newsletter Signup
```json
"newsletter": {
  "enabled": true,
  "provider": "buttondown",
  "action": "https://buttondown.email/api/emails/embed-subscribe/yourusername",
  "title": "Join my newsletter",
  "description": "Get updates when I publish new posts"
}
```

### Analytics (Privacy-Friendly)
```json
"analytics": {
  "enabled": true,
  "provider": "plausible"
}
```

### Webmentions
```json
"webmentions": {
  "enabled": true,
  "domain": "yourdomain.com"
}
```

## Deploy

### GitHub Pages
1. Push to GitHub
2. Enable Pages in repository settings
3. Done! Auto-deploys on every push

### Netlify
1. Connect GitHub repo
2. Build: `npm run build`
3. Publish: `_site`

That's it! You now have a fully-featured IndieWeb blog. 🎉
