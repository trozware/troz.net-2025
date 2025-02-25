import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { longDate, shortDate, longYear, postInfo } from "./src/filters/filters.js";
import { getPosts, getAllUniqueCategories } from './src/filters/collections.js';
import { execSync } from "child_process"

export default async function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("./src/images")
	eleventyConfig.addPassthroughCopy("./src/styles")
	
	eleventyConfig.addFilter("longDate", longDate)
	eleventyConfig.addFilter("shortDate", shortDate)
	eleventyConfig.addFilter("longYear", longYear)
	eleventyConfig.addFilter("postInfo", postInfo)

	eleventyConfig.addPlugin(syntaxHighlight)

	eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

	eleventyConfig.addCollection("posts", getPosts)
	eleventyConfig.addCollection('categories', getAllUniqueCategories);

	eleventyConfig.on('eleventy.after', () => {
    execSync(`npx pagefind --site public --glob \"**/*.html\"`, { encoding: 'utf-8' })
  })

	return {
		dir: {
			input: "src", 
			output: "public",
		},
	}
}
