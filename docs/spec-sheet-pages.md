# JAMstack Blog Pages Spec: IndieWeb Blog Template

## Introduction

This document provides example page specifications for an IndieWeb-friendly JAMstack blog template. Replace example content with your own.

## Pages

- /about: Author journey, philosophy, interests (use h-card microformats where applicable)
- /uses: Tools, software, hardware
- /now: Current focus and activities
- /blog: Main feed (paginated)
  - /archive: Chronological archive
  - /tags and /categories: Index + per-tag/category archives
- /blogroll: Curated links to other sites
  - /notes: Short notes collection
  - /journal: Longer-form or personal entries
  - /poetry: Poems/verse formatting
- /portfolio (optional): Showcase professional projects/services
  - /projects: Open-source or personal projects
  - resume: PDF or HTML version
- /contact: Contact details or form (use Netlify Forms/Formspree if needed)
- /donate: Support options
- /accessibility: Accessibility statement and features
- /style: Typography, components, and color palette (living style guide)
- /type: Typefaces and usage
- /links: Interesting links list
- /bookshelf (optional): Reading list and reviews

## Header / Post Template Elements

- NAV: Include global navigation
- Featured Image: Conditional display per post
- Breadcrumbs: Generated via shortcodes/filters
- Title & Subtitle: Prominent hierarchy
- Metadata: Author, date, reading time, tags (h-entry microformats)
- Content: Markdown rendered to HTML with `prose` classes
- Author/DONATE: Optional author card and support CTA
- Newsletter: Optional embed or link
- Related Posts: Based on tags/categories
- FOOTER: Global footer inclusion

## Footer Ideas

- Eleventy badge, style guide link, license, “Edit this page” link
- Toggles: CSS theme, font, reduce motion
- Optional Lighthouse link
- Copyright: “© YEAR Your Name”

## Implementation Notes

- Use Eleventy collections for posts, notes, projects, etc.
- Provide shortcodes/filters for reading time, breadcrumbs, and image optimization.
- Ensure color contrast for tag badges and links.
- Add microformats2: h-entry, h-card, h-feed.
