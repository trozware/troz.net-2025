---
title: 'WWDC 2026 First Thoughts'
date: 2026-06-19 18:48:16
layout: layouts/post.njk
draft: false
categories: ['Apple', 'WWDC']
---

Most years, I am deeply interested in what happens at Apple's Worldwide Developer Conference and what is announced. This year, I am on holiday in the depths of rural Queensland, Australia with very limited connectivity. At least this meant that I didn't have to wake at 3 am to watch the keynote like I usually do, although I have to confess that I wasn't that excited for this year's announcements anyway.

Thank you to everyone who posted their reactions on Mastodon as that enabled me to keep up with the major features.

I've now managed to watch most of the keynote, so I have some preliminary thoughts. I have watched none of the session videos, so deeper analysis, especially with regard to my beloved Mac app development sphere, will have to wait.

<!--more-->

The keynote had three main sections: platform improvements, child safety and of course, AI.

### Platform Improvements

We developers refer to these as bug fixes and I'm delighted to see that Apple is paying some attention to such issues. Without actually apologizing for the Liquid Glass debacle, Apple came closer than I ever expected. When you hear phrases like "we do this by listening to users and developers" and "our team really appreciates your feedback and considers it deeply", you'd be forgiven for wondering if this was coming from Apple at all.

It's clear that this is a Snow Leopard year, and before people jump up and down to tell me that Snow Leopard wasn't actually what we all think it is, in the Apple community the term Snow Leopard has come to mean a release that has fewer new features and more attention to fixes.

The most important change is that Apple has realized that having control text overlapping content text makes both unreadable, so they are dialling back Liquid Glass in several ways. First, there's a slider for adjusting how much transparency you want. I will be fascinated to see any data showing the distribution of settings for this. I expect to have it at or near 100% opaque.

Next, in Mac apps at least, the sidebar is no longer floating but is actually a sidebar to its window. I am very keen to find out if this solves any of my long standing issues with `NavigationSplitView` on Mac.

Toolbars will have a defined edge and content that scrolls under them will be less visible, which means that the toolbar controls are more visible and usable.

And finally, all Mac window corners will have the same corner radius. I know the differing radii really upset some people.

Apple put up a wall of text with a list of the platform improvements. [Tidbits][tidbits_home] has worked out that there were 264 items in this list, and they've published them here: [All 264 Items on Apple’s WWDC26 “Sweating the Details” Slide][tidbits]. Some of them appear trivial while others will be great improvements, but to see Apple bothering to work on a list like this is encouraging.

So my overall view of this is extremely positive. Apple has conceded their errors and admits they are listening to feedback. Most of us who file feedbacks feel like we are dropping them into a giant pit from whence they will never escape, but maybe we are wrong. I'd love that to be the case.

### Child Safety

I didn't waste my precious bandwidth on this section as my children are all in their thirties and no longer need me controlling their phone usage. But I imagine this will be of great interest to parents of younger children.

I am disappointed by recent government efforts in Australia and now in the UK to ban children from social media. Not only is this impossible to enforce, but it is punishing the victims and not the perpetrators. If social media platforms cannot make themselves safe for children, then ban them, not the children.

I don't know if Apple is getting into this argument, so I'll wait to see what develops here.

### AI

Based on the proportion of the keynote that was allocated to AI, this is what Apple considers to be the most important aspect of WWDC 2026. The demos were similar to what Apple demo'd at WWDC 2024, but as we now know, those were faked demos of vaporware that still doesn't exist two years later.

Now Apple has handed the generative part of AI over to Google. The demos were sufficiently laggy to make me believe that they were real, but having fooled me once, Apple still has to convince me on this.

I am concerned that Apple has chosen Google Gemini as their AI partner. I have found Google to be the most unhelpful and inaccurate of the LLMs by quite a wide margin, both for programming tasks and general queries. I really hope that Apple enables a way to integrate other LLMs, and that they don't just lock us into Google. I think they have to do this to get around the EU's anti-competition laws, but I hope it will apply everywhere.

### Developers

Finally, about 1 hour 9 minutes into a 1 hour 16 minute keynote, there was a slide titled "Developers" - you know - the people who this conference is supposedly for. It was only a brief mention, so I guess we have to live with the keynote being a glorified advertisement and the developer content starting later.

### Conclusion

I am cautiously optimistic about the ~~bug fixes~~ platform improvements, I am neutral about the child restrictions and I am waiting to see how the AI partnership with Google works out. Given the bugginess and usability problems of OS 26, I will have little hesitation in installing the betas of OS 27 on my devices when I get home. I look forward to testing the platform improvements and seeing if they actually solve the real problems that we have all had with OS 26.

---

If you have any feedback about this article, please contact me using one of the links below or through the [Contact][contact] page. And if you found this useful, please [buy me a coffee][kofi].

[contact]: /contact/
[kofi]: https://ko-fi.com/trozware
[tidbits]: https://tidbits.com/2026/06/11/all-264-items-on-apples-wwdc26-sweating-the-details-slide/
[tidbits_home]: https://tidbits.com
