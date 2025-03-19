---
title: "Moving to Eleventy"
date: 2025-03-19T14:15:33+10:00
layout: "layouts/post.njk"
draft: false
categories:
  - Eleventy
  - Jekyll
  - Hugo
  - Blog
  - Web
---

I have been running this blog since 2014 and it's seen several major changes along the way. I started with WordPress but it felt slow and clumsy, so in 2015 I entered the world of static site generators and [transferred to Jekyll][2]. That worked for a couple of years until Jekyll was updated from version 2 to version 3 which broke my setup. At that point I [converted to Hugo][1] which has worked fine for more than six years.

But as with [Jekyll][4], updates broke my site and I didn't know enough about how it all worked to fix it. As a temporary measure, I reverted to an old version of [Hugo][5] which got everything working again, but this was not a long term solution.

After considering a number of options, I decided to try [Eleventy][3] and that's what you're looking at right now.

<!--more-->

## What Were My Criteria?

My requirements for the site haven't changed much over the years. I still want a simple, lightweight site that is easy to maintain and easy to update:

- Responsive
- Fast with minimal client-side Javascript
- Blog style:
  - front page with recent posts
  - tags
  - archives
- Searching within the site
- Written using Markdown
- Static pages for books and apps
- Contact form
- Syntax highlighting
- Light and dark themes
- Social links
- JSON Feeds

## Why Did I Choose Eleventy?

At first, I was looking for an option like Jekyll or Hugo that provided themes that I could plug my content into. After a while, I realized that this was what had caused my problems with the previous generators: they were black boxes, written and configured in languages that I didn't know, so I didn't know how to fix them when things went wrong.

While I was daunted by the prospect of having to create my own theme, I was very attracted by the idea of using a generator that I understood, with a site structure that I could control completely.

Given my language preferences, I was looking for a generator that used Swift, Python or Javascript. I asked for advice on Mastodon and got a number of recommendations, but in the end I decided to try Eleventy for several reasons:

- It's written in JavaScript, which is a language that I'm familiar with.
- It has a large and active community, with lots of articles, tutorials and videos available.
- There are a lot of plugins available both from Eleventy and from third parties.
- I can deploy it automatically from Github using CloudFlare Pages, just like I did with Hugo.

## How Did I Learn Eleventy?

I started on the [Eleventy website][3] and then watched the [Build an 11ty Site in 3 Minutes][6] video for a quick start guide. This was a bit like the tutorials on how to draw an owl: draw a circle, add another circle, now draw the rest of the owl.

After that, I found a great guide at [Learn Eleventy][7]. I got stuck at lesson 18 when I couldn't get `gulp` to work, but by that stage I had learned enough to be able to set up my site, configure the folders and files and use the templates to create the pages that I needed.

The key for me was to accept that my first draft was going to be HTML only, with no styling. This was completely different to Jekyll or Hugo where you start by choosing a theme and then adding your content, so it felt a bit strange at first, but following the example at [Learn Eleventy][7], my first goal was to get my content appearing with my preferred navigation structure.

Here's how my files and folders are organized:

![Folders and files](/images/2025/folders_files.jpeg)

At the top level, I have these folders and files:

- node_modules: where `npm` stores all the required modules, including `eleventy` and all of its dependencies.
- public: where the generated files are stored.
- scripts: where I keep my custom Python scripts for bulk edits and configuration.
- src: where the source files are stored - posts, scripts, images, etc.
- notes.md: a file to help me remember what I still need to do.
- package-lock.json: a file that records the exact versions of installed modules.
- package.json: the configuration file for `npm`.
- README.md: for display on the GitHub page.

The main action is in the `src` folder, where I have these folders:

- _data: JSON files with data to fill in the navigation menu, footer links, books and apps pages.
- _includes:
  - layouts: Nunjucks templates that are used to create the pages.
  - partials: Nunjucks templates that are used for sections of the pages.
- apps: Markdown files for each app page.
- books: Markdown files for book pages and samples.
- feeds: Nunjucks templates for the RSS feeds: XML, Atom and JSON.
- filters: Javascript helper functions.
- images: all the images except the favicon.
- js: client-side Javascript files.
- post: Markdown files for each post, with a subfolder for each year.
- scss: the SCSS files, which are compiled to CSS.
- styles: the CSS files, generated from the SCSS files.

The `src` directory contains a Markdown file or Nunjucks template for each page, the favicon images and the invisible `.eleventy.js` file that ties everything together. The Markdown files contain nothing but front matter that points to the relevant layout and adds pagination information if required. Eleventy can use many different templating engines, but the tutorial I followed used [Nunjucks][14] and having used [Handlebars][15] for another project, this was reasonably familiar territory.

One key concept for me was to realize that a `filter` in eleventy is not the same as the `filter` function in Javascript or Swift. It's easier to think of it as a formatter that takes data and returns all or part of it in a different format. For example, the info at the top of each post shows the date, the number of words and an estimated reading time. That's all produced by a filter written in JavaScript.

Collections are an incredibly powerful feature of Eleventy, especially when combined with pagination. I'm still learning how to use them effectively, but they allow me to assemble the posts for the main page and for the archives, as well as the list of unique tags for the tags page.

I'm particularly pleased with the [Archives][8] page where I wanted to add a year as the header for each year's posts. In the template, I set a variable to hold the year, then use a filter to get the year of each post. If the year is different from the previous post, I add a new header to the list.

I'm not so thrilled with the [Tags][9] page, but hopefully I can improve it. The problem is that Eleventy is excellent at collections, but not at collections of collections. I wanted a collection of tags, then a collection of posts for each tag. I haven't worked out how to do this yet, but I have an interim solution that works.

## Plugins

I've used a few plugins although I tried to keep the number down and use my own JavaScript where possible.

- `@11ty/eleventy-plugin-syntaxhighlight` to highlight the code using Prism.js
- `@aloskutov/eleventy-plugin-external-links` to make external links open in a new tab.
- `@11ty/eleventy-plugin-rss` to generate the RSS feeds.
- `pagefind` to add search to the site.

If anyone uses an RSS reader for this site, I'd love to know if the formatting works for you. The various links are in the footer.

## What Do I Miss From Hugo?

In Hugo, I could run the command to add a new post and it would fill in the template for me, with the basic front matter, a header and a `<!--more-->` marker to separate the summary from the full post. For Eleventy, I wrote a Python script to create a new post. For displaying the first few paragraphs of a post on the home page, I wrote a filter that looks for the `<!--more-->` marker and displays the text up to that point. If there is no marker, it displays the first few paragraphs, up to a certain word count.

Tags were better handled in Hugo, but I haven't finished exploring different ways to do them in Eleventy.

Hugo has a draft server mode that includes posts marked as draft. My collections exclude draft posts os I need to toggle them when writing, but I expect I can get around this using environment settings.

It was easy to generate a table of contents for a post in Hugo as it automatically made all headers into anchor links. I had to fix this manually for the existing posts with a ToC.

## My Tips for Eleventy Beginners

If things don't appear to be working, stop the eleventy development server and re-start it. I think if you make too many mistakes, it gets lost and gives up reporting them. When it is showing errors, they are usually quite helpful, pointing to the exact line of code that is causing the problem.

Don't be afraid to trash the output folder and start again at any time. This is especially important if you've deleted or moved any files as Eleventy will not automatically delete the files in the output folder.

If you're using SASS or SCSS, compile the CSS into a folder inside the `src` folder and then use `addPassthroughCopy` to copy these files to the output folder. I made the mistake of compiling the SCSS files directly into the output folder, but when I uploaded the site to CloudFlare, it ran the eleventy command to re-generate the site but didn't re-compile the SCSS files.

Sometimes, the live server refresh doesn't update the styles, so refresh the page manually before panicking.

## The Plain HTML Site

With the structure in place, and all my old posts imported, here's what the home page looked like:

![home page](/images/2025/home_html.png)

And here's what a post looked like, using Prism.js for syntax highlighting:

![post page](/images/2025/post_html.png)

But now I was stuck. I'm not a complete beginner when it comes to CSS and I knew the sort of look that I wanted, but I knew it would take a lot of my time and effort to get there. However, I use [Cursor - The AI Code Editor][10] as my editor so I decided to see how its integrated AI could help me.

## Styling With AI

Here was my first prompt:

> Create a responsive css theme with light and dark modes. It should have a header with the navigation and a footer with links and copyright notices. The home page has a list of blog posts summaries and each post has its own page. The site is mainly text with some images. Use a sans serif font and a maximum width.

As context, I pointed it at the entire `src` folder and I added web search to help it find the right information.

This was amazingly successful, although it took a lot of tweaks and edits. What I liked was that the AI - claude-3.5-sonnet - told me what it was doing at each step. At the beginning, it listed some web sites that it had consulted about responsive design and then it generated a lot of SCSS. Then it told me what it had done and what I needed to do to finish the job.

One of the tasks listed was:

> Navigation should use the nav element with proper structure

I didn't know what the proper structure was, so I asked the AI to do it.

After that, I spent 3 - 4 hours talking to the AI, tweaking the styles and getting the layout just right. It was fascinating. I felt like a designer leaning over the shoulder of a CSS expert, although a real-life expert would have become quickly exasperated by my demands!

At times, I would ask it to revert the previous change and try something different. Other times i would accept the changes but ask for a modification.

At one point it got a bit cheeky about my existing code:

> I'll modify the `apps.njk` template to match the side-by-side layout style we created for books. I'll also fix the unclosed `</li>` tags in the current file.

Once I had the basic styling, here are some examples of the more interesting things I asked the AI to do:

- Create a capsule shape for the tag buttons.
- Generate Prism.js styles for the code blocks, so that they looked similar to Xcode's default dark and light themes.
- Add a rotation effect to the dark/light toggle with animation.
- Implement a copy button for the code blocks.

Importantly, I was able to understand all the SCSS the AI generated.

Context is really important. In order to get the best results out of any AI, you have to tell it where it should start. As an example, I got my books page styled in a way that I liked, and then gave the AI the books page layout file and the app page layout file and asked it to apply a similar style to the apps page.

Also, in many cases, it was faster and easier for me to edit the SCSS manually, than to ask the AI.

I'm sure that I'll continue to refine the styles over time, but I'm very happy with what I have right now. Using AI to generate the styles was a lot of fun and really demonstrated to me how I can use AI to help me with my work.

## The Result

You're probably reading this page on my site, so you can see how it looks now. If you're at [dev.to][dev.to] or some other location, you can see my version at [https://troz.net][11].

I used [Lighthouse Metrics][12] to check the performance of both the old site and the new site. Here are the results:

For the old site, I got the following scores:

- Performance: 69%
- Accessibility: 95%
- Best Practices: 96%
- SEO: 100%

For the new site, I got these scores:

- Performance: 100%
- Accessibility: 100%
- Best Practices: 96%
- SEO: 100%

The **Best Practices** score is less than 100% because apparently some errors are being logged to the console, but I'm not seeing them so I'm not sure what's causing that.

But I am thrilled with the improvement in every other metric.

Deploying to Cloudflare is also faster - about 35 seconds compared to 48 seconds for Hugo. I think this is probably due to having to download two repos for Hugo - mine and the theme's.

One aspect that I'm really pleased with is the site search. Eleventy uses [Pagefind][13] so I started there and found it easy to set up. This is much better than the custom DuckDuckGo search I had embedded on the old site. I'm using the default Pagefind styling for the search results, but I may change that later.

If you find any bugs or any styling errors, please let me know. And if you would like any further information about how I built the site, please ask. You can contact me using one of the links below or through the [Contact][contact] page.

[1]: /post/2017/moving-to-hugo/
[2]: /post/2015/new-site-for-trozware/
[3]: https://www.11ty.dev
[4]: https://jekyllrb.com
[5]: https://gohugo.io
[6]: https://www.youtube.com/watch?v=BKdQEXqfFA0
[7]: https://learn-eleventy.pages.dev
[8]: /archives/
[9]: /tags/
[10]: https://www.cursor.com
[11]: https://troz.net
[12]: https://lighthouse-metrics.com
[13]: https://pagefind.app
[14]: https://mozilla.github.io/nunjucks/
[15]: https://handlebarsjs.com/
[contact]: /contact/
[dev.to]: https://dev.to/trozware
