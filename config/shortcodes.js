// config/shortcodes.js
//
// Shortcodes are like filters, but called as their own tag rather than
// piped onto a value: `{% year %}` instead of `{{ something | year }}`.

import path from "node:path";
import Image from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  // `{% year %}`. Handy for a footer copyright line that never goes stale.
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // `{% image "assets/images/posts/example/cover.jpg", "Alt text", "Caption", "(min-width: 30em) 50vw, 100vw" %}`
  //
  // Wraps @11ty/eleventy-img to output a responsive <picture> with a
  // couple of common widths and a WebP + original-format fallback. The
  // only shortcode that touches the filesystem at build time. The
  // rest of the site is deliberately JS-free.
  eleventyConfig.addAsyncShortcode(
    "image",
    async function (src, alt, caption = "", sizes = "100vw", widths = [400, 800, 1200]) {
      if (alt === undefined) {
        throw new Error(`Missing \`alt\` text for image: ${src}`);
      }

      const inputPath = path.join("src", src);
      const metadata = await Image(inputPath, {
        widths: [...widths, null], // null = original size, uncropped
        formats: ["webp", "auto"],
        outputDir: "_site/assets/images",
        urlPath: "/assets/images/"
      });

      const imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async"
      };

      const imageHTML = Image.generateHTML(metadata, imageAttributes);

      // Wrap in figure with caption if provided
      if (caption) {
        return `<figure>${imageHTML}<figcaption>${caption}</figcaption></figure>`;
      }

      return imageHTML;
    }
  );
}
