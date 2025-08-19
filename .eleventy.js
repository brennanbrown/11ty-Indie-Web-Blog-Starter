const { DateTime } = require("luxon");
const tagColors = require("./src/_data/tagColors.json");

module.exports = function(eleventyConfig) {
  // Filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    try {
      return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, yyyy");
    } catch {
      return "";
    }
  });

  // For use in datetime="..." attributes (YYYY-MM-DD)
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    try {
      return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
    } catch {
      return "";
    }
  });

  // Approximate reading time in minutes
  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content || typeof content !== "string") return 1;
    const words = (content.trim().match(/\S+/g) || []).length;
    const minutes = Math.ceil(words / 200);
    return Math.max(1, minutes);
  });

  // Map tag to color using src/_data/tagColors.json
  eleventyConfig.addFilter("tagColor", (tag) => {
    if (!tag) return "#6b7280"; // gray-500 default
    const key = String(tag).toLowerCase();
    return tagColors[key] || "#6b7280";
  });

  // Return the first N items of an array (like Eleventy sample)
  eleventyConfig.addFilter("head", (arr, n) => {
    if (!Array.isArray(arr)) return arr;
    if (n < 0) {
      return arr.slice(n);
    }
    return arr.slice(0, n);
  });

  // Convert relative href/src URLs in HTML to absolute with base URL
  eleventyConfig.addFilter("htmlToAbsoluteUrls", (html, base) => {
    if (!html || !base) return html || "";
    const joinUrl = (b, p) => b.replace(/\/+$/, "") + "/" + String(p).replace(/^\/+/, "");
    return String(html).replace(/(href|src)="(\/[^"]*)"/g, (m, attr, url) => {
      return `${attr}="${joinUrl(base, url)}"`;
    });
  });

  // Passthrough copy for static assets (CSS, JS, images)
  // Copies from src/assets/* to _site/assets/*
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Collections
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/blog/**/*.md")
      .sort((a, b) => (a.date > b.date ? -1 : 1));
  });

  // Unique list of tags used across posts
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const ignore = new Set(["all", "nav", "post", "posts"]);
    const seenSlugs = new Set();
    const list = [];
    const toSlug = (s) => String(s)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    collectionApi.getFilteredByGlob("src/blog/**/*.md").forEach((item) => {
      const t = item.data && item.data.tags;
      if (Array.isArray(t)) {
        t.forEach((tag) => {
          if (!tag || ignore.has(tag)) return;
          const slug = toSlug(tag);
          if (!slug || seenSlugs.has(slug)) return;
          seenSlugs.add(slug);
          list.push(tag);
        });
      }
    });
    return list.sort((a, b) => String(a).localeCompare(String(b)));
  });

  // Unique list of categories from posts
  eleventyConfig.addCollection("categoryList", (collectionApi) => {
    const cats = new Set();
    collectionApi.getFilteredByGlob("src/blog/**/*.md").forEach((item) => {
      const c = item.data && item.data.category;
      if (c) cats.add(c);
    });
    return Array.from(cats).sort((a, b) => a.localeCompare(b));
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes",
      data: "_data"
    }
  };
};
