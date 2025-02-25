import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight"
import { longDate, shortDate, longYear, postInfo } from "./src/filters/filters.js"
import { getPosts, getAllUniqueCategories } from './src/filters/collections.js'
import { execSync } from "child_process"
import externalLinks from "@aloskutov/eleventy-plugin-external-links"
import rssPlugin from '@11ty/eleventy-plugin-rss'

export default async function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("./src/images")
	eleventyConfig.addPassthroughCopy("./src/styles")
	eleventyConfig.addPassthroughCopy("./src/books/*_sample.html")
	eleventyConfig.addPassthroughCopy("./src/js")
	eleventyConfig.addPassthroughCopy("./src/favicon.ico")
	eleventyConfig.addPassthroughCopy("./src/icon.svg")
	eleventyConfig.addPassthroughCopy("./src/apple-touch-icon.png")
	
	eleventyConfig.addFilter("longDate", longDate)
	eleventyConfig.addFilter("shortDate", shortDate)
	eleventyConfig.addFilter("longYear", longYear)
	eleventyConfig.addFilter("postInfo", postInfo)

	eleventyConfig.addPlugin(syntaxHighlight)
	eleventyConfig.addPlugin(externalLinks, {'url': 'https://troz.net'})
	eleventyConfig.addPlugin(rssPlugin)
	
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
