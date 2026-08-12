---
title: "Refactoring Eleventy Config Into Modules"
date: 2026-05-15
description: "How to decompose a monolithic Eleventy config into focused modules, fix lurking bugs, and eliminate dead code along the way."
postType: article
tags: ["eleventy", "refactoring", "developer-experience", "tutorial"]
featured_image: /assets/images/posts/refactoring-eleventy-config.jpg
featured_image_alt: "An impressionistic painting of a barefoot woman in a flowing white dress hanging laundry on a rooftop clothesline in a sunlit city. White sheets billow in the breeze around her, with one purple garment draped over the line. Warm afternoon light casts long shadows across the rooftop, while brick buildings and smokestacks fade into the hazy urban background."
featured_image_caption: "'Sun and Wind on the Roof' by John Sloan, 1915. | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:John_Sloan_-_Sun_And_Wind_On_The_Roof.jpg) (edited by the Author)"
---

As your Eleventy site grows, your configuration file can become unwieldy. What started as a clean 50-line config can grow to hundreds of lines as you add filters, shortcodes, collections, and plugins. Any time you want to touch a filter or tweak a collection, you're scrolling through a wall of code to find the right spot.

This guide shows you how to decompose a monolithic Eleventy config into focused modules, fix lurking bugs in the process, and eliminate dead code. The goal is to improve structure without changing behavior for end-users.

## The Before State

Here's a rough sketch of what `.eleventy.js` looked like before:

```javascript
// .eleventy.js was 866 lines, with everything in one place
const pluginRss = require("@11ty/eleventy-plugin-rss");
// ... 15 more require()s

module.exports = async function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  // ...blah blah blah

  // ~30 filters, each defined inline
  eleventyConfig.addFilter("assetHash", (assetPath) => { /* 20 lines */ });
  eleventyConfig.addFilter("readableDate", (dateObj) => { /* ... */ });
  eleventyConfig.addFilter("getWebmentionsForUrl", (webmentions, url) => { /* 30 lines */ });
  // ...

  // Async shortcodes
  eleventyConfig.addAsyncShortcode("thumbnail", async function(...) { /* 40 lines */ });
  eleventyConfig.addShortcode("postGraph", (postsCollection) => { /* 80 lines + 110 lines of inline CSS */ });

  // Collections
  eleventyConfig.addCollection("posts", function(collectionApi) { /* ... */ });
  // ...

  // markdown-it setup with 6 plugins + custom link rewriting
  const markdownLibrary = markdownIt({ /* ... */ })
    .use(markdownItAnchor, { /* ... */ })
    // ...
  eleventyConfig.setLibrary("md", markdownLibrary);

  return { /* config */ };
};
```

It worked great! Which was the problem, it was "good enough" for long enough that it just kept growing and growing.

## The Plan: a `config/` Directory

The split was straightforward. Everything in `.eleventy.js` fell naturally into four groups:

- **Filters** — 30 custom Nunjucks filters for dates, content, webmentions, etc.
- **Shortcodes** — `year`, `thumbnail`, and `postGraph`
- **Collections** — `posts`, `notes`, `pages`, and `tagList`
- **Markdown** — markdown-it with all its plugins and the custom link-rewriting rule

Each group becomes its own file that exports a single function accepting `eleventyConfig`. The main file would just call the config scripts in order.

## `config/filters.js`

The filters module is the biggest one. It starts with all its own `require()` statements and a local cache map, then exports one function:

```javascript
// config/filters.js
const { DateTime } = require("luxon");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const { execSync } = require("child_process");
const commentsData = require("../src/_data/comments.js");

const ROOT_DIR = path.join(__dirname, "..");

const _assetHashCache = new Map();

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("assetHash", (assetPath) => {
    if (_assetHashCache.has(assetPath)) {
      return _assetHashCache.get(assetPath);
    }
    // ... hash computation
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" })
      .toFormat("dd LLLL yyyy");
  });

  // ... all 30 filters
};
```

One important detail: the filters in `.eleventy.js` must be registered *after* the plugins, because some of them override defaults set by the RSS plugin (the date filters in particular). The module call order in the orchestrator preserves this.

## `config/shortcodes.js`

The shortcodes module had a pre-existing problem I fixed while moving things, it turned out I never moved the embedded 110 lines of CSS from the `postGraph` shortcode to my stylesheets. Whoops!

```javascript
// Before: CSS string injected into every page render
eleventyConfig.addShortcode("postGraph", (postsCollection) => {
  const styleSheet = `<style>
    .epg { color: var(--text); margin: 20px 0; }
    .epg__squares { display: grid; grid-template-rows: repeat(7, 1fr); ... }
    .epg__squares > :nth-child(7n + 1) .epg__hasPost { background: var(--nav-red); }
    /* ... 100 more lines ... */
  </style>`;

  return styleSheet + buildGraphHTML(postsCollection);
});
```

The fix was to move all of that into `08-features.css` and have the shortcode return only HTML:

```javascript
// After: shortcode only builds HTML, CSS lives in the stylesheet
module.exports = function(eleventyConfig) {
  eleventyConfig.addShortcode("postGraph", (postsCollection) => {
    // HTML-only output, no inline <style>
    return buildGraphHTML(postsCollection);
  });

  eleventyConfig.addAsyncShortcode("thumbnail", async function(
    imagePath, alt, width = 400, height = 225, loading = "lazy", fetchpriority = ""
  ) {
    // @11ty/eleventy-img handles WebP conversion and srcset generation
    const metadata = await Image(fullPath, {
      widths: [width],
      formats: ["webp", "jpeg"],
      outputDir: path.join(ROOT_DIR, "_site/assets/thumbnails/"),
      urlPath: "/assets/thumbnails/"
    });
    // ...
  });
};
```

The EPG styles now live where they belong, next to the other feature CSS.

## `config/collections.js`

Collections were the simplest to extract, just four definitions:

```javascript
// config/collections.js
module.exports = function(eleventyConfig) {
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/**/*.md")
      .sort((a, b) => {
        const dateA = a.data.date || a.date;
        const dateB = b.data.date || b.date;
        return new Date(dateB) - new Date(dateA);
      });
  });

  eleventyConfig.addCollection("tagList", function(collection) {
    const tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });
    return [...tagSet].filter(tag =>
      !["posts", "notes", "pages", "all"].includes(tag)
    ).sort();
  });

  // notes and pages collections follow the same pattern
};
```

## `config/markdown.js`

The markdown module configures markdown-it with all its plugins, plus a custom rule that rewrites `.md` links to clean URL slugs (so internal wikilinks work in both the editor and the browser):

```javascript
// config/markdown.js
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
// ... other plugin requires

function rewriteMarkdownLinks(md) {
  const defaultRender = md.renderer.rules.link_open ||
    function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    const hrefIndex = tokens[idx].attrIndex("href");
    if (hrefIndex >= 0) {
      const href = tokens[idx].attrs[hrefIndex][1];
      if (href.endsWith(".md")) {
        // /posts/2026-01-10-some-post.md → /some-post/
        const slug = path.basename(href, ".md")
          .replace(/^\d{4}-\d{2}-\d{2}-/, "")
          .toLowerCase().replace(/\s+/g, "-");
        tokens[idx].attrs[hrefIndex][1] = `/${slug}/`;
      }
    }
    return defaultRender(tokens, idx, options, env, self);
  };
}

module.exports = function(eleventyConfig) {
  const markdownLibrary = markdownIt({ html: true, linkify: true, typographer: true })
    .use(markdownItAnchor, { permalink: markdownItAnchor.permalink.ariaHidden({ placement: "after" }) })
    .use(emoji)
    .use(markdownItKatex)
    .use(markdownItFootnote)
    .use(markdownItTaskLists, { label: true })
    .use(markdownItDeflist);

  rewriteMarkdownLinks(markdownLibrary);
  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.addFilter("markdown", (string) =>
    markdownLibrary.render(string || "")
  );
};
```

## The Slim Orchestrator

After all four modules were extracted, `.eleventy.js` collapsed from 866 lines down to 117. Hurray!

```javascript
require("dotenv").config();
const EleventyFetch = require("@11ty/eleventy-fetch");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = async function(eleventyConfig) {
  const faModule = await import("@11ty/font-awesome/plugin.js");
  const pluginFontAwesome = faModule.default || faModule;

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginFontAwesome);

  eleventyConfig.addGlobalData("statuslog", async () => { /* omg.lol fetch */ });

  eleventyConfig.addPassthroughCopy("src/assets/css");
  // ... other passthroughs and watch targets

  // Filters must come after plugins (some override RSS plugin defaults)
  require("./config/filters.js")(eleventyConfig);
  require("./config/markdown.js")(eleventyConfig);
  require("./config/shortcodes.js")(eleventyConfig);
  require("./config/collections.js")(eleventyConfig);

  eleventyConfig.ignores.add("src/drafts/**");

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: { input: "src", includes: "_includes", layouts: "_includes/layouts",
           data: "_data", output: "_site" }
  };
};
```

I love looking at this now. The FontAwesome plugin uses a dynamic `import()` because it's an ES module, while everything else is CommonJS, a quirk of Eleventy v3's transition period. The `require()` calls for the config modules are synchronous, which is fine since they just call registration functions.

## Bugs Found Along the Way

The best part of a refactor is what crawls out from under the furniture, of course. The true refactoring is the bugs we found along the way.

### The April Fools Flag That Never Turned Off

While reading through `base.njk` I spotted:

```javascript
// Before: this ran on every page visit
const isAprilFools = new Date().getMonth() === 3 && new Date().getDate() === 1;
const isDebug = true; // Temporary debug flag
if (isAprilFools || isDebug) {
  loadAprilFoolsScript();
}
```

The `isDebug = true` flag was clearly meant to be temporary. Fixed it by simply removing the `isDebug` line and letting `isAprilFools` do its job alone.

### `require()` Inside a Hot Loop

The `commentCount` filter was doing something expensive on every call:

```javascript
// Before: require() called thousands of times during a build
eleventyConfig.addFilter("commentCount", (postUrl) => {
  const commentsData = require("./src/_data/comments.js"); // ← inside the filter!
  return (commentsData[postUrl] || []).length;
});
```

Node.js does cache `require()` calls, but the cache lookup still happens on every invocation, and it's sloppy. The fix is to hoist the `require()` to the top of the file so it runs exactly once:

```javascript
// After: loaded once, referenced many times
const commentsData = require("../src/_data/comments.js");

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("commentCount", (postUrl) => {
    return (commentsData[postUrl] || []).length;
  });
};
```

### A CSS Variable That Disagreed With Itself

I found that `--panel` had two different values in the codebase:

```css
/* 01-variables.css — what the stylesheet said */
:root {
  --panel: #f9f5d7;
}

/* base.njk critical inline CSS — what loaded first */
:root {
  --panel: #f2e5bc;
}
```

Since the external stylesheet loads *after* the inline critical CSS, `#f9f5d7` was winning at render time. But during initial paint, `#f2e5bc` was used. Every page had a brief flash on the header and panel backgrounds before the stylesheet loaded. `#f2e5bc` is the correct Gruvbox `bg0_s` panel colour, so I updated `01-variables.css` to match.

This is more of a fix in principle, since both colours are just, uh, white.

### A 329-Line Dead File

I also found that I still had `src/assets/css/critical.css`, which was the original source for the inline critical CSS block in `base.njk`, but the two diverged over time and only the inline version is used. Deleted it.

## Extracting More Inline `<style>` Blocks

While I was in the zone after fixing `postGraph`, I noticed `comments.njk` had the same problem: 261 lines of `<style>` injected into every post page that had comments.

Shortcodes/partials outputting CSS alongside its HTML work. But it means every page using that component carries the full CSS payload inline rather than getting it from a cached, shared stylesheet.

All the comment-specific classes (`.comments-section`, `.comment-header`, `.btn-reply`, `.reply-form-container`, etc.) went into `08-features.css`. The classes that were already covered by `10-utilities.css` (`.btn`, `.btn-primary`) and `06-forms.css` (`.form-group`) were dropped from the extracted CSS.

## Dependency Cleanup

Two npm packages had been dead for a while:

**`@fortawesome/fontawesome-free`** wasn't needed, as I migrated to `@11ty/font-awesome` (the SVG plugin) back in January. The old package stuck around, along with its `fontawesome.css` and `fontawesome-all.css` files sitting in `src/assets/css/`. Those files were still being passthrough-copied to `_site` on every build. Removed the package (`npm uninstall`), deleted the two CSS files, and freed up 54 packages and ~200KB of font data from the output. Yay space-saving!

**`chart.js`** was listed in `dependencies`, but the charts page loads it from a CDN:

{% raw %}```html
<!-- src/pages/charts.md -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  window.blogStats = {{ charts.generate(collections) | dump | safe }};
</script>
```
{% endraw %}

The npm package was never `require()`d anywhere in the build. Removed it.

## The Result

The project structure now looks like this:

```
brennan.day/
├── .eleventy.js           # 117 lines, plugins, global data, passthrough
├── config/
│   ├── filters.js         # All 30 custom Nunjucks filters
│   ├── shortcodes.js      # year, thumbnail, postGraph
│   ├── collections.js     # posts, notes, pages, tagList
│   └── markdown.js        # markdown-it + plugins + link rewriting
└── src/
    └── ...
```

I made sure my local dev server rebuilt at each step. 421 files and no errors. 

## What I Learned

1. **Follow the shape of the data.** There's no need to reinvent the wheel, or in this case, the model structure. Filters, shortcodes, collections, and markdown are the four things Eleventy actually has. The natural groupings were already there, I just needed to honour them with separate files.
2. **Refactoring is a great time to audit.** When you're reading every line carefully to move it, you actually *read* it. I found the April Fools bug, the `require()` in a hot loop, the dead CSS file, and the colour variable mismatch. The refactoring forced me to look at my code instead of scrolling past it, which is what I typically do for my own sanity.
3. **Small self-contained modules are easier to reason about.** When I want to add a new filter now, I open `config/filters.js`. I don't have a monolith file with markdown configuration and collection definitions, scrolling to find where I want to add something. The file I need is obvious from the name.
4. **Inline CSS in shortcodes and partials is an anti-pattern.** It feels convenient, but inline CSS conjures dark demons (I think this is what anti-pattern means), and also means the same CSS is embedded in every page that uses the component, it bypasses the browser's stylesheet cache, plus it's invisible to anyone reading the stylesheet files. The CSS belongs in the stylesheet. Always. To stave off the demons.

The site works as it did before. It's just a little easier for me to work with now.

## Postscript: A Gotcha That Bit Me While Writing This Post

After writing the post above, the dev server threw a build error:

{% raw %}
```
[11ty] ./src/pages/charts.md contains a circular reference
       (using collections) to its own templateContent.
```
{% endraw %}

This is an issue I've had before: the culprit turned out to be a code example inside this very post! Since `markdownTemplateEngine: "njk"` is set in the Eleventy config, Nunjucks processes every `.md` file **before** the markdown renderer runs. Nunjucks expressions inside backtick code blocks are still executed, not protected by markdown fencing at all.

The code block example was the Nunjucks expression that called `charts.generate(collections)`. Nunjucks actually ran it. That call accessed `collections`, which needed `charts.md`'s `templateContent`, which needed `charts.md` to finish building first. Circular!

The fix was wrapping the offending code block in `{% raw %}` and `{% endraw %}` tags. Those tell Nunjucks to pass the content through as literal text without evaluating it, so the expression appears in the rendered post as code rather than being executed.

If you write technical posts about Eleventy, wrap every code example containing Nunjucks syntax in raw tags. The backticks (like the goggles) do nothing to stop the template engine.
