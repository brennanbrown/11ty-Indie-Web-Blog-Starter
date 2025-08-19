module.exports = function(eleventyConfig) {
  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data"
    }
  };
};
