---
layout: layouts/post.njk
title: Markdown Syntax Showcase
subtitle: A comprehensive guide to all markdown features
author: Blog Author
date: 2025-08-15
description: Complete demonstration of markdown syntax including headers, lists, code blocks, tables, and more.
tags: [markdown, guide, reference]
featuredImage: https://picsum.photos/800/400?random=1
category: reference
---

# Markdown Syntax Showcase

This post demonstrates all the markdown features supported by this blog template.

## Headers

# H1 Header
## H2 Header  
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header

## Text Formatting

**Bold text** and __also bold__

*Italic text* and _also italic_

***Bold and italic*** and ___also bold and italic___

~~Strikethrough text~~

`Inline code` with backticks

## Lists

### Unordered Lists

- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
    - Deep nested item
- Item 3

### Ordered Lists

1. First item
2. Second item
   1. Nested numbered item
   2. Another nested item
3. Third item

### Task Lists

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task

## Links and Images

[Link to Eleventy](https://11ty.dev)

[Link with title](https://indieweb.org "IndieWeb Homepage")

![Sample Image](https://picsum.photos/600/300?random=2 "Random placeholder image")

## Code Blocks

### JavaScript
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to the blog, ${name}`;
}

greet('World');
```

### CSS
```css
.blog-post {
  max-width: 65ch;
  margin: 0 auto;
  line-height: 1.6;
}

.code-block {
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 4px;
}
```

### HTML
```html
<article class="h-entry">
  <h1 class="p-name">Blog Post Title</h1>
  <time class="dt-published">2025-08-15</time>
  <div class="e-content">
    <p>Post content goes here...</p>
  </div>
</article>
```

## Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | ✅ | H1-H6 |
| Lists | ✅ | Ordered, unordered, tasks |
| Code | ✅ | Inline and blocks |
| Tables | ✅ | With alignment |
| Images | ✅ | With alt text |
| Links | ✅ | Internal and external |

## Blockquotes

> This is a blockquote. It can span multiple lines and is great for highlighting important information or quotes from other sources.
> 
> — Someone Important

> ### Blockquote with header
> 
> You can even include other markdown elements inside blockquotes:
> 
> - List items
> - **Bold text**
> - `Code snippets`

## Horizontal Rules

---

## Special Characters

Here are some special characters that should render correctly:

- Em dash: —
- En dash: –
- Ellipsis: …
- Copyright: ©
- Trademark: ™
- Registered: ®

## Math (if supported)

Inline math: E = mc²

## Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.

## Conclusion

This showcase demonstrates the rich markdown support in this blog template. All these features work seamlessly with the IndieWeb microformats and accessibility features built into the template.

Happy writing! ✍️
