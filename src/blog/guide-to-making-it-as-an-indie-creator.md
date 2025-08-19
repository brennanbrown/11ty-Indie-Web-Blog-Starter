---
layout: layouts/post.njk
permalink: "/blog/guide-to-making-it-as-an-indie-creator/"
title: "Guide to Making It as an Indie Creator"
date: 2025-08-19
description: Practical steps to grow your audience, accept support, and keep your workflow simple using this IndieWeb blog starter.
tags: [guide, indieweb, meta]
category: reference
featuredImage: /assets/og-default.png
---

Sustainable indie creation = consistent publishing + simple systems for connection and support. This guide shows how to ship regularly, invite readers into your world, and make it easy for fans to support you—using what's already in this starter.

## 1) Newsletter (Audience you own)

Email is your most durable channel. This template renders a signup block on posts when `site.newsletter.enabled` is true.

- Edit `src/_data/site.json`:

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

- The subscribe form uses the `action` URL you provide and is rendered by `src/_includes/layouts/post.njk`.
- Swap the `action` with your provider (Buttondown, ConvertKit, Beehiiv, etc.). Any POST endpoint works.

Pro tips:
- Keep the form minimal (email only). Friction kills signups.
- Tease benefits near the form: cadence, topics, exclusives.

## 2) Contact form (Conversation at the edges)

The `Contact` page (`src/contact.njk`) ships with a simple form and a note to configure it with a provider:

- Quickest path: Netlify Forms (no backend needed). In Netlify site settings you can enable form detection, or use attributes like:

```html
<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact">
  <!-- name/email/message fields -->
</form>
```

- Alternatives: Formspree, Basin, Getform, or your own serverless function.
- Always send a confirmation page or toast. People like feedback.

## 3) Donations & Sponsorships (Fuel the work)

Configure three common options in `src/_data/site.json` under `donate`. The template renders buttons on `/donate/` and links from posts.

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

- Ko‑fi: one‑time support at `https://ko-fi.com/<name>`
- Buy Me a Coffee: one‑time or membership at `https://buymeacoffee.com/<name>`
- GitHub Sponsors: recurring sponsorships at `https://github.com/sponsors/<name>`

Tips:
- Link to `/donate/` in your post footers (already present) and About page.
- Share what support unlocks (hosting costs, time to write, etc.).

## 4) Social proof without platforms owning you

- Webmentions are supported; show responses under posts.
- RSS feed is built-in; add an RSS badge where relevant.
- Keep your identity page (`/about`) tight: photo, short bio, links.

## 5) Ship cadence and workflow

- Draft fast, publish small. You can always update posts later.
- Maintain an ideas list in your repo or notes app.
- Use the built-in tags and archive pages for curation.

## Checklists

Newsletter
- [ ] Set `newsletter.enabled` to true
- [ ] Add provider `action` URL
- [ ] Update title/description copy

Contact Form
- [ ] Choose backend (Netlify Forms, Formspree, etc.)
- [ ] Add provider-specific attributes/action
- [ ] Add a confirmation UX (message or page)

Donations
- [ ] Enable `donate.enabled`
- [ ] Fill in `kofi`, `buymeacoffee`, `github`
- [ ] Personalize the message

You now have the core levers to grow an audience you own, hear from readers, and get support—all while keeping your stack simple and independent.
