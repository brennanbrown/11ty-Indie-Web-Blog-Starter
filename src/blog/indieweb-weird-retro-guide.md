---
layout: layouts/post.njk
title: IndieWeb 101 and Making Your Site Delightfully Weird
subtitle: A friendly guide for non‑technical folks
author: Blog Author
date: 2025-08-19
description: Learn the basics of the IndieWeb and easy ways to give your site a fun retro personality—no coding required.
tags: [indieweb, guide, retro]
category: reference
featuredImage: https://picsum.photos/800/400?random=12
---

Welcome! This post explains what the IndieWeb is in simple terms and shows how to add nostalgic personality (think MySpace/GeoCities) to your site—while keeping it fast and accessible.

## What is the IndieWeb?

- You own your website and posts. No algorithm. No lock‑in.
- Your site speaks a common language (microformats) so other sites can understand your posts.
- Webmentions are like cross‑site replies/likes/bookmarks.

That’s it. If you can write, you can be IndieWeb.

Resources:
- IndieWeb: Getting Started — https://indieweb.org/Getting_Started
- IndieWebify Me — https://indiewebify.me/
- Microformats on MDN — https://developer.mozilla.org/en-US/docs/Web/HTML/microformats
- Webmention.io — https://webmention.io/

## The minimal setup

1. Open `src/_data/site.json`
2. Fill in `name`, `author`, `email`, and `url`
3. Optional: enable webmentions by adding your domain in `webmentions` settings

You’re already IndieWeb‑ready—this template includes microformats and RSS by default.

## Write your first post

Create a file in `src/blog/` like this:

```md
---
layout: layouts/post.njk
title: My First IndieWeb Post
description: Why I want my own space online
date: 2025-01-01
tags: [intro]
category: announcements
---

Hello, world! This is my corner of the open web.
```

## Brand‑new to HTML/CSS? Tiny 5‑minute primer

You’ll mostly write in Markdown (simple text). But sometimes you’ll paste tiny bits of HTML/CSS.

HTML is just structure:

```html
<h2>A heading</h2>
<p>A short paragraph with a <a href="https://example.com">link</a>.</p>
```

CSS is just style. If you add this to `src/assets/css/tailwind.css`:

```css
.note { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 0.75rem 1rem; }
```

…then you can use it inside a post like this:

```md
<div class="note">This is a highlighted note for readers.</div>
```

Resources:
- Markdown basics — https://www.markdownguide.org/basic-syntax/
- Learn HTML (MDN) — https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content
- Learn CSS (MDN) — https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics

## Make it weird (in a good way)

You don’t need to code to add personality:

- Use emoji and playful headings
- Add a “Guestbook” page and show webmentions
- Use the built‑in Style Guide page at `/style/` for components to copy
- Turn on system fonts in the A11y menu for a “raw” web feel

### Copy‑paste ideas

- Add a marquee banner to any page:

```html
<div role="marquee" aria-label="Scrolling message" class="overflow-hidden whitespace-nowrap py-2">
  <div class="inline-block animate-[marquee_18s_linear_infinite]">
    🌟 Welcome to my corner of the open web • Built with care • Be kind online 🌟
  </div>
</div>
```

- If you want the keyframes, add this to `src/assets/css/tailwind.css`:

```css
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
```

- Add a retro background on a page:

```html
<div class="retro-bg">
  <!-- your content here -->
</div>
```

And in `tailwind.css`:

```css
.retro-bg {
  background-image: url('/assets/retro-stars.png');
  background-size: cover;
  background-attachment: fixed;
}
```

## Add badges (fun little labels)

Badges are tiny images that show info (like “RSS” or “Built with Eleventy”). You can add them to pages or your README.

- Make your own at Shields.io: https://shields.io/
- Browse lots of examples: https://ileriayo.github.io/markdown-badges/

Resources:
- Shields.io — https://shields.io/
- Markdown Badges list — https://ileriayo.github.io/markdown-badges/

Add a badge in Markdown:

```md
[![RSS](https://img.shields.io/badge/RSS-Subscribe-orange?style=for-the-badge)](/feed.xml)
```

Add a badge in HTML:

```html
<a href="/feed.xml">
  <img alt="RSS" src="https://img.shields.io/badge/RSS-Subscribe-orange?style=for-the-badge" />
</a>
```

### Classic 88×31 buttons (old‑school GIF badges)

Want that nostalgic 90s/00s feel? Add tiny 88×31 pixel buttons.

- Big gallery: https://cyber.dabamos.de/88x31/

How to add:

1) Save button images to `src/assets/buttons/` (create the folder).

2) Paste this where you want them (page or footer template):

```html
<div class="badges">
  <a href="/" title="Home">
    <img src="/assets/buttons/my-site.gif" width="88" height="31" loading="lazy" alt="My Site" />
  </a>
  <a href="/feed.xml" title="RSS">
    <img src="/assets/buttons/rss.gif" width="88" height="31" loading="lazy" alt="RSS Feed" />
  </a>
  <!-- add more here -->
  </div>
```

Optional CSS (in `src/assets/css/tailwind.css`) for tidy layout and crisp pixels:

```css
.badges { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.badges img { image-rendering: pixelated; }
```

Tips: host images locally, add good `alt` text, and include `width`/`height` for stable layout.

More 88×31 resources:
- Gallery: https://cyber.dabamos.de/88x31/
- Button maker: https://websetsbylynn.neocities.org/88x31-button-maker/
- Curated collections: https://anlucas.neocities.org/88x31Buttons

## Join a Webring (share visitors with friendly sites)

Webrings connect sites in a circle with simple “Previous/Next” links.

Popular option:
- XXIIVV Webring: https://webring.xxiivv.com/

How to join (high level):
1) Open a pull request to add your site: https://github.com/XXIIVV/webring
2) Pick an ID (often your domain without dots). Use it below.
3) Add the links on your site (footer is common).

Copy/paste HTML (replace `your-id`):

```html
<nav aria-label="Webring navigation" class="webring">
  <a href="https://webring.xxiivv.com/prev/your-id" rel="nofollow" title="Previous site">← Prev</a>
  <a href="https://webring.xxiivv.com/#your-id" rel="nofollow" title="Webring hub">
    <img src="https://webring.xxiivv.com/icon.black.svg" alt="XXIIVV Webring" width="24" height="24" />
  </a>
  <a href="https://webring.xxiivv.com/next/your-id" rel="nofollow" title="Next site">Next →</a>
</nav>
```

Optional CSS (in `src/assets/css/tailwind.css`):

```css
.webring { display: inline-flex; gap: 12px; align-items: center; }
.webring a { text-decoration: none; }
```

Resources:
- XXIIVV Webring — https://webring.xxiivv.com/
- Join via GitHub — https://github.com/XXIIVV/webring

## Keep it accessible

- Ensure contrast is sufficient (try dark mode and the Contrast toggle in A11y)
- Respect “Reduce Motion” preferences (this template provides a toggle)
- Use headings in order (H1 → H2 → H3)

Accessibility resources:
- W3C WAI Accessibility Fundamentals — https://www.w3.org/WAI/fundamentals/
- WAI Tutorials — https://www.w3.org/WAI/tutorials/

## Where to go next

- Read the non‑technical project guide: `GUIDE.md` in the project root
- Add a Blogroll at `/blogroll/` to share sites you like
- Explore categories at `/categories/` and tags at `/tags/`

Have fun. The web needs more personal, quirky, welcoming spaces.
