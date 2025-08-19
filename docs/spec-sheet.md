# JAMstack Blog Specification Sheet: IndieWeb Blog Template

## Introduction

This document outlines the technical specifications for an IndieWeb-friendly JAMstack blog template. It uses Eleventy, emphasizes accessibility, and aims for a clean, focused experience. It is intended as a reusable template that others can easily customize.

## Core Technologies & Principles

- Static Site Generator: Eleventy (11ty)
- Styling: Tailwind CSS (+ small custom CSS)
- Version Control: Git & GitHub
- Deployment: GitHub Pages or Netlify
- IndieWeb Principles: microformats2, Webmentions, POSSE
- Accessibility: WCAG 2.1 AA mindset
- Optional AI Assistance: use for boilerplate, content structuring, and a11y feedback

## Global Site Elements (ETC)

- Background & Layout: off-white background, centered content, `max-w-3xl/4xl` for readability
- Scroll Progress Bar: lightweight JS updating a top progress bar
- Easter Eggs: optional small interactive surprises

## Header

- Search Bar: client-side search with Lunr.js/FlexSearch
- Analytics (optional): privacy-friendly (Plausible/Fathom)
- Comments via Webmentions: Webmention.io integration
- Accessibility Options: font size, contrast, reduce motion (persist with localStorage)
- Dark Mode Toggle: `dark` class on `<html>`, respect `prefers-color-scheme`
- Pagination: Eleventy pagination for lists
- Logo: simple text/SVG with alt text

### Navigation

- Highlight the active page using `page.url` or `eleventyNavigation`

## Main Page

- “Where to find me” section (icons + links) using semantic HTML

## Blog

- Reading Time: shortcode/filter based on word count
- Uniquely-colored Tags: tag-to-color mapping; ensure contrast
- Categories: separate Eleventy collection and archive pages
- Subtitle / By-line: front matter `subtitle`, `author`
- Featured Image: front matter `featuredImage` + responsive images
- Share Links: lightweight, no heavy JS
- Related Posts (3): based on tags/categories

## IndieWeb Integration & Microformats2

- Webmentions: add webmention/pingback links to `<head>`; render mentions
- Microformats2:
  - h-entry for posts: `p-name`, `p-author` (h-card), `dt-published`, `e-content`, `u-url`, `p-category`
  - h-card for author/about page: `u-photo`, `p-name`, `p-note`, `u-url`, etc.
  - h-feed for blog feed/archive

## Pages (Examples)

- /about, /uses, /now, /blogroll, /archive, /tags, /categories
- /style (style guide), /type
- /contact, /donate, /accessibility
- Optional: /portfolio, /projects, /bookshelf

## Footer

- Column ideas: Eleventy badge, style guide, license, “Edit this page”
- Accessibility toggles, optional Lighthouse link
- Copyright: “© YEAR Template Author” (replace with your details)

## Implementation Notes for AI Assistance

- Boilerplate generation for layouts/components
- Tailwind utility suggestions
- Shortcodes/filters (reading time, images, breadcrumbs)
- A11y audit suggestions
- Microformats2 markup checks
