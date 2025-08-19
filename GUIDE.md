# IndieWeb Blog Starter – Guide for Non‑Technical Creators

This guide helps you publish quickly, understand the IndieWeb, and customize your site’s vibe (including fun retro touches) without needing to be a developer.

---

## 1) What this is

- Your own blog you control. No algorithm, no lock‑in.
- Write posts in plain text (Markdown).
- Deploy to the open web with one click.

If you can edit a text file, you can publish.

---

## 2) The absolute minimum to publish

1. Open `src/_data/site.json` and change:
   - `name`, `author`, `email`, `url`
2. Start the site locally:
   ```bash
   npm install
   npm run dev
   ```
3. Write your first post:
   - Duplicate any file in `src/blog/` and edit the front matter at the top:
     ```yaml
     ---
     layout: layouts/post.njk
     title: My First Post
     description: What this site is about
     date: 2025-01-01
     tags: [intro]
     category: announcements
     ---
     ```
   - Then write your content below the `---` line in normal text.
4. Deploy (when ready):
   ```bash
   npm run build
   ```
   Upload the `_site/` folder to your host or use Netlify.

---

## 3) Absolute beginner: tiny HTML/CSS primer (10 minutes)

You’ll see two kinds of files:

- `.md` (Markdown): easy writing format. `**bold**`, `*italic*`, links like `[text](https://example.com)`.
- `.njk` (templates): page shells you rarely need to touch.

Tiny HTML you might copy/paste:

```html
<h2>My heading</h2>
<p>One short paragraph. <a href="https://example.com">A link</a>.</p>
```

Tiny CSS you might copy/paste (in `src/assets/css/tailwind.css`):

```css
.note {
  background: #fffbeb; /* soft yellow */
  border-left: 4px solid #f59e0b; /* amber */
  padding: 0.75rem 1rem;
}
```

Then use it in Markdown by adding raw HTML:

```md
<div class="note">This is a friendly callout box.</div>
```

You don’t need to learn everything. Copy, paste, tweak one thing at a time.

Resources:
- Markdown basics: https://www.markdownguide.org/basic-syntax/
- Learn HTML (MDN): https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content
- Learn CSS (MDN): https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics

---

## 4) The IndieWeb in plain language

- IndieWeb is a people‑first approach to publishing.
- You own your domain and content.
- Your site speaks “microformats” so other sites can understand posts.
- Webmentions let other sites reply/like/bookmark your posts—across the web.

Minimum IndieWeb setup:
- Set `site.url` in `src/_data/site.json` (your domain).
- Optional webmentions: create an account on webmention.io and add to `site.json`:
  ```json
  "webmentions": { "enabled": true, "domain": "yourdomain.com" }
  ```
- Your posts already include h‑entry microformats. Nothing else to do.

Resources:
- IndieWeb: Getting Started — https://indieweb.org/Getting_Started
- IndieWebify Me — https://indiewebify.me/
- Microformats h-entry — http://microformats.org/wiki/h-entry
- Microformats h-card — https://microformats.org/wiki/h-card
- Microformats on MDN — https://developer.mozilla.org/en-US/docs/Web/HTML/microformats
- Webmention.io — https://webmention.io/

---

## 5) Make it yours (without coding)

- Edit `src/_data/site.json` – this single file controls:
  - Name, bio, social links, analytics (optional), newsletter (optional)
- Edit colors and fonts:
  - Use the “A11y” menu in the header: Dark mode, font size, contrast, system/web fonts
- Change the homepage text in `src/index.njk` (search for the hero section)
- Add pages by duplicating a file in `src/` (e.g., `about.njk`) and editing the text

Resources:
- Eleventy docs — https://www.11ty.dev/docs/
- Tailwind CSS docs — https://tailwindcss.com/docs

---

## 6) Tags, categories, and search

- Add tags: `tags: [thoughts, notes]` → your post appears on `/tags/thoughts/` automatically.
- Add one category: `category: tutorials` → shows up on `/categories/tutorials/` and the index `/categories/`.
- Search is automatic—no setup required.

Resources:
- Eleventy collections (tags) — https://www.11ty.dev/docs/collections/

---

## 7) Add badges (fun little labels)

Badges are tiny images that show info (e.g., “Built with Eleventy”, “RSS”). They work anywhere you can put an image/link.

Where to find badges:
- Shields.io badge builder: https://shields.io/
- Big list of ready‑made Markdown badges: https://ileriayo.github.io/markdown-badges/

Add a badge to `README.md` (Markdown):

```md
[![RSS](https://img.shields.io/badge/RSS-Subscribe-orange?style=for-the-badge)](./_site/feed.xml)
```

Add a badge to a page (HTML):

```html
<a href="/feed.xml">
  <img alt="RSS" src="https://img.shields.io/badge/RSS-Subscribe-orange?style=for-the-badge" />
</a>
```

Tip: Change the text and color directly in the Shields.io URL.

Resources:
- Shields.io — https://shields.io/
- Markdown Badges list — https://ileriayo.github.io/markdown-badges/

---

## 8) Make it “weird” (retro fun, MySpace/GeoCities vibe)

No code required for these simple tweaks:

- Emoji and ASCII art: add personality to headings and dividers.
- Use the Style Guide page at `/style/` for color ideas and components you can copy.
- Add playful copy and sections (e.g., a “Guestbook” page using a webmention list).

Low‑code ideas (copy/paste):

- Custom background image: open `src/assets/css/tailwind.css` and add:
  ```css
  .retro-bg {
    background-image: url('/assets/retro-stars.png');
    background-size: cover;
    background-attachment: fixed;
  }
  ```
  Then wrap your content in a div with `class="retro-bg"` in `src/_includes/layouts/base.njk` or any page.

- Animated marquee (accessible flavor):
  ```html
  <div role="marquee" aria-label="Scrolling message" class="overflow-hidden whitespace-nowrap py-2">
    <div class="inline-block animate-[marquee_18s_linear_infinite]">
      🌟 Welcome to my corner of the open web • Built with love • Be kind on the internet 🌟
    </div>
  </div>
  ```
  And in `tailwind.css` add a keyframes block:
  ```css
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  ```

- Pixel/retro font just for headings:
  - Add a free font file to `src/assets/` and include via CSS, or use the System Fonts toggle for a simpler look.

### Classic 88×31 buttons (old‑school GIF badges)

These tiny 88×31 pixel buttons were everywhere in the 1990s/2000s. They’re a fun way to show your vibe.

- Big gallery: https://cyber.dabamos.de/88x31/

How to add them (simple):

1) Put button images in `src/assets/buttons/` (create the folder).

2) Add this HTML where you want them to appear (e.g., in a page or the footer template `src/_includes/layouts/base.njk`):

```html
<div class="badges">
  <a href="/" title="Home">
    <img src="/assets/buttons/my-site.gif" width="88" height="31" loading="lazy" alt="My Site" />
  </a>
  <a href="/feed.xml" title="RSS">
    <img src="/assets/buttons/rss.gif" width="88" height="31" loading="lazy" alt="RSS Feed" />
  </a>
</div>
```

3) Optional CSS for neat layout and crisp pixels (add to `src/assets/css/tailwind.css`):

```css
.badges { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.badges img { image-rendering: pixelated; }
```

Tips:
- Prefer hosting locally (`/assets/buttons/...`) so the images don’t disappear.
- Always include `alt` text and `width/height` for accessibility and layout stability.
- Use `loading="lazy"` so they don’t slow the page.

More 88×31 resources:
- Gallery: https://cyber.dabamos.de/88x31/
- Button maker: https://websetsbylynn.neocities.org/88x31-button-maker/
- Curated collections: https://anlucas.neocities.org/88x31Buttons

### Join a Webring (share visitors with friendly sites)

Webrings connect sites in a circle with simple “Previous/Next” links.

Popular option:
- XXIIVV Webring: https://webring.xxiivv.com/ (rules + join instructions in the repo)

How to join (high level):
1) Make a pull request to add your site to the webring list: https://github.com/XXIIVV/webring
2) Choose an ID (often your domain without dots). You’ll use it in the links below.
3) Add the webring links to your footer or a page.

Copy/paste HTML (replace `your-id` with your chosen ID):

```html
<nav aria-label="Webring navigation" class="webring">
  <a href="https://webring.xxiivv.com/prev/your-id" rel="nofollow" title="Previous site">← Prev</a>
  <a href="https://webring.xxiivv.com/#your-id" rel="nofollow" title="Webring hub">
    <img src="https://webring.xxiivv.com/icon.black.svg" alt="XXIIVV Webring" width="24" height="24" />
  </a>
  <a href="https://webring.xxiivv.com/next/your-id" rel="nofollow" title="Next site">Next →</a>
  </nav>
```

Optional CSS (add to `src/assets/css/tailwind.css`):

```css
.webring { display: inline-flex; gap: 12px; align-items: center; }
.webring a { text-decoration: none; }
```

Notes:
- Keep the links visible so visitors can actually use the ring.
- Use `rel="nofollow"` if you prefer; some rings recommend it.
- If you leave the ring later, simply remove the links.

Resources:
- XXIIVV Webring — https://webring.xxiivv.com/
- Join via GitHub — https://github.com/XXIIVV/webring

Keep it accessible:
- Ensure sufficient color contrast.
- Don’t rely only on color to convey meaning.
- Prefer CSS animations that respect “reduce motion”.

Accessibility resources:
- W3C WAI Accessibility Fundamentals — https://www.w3.org/WAI/fundamentals/
- WAI Tutorials — https://www.w3.org/WAI/tutorials/

---

## 9) Common questions

- Where do images go? Put files in `src/assets/` and reference with `/assets/...` URLs.
- Can I change the menu? Edit `src/_includes/layouts/base.njk` and update the nav links.
- How do I add social links? Edit `social` in `src/_data/site.json`.

---

## 10) Next steps

- Write a welcome post: why your site exists and what you’ll write about.
- Add a “Blogroll” (`src/blogroll.njk`) – link to sites you enjoy.
- Explore the Categories page at `/categories/` and tag pages at `/tags/`.

You’ve got this. The web needs more personal, weird, welcoming spaces.
