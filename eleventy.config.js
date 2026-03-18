// eleventy.config.js
//
// The heart of the build. Eleventy calls the default export below
// once, passing it an `eleventyConfig` object that you use to register
// plugins, filters, shortcodes, and collections, and to tell Eleventy
// where your files live.
//
// New to 11ty? Start by reading the comments in each `config/*.js` file.
// They're grouped by concern (filters, markdown, shortcodes, collections)
// so you don't have to hunt through one giant file to find something.

import "dotenv/config";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginFontAwesome from "@11ty/font-awesome/plugin.js";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

import registerFilters from "./config/filters.js";
import registerMarkdown from "./config/markdown.js";
import registerShortcodes from "./config/shortcodes.js";
import registerCollections from "./config/collections.js";

export default function (eleventyConfig) {
  // --- Plugins ---
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginFontAwesome, {
    transform: 'i[class]',
    shortcode: false,
    defaultAttributes: {
      class: 'icon-svg',
    },
    icons: ['fa-rss', 'fa-github', 'fa-scale-balanced'],
  });
  // Highlights fenced code blocks (```js, ```njk, etc.) at build time with
  // Prism, so there's no client-side highlighting JS shipped to the
  // browser. The actual colors live in assets/css/syntax-highlighting.css.
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  // Ensure layout chaining works properly
  eleventyConfig.setDataDeepMerge(true);

  // --- Passthrough copy ---
  // Anything here is copied to the output folder as-is, untouched by
  // templating. CSS/JS/images live outside `_includes` so they can be
  // served directly.
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // --- Watch targets ---
  // Rebuild (and live-reload) when these change, even though they aren't
  // template files Eleventy would otherwise watch.
  eleventyConfig.addWatchTarget("src/assets/css/");

  // --- Filters / Markdown / Shortcodes / Collections ---
  // Split into their own files under config/ to keep this file readable.
  // Order matters a little: filters are registered before markdown because
  // the markdown config reuses the (cached) `slugify` filter for heading
  // anchors.
  registerFilters(eleventyConfig);
  registerMarkdown(eleventyConfig);
  registerShortcodes(eleventyConfig);
  registerCollections(eleventyConfig);

  // Exclude drafts from the build entirely.
  eleventyConfig.ignores.add("src/drafts/**");

  return {
    // Eleventy will process markdown, Nunjucks, and plain HTML files.
    templateFormats: ["md", "njk", "html"],
    // Render Markdown *content* through Nunjucks too, so front matter
    // variables and includes work inside .md files.
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
      output: "_site"
    }
  };
}
