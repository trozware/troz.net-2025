import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight"
import externalLinks from "@aloskutov/eleventy-plugin-external-links"
import rssPlugin from '@11ty/eleventy-plugin-rss'
import { execSync } from "child_process"

import { longDate, shortDate, longYear } from "./src/filters/dates.js"
import { postSummary, postInfo } from "./src/filters/posts.js"
import { getPosts, getRecentPosts, getCategoriesByCount, getCategoriesByName } from './src/filters/collections.js'

export default async function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("./src/images")
	eleventyConfig.addPassthroughCopy("./src/styles/contact.css")
	eleventyConfig.addPassthroughCopy("./src/books/*_sample.html")
	eleventyConfig.addPassthroughCopy("./src/favicon.ico")
	eleventyConfig.addPassthroughCopy("./src/icon.svg")
	eleventyConfig.addPassthroughCopy("./src/apple-touch-icon.png")
	eleventyConfig.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' });
	eleventyConfig.addPassthroughCopy({ 'src/js/': '/js/' });
	
	eleventyConfig.addFilter("longDate", longDate)
	eleventyConfig.addFilter("shortDate", shortDate)
	eleventyConfig.addFilter("longYear", longYear)
	eleventyConfig.addFilter("postSummary", postSummary)
	eleventyConfig.addFilter("postInfo", postInfo)
	
	eleventyConfig.addPlugin(syntaxHighlight)
	eleventyConfig.addPlugin(externalLinks, {'url': 'https://troz.net'})
	eleventyConfig.addPlugin(rssPlugin)
	
	eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

	eleventyConfig.addCollection("posts", getPosts)
	eleventyConfig.addCollection("recentPosts", getRecentPosts)
	eleventyConfig.addCollection('categories', getCategoriesByCount);
	eleventyConfig.addCollection('categoriesByName', getCategoriesByName);
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
