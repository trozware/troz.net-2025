import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { longDate, shortDate, longYear, postInfo } from "./src/filters/filters.js";
import { getAllUniqueCategories, getPostsByCategory } from './src/filters/categories.js';

export default async function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("./src/images")
	eleventyConfig.addPassthroughCopy("./src/styles")
	
	eleventyConfig.addFilter("longDate", longDate)
	eleventyConfig.addFilter("shortDate", shortDate)
	eleventyConfig.addFilter("longYear", longYear)
	eleventyConfig.addFilter("postInfo", postInfo)

	eleventyConfig.addPlugin(syntaxHighlight)

	eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

	eleventyConfig.addCollection("posts", (collection) => {
		let posts = collection.getFilteredByGlob("./src/post/*/*.md")
			.filter((item) => !item.data.draft)
			.sort((a, b) => new Date(b.date) - new Date(a.date))
		return posts
	})

	eleventyConfig.addCollection('categories', getAllUniqueCategories);
  eleventyConfig.addCollection('postsByCategory', getPostsByCategory);

	return {
		dir: {
			input: "src", 
			output: "public",
		},
	}
}
