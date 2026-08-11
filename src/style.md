---
title: "Markdown Style Guide"
date: 2026-01-05
description: "Common Markdown elements in one post, for reference."
postType: article
---

This page demonstrates what Markdown renders like on this site. Use it as a reference when writing your own posts.

## Headings

This is an `h2`. Headings get an auto-generated id and a hover-to-reveal
anchor link, via `markdown-it-anchor` (see `config/markdown.js`).

### This is an h3

#### This is an h4

## Lists

Unordered, with nesting:

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

Ordered:

1. First step
2. Second step
3. Third step

## Blockquotes

> A blockquote looks like this. Useful for quoting a source or another
> post you're replying to.

## Code

Inline code: `const eleventy = "the way";`

A fenced code block with a language hint (for syntax highlighting, add a
plugin like [`@11ty/eleventy-plugin-syntaxhighlight`](https://www.11ty.dev/docs/plugins/syntaxhighlight/)
if you want it. Deliberately left out of this minimal starter):

```js
eleventyConfig.addFilter("readableDate", (dateObj) => {
  return DateTime.fromJSDate(dateObj).toFormat("LLLL d, yyyy");
});
```

## Tables

| Feature     | Included in this starter? |
| ----------- | ------------------------- |
| Webmentions | Yes                       |
| Comments    | Link out only             |
| Guestbook   | Link out only             |
| Dark mode   | Yes, CSS-only             |

## Horizontal rule

---

## Emphasis

Bold: **bold text**. Italic: *italic text*. Strikethrough: ~~struck out~~.

## Footnotes

Here's a sentence with a footnote.[^1]

[^1]: This is the footnote text, rendered at the bottom of the post via
    `markdown-it-footnote`.
