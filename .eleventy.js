const { DateTime } = require("luxon");
const tagColors = require("./src/_data/tagColors.json");

module.exports = function(eleventyConfig) {
  // Filters
  // JSON stringify helper for Nunjucks (used by search.json)
  eleventyConfig.addFilter("json", (value, spaces = 0) => {
    try {
      return JSON.stringify(value, null, spaces);
    } catch {
      return "null";
    }
  });
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
    if (!tag) return "#6b7280";
    const key = String(tag).toLowerCase();
    if (tagColors[key]) return tagColors[key];
    // Deterministic color from tag text: hash -> HSL -> HEX
    const str = key;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    // Hue across full 360, with pleasant saturation/lightness
    const hue = hash % 360;
    const sat = 65;   // 0-100
    const light = 45; // 0-100
    // Convert HSL to HEX
    const h = hue / 360;
    const s = sat / 100;
    const l = light / 100;
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q; // standard HSL -> RGB conversion
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x) => {
      const v = Math.round(x * 255);
      return (v < 16 ? "0" : "") + v.toString(16);
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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

  // Search index: lightweight documents for FlexSearch (client-side)
  eleventyConfig.addCollection("searchIndex", (collectionApi) => {
    const posts = collectionApi
      .getFilteredByGlob("src/blog/**/*.md")
      .sort((a, b) => (a.date > b.date ? -1 : 1));

    return posts.map((p) => ({
      id: p.url,
      title: (p.data && p.data.title) || "",
      description: (p.data && p.data.description) || "",
      tags: Array.isArray(p.data?.tags) ? p.data.tags : [],
      // Avoid using templateContent here (not available during collection build in Eleventy v3)
      content: "",
      date: p.date,
    }));
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
