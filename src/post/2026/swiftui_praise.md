---
title: 'In Praise of SwiftUI'
date: 2026-05-26 15:00:00
layout: layouts/post.njk
draft: false
categories: ['SwiftUI', 'AppKit', 'UIKit']
---

Recently, I have seen multiple posts on Mastodon suggesting that SwiftUI is a failure, that nobody is using it, and that Apple should have focused on improving or replacing AppKit and UIKit instead of wasting everyone's time with SwiftUI. While I have great respect for some of the people saying these things, I disagree. I love using SwiftUI, I think a large number of developers are using it, and I want to explain what I find so great about it.

Perhaps one problem was the name. Yes, it allows you to define your user interface in Swift, but so do AppKit and UIKit. For me, the part that I miss most when going back to work on an older project is the data flow and the reactive nature of SwiftUI, and that's not reflected in the name at all.

<!--more-->

## Data Flow

I have written several articles about SwiftUI's data flow. The most recent one was in 2023 and it's still valid today: [SwiftUI Data Flow 2023][data-flow]. I won't repeat all the details here, but SwiftUI gives us features that allow for concise and logical data control, while making it clear which view owns the data and provides the single source of truth.

The reactive aspect of SwiftUI feels like magic! It allows me to have something like a stored setting with a default value, connected to a menu item with a checkmark, a toggle in a settings window, a button in the toolbar, and a switch on the main interface. SwiftUI keeps these all in sync without any effort on my part. This sort of flexibility was a lot of work in AppKit and UIKit, and it was easy to end up with sections of the UI out of sync with the data. In AppKit apps, you could use Cocoa Bindings, but these were tricky to set up, not good with source control and totally opaque to any developer new to the project.

## User Interface

Let's go deeper into the UI part. AppKit and UIKit have two options for creating user interfaces. You can either build graphically in Xcode's Interface Builder, or write all the interface in code. The "interface-in-code" lobby has always been very vocal and while I only ever did this for small sub-views, I can see part of the appeal. It's definitely better for source control as the interface is saved as text instead of in Xcode's strange XML that changes frequently for no apparent reason. But it's also a lot of code to write, and it doesn't give the interface positioning guidelines and the easy access to interface element properties that Interface Builder provides. However, unlike SwiftUI, both these methods give you pixel perfect control over the positioning, even if AutoLayout frequently drove me to distraction.

SwiftUI takes a very different approach and to some extent, it takes the power away from the developer and insists that Apple knows best. This means that when designing apps for different platforms, you don't have to remember the differences between the AppKit and UIKit versions of a control and you don't have to apply the different interface guidelines. SwiftUI applies styling and behavior for each platform, but this doesn't always give the result that people want and expect.

Paulo Andrade wrote an article recently titled [Using SwiftUI to build a Mac-assed App in 2026][mac-assed]. He thoughtfully detailed several ways in which SwiftUI fails to create the Mac experience that we have learned to expect. A lot of his points were to do with how the app indicated selections, but he also covered toolbars, drag & drop and keyboard shortcuts. While I understand what he's saying, and agree that SwiftUI and AppKit provide different experiences, I would argue that the Mac experience has changed many times and in lots of ways over the years. We developers are familiar with the small details and notice the changes, but to most users, this is just how Mac software is now. I got my first Mac in 1985, so I may have a broader perspective on this than most people. I do agree with his point that the Mac doesn't seem to matter inside Apple these days, but I also think it's part of the general trend of Apple rushing to release the big yearly OS updates and not taking the time to test and polish them, which lowers the quality of all their software, not just macOS or SwiftUI.

## AI

Critics of SwiftUI are using AI as an excuse to go back to AppKit or UIKit. There is no doubt that these older frameworks require a lot more boilerplate code, especially if you're designing the interfaces in code. The AI proponents argue that if AI is writing all this verbose code, then there is no need for the more concise SwiftUI. While I have started using AI to write some code, I still review every line and the more the AI writes, the harder this becomes and the more likely it is that there will be un-detected bugs.

There's no doubt that right now, the various LLMs have had access to a lot more AppKit and UIKit code than they have SwiftUI code. This is purely a factor of the ages of the frameworks. But that doesn't mean that they can't write SwiftUI. You need to provide guidance, but that's true for any code generation.

## SwiftUI Problems

I don't want to imply that I think SwiftUI is perfect. I have struggled with various aspects of it, and I have had to find workarounds for some things that I want to do. Partly, this is due to the buggy nature of Apple software at the moment, but as someone who primarily works with Mac apps, I am feeling the pain of the lack of attention to the Mac. Again, this is not a SwiftUI problem, but a general Apple problem.

As an example, I have had to recommend that people building Mac apps avoid `NavigationSplitView` completely. It is very buggy and doesn't work well with multi-window apps. My numerous feedbacks have been ignored except for one response telling me that I shouldn't assemble all my feedbacks on the topic into a single report!

There are still some performance issues, particularly with long lists, but these can be worked around by dropping back to AppKit or UIKit. The ability to mix and match SwiftUI with UIKit and AppKit is a great feature, and it allows for gradual adoption of SwiftUI as well as filling in the gaps with AppKit or UIKit when needed.

## My Plans

SwiftUI started off missing a lot of features that had to be added using UIKit or AppKit. This was a sensible approach as it allowed Apple to release it before it was fully featured, however with the addition of the SwiftUI web view last year, there are very few things that you can't do in SwiftUI now.

My current strategy is **ALWAYS** to start with SwiftUI. I find it much easier to write, read and maintain, and really appreciate the ease of passing data around the app.

If I come across a bug in a SwiftUI component, I will try to work around it or see if I can use an alternative SwiftUI approach. If that doesn't work, I will drop back to AppKit or UIKit for that part of the app.

For long lists, again I'll start using SwiftUI, but if I find performance issues, I'll drop back to AppKit for that part of the app.

I can't see myself ever basing an app on AppKit or UIKit again, but I will continue to use them as needed to fill in the gaps and work around SwiftUI bugs.

I ❤️ SwiftUI!

---

If you have any feedback about this article, please contact me using one of the links below or through the [Contact][contact] page. And if you found this useful, please [buy me a coffee][kofi].

[contact]: /contact/
[kofi]: https://ko-fi.com/trozware
[data-flow]: /post/2023/swiftui-data-flow-2023/
[mac-assed]: https://pfandrade.me/blog/mac-assed-swiftui-app/
