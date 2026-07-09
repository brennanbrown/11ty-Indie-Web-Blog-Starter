---
title: "Transitioning from CMS and SSI to Static Sites"
date: 2026-03-02
description: "A guide for experienced developers moving from WordPress, SSIs, and rsync to static site generators like Eleventy."
postType: article
tags: ["transition", "static-sites", "eleventy", "tutorial"]
featured_image: /assets/images/posts/computer-lab.jpg
featured_image_alt: "Vintage computer lab with rows of CRT monitors and terminals, showing the early days of computing education and work environments."
---

If you're coming from a CMS like WordPress, or you've been handcoding sites with SSIs and deploying with rsync, static site generators represent a different approach. It's not just a different tool—it's a different philosophy.

## The WordPress Mindset

WordPress is a dynamic CMS: PHP, MySQL, admin interface, plugins, themes. You log into a dashboard, write in a WYSIWYG editor, install plugins for every feature, and everything happens at runtime. It's comfortable, familiar, and powerful.

But it comes with baggage: plugin updates, security patches, database backups, SQL injection risks, and a server that needs constant attention. The plugin marketplace is convenient, but it's also a dependency chain you don't control.

## The Static Site Philosophy

Static sites flip the model upside down. Instead of generating HTML on every request, you generate it once at build time. The result is pre-built HTML files that can be served directly from a CDN or static host.

What changes:
- No database: content lives in Markdown files
- No admin interface: you edit files in your editor and commit
- No runtime PHP: everything happens at build time
- No plugin ecosystem: you add functionality through configuration and templates
- Instant security: no PHP to patch, no SQL injection risk

What you gain:
- Speed: static files are fast to serve
- Security: no attack surface
- Simplicity: less to maintain
- Portability: your content is plain text
- Version control: every change tracked in Git

## The SSI Transition

If you've been using Server-Side Includes (SSIs) with rsync deployment, you're already halfway there. You handcode templates, use includes for shared components, deploy static files, and use version control. You're just missing the build step.

Static site generators add:
- Template languages (Nunjucks, Liquid, etc.) with more power than SSIs
- Content management in Markdown instead of HTML
- Asset processing (minification, optimization, image resizing)
- Build-time data fetching (webmentions, feeds)
- Local development server with hot reload

The migration path is straightforward:
1. Keep your HTML structure
2. Convert SSIs to Nunjucks includes
3. Move content into Markdown front matter
4. Add a build step (Eleventy)
5. Replace rsync with Git-based deployment

## Git vs rsync

If you've been using rsync to deploy, Git will feel different at first but better in practice.

Instead of:
```bash
rsync -avz local/ user@server:/path
```

You do:
```bash
git add .
git commit -m "Update"
git push
```

The benefits are significant:
- Automatic deployments via Netlify/Vercel/GitHub Pages
- Rollback to any previous commit
- Branching for experiments
- Pull requests for collaboration
- Conflict resolution tools

## The Learning Curve

The first week will feel slower than your WordPress/SSI workflow. You're learning new tools and rethinking your approach. But after that initial adjustment, you'll likely be faster:

- No plugin updates to manage
- No security patches to apply
- No database backups to worry about
- Instant deployments on push
- Version control for everything

The tradeoff is upfront learning for long-term simplicity. You're investing time now to save time later.

## Common Pain Points

**"I miss my WordPress plugins"**

Most WordPress functionality has static equivalents:
- SEO: manual meta tags, sitemaps (this starter has both)
- Analytics: add tracking scripts to base layout
- Forms: Netlify Forms, Formspree, or custom Netlify Functions
- Comments: webmentions (this starter), Disqus, Isso

**"I need a database"**

You probably don't. Consider:
- JSON/YAML data files for structured content
- External APIs for dynamic data (fetch at build time)
- Headless CMS (Contentful, Sanity) if you really need one

**"I need an admin interface"**

Options:
- Edit files in your editor (recommended)
- Forestry.io, TinaCMS, Decap CMS (Git-based CMS)
- Netlify CMS (deprecated but still works)

**"I miss the WordPress editor"**

You can use:
- VS Code with Markdown preview
- Typora, MarkText, or other Markdown editors
- Browser-based editors like StackEdit
- CMS options mentioned above

## Where to Focus

As an experienced developer, skip the basics and focus on:
- **Eleventy configuration**: filters, shortcodes, collections
- **Template architecture**: layouts, partials, inheritance
- **Data management**: JSON/JS data files vs database
- **Build optimization**: caching, incremental builds
- **Deployment automation**: CI/CD, Netlify/Vercel configuration

The official documentation is excellent:
- [Eleventy Documentation](https://www.11ty.dev/docs/): Complete reference
- [Netlify Documentation](https://docs.netlify.com/): Advanced deployment features
- [GitHub Actions Documentation](https://docs.github.com/en/actions): CI/CD automation

## The Bottom Line

Static sites aren't for everyone. If you need a full-featured CMS with a dashboard, plugins, and database-driven content, WordPress might still be the right choice. But for personal sites, blogs, and documentation, the static approach offers simplicity, speed, and security that's hard to beat.

The tradeoff is control over convenience. You give up the WordPress ecosystem in exchange for total control over your stack. For many developers, that's a trade worth making.
