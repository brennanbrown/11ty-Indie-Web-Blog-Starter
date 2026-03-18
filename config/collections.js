// config/collections.js
//
// Custom collections beyond Eleventy's automatic tag-based ones. A
// "collection" represents a named, sorted array of pages you can loop over
// in a template with `collections.posts`, `collections.tagList`, etc.

export default function (eleventyConfig) {
  // Newest-first list of posts. `src/posts.njk` (the archive) and
  // `src/feed.njk` (the RSS/JSON feed) both read from this.
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/**/*.md").reverse();
  });

  // A flat, de-duplicated, alphabetized list of all tags in use. Useful
  // for a tag cloud or index, without the "all"/"nav"/"post" housekeeping
  // tags Eleventy uses internally.
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tagSet = new Set();
    collectionApi.getFilteredByGlob("src/posts/**/*.md").forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return [...tagSet].filter((tag) => !["all", "nav", "post", "posts"].includes(tag)).sort();
  });
}
