---
title: 'macOS Apps Step by Step'
layout: 'layouts/article.njk'
redirect_from: /books/macos_tutorials/
draft: false
---

If you're an iOS developer who wants to branch out into creating native macOS apps, this is the book for you!

The book is available for sale through Gumroad at [macOS Apps Step by Step][2].

If you'd like to check out the start of the book including the table of contents and the first chapter, you can read it online at [macOS Apps Step by Step Sample][4].

This book was previously titled **macOS by Tutorials** and was released in 2022 by [Kodeco][1]. Since they transferred the rights to me, I have released two updates under the same name, but now it feels like time to move on from the Kodeco naming convention and give it a name that is more part of my brand. After considering several options, I put a [poll on Mastodon][5] and **macOS Apps Step by Step** won.

Version 4.0 - released 6th November 2025 - is fully updated to cover macOS 26 Tahoe & Xcode 26.

The major changes in this edition include:

* A new title!
* All projects updated to include new features introduced in macOS 26 Tahoe and Xcode 26.
* All projects use *Swift 5 or 6* with *Approachable Concurrency*. Swift 5 is still the default in Xcode but I switched all the projects to Swift 6 and made sure that any required changes are documented in the book.
* The _On This Day_ app has been re-designed to use a more stable `HSplitView` instead of the problematic `NavigationSplitView`.
* Icons are created using Apple's Icon Composer app.
* The _MarkWriter_ app uses SwiftUI's `WebView` to display HTML content and adds the ability to work with and edit selected text.

I hope you enjoy this updated edition of ~~macOS by Tutorials~~ **macOS Apps Step by Step.**

![Book cover][i1]

This book is split into five sections:

## Section I: Your First App: On This Day

Begin your journey developing for macOS by building a full-featured app using SwiftUI. The app, On This Day, accesses a public network API to collect information about events, births and deaths for a given date.You'll learn how to manage multiple windows, add menu and toolbar commands, and choose multiple display options. You'll experience first-hand the power of SwiftUI and see just how easy it is to build an app that has all of the look and feel you expect in a macOS app.

## Section II: Building a Menu Bar App

In this section, you'll use AppKit to build a Pomodoro-style time tracking app that lives only in the macOS menu bar. Along the way, you'll learn how to manage timers, update the menu in real-time, and integrate a SwiftUI view into an AppKit app. You'll also learn about how macOS “sandboxes” apps to protect both them and the system itself.

## Section III: Building a Document-based App

In this section, you'll return to using SwiftUI and explore how to build a document-based app. You'll create a Markdown editor — there can never be enough Markdown editors in the world! — that allows you to preview your text in real time. While working on this app, you'll add menu commands to change the styling of the preview and add formatting to your Markdown text.

## Section IV: Advanced Wizardry

Because macOS has its roots in Unix, it provides a vast array of command line tools which allow power users to perform tasks ranging from system management to image manipulation. In this section, you'll learn how to build a graphical front-end for one such command: sips. Once you've built your sips GUI, you'll enable automation to allow your new command to appear in the Services menu and Shortcuts app. When you complete this section, you too will be a wizard!

## Section V: Distributing Your macOS Apps

Once you've written your app, you'll want to distribute it to others so they can benefit from your creativity. On macOS, you have more distribution options than you do on iOS. In this section, you'll explore the pros and cons of those options so you can choose which is best for you.

[i1]: /images/2025/mac_apps_cover_small.png
[1]: https://www.kodeco.com/
[2]: https://sarahreichelt.gumroad.com/l/oximx
[3]: mailto:books@troz.net?subject=macOS%20by%20Tutorials%20Discount
[4]: /books/mac_apps_sample.html
[5]: https://mastodon.social/@troz/115365045162246609
[contact]: /contact/
[kofi]: https://ko-fi.com/trozware
