const inspect = require("util").inspect;
const _get = require("lodash.get");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("inspect", inspect);
  
  // Polyfill the liquidjs "map" filter into Nunjucks templates.
  eleventyConfig.addNunjucksFilter("map", (arr, prop) => arr.map(item => item[prop]));
  
  // Build a better `map` filter.
  eleventyConfig.addFilter("map2", (arr, prop) => arr.map(item => _get(item, prop)));

  eleventyConfig.addCollection("posts", collection => {
    return collection.getAll().sort((a, b) => a.data.order - b.data.order);
  });

  return {
    dir: {
      input: "src",
      output: "www"
    }
  }
};
