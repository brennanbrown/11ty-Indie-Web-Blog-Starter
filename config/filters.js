// config/filters.js
//
// Custom Nunjucks/Liquid filters used across layouts and partials. Filters
// take a value and transform it. E.g. `{{ post.date | readableDate }}`.
//
// These are intentionally small and readable. If you're new to Eleventy:
// a filter represents a function registered with `eleventyConfig.addFilter`.

import { DateTime } from "luxon";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.dirname(__dirname);

const _assetHashCache = new Map();

export default function (eleventyConfig) {
  // --- Dates ---
  // IndieWeb microformats (h-entry's dt-published) want machine-readable
  // ISO 8601 timestamps; humans want something friendlier. We keep both.
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, yyyy");
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISO();
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-MM-dd");
  });

  // Note: RFC 822 (RSS <pubDate>) formatting is provided by
  // @11ty/eleventy-plugin-rss's `dateToRfc822` filter. Used in feed.njk
  // as `| dateToRfc822("UTC")` so build output doesn't depend on the
  // timezone of the machine running the build.

  // --- Tags ---
  // Posts are tagged "post" internally so `collections.post` works.
  // That tag (plus a couple of housekeeping tags) shouldn't show up in the
  // rendered tag list on the page.
  eleventyConfig.addFilter("filterTagList", (tags) => {
    return (tags || []).filter((tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
  });

  // --- Content ---
  eleventyConfig.addFilter("excerpt", (content, limit = 200) => {
    const text = (content || "").replace(/<[^>]*>/g, "");
    if (text.length <= limit) return text;
    return text.substring(0, limit).trim() + "…";
  });

  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content || typeof content !== "string") return "1 min read";
    const words = content.replace(/<[^>]*>/g, "").trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  });

  eleventyConfig.addFilter("wordCount", (content) => {
    if (!content || typeof content !== "string") return 0;
    return content.replace(/<[^>]*>/g, "").trim().split(/\s+/).length;
  });

  // Used by the sidebar's "Stats" module (see partials/aside.njk) to show
  // a running word count across posts.
  eleventyConfig.addFilter("totalWords", (posts) => {
    if (!Array.isArray(posts)) return 0;
    const total = posts.reduce((sum, post) => {
      if (!post.templateContent) return sum;
      const words = post.templateContent.replace(/<[^>]*>/g, "").trim().split(/\s+/).length;
      return sum + words;
    }, 0);
    return total.toLocaleString();
  });

  // --- Arrays ---
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array)) return [];
    return array.slice(0, n);
  });

  // --- Strings ---
  eleventyConfig.addFilter("capitalize", (str) => {
    if (!str || typeof str !== "string") return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  // --- Nav ---
  // nav.js entries can be listed in any order. This filter sorts by the
  // `order` field so reordering the nav involves a one-line change there, not a
  // template edit.
  eleventyConfig.addFilter("sortByOrder", (items) => {
    return [...(items || [])].sort((a, b) => a.order - b.order);
  });

  // --- Webmentions ---
  // Filters used by partials/webmentions.njk to slice the full list of
  // received mentions (fetched in _data/webmentions.js) down to the
  // ones relevant to the current page.
  eleventyConfig.addFilter("webmentionsForUrl", (webmentions, url) => {
    if (!Array.isArray(webmentions)) return [];
    return webmentions.filter((entry) => entry["wm-target"] === url);
  });

  eleventyConfig.addFilter("webmentionsByType", (mentions, type) => {
    if (!Array.isArray(mentions)) return [];
    return mentions.filter((entry) => entry["wm-property"] === type);
  });

  // --- Archive ---
  // Groups posts by month for the archive page. Returns an array of objects
  // with monthYear and posts properties, sorted newest first.
  eleventyConfig.addFilter("groupPostsByMonth", (posts) => {
    const grouped = {};
    posts.forEach((post) => {
      const postDate = post.date || post.data.date;
      let dt;
      if (typeof postDate === "string") {
        dt = DateTime.fromISO(postDate, { zone: "utc" });
      } else {
        dt = DateTime.fromJSDate(postDate, { zone: "utc" });
      }
      const monthYear = dt.toFormat("MMMM yyyy");
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(post);
    });
    return Object.entries(grouped)
      .map(([monthYear, posts]) => ({ monthYear, posts }))
      .sort((a, b) => {
        const dateA = a.posts[0].date || a.posts[0].data.date;
        const dateB = b.posts[0].date || b.posts[0].data.date;
        return new Date(dateB) - new Date(dateA);
      });
  });

  // --- Asset Hashing ---
  // Cache-busting filter for CSS and JS files. Generates an MD5 hash of
  // the file contents and appends it as a query parameter. Results are
  // cached to avoid repeated file reads during the build.
  eleventyConfig.addFilter("assetHash", (assetPath) => {
    if (_assetHashCache.has(assetPath)) return _assetHashCache.get(assetPath);
    try {
      const fullPath = path.join(ROOT_DIR, "src", assetPath);
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const hash = crypto.createHash("md5").update(fileContents).digest("hex").substring(0, 8);
        const result = `${assetPath}?v=${hash}`;
        _assetHashCache.set(assetPath, result);
        return result;
      }
    } catch (error) {
      console.warn(`Could not generate hash for ${assetPath}:`, error.message);
    }
    return assetPath;
  });
}
