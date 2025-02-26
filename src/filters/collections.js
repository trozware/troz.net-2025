export function getPosts(collection) {
  let posts = collection.getFilteredByGlob("./src/post/*/*.md")
    .filter((item) => !item.data.draft)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
return posts
}

export function getRecentPosts(collection) {
  let year = new Date().getFullYear()
  let posts = collection.getFilteredByGlob("./src/post/*/*.md")
    .filter((item) => !item.data.draft)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((item) => item.data.date.getFullYear() >= year - 5)
  return posts
}

/** Returns all unique categories as a collection.
 * NOTE: I'm calling these "categories" to distinguish them from 11ty's built-in "tags." However,
 * these are still referred to as tags in the UI since that's what's most common.
 * @returns {({ title: string; href: string; count: string })[]}
 */
export function getAllUniqueCategories(collection) {
  const allPosts = getRecentPosts(collection)

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

export function getCategoriesByName(collection) {
  const categories = getAllUniqueCategories(collection)
  return categories.sort((a, b) => a.title.localeCompare(b.title))
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