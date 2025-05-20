---
title: "Apple Developer Relations"
date: 2025-05-21T09:53:52+10:00
layout: layouts/post.njk
draft: false
categories: ['Apple', 'WWDC']
---

Apple's Worldwide Developer Conference is just weeks away, but I'm sensing a lot of apathy in the community. The company's relationship with third-party developers is at a low point.

We all know that Tim Cook and his senior people will stand up at WWDC and say how much they value their developers and boast about how much money they've paid out to them. Being so enthusiastic about the money is very strange - it's like a rent collector bragging about how much money he has given to the landlord when all he's doing is collecting the rent and taking his cut. And it's difficult to take Apple's apparent enthusiasm for their developers seriously given their behavior over the rest of the year.

Trust is a hard thing to gain. Apple used to have the developers' trust but now they've lost it. It's much more difficult to regain lost trust than it is to gain it in the first place. I have read many reports of talented developers leaving the Apple ecosystem because they can't take it any more. This is bad for all of us, but particularly bad for Apple.

I don't imagine that anyone at Apple reads my blog, but I have thought of some things I think they could do to improve their relationship with their developers.

<!--more-->

### 1. Open up iOS and all other systems to be like macOS

macOS has the Gatekeeper system which allows you to run apps from the App Store and from known developers. If you want to distribute a macOS app outside the App Store, you submit your app to Apple for notarization. This is not app review by a person, but an automated check for malware.

Apple states that iOS needs to be kept locked down to protect us, but macOS is not full of viruses and malware despite it's greater openness. Apple also states that the App Store and its review process protects users, but the most cursory glance through the iOS App Store shows that it's full of scam apps, copycat apps and apps with fake reviews.

If Apple were to open up iOS in the same way that macOS is open, it would immediately end a vast array of court cases against them, as well as avoiding the constant stream of fines from the EU which does not take kindly to Apple's habit of malicious compliance with their regulations. As a side-note, isn't it odd how Apple fights the regulations enacted by the democratically elected EU parliament, but falls over itself to comply instantly with the orders of the Russian and Chinese governments?

### 2. Give registered developers access to feedback reports

Every year, Apple releases betas of their operating systems to registered developers. They ask for all bugs to be reported using the Feedback Assistant app. This is a time-consuming process for developers and we are becoming increasingly reluctant to provide Apple with unpaid quality control services.

When you encounter a bug, first you have to make sure it's not in your code. You analyze it and then try to create a stripped down project that demonstrates it. Next, you file a report with as much detail as you can. This usually includes a system log, which used to be fine but now shows a dialog saying that although this may contain confidential information, it will be used to train AI! So much for confidential.

Once you submit the bug, the usual response is nothing. Even if the bug is fixed, you get no acknowledgement. It seems to be your responsibility to keep testing and close the bug once you can prove it's fixed. Very occasionally, you get a response. Sometimes, this is asking for more information. Other times, it's saying that the bug is closed as a duplicate of some other bug. The problem is that you have no access to the other bug, so now you're cut out of the loop entirely. Only once, in all my years of filing bugs, have I received a real human response. Filing bug reports feels like a giant waste of my time.

Now imagine that the bug database was open to all registered developers. When you encounter a bug, you could immediately search to see if anyone else had reported it. If so, you could mark it as "I see this too" and maybe add more information. This would be much faster and more efficient.

From Apple's point of view, it would also be vastly more efficient. Instead of having to correlate many reports about the same issue but worded and tagged differently, they could have a much smaller and more manageable database of reported bugs, with a better indication of how widespread each bug was.

To me, this seems like a win-win situation. I have trouble coming up with a reason for Apple to keep the bug reports secret. Do they think the sheer number of them is embarrassing? Are they afraid of people exploiting the bugs? Either way, having a more efficient system would be better.

### 3. Improve the app review process

This has got to be the most frustrating part of an Apple developer's life. Apple's app review process is a capricious mess and every time you click **Submit for Review**, it feels like spinning a roulette wheel. Even apps that have been on the App Store for years are not immune to this. Some apps get blocked for the most bizarre reasons, but the same app will be approved without issue for a different platform or on a different day.

I think the app review team is probably under-staffed and without clear guidelines. It also appears that the larger development companies are allowed more latitude than the independent developers.

I would suggest that app review be mainly a check for malware and to confirm that the app doesn't crash on various hardware and software combinations. After that, there should be checks to see if the app is a scam or an obvious copycat.

Apple's reviewers are not familiar with everything that can be done on an iPhone, iPad or Mac and I don't expect them to be. The problem is when they reject apps purely because they don't understand them.

And while I'm on the topic of app review, how about some validation of App Store reviews before they go online? It wouldn't take a very sophisticated system to detect when an app suddenly receives hundreds of reviews, all virtually identical.

---

I could go on and on, but these are my top three suggestions for Apple to improve developer relations. What are yours? If you could speak to the Apple board for one meeting, what would you say?

Let me know using one of the links below or through the [Contact][contact] page. And if you found this article interesting, please [buy me a coffee][kofi].

[contact]: /contact/
[kofi]: https://ko-fi.com/trozware