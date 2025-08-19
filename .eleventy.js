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

  // Passthrough copy for static assets (CSS, JS, images)
  // Copies from src/assets/* to _site/assets/*
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Collections
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/blog/**/*.md")
      .sort((a, b) => (a.date > b.date ? -1 : 1));
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
