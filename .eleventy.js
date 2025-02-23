export default async function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("./src/images")
	
	return {
		dir: {
			input: "src", 
			output: "public",
		},
	}
}
