## Notes

Tags page not quite how I wanted it, but that will do for now, maybe only show recent tags?

## Questions

Can I paginate the tags?
I keep getting errors with multiple input files writing to the same output file.

## Styling

Added SCSS - now to style everything.

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
