---
title: 'Fun with AI'
date: 2026-09-19 08:48:31
layout: layouts/post.njk
draft: false
categories: ['AI']
---

There is a lot of debate in the developer community regarding the use of AI and its long term implications for our jobs. I feel like I occupy a middle ground: I'm not a "never AI" person and I'm not an "AI solves everything" person. I've been having a lot of fun using AI a lot in the past month, so I thought it was worth writing up what I have been doing, how well it works, and how it changes my workflow.

<!--more-->

### The Project

At my day job, I am responsible for the development and maintenance of custom process control solutions. Over many years, I have developed multiple Mac and iPhone apps for interfacing with all the various hardware systems, allowing user control, leading users through complex procedures, handling alarm conditions and so on. With the introduction of more remote work, I have been gradually transitioning this to be a single web app and that has been going really well. But I was left with the most complicated of the custom apps still running...

After putting this off for as long as possible, I hired a designer/systems analyst. This person is a former operator of these systems, so he knows all the details from a user perspective. My brief was very clear:

> Ignore everything that has gone before and all the ways we do things now.  
> Don't think about the programming side - that's my problem.  
> Design the system **you** want to use.

Sure enough, he came back with an approach that was nothing like what I would have done and started in a completely different place. But when he presented his plan to the entire team, they were very enthusiastic. So now it was my turn. Gulp.

### Which AI?

The web app is a Node.js app running an Express server. My JavaScript is pretty good but my HTML and CSS skills are minimal, so now seemed like the perfect time to start using AI to fill in the gaps in my expertise. But which one?

As you know if you've read any other articles on this site, my main focus is on Mac app development using Swift. This meant that the AI agent had to work inside Xcode for Swift projects, as well as inside Visual Studio Code for web projects.

Xcode allows you to add agents from Anthropic (Claude), OpenAI (Codex) and Google (Antigravity). I'm sure the Google offering was Gemini last time I looked, but this is what Xcode 27 shows.

In Visual Studio Code, I searched the list of available extensions. All of these have an extension so those were my three options. I had previously used GitHub Copilot, but without direct Xcode support, this didn't make my list for consideration.

Price was the next factor. Codex and Claude are very similar although Codex has a free tier which allows some experimenting. Google doesn't show pricing, it only has a **Get Plan** button which I didn't want to click without further information.

I know nothing about Antigravity, but my tests with Google Gemini had been disappointing, so putting that together with the pricing uncertainty narrowed the list to either Claude or Codex. While neither OpenAI or Anthropic are notably ethical, I feel that Anthropic is slightly better, so that's what I chose.

I signed up for the Claude Pro account which costs me $30.91 Australian every month - about USD 22 at the current exchange rates. I deliberately pay per month instead of per year in case I want to stop or change.

### Preparation

My first step was to make sure the existing project was in good shape. I created a new branch for the repo and asked Claude to do an extensive review, without changing anything. This was fascinating. I ended up with a beautifully formatted web page laying out dozens of issues: out-dated styles of code, potential or real bugs, badly formatted HTML, security issues - the works. This was arranged into lists of high, medium and low priorities. Since this major addition was my excuse to make substantial changes, I implemented all the recommendations. Some of them I did manually, some I fed back to a new Claude chat and asked for help.

The project had some documentation, but Claude added more, both in the JSDoc comments I had been using already and in the CLAUDE.md file. I started this file to indicate my coding style preferences, but Claude has made it into a complete design document, laying out the project structure as well as showing reasons behind various choices so future me (or replacement me) doesn't re-think myself.

Claude also added tests, which is something I'm very bad at.

With the existing project in better shape than ever, I was ready to start adding new features.

### My New Workflow

Usually, when starting a new project, or a new extension to an existing project, I break all my own rules and jump into the code, making the plan up as I go along. This time, I made myself step back. I already had a design as the starting point, so I should use it.

The first step was to divide the new features into smaller chunks. I don't want to give Claude a monolithic task, I want a series of small tasks that are easier for me to assess along the way, and let me rewind any that don't work the way I want. For each task, I write a detailed spec, which includes:

- the overall goal of this new feature
- a screenshot of the relevant portion of the UI from the design document
- a description of any new routes or models required
- links to where to get, and where and how to save any data required
- guidelines for how I want this to operate

Then I start a new chat, feed Claude this spec and ask it to write a plan. This usually results in some further questions, and often Claude has suggestions to avoid problems I hadn't thought of. We go back and forth until Claude has a plan that I like, then I tell it to go ahead while I take a break.

After that comes what I consider the most important part: I carefully read the report that Claude produces after doing the work. This tells me what files have been modified or created and what changes have been made. It points out things I need to check in a real browser or on a real iPhone. It clarifies some of the decisions made in the implementation. It mentions any possible issues that I might want to address now or later.

I don't read all the code, although I scan and manually edit some of it. It's all amazingly well documented and Claude adds new tests and updates the docs for every new feature.

Then I tweak what Claude has added, sometimes manually and other times asking Claude. These adjustments don't always work, in which case I tell Claude to revert and try something else.

Once I'm happy with the new feature, I do a commit and then I'm ready to start again on the next one.

As you can see, my workflow has changed completely. I do all my thinking up front. I plan more carefully and in more detail than I ever have before. I just don't type much code.

### What Impressed Me

A lot of what Claude did was really impressive, but some things stood out.

I wasn't sure about the UI for a particular element so I asked for suggestions. Claude mocked up a test page with buttons allowing me to swap between four different ideas.

While running the system, we often operate our phones using gloves or with wet hands, so avoiding accidental taps and having large hit targets was an important feature in one aspect of the UI. Claude noted this in CLAUDE.md and when implementing another feature, added a "Confirm" button, pointing out that this matched the prior requirement.

One feature had a simple UI but what happened on the back-end was very complicated. I went back and forth with the designer on this and ended up with a three page Markdown file which I sent to Claude. It got the exact result we wanted first time, even though I had made a silly copy/paste mistake in the spec which it picked up and corrected.

The CSS that Claude produces uses features I've never even heard of! I would never have been able to do anything like this. At one point, Claude calculated that the contrast ratio between the colors I had chosen for a button background and its label were too low and suggested adjusting one of the colors.

### Looking to the Future

I am really having a lot of fun with this process at the moment. I feel totally in control and massively productive. The enjoyment factor is huge - I want to get started every morning because I know I'm going to be able to do great work. Some people have said that using AI for coding removes their joy, but not me.

But this is web development and not a Swift app which has two implications:

1. JavaScript, HTML and CSS are so popular that there is a massive amount of training data for the AI. Swift has fewer examples available.
2. Although they get new features all the time, the web technologies are relatively stable when compared to Swift which changes dramatically every year.

So I may not use AI so much when I get back to Swift development.

Then there are the long term prospects for AI. While I do not think it is ever going to go away, I think that AI in its current form is unsustainable financially, environmentally and legally.

I don't see how these large AI companies can survive when they are selling their product for vastly less than it costs them. Do they think we will all get so hooked on it that we won't be able to quit when they increase the prices? I pay roughly USD 20 per month. If this went to USD 200 I would fast-track the project and pay for a couple more months, then unsubscribe. If it went to USD 2000 per month, I'd unsubscribe immediately and go back to coding by hand.

Environmentally, the AI data centres are a disaster and legally there is a huge cloud over how they gather their training data. If an AI company can't operate legally, safely and environmentally responsibly, then it should fail, just like companies do in any other industry. Regulations need to be enacted and enforced to make this happen.

I expect OpenAI and Anthropic to fail. Google may survive because AI is not their only product. What happens after that will be fascinating. Will we see better AI companies built on the ruins? Will AI be regulated? Maybe it will become so expensive that it's only available to a few? Who knows? Either way, the next 5 years will be interesting to watch.

### AI and Writing

No. Never. Absolutely not.

This is a hard line I will never cross. I write about things that interest me and I use my own voice. I don't imagine that anything I have to say is particularly new or novel, but I say it in a different way to other people and that's what I want people to enjoy. I love writing and when I write my books and articles, I always speak the words in my head as I type - I'm doing it right now. That way, what you read is what I would have spoken if you'd been here with me.

**I guarantee that if you read any of my articles, books or even posts on Mastodon, you are getting the real Sarah, complete with typos, bad grammar and misplaced commas.**

---

If you have any feedback about this article, please contact me using one of the links below or through the [Contact][contact] page. And if you found this useful, please [buy me a coffee][kofi].

[contact]: /contact/
[kofi]: https://ko-fi.com/trozware
