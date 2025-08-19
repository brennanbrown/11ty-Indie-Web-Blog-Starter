---
layout: layouts/post.njk
title: Building the IndieWeb Blog Template — A Technical Postmortem
subtitle: What broke, how we fixed it, and advice for Eleventy devs
author: Your Name
date: 2025-08-19
description: A deep-dive into making a production-ready Eleventy blog template with robust E2E tests, accessibility, and clean UI patterns.
tags: [eleventy, testing, accessibility, indieWeb, jamstack]
category: engineering
image: /screenshot.png
featuredImage: /screenshot.png
---

This post documents the technical journey of turning a clean Eleventy starter into a robust, reusable blog template with end‑to‑end tests. It highlights where things broke, how they were fixed, and practical advice for building resilient 11ty sites.

## Scope & Goals

- **Template-first mindset**: Remove personal identifiers; make customization predictable via `src/_data/site.json`.
- **Stable E2E tests**: Use Playwright for cross-browser checks (desktop + mobile).
- **A11y & UX**: Keyboard navigation, skip links, and predictable focus order.
- **SEO previews**: Open Graph and Twitter cards with a sensible default image.
- **Deployment**: One-click deploy and repeatable builds.

---

## Where We Got Stuck (and Fixes)

### 1) Mobile navigation visibility
- **Symptom**: Mobile tests couldn’t find nav links; menu was hidden by default.
- **Root cause**: `#primary-nav` started with a `hidden` class in `src/_includes/layouts/base.njk`.
- **Fix**: Remove `hidden` and ensure it renders as `block` on mobile. This made selectors stable and avoided strict-mode conflicts.

### 2) Desktop width constraints
- **Symptom**: Layout width expectations failed on large screens.
- **Root cause**: Header/nav containers lacked a max width.
- **Fix**: Constrain to `max-w-4xl` on containers in `base.njk` to achieve consistent line-length and pass tests.

### 3) Overlapping controls and click interception
- **Symptom**: Dark mode toggle and search were intermittently unclickable (intercepted by surrounding containers), especially on mobile.
- **Root cause**: Header controls + search placement caused overlap in certain viewports.
- **Fix**: Move the search form into the nav area and relocate the dark mode toggle to avoid pointer interception. This also simplified focus order.

### 4) Keyboard navigation focus order
- **Symptom**: Tests expected the first nav link to be focused after two Tabs (after the skip link), but the brand/link or utility controls received focus first.
- **Root cause**: Natural DOM/tab order favored brand and header utilities.
- **Fixes**:
  - Make the brand link non-focusable (`tabindex="-1"`).
  - Provide a visible-on-focus skip link and a focus target on `<main id="main-content" tabindex="-1">`.
  - Keep utility controls out of the tab order and move the dark toggle into the nav block.

### 5) Ambiguous selectors in tests
- **Symptom**: Playwright strict-mode violations due to multiple `.grid` matches.
- **Root cause**: Test targeted a generic selector expected to be unique.
- **Fix** (tests): Narrow the selection via `.first()` in `tests/e2e/responsive.spec.js`.

### 6) BrowserSync websocket error noise
- **Symptom**: Repeated `Invalid WebSocket frame: RSV1 must be clear` messages in logs.
- **Root cause**: BrowserSync/WS interaction; not a functional site bug.
- **Fix**: Treat as low priority; continue tests. Consider disabling live reload in CI for noise reduction.

### 7) SEO preview cards
- **Need**: Reliable previews for social sharing without per-page boilerplate.
- **Solution**: In `src/_includes/layouts/base.njk`, add OG + Twitter tags.
  - Canonical URL from `site.url` + `page.url`.
  - `og:title`, `og:description` from page or site.
  - Image resolution logic supports a page `image` front matter or defaults to `/screenshot.png`.

---

## Advice for Eleventy Developers

- **Start with testable markup**
  - Favor stable IDs or scoped selectors where appropriate.
  - Avoid hiding critical nav by default on smallest breakpoints unless you test toggles explicitly.

- **Design keyboard flows early**
  - Add a skip link at the top: `"Skip to content"`.
  - Make the main region focusable: `<main id="main-content" tabindex="-1">`.
  - Ensure the first actionable element is predictable after the skip link.

- **Prevent click interception**
  - Test on mobile widths; watch for absolutely-positioned wrappers intercepting clicks.
  - Keep interactive controls in their own container and verify with Playwright’s pointer-interception errors.

- **Keep selectors resilient**
  - Strict mode in Playwright is great—use `.first()` or more specific locators when multiple matches are expected.
  - Prefer role-based queries where possible.

- **Centralize configuration**
  - Put owner, URLs, and social accounts in `src/_data/site.json`.
  - In templates, always fall back to site-level defaults.

- **Ship good previews with defaults**
  - Add OG/Twitter tags once in your base layout.
  - Provide a default image (e.g., `/screenshot.png`) and allow per-page overrides via `image` front matter.

- **Treat noisy dev tooling errors pragmatically**
  - If live-reload tooling logs errors but the site works and tests pass, deprioritize for launch; circle back later.

- **Automate deployments**
  - Keep builds deterministic. Verify the live site’s meta tags with official validators after deploy.

---

## Files Touched (Highlights)

- `src/_includes/layouts/base.njk` — nav visibility, width constraints, skip link, main focus, search placement, dark toggle relocation, SEO meta.
- `tests/e2e/responsive.spec.js` — more specific locator to pass strict mode.
- `README.md` — preview image at the top for quick visual context.
- `src/_data/site.json` — centralized site info used for meta tags.

---

## What I’d Do Next

- Reduce test flakiness with explicit focus waits where necessary.
- Optionally disable BrowserSync websocket during test runs.
- Add Lighthouse CI and HTML validation in CI for ongoing quality.

If you’re building with Eleventy: design for testability, keep accessibility first, and default your SEO. The rest becomes much easier to maintain.
