# 11ty-nunjucks-filter-map

Polyfill liquid `map` filter into Nunjucks.

Liquidjs includes a built-in `map` filter which <q>creates an array of values by extracting the values of a named property from another object.</q>
By default this only works with directly nested properties, and not properties nested more than one level deep, as seen in the following example:

```html
fileSlug:
{{ collections.posts | map: "fileSlug" }}
<!-- Output: [ 'liquid-v1', 'nunjucks-v1', 'liquid-v2', 'nunjucks-v2' ] -->

data.title:
{{ collections.posts | map: "data.title" }}
<!-- Output: [ undefined, undefined, undefined, undefined ] -->
```

We can polyfill this into Nunjucks using the following custom filter in our .eleventy.js config file, as seen in the following snippet:

```js
// Polyfill the liquidjs "map" filter into Nunjucks templates.
eleventyConfig.addNunjucksFilter("map", (arr, prop) => arr.map(item => item[prop]));
```

```html
fileSlug:
{{ collections.posts | map("fileSlug") }}
<!-- Output: [ 'liquid-v1', 'nunjucks-v1', 'liquid-v2', 'nunjucks-v2' ] -->

data.title:
{{ collections.posts | map("data.title") }}
<!-- Output: [ undefined, undefined, undefined, undefined ] -->
```

Success! Sort of.

If you want to be able to use nested properties, you can use something like [`lodash.get`](https://www.npmjs.com/package/lodash.get) (https://lodash.com/docs/4.17.15#get), and a custom filter in your .eleventy.js config file:

```js
const _get = require("lodash.get");

module.exports = function (eleventyConfig) {
  // Build a better `map` filter.
  eleventyConfig.addFilter("map2", (arr, prop) => arr.map(item => _get(item, prop)));

// ...
};
```

Now, you can use this new custom, global `map2` filter in your liquid templates:

```html
fileSlug:
{{ collections.posts | map2: "fileSlug" }}
<!-- Output: [ 'liquid-v1', 'nunjucks-v1', 'liquid-v2', 'nunjucks-v2' ] -->

data.title:
{{ collections.posts | map2: "data.title" }}
<!-- Output:
  [
    'Liquidjs v1 (native)',
    'Nunjucks v1 (polyfill)',
    'Liquidjs v2 (nested props)',
    'Nunjucks v2 (nested props)'
  ]
-->
```

As well as your Nunjucks templates:

```html
fileSlug:
{{ collections.posts | map2("fileSlug") }}
<!-- Output: [ 'liquid-v1', 'nunjucks-v1', 'liquid-v2', 'nunjucks-v2' ] -->

data.title:
{{ collections.posts | map2("data.title") }}
<!-- Output:
  [
    'Liquidjs v1 (native)',
    'Nunjucks v1 (polyfill)',
    'Liquidjs v2 (nested props)',
    'Nunjucks v2 (nested props)'
  ]
-->
```
