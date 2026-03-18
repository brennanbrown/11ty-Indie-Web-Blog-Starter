// config/markdown.js
//
// Configures the markdown-it library Eleventy uses to render .md files.
// Kept intentionally small: heading anchors (so a table of contents or
// deep link can point at a specific `## Heading`) and footnotes, since
// the kitchen-sink example post demonstrates both.

import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from "markdown-it-footnote";

export default function (eleventyConfig) {
  const markdownLibrary = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  })
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: "after",
        class: "header-anchor",
        symbol: "#"
      }),
      level: [2, 3, 4],
      // Reuse Eleventy's built-in slugify filter so heading ids match
      // whatever `| slugify` would produce elsewhere on the site.
      slugify: eleventyConfig.getFilter("slugify")
    })
    .use(markdownItFootnote);

  eleventyConfig.setLibrary("md", markdownLibrary);

  // Lets you render a Markdown string from within a template, e.g. for a
  // caption or bio field stored in front matter or a data file.
  eleventyConfig.addFilter("markdown", (string) => {
    return markdownLibrary.renderInline(string || "");
  });
}
