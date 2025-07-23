---
title: "SwiftUI for Mac 2025"
date: 2025-07-12 17:18:41
layout: layouts/post.njk
draft: true
description: 'Mac app development using SwiftUI on macOS 26 Tahoe'
categories: ['Swift', 'SwiftUI', 'macOS']
---

Almost every year, I write an article and sample app, exploring the new features of SwiftUI with particular emphasis on Mac app development. This year, it feels like the operating systems are becoming more uniform, so there is not a lot that's Mac-specific, but there are several new features that I am keen to explore.

<!--more-->

Right now, I'm using Beta 3: macOS 26.0 Beta (25A5306g) and Xcode 26.0 beta 3 (17A5276g). And by the way, I love the new year numbering system so that all the operating systems are easily identifiable and even Xcode is in line with everything else.

Here is a list of the topics I'm going to cover:

* [App icons](#app-icons)
* [New look controls](#new-look-controls)
* [Web view](#web-view)
* [Rich text](#rich-text)
* [Menu item icons](#menu-item-icons)
* [Concurrency](#concurrency)
* [Toolbars](#toolbars)

<a id="app-icons"></a>
### App icons

When you create a new project in Xcode 26, the old **Assets.xcassets** folder is still there and it still contains an **AppIcon** entry, but this is no longer the only way to create an app icon. This is an area where macOS has lagged behind iOS, so it's great to see all the systems using the same method now.

Right-click on the Xcode icon in your Dock and choose **Open Developer Tool -> Icon Composer** from the popup menu. This opens a new app for creating icon files. Start by using the Document tab in the inspector to turn off watchOS and select macOS only:

![Icon document settings][i1]

Then switch back to the paint brush inspector to set the background. The app supplies a few fill options, so play around with them to see what you like. After that, the recommendation is to add one or two layers using SVGs.

Being graphically challenged, I searched for a free cat icon in SVG format and found this: [https://iconscout.com/icon/cat-9608559](https://iconscout.com/icon/cat-9608559). I dragged the file on to my icon and started playing around with it. The most useful controls in the main portion of the app are the one at the top for toggling on the grid - you can use the dropdown button on the right to switch between light and dark modes - and the three preview options at the bottom for toggling between default, dark and mono modes.

In the sidebar, select **Icon** to edit the background and select your image to change its properties. When working with the image, you can select whether options apply to all the versions or just the currently selected variant. This is useful as I found that the Liquid Glass effect looked great in dark mode but not in default mode with my gradient. I wasn't pleased with the mono version, but I'll see how it looks in real life. I can't imagine myself ever using mono icons on my Mac, but maybe that's just me.

![Icon composer][i2]

Anyway, with my icon composed, I saved it as **Cat.icon** and then dragged it in to the project folder, copying it to my app target. Then, in General settings for the app target, I changed the app icon to **Cat** without the extension. After running the app, I right-clicked on its icon in the Dock and selected **Options -> Show in Finder** so I could see the icon fully in Icons view mode. It looked pretty good in default mode, but when I used **System Settings -> Appearance** to alter the icon style, it was clear that some of the options would require more work. But still, this was a good start.

![Icon appearance][i3]

Note: When building the app, I got a warning saying **Failed to generate flattened icon stack for icon named 'Cat'**. I assume this is a beta issue and it didn't stop the app from using the new icon.

If you want to support older systems and have an AppIcon set in **Assets.xcassets**, set the name of your Icon Composer file to AppIcon and your app will use the new one and fall back to the old one if required.

One nice touch is that if you select the icon file in the Xcode Project navigator, you get an option to open the file in Icon Composer directly.

<a id="new-look-controls"></a>
### New look controls

With the introduction of Liquid Glass, many controls have a new look. In the sample app, I added a `TabView` to group the controls I wanted to test. Tabs have a title and an icon, as they did last year. The default style groups them in the toolbar, although in Beta 3, there is not a lot of transparency:

![Default tabs][i4]

Notice how this has hidden the window title too.

Setting the `tabViewStyle` to `sidebarAdaptable` moved the tabs to a sidebar overlay and displays the window title. This looks much more like a standard sidebar and shows the tab icons too. I didn't like the way this looked last year, but I think it fits well with the new UI design. It's like a navigation sidebar but for a static list.

![Sidebar tabs][i5]

Not only does this style display the window title, but it also allows for a window subtitle using the `navigationSubtitle` modifier. And it displays a sidebar toggle button. There is a way to remove the sidebar toggle button if it's part of a navigation view, but that technique didn't work here. Despite the style name indicating that this style is adaptable, that only applies to iPad app.

#### Buttons

The main change for buttons is the two new options for `buttonStyle`: `glass` and `glassProminent`. Both styles can have a `tint` applied, but when tinted, the `glass` style buttons don't show the mouse down effect very distinctly. The `glassProminent` style never shows it clearly. By default, the `glassProminent` style is tinted using the `accentColor` or the user's preferred theme color if chosen.

Toggles have a slightly new look. The button style gives a much more prominent indicator of the selected state, and the switch style uses the new Liquid Glass style which you can really see if you drag the switch instead of clicking on it.

In this screenshot, I've added a background to the view and tinted the `glassProminent` button. The background looks great with the tab sidebar but the title bar looks a bit jarring:

![Buttons][i6]

In the **...App.swift** file, I set the `WindowGroup` `windowStyle` to `hiddenTitleBar`, which looks more consistent, but would not be good for a multi-window app:

![Hidden title bar][i7]

#### Numbers

For entering numbers, I tested the `Slider` and `Stepper` controls. The `Slider` has the new Liquid Glass style thumb and a cute little bounce of the icons when you reach either end. The `step` parameter displays tick marks along the slider.

For the stepper, the up and down arrows are larger, which I think is a good idea - they were very small before. There's also a format parameter which has probably been there for years but I've never used it. What I like about it is that it displays the selected value in the format you specify and it's editable! I'm using `percent` in this example:

![Numbers][i8]

One slight oddity of the stepper showing an editable value is that it lets you enter a value that doesn't match the step size or is inside the range. In this example, I set the step size to 0.05 (5%) and then entered 13%. The arrow buttons still go up and down in 5% increments, so I got 18% or 8% depending on which way I clicked. Also, you can enter a non-numeric value, but it is ignored: tabbing out of the entry resets it, and the arrow buttons operate on your previous entry.

I added a view to test the various `Picker` styles, but they seem to be the same as last year.

<a id="web-view"></a>
### Web view

One of the most exciting additions for me was the new WebView. So many apps need to display web content, and until now, the only option has been to use `NSViewRepresentable` or `UIViewRepresentable` to bring in the view from WebKit. The SwiftUI team has exceed my expectations with the features in the new `WebView` and it's going to need its own article, but I'll cover the two main ways to use it here.

I wanted to see how toolbars look, so I added a toolbar to `ContentView` with two buttons for navigating to a web display window and a text editing window. With the window's title bar hidden, I was unable to adjust the placement of the toolbar, even when adding a `ToolbarSpacer`. Adding an old-style `Spacer` worked, but that felt wrong.

Before working with any web view, you need to turn on **Outgoing Connections (Client)** in **Signing & Capabilities** for the target. Also, any SwiftUI view that needs to use WebView must import WebKit.

With those in place, here's my code for displaying my web page in a SwiftUI WebView:

```swift
import SwiftUI
import WebKit

struct WebDemo: View {
  let myPage = URL(string: "https://troz.net")!
  
  var body: some View {
    WebView(url: myPage)
  }
}
```

I have found that the only way to create an invalid URL from a string is to provide an empty string, so I am now happy to force-unwrap URLs. After that, I add a `WebView` and set its `url` to `myPage`:

![Web view][i9]

As you can see, a contextual menu offers basic navigation options. So to display any web page off the internet, all you need to the URL.

To gain more control, initialize a `WebView` with a `WebPage`:

```swift
struct WebDemo: View {
  @State private var page = WebPage()
  let blank = URL(string: "about.blank")!

  var body: some View {
    WebView(page)
      .onAppear {
        page.load(html: html, baseURL: blank)
      }
  }

  let html = """
      HTML goes here
    """
}
```

I added a `Picker` to the toolbar for switching between the two web view sources. Here's the one showing a local HTML string:

![Local web][i10]

Using a `WebPage` gives a lot of different options, but this shows the basic idea. I think I would tend to use a WebPage as that lets me track the loading state so I could show a progress indicator.

<a id="rich-text"></a>
### Rich text

When I'm asked if I recommend starting a Mac app with SwiftUI or with AppKit, I used to say SwiftUI unless your app uses lists with thousands of entries or long form text editing. SwiftUI lists have improved a lot in macOS this year, but I'm still not sure about that, however it looks like text editing can come off my AppKit list.

The key is to use a `TextEditor` but to link it to an `AttributedString` instead of a plain `String`.

```swift
@State private var text: AttributedString = ""

var body: some View {
  TextEditor(text: $text)
}
```

With an `AttributedString`, you get a lot of formatting options, although not as many as I expected. Setting bold, italic or underline is easy and so is changing the font size. I have not yet worked out how to change the font, except by pasting in text in a different font. At that point, the newly pasted font becomes one of the document's styles and can be applied to other portions of the text, but this can't be the only way. Spell checking is also a bit erratic - it works really well if you open the spell checker dialog, but it doesn't work as you type.

I added `TextEditingCommands` and `TextFormattingCommands` to the menus, but they all seemed to be available through the contextual menu anyway.

For saving and loading the formatted text, I realized that `AttributedString` is a `Codable` type, so I used `JSONEncoder` and `JSONDecoder` to save and load as the view appears and disappears. This worked really well, whether I closed the editor window manually or just quit the app. This is just a quick hack for a single editor, but it could be the basis for a more complex app.

![Text editing][i11]

I think there will be more to discover with this, but it's already a lot better than before. And I haven't even started to get into tracking the selection and adding custom formatting.

<a id="menu-item-icons"></a>
### Menu item icons

A new thing in macOS 26 is the icons attached to menu items. Most of the default menu items have icons, but what about my own? 

Starting with the **Window** menu, I see the entries for my three windows:

![Window menu][i12]

Interestingly, the main window shows the title and its subtitle, even though I set the title bar to be hidden. I cannot see see how to add an icon to any of my windows in this menu.

What if I add menu items to mimic the tab buttons? I added a new **Show** menu and used a `Picker` to select the main window tabs and buttons to open the demo windows. For each one, I used a `Label` instead of a `Text` view or a plain title. This let me assign an SFSymbol to each. I realize that this means the demo windows each have two menu items, but I wanted to experiment. And anyway, Xcode has two menu items to open the docs.

![New menu][i13]

For the top three items in the `Picker`, I set the `pickerStyle` to `inline` and set `labelIsHidden` to true. I like this style as it gives me a picker in the top level of the menu, instead of in a submenu. For passing the selection to the window, I used `@AppStorage` which is not a great choice as it makes the choice apply to every open instance of the main window, but I didn't want to get bogged down here. If you're interested in a more complete solution, check out my article on [The Mac Menubar and SwiftUI
][1]

As you can see, I was able to show icons, check marks and keyboard shortcuts. I like this, but it can be over done. The WWDC video on the topic said that if you have related menu items, you should only add an icon to the first. An example of them **not** doing this is the Finder's **File** menu. There are three **New Folder..** items, all with the same icon. I think it would look better if they followed their own guidelines and only put the icon on the first.

<a id="concurrency"></a>
### Concurrency

Last year, I sat out the change to Swift 6 and its strict concurrency checking. While I could get it to work but following Xcode's suggestions, I was left feeling that I was adding code to make the compiler happy, instead of code that actually made my apps better. This year, things are different. For a start, a new Xcode project has **Approachable Concurrency** turned on and has **Default Actor Isolation** set to **MainActor**. This means that everything is isolated to the main thread by default, but you can still step out into a background thread as required, for example when doing network operations.

The default Swift version is still set to 5, but I changed it to 6 for this sample app and had no compile-time warnings or errors. I realize that this app isn't doing any background tasks, but I still feel that things are improved, so I'll probably be using Swift 6 from now on.

<a id="toolbars"></a>
### Toolbars

I've discussed toolbars briefly as I added them to the sample app, but I have a few more unified thoughts. There are a lot of toolbar positioning options that are not available in macOS. It used to be possible to identify a Catalyst app from its missing Settings menu item. I think that in the future, we'll identify them from toolbars floating in unexpected places!

Looking back at the screenshots from the web view section, the window without a toolbar already looks old-fashioned. Adding the toolbar made it look more modern. I see a lot of apps where the content scrolls behind the toolbar, getting blurred in the background. I'm not a huge fan of this as I think it's visually messy and makes the content and the toolbar more difficult to read. But I also don't know how to control this yet, so I can't test it.

It's weird how setting the window style to `hiddenTitleBar` breaks the toolbar placement, but maybe this will be fixed in later betas. I haven't found a use yet for the new `ToolbarSpacer` - this may be another feature that is more suited to the iPad or iPhone.

### Summary

The big thing is Liquid Glass. I have always advocated using default controls wherever possible and for apps that did this, most of the new look will be applied by re-compiling in Xcode 26. Of the new features, I'm most excited about the WebView so expect a separate article on that soon.






[1]: /post/2025/mac_menu_data/
[i1]: /images/2025/icon_doc_settings.png
[i2]: /images/2025/icon_composer.png
[i3]: /images/2025/icon_appearance.png
[i4]: /images/2025/default_tabs.png
[i5]: /images/2025/sidebar_tabs.png
[i6]: /images/2025/buttons.png
[i7]: /images/2025/hidden_titlebar.png
[i8]: /images/2025/number_entry.png
[i9]: /images/2025/webview_url.png
[i10]: /images/2025/local_web.png
[i11]: /images/2025/text_editing.png
[i12]: /images/2025/window_menu.png
[i13]: /images/2025/new_menu.png