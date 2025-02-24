// Blog posts by category, for pagination
// Adapted for use from: https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/
export function getPostsByCategory(collection) {
  const allPosts = collection
    .getFilteredByGlob("./src/post/*/*.md")
    .filter((item) => !item.data.draft)
  const allUniqueCategories = getAllUniqueCategories(collection)

  // Massage the data into a format that 11ty's pagination will like
  // https://github.com/11ty/eleventy/issues/332#issuecomment-445236776
  const blogPostsByCategory = allUniqueCategories.map((category) => ({
    title: category.title,
    href: getCategoryHref(category.title),
    posts: allPosts.filter((post) => !!post.data.categories?.includes(category.title)),
  }))
  console.log(blogPostsByCategory)
  return blogPostsByCategory;
}

/** Returns all unique categories as a collection.
 * NOTE: I'm calling these "categories" to distinguish them from 11ty's built-in "tags." However,
 * these are still referred to as tags in the UI since that's what's most common.
 * @returns {({ title: string; href: string; count: string })[]}
 */
export function getAllUniqueCategories(collection) {
  const allPosts = collection.getFilteredByGlob("./src/post/*/*.md")
    .filter((item) => !item.data.draft)

  /** @type {Map<string, number>} */
  const categoryCounts = allPosts.reduce((categoryCounts, post) => {
    post.data.categories?.forEach((category) => {
      const count = categoryCounts.get(category) ?? 0
      categoryCounts.set(category, count + 1)
    });
    return categoryCounts
  }, new Map())

  let categories = (
    Array.from(categoryCounts.entries())
      .map(([category, count]) => ({
        title: category,
        href: getCategoryHref(category),
        count,
      }))
      // Sort by name first
      .sort((a, b) => a.title.localeCompare(b.title))
      // And then by popular categories first
      .sort((a, b) => b.count - a.count)
  )

  // Sample:  { title: 'man reader', href: '/man-reader/', count: 1 },
  return categories
}

/** Given a category name, returns the root-relative URL to that category's page.
 * @param {string} category
 */
function getCategoryHref(category) {
  const slug = slugifyString(category);
  return `/tags/${slug}/`
}

/** Converts the given string to a slug form. */
export const slugifyString = (str) => {
  return str.toLowerCase().replace(/ /g, '-');
};