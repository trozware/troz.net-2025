## Notes

Can't work out how to set a layout for all the posts in all the years folders.
 - write a Python script to do it
 - and a script to change tags to categories.
 - And add year as tag - maybe

My year folder split may not be ideal, but I like it so I'll keep trying for a bit.
I can make my tags look good - the urls will be lower-cased and spaces will be replaced with hyphens.
Tags page not quite how I wanted it, but that will do for now.

## Next up

- Add a search box
- Books page
- App page
- Contact page
- Rss feeds



## Code

To generate CSS for syntax highlighting, use https://base2t.one

npm install --global base16-builder
base16-builder ls schemes to open a local web page with the themes available.

Convert name to lowercase, delete spaces.

base16-builder -s macintosh -t prism -b light | pbcopy

paste result into /styles/code.css

base16-builder -s macintosh -t prism -b dark | pbcopy

Paste result into /styles/code.css after the light theme, inside:

@media (prefers-color-scheme: dark) {

}

Haven't found one I really like yet, using two defaults from Prism.
Can I add the Copy button?
Do I need the prism.js file?
Can I add these files only to posts?
