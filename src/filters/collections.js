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

export function getCategoriesByCount(collection) {
  const allPosts = getRecentPosts(collection)

  let categoryCounts = {}
  for (const post of allPosts) {
    post.data.categories?.forEach((category) => {
      categoryCounts[category] = (categoryCounts[category] ?? 0) + 1
    })
  }

  let categories = Object.entries(categoryCounts).map(([category, count]) => ({
    title: category,
    count,
  }))
  categories.sort((a, b) => a.title.localeCompare(b.title))
  categories.sort((a, b) => b.count - a.count)

  // Sample:  { title: 'man reader', count: 1 },
  return categories
}

export function getCategoriesByName(collection) {
  const categories = getCategoriesByCount(collection)
  return categories.sort((a, b) => a.title.localeCompare(b.title))
}
