---
title: "Customizing Your Site's Design"
date: 2026-08-12
description: "An in-depth guide to customizing the IndieWeb 11ty Starter's design, from colour palettes and typography to layout and animations."
postType: article
tags: ["11ty", "css", "design", "tutorial"]
---

The IndieWeb 11ty Starter uses a minimal design with chota.css as the base framework. This guide shows you how to transform that minimal foundation into a design that's uniquely yours.

For the basic setup steps (deleting demo content, updating configuration, deployment), see [A Guide to Forking this Starter](/posts/forking-the-starter/).

## Colour Palette via `site.js`

The IndieWeb 11ty Starter now centralizes all design tokens in `src/_data/site.js`. This is the single source of truth for your site's appearance - edit the `theme` section to customise colours:

```javascript
theme: {
  light: {
    bg: "#ffffff",
    bgSecondary: "#f4f4f5",
    font: "#18181b",
    primary: "#3563e9",
    lightGrey: "#e4e4e7",
    grey: "#a1a1aa",
    darkGrey: "#52525b",
    error: "#dc2626",
    success: "#16a34a",
    linkVisited: "#7c5cbf",
    linkHover: "#1d4ed8"
  },
  dark: {
    bg: "#18181b",
    bgSecondary: "#27272a",
    font: "#f4f4f5",
    primary: "#6d8cf0",
    lightGrey: "#3f3f46",
    grey: "#52525b",
    darkGrey: "#a1a1aa",
    error: "#f87171",
    success: "#4ade80",
    linkVisited: "#a68df0",
    linkHover: "#93b4ff"
  }
}
```

The CSS file `src/assets/css/01-variables.css.njk` is a Nunjucks template that automatically references these values. When you build the site, Eleventy processes the template and generates the final CSS with your colours from `site.js`.

### Colour Palette Ideas

- **Warm & cozy**: Earth tones (browns, oranges, creams)
- **Cool & minimal**: Blues, grays, whites
- **Bold & vibrant**: Bright primaries with high contrast
- **Dark mode**: Dark backgrounds with light text
- **Pastel**: Soft, muted colours for a gentle feel
- **Monochrome**: Single colour with varying shades

### Tools for Generating Palettes

- [Coolors.co](https://coolors.co/) - Quick palette generation
- [Adobe Color](https://color.adobe.com/) - Professional color tools
- [Color Hunt](https://colorhunt.co/) - Community-curated palettes

## Typography

The starter uses system font stacks by default for performance. You can customize fonts while keeping the performance benefits.

### Keep System Fonts (Recommended)

Update the font stacks in `src/_data/site.js`:

```javascript
fonts: {
  body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
  heading: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
  monospace: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace"
}
```

### Add Google Fonts

If you want specific fonts, here's how to add them:

#### 1. Add the Google Fonts Link

Add this to `src/_includes/partials/head.njk`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
```

#### 2. Update Site Configuration

Update `src/_data/site.js`:

```javascript
fonts: {
  body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  heading: '"Merriweather", Georgia, serif',
  monospace: '"JetBrains Mono", "Fira Code", ui-monospace, monospace'
}
```

The CSS will automatically pick up these changes on the next build.

### Font Pairing Ideas

- **Modern clean**: Inter + Space Grotesk + JetBrains Mono
- **Classic editorial**: Merriweather + Open Sans + Fira Code
- **Tech minimal**: Inter + JetBrains Mono + JetBrains Mono
- **Playful**: Poppins + Nunito + Fira Code
- **Elegant**: Playfair Display + Lato + IBM Plex Mono

## Visual Interest & Layout

Make your site stand out with these design elements.

### Hero Section

Customize your homepage hero in `src/index.njk` or create a custom hero component:

```html
<header class="hero">
  <h1 class="hero-title">Welcome to My Site</h1>
  <p class="hero-subtitle">A personal space on the web</p>
  <div class="hero-actions">
    <a href="/posts/" class="button">Read Posts</a>
    <a href="/about/" class="button button-outline">About Me</a>
  </div>
</header>
```

Add hero styling in `src/assets/css/13-hero.css`:

```css
.hero {
  padding: 4rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}
```

### Card Styles

Enhance post cards with custom shadows, borders, or hover effects:

```css
.post-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
```

### Custom Borders & Dividers

Add personality with custom border styles:

```css
/* Dashed borders for a playful look */
.decorative-border {
  border: 2px dashed var(--color-accent);
  border-radius: 12px;
}

/* Gradient borders */
.gradient-border {
  border: 2px solid;
  border-image: linear-gradient(45deg, var(--color-primary), var(--color-accent)) 1;
}

/* Custom dividers */
hr.custom-divider {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  margin: 3rem 0;
}
```

### Background Patterns

Add subtle patterns or textures:

```css
body {
  background-color: var(--color-bg);
  background-image: radial-gradient(var(--color-border-light) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Or a gradient background */
body {
  background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-alt) 100%);
}
```

### Button Styles

Create distinctive buttons:

```css
.button {
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s;
}

.button:hover {
  background: var(--color-link-hover);
  transform: translateY(-2px);
}

.button-outline {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

.button-outline:hover {
  background: var(--color-primary);
  color: white;
}
```

## Layout Customization

### Container Width

Adjust the max-width in your CSS:

```css
.container {
  max-width: 1200px; /* Wider layout */
  margin: 0 auto;
  padding: 0 1rem;
}
```

### Sidebar Position

Move the sidebar from right to left in `src/_includes/layouts/base.njk`:

```html
<div class="layout">
  <aside class="sidebar">{{ sidebar }}</aside>
  <main class="content">{{ content }}</main>
</div>
```

```css
.layout {
  display: grid;
  grid-template-columns: 300px 1fr; /* Sidebar on left */
  gap: 2rem;
}
```

### Post Layout

Experiment with different post layouts:

```css
/* Full-width featured images */
.post-featured-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 2rem;
}

/* Two-column layout for post lists */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

## Dark Mode Enhancements

The starter includes basic dark mode support. Customise dark mode colours in the `theme.dark` section of `src/_data/site.js`:

```javascript
theme: {
  dark: {
    bg: "#1a1a1a",
    bgSecondary: "#2d2d2d",
    font: "#e0e0e0",
    primary: "#6d8cf0",
    // ... more colors
  }
}
```

For custom dark mode CSS beyond the colour palette (like the hero background example), you can still add styles in `src/assets/css/01-variables.css.njk` within the `@media (prefers-color-scheme: dark)` block.

## Animation & Micro-interactions

Add animations for polish:

```css
/* Smooth fade-in for content */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.post-card {
  animation: fadeIn 0.5s ease-out;
}

/* Link hover effects */
a {
  position: relative;
  text-decoration: none;
}

a::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -2px;
  left: 0;
  background: var(--color-primary);
  transform: scaleX(0);
  transition: transform 0.2s;
}

a:hover::after {
  transform: scaleX(1);
}
```

## Design Inspiration

Looking for design ideas? Check out these resources:

- **[Brutalist Websites](https://brutalistwebsites.com/)** - Bold, unconventional designs
- **[Awwwards](https://www.awwwards.com/)** - Award-winning web design
- **[SiteInspire](https://www.siteinspire.com/)** - Web design inspiration
- **[Dribbble](https://dribbble.com/)** - UI/UX design inspiration
- **[IndieWeb examples](https://indieweb.org/Examples)** - Real IndieWeb sites

## The Iterative Approach

The key to good design is iteration:

1. **Start simple**: Change one thing at a time
2. **Test frequently**: Check how changes look across pages
3. **Get feedback**: Ask others what they think
4. **Refine gradually**: Polish your design over time

Don't try to do everything at once. Pick one area (colours, typography, layout) and master it before moving to the next.

## Summary

Customizing your site's design is about making it feel like yours while keeping the solid foundation the starter provides. The main areas to focus on:

1. **Colour palette**: Define your brand through CSS variables
2. **Typography**: Choose fonts that reflect your style
3. **Visual elements**: Add personality with cards, borders, and patterns
4. **Layout**: Adjust spacing and positioning to suit your content
5. **Dark mode**: Ensure your design works in both light and dark
6. **Micro-interactions**: Add subtle animations for polish

The starter is designed to be minimal and understandable, so don't be afraid to dive into the CSS and make it truly yours. The IndieWeb is about owning your space on the web: your design should reflect that.
