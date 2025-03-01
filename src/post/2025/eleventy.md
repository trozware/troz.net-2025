---
title: "Moving to Eleventy"
date: 2025-03-01T11:01:22+10:00
layout: "layouts/post.njk"
draft: true
categories:
  - Eleventy
  - Jekyll
  - Hugo
  - Blog
  - Web
---

I have been running this blog since 2014 and it's seen several major changes along the way. I started with WordPress but it felt slow and clumsy, so despite its ease of use, in 2015 I entered the world of static site generators and [transferred to Jekyll][2]. That worked for a couple of years until Jekyll was updated from version 2 to version 3 which broke my setup. At that point I [converted to Hugo][1] which has worked fine for more than six years.

But as with [Jekyll][4], updates broke my site and I didn't know enough about how it all worked to fix it. As a temporary measure, I reverted to an old version of [Hugo][5] which got everything working again, but this was not a long term solution.

After considering a number of options, I decided to try [Eleventy][3] and that's what you're looking at right now.

<!--more-->

## What Were My Criteria?

My requirements for the site haven't changed much over the years. I still want a simple, lightweight site that is easy to maintain and easy to update:

- Responsive
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

At first, I was looking for an option like Jekyll or Hugo that provided themes that I could plug my content into. After a while, I realised that this was what had caused my problems with the previous generators: they were black boxes, written and configured in languages that I didn't know, so that I didn't know how to fix them when things went wrong.

While I was daunted by the prospect of having to create my own theme, I was very attracted by the idea of using a generator that I understood, with a site structure that I could control.

Given my language limitations, I was looking for a generator that used Swift, Python or Javascript. I asked for advice on Mastodon and got a number of recommendations, but in the end I decided to try Eleventy for several reasons:

- It's written in JavaScript, so it's a language that I'm familiar with.
- It has a large and active community, with lots of articles, tutorials and videos available.
- There are a large number of plugins available both from Eleventy and from third parties.
- I can deploy it automatically from Github using CloudFlare Pages, just like I did with Hugo.

## How Did I Learn Eleventy?

I started on the [Eleventy website][3] and then watched the [Build an 11ty Site in 3 Minutes][6] video for a quick start guide. This was a bit like the tutorials on how to draw an owl: draw two circles, then draw the rest of the owl.

After that, I found a great guide at [Learn Eleventy][7]. I got stuck at lesson 18 but by that stage I had learned enough to be able to set up my site, configure the folders and files and use the templates to create the pages that I needed.

The key for me was to accept that my first draft was going to be HTML only, with no styling. My goal was to get my content appearing and then add styling later.

![Folders and files](/images/2025/folders_files.jpeg)

This is my basic structure:

- _data: JSON files with data to fill in the navigation menu, footer links, books and apps pages
- _includes:
  - layouts: Nunjucks templates that are used to create the pages
  - partials: Nunjucks templates that are used for sections of the pages
- apps: Markdown files for each apps page
- books: Markdown files for each books page
- feeds: Nunjucks templates for the RSS feeds: XML, Atom and JSON
- filters: Javascript helper functions
- images: all the images
- js: client-side Javascript files
- post: Markdown files for each post, with a subfolder for each year
- styles: the CSS files

The root directory contains a Markdown file or Nunjucks template for each page, the favicon images and the invisible `.eleventy.js` file that ties everything together.

One key concept for me was to realize that a filter in eleventy is not the same as the filter function in Javascript or Swift. It's easier to think of it as a formatter that takes data and returns all or part of it in a different format. For example, the info at the top of each post shows the date, the number of words and an estimated reading time. That's all produced by a single filter function written in JavaScript.

Collections are an incredibly powerful feature of Eleventy, especially when combined with pagination. I'm still learning how to use them effectively, but they allow me to assemble the posts for the main page and for the archives, as well as the list of unique tags for the tags page.

I'm particularly pleased with the [Archives][8] page where I wanted to add a year as the header for each year's posts.

In the template, I set a variable to hold the year, then use a filter to get the year of each post. If the year is different from the previous post, I add a new header to the list.

I'm not so thrilled with the [Tags][9] page, but hopefully I can improve it. The problem is that Eleventy is excellent at collections, but not at collections of collections. I wanted a collection of tags, then a collection of posts for each tag. I haven't worked out how to do this yet, but I have an interim solution that works.

## Plugins

I've used a few of plugins and NPM modules, although I tried to keep the number down and use my own JavaScript where possible.

- `@11ty/eleventy-plugin-syntaxhighlight` to highlight the code using Prism.js
- `@aloskutov/eleventy-plugin-external-links` to make external links open in a new tab.
- `@11ty/eleventy-plugin-rss` to generate the RSS feeds.
- `pagefind` to add search to the site.

If anyone uses an RSS reader for this site, I'd love to know if the formatting works for you. The various links are in the footer.

## What Did I Dislike?

## My Tips for Eleventy Beginners


[1]: /post/2017/moving-to-hugo/
[2]: /post/2015/new-site-for-trozware/
[3]: https://www.11ty.dev
[4]: https://jekyllrb.com
[5]: https://gohugo.io
[6]: https://www.youtube.com/watch?v=BKdQEXqfFA0
[7]: https://learn-eleventy.pages.dev
[8]: /archives/
[9]: /tags/