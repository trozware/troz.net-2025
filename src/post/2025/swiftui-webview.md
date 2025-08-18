---
title: "SwiftUI WebView"
date: 2025-08-15 11:11:18
layout: layouts/post.njk
draft: true
categories: ['Swift', 'SwiftUI', 'WebView']
---

At WWDC 2025, Apple announced that SwiftUI would now have it's own `WebView`. I touched on this briefly in my [SwiftUI for Mac 2025][1] article, but this view has a lot of features that I wanted to explore and document.

My primary source was the WWDC video: [Meet WebKit for SwiftUI][2] but as usual, there is a lot of detail hidden in the video and some of the sample code doesn't work in the later betas. I'm currently using macOS Tahoe 26 beta 6 and Xcode 26 beta 5.

<!--more-->

I've written a sample app demonstrating various aspects of the new `WebView`, which you can download from [GitHub][3]. This will let you follow along as I describe the various options. The numbered sections in this article correspond to the numbered view files in the project.

### 1. WebURLView

The simplest way to use a `WebView` is to provide it with a URL:

```swift
WebView(url: URL(string: "https://www.swift.org"))
```

The URL is optional, so there's no need to force-unwrap it.

This is simple but doesn't allow any progress tracking or customization so I think I would rarely use this.

### 2. WebPageLoad

In this example, I create a `WebPage` and use it to populate the `WebView`.

Toolbar buttons switch between loading an online page:

```swift
var request = URLRequest(url: URL(string: "https://troz.net")!)
request.attribution = .user
page.load(request)
```

Or loading a local HTML string:

```swift
page.load(html: html, baseURL: Bundle.main.resourceURL!)
```

In Apple's examples, they always use `URL(string: "about:blank")!` for the `baseURL`, but using `Bundle.main.resourceURL!` lets me include a link to a stylesheet that's inside the app bundle.

### 3. TrackLoad

In the WWDC video, they demonstrated how to track the navigation events. The code in the video does not work - it doesn't even compile. But after some trial and error, I worked out how to track these events.

When the view first appears, a task starts monitoring the events:

```swift
.task {
  await startObservingEvents()
}
```

My event tracker method uses the new `Observations` sequence to read an async stream of page navigation events:

```swift
func startObservingEvents() async {
  let eventStream = Observations { page.navigations }

  for await observation in eventStream {
    do {
      for try await event in observation {
        switch event {
        case .startedProvisionalNavigation:
          statusText = "Started provisional navigation for \(page.url?.absoluteString ?? "unknown URL")\n"
        case .receivedServerRedirect:
          statusText += "Received server redirect\n"
        case .committed:
          statusText += "Committed\n"
        case .finished:
          statusText += "Finished\n"
        @unknown default:
          statusText += "Unknown navigation event\n"
        }
      }
    } catch WebPage.NavigationError.failedProvisionalNavigation(let error) {
      statusText += "Error: Failed provisional navigation: \(error.localizedDescription)\n"
    } catch WebPage.NavigationError.pageClosed {
      statusText += "Error: Page closed\n"
    } catch WebPage.NavigationError.webContentProcessTerminated {
      statusText += "Error: Web content process terminated\n"
    } catch {
      statusText += "Unknown error: \(error.localizedDescription)\n"
    }
  }
}
```

This detects the _good_ `WebPage.NavigationEvent` types: `startedProvisionalNavigation`, `receivedServerRedirect`, `committed` and `finished`. Each of the possible `WebPage.NavigationError` events is also monitored.

This seems like overkill for most use cases, but this code shows how to set it up. The key is that `page.navigations` is an `AsyncSequence<WebPage.NavigationEvent, any Error>`.

As an added extra, this sample uses the value of `page.isLoading` to show or hide a `ProgressView`. This is what I'll mostly use for tracking loads and providing user feedback during a load. If you want to get fancy, you can provide the `ProgressView` with a `value`:

```swift
if page.isLoading {
  ProgressView(value: page.estimatedProgress)
}
```

This changes it from an indeterminte spinner to a progress bar.

### 4. CustomScheme

If you want your `WebView` to load custom pages, create a custom scheme. In my [Man Reader][4] app, I use a custom scheme to load HTML versions of man pages, so I decided to try something similar here.

First, you create your scheme and then a scheme handler that actually provides the data for the web view to display. The web page's configuration ties these two together.

```swift
let scheme = URLScheme("manpage")!
let handler = ManPageSchemeHandler()
var configuration = WebPage.Configuration()
configuration.urlSchemeHandlers[scheme] = handler

page = WebPage(
  configuration: configuration
)
```

In my scheme handler struct, I try to read the relevant file from the app bundle. If the file exists, I use its data to first create a `URLResponse` and then to supply data, emitting these and any errors in an `AsyncSequence`.

```swift
struct ManPageSchemeHandler: URLSchemeHandler {
  func reply(
    for request: URLRequest
  ) -> some AsyncSequence<URLSchemeTaskResult, any Error> {
    AsyncThrowingStream { continuation in
      guard
        let bundleURL = Bundle.main.url(forResource: request.url?.host, withExtension: nil),
        let pageData = try? Data(contentsOf: bundleURL)
      else {
        continuation.finish(throwing: URLError(.badURL))
        return
      }
      let response = URLResponse(
        url: request.url!,
        mimeType: "text/html",
        expectedContentLength: pageData.count,
        textEncodingName: "utf-8"
      )
      continuation.yield(.response(response))
      continuation.yield(.data(pageData))
      continuation.finish()
    }
  }
}
```

For example, when I try to open `manpage://cal.html`, this reads the cal.html file from the bundle, uses it's URL and length to supply the URLResponse and then yields the file data.

The other part of this is using `WebPage.NavigationDeciding` to work out what to do with other links, using different schemes. Back in the initial setup phase, I created a decider and provided it to the WebPage with the configuration.

```swift
let navigationDecider = NavigationDecider()

page = WebPage(
  configuration: configuration,
  navigationDecider: navigationDecider
)
```

The decider checks the supplied URL and works out what to do with it:

```swift
class NavigationDecider: WebPage.NavigationDeciding {
  func decidePolicy(
    for action: WebPage.NavigationAction, preferences: inout WebPage.NavigationPreferences
  ) async -> WKNavigationActionPolicy {
    guard let url = action.request.url else {
      print("No URL supplied for decision")
      return .cancel
    }

    if url.scheme == "manpage" {
      print("Opening man page for \(url)")
      return .allow
    }

    print("Opening \(url) in default browser")
    NSWorkspace.shared.open(url)
    return .cancel
  }
}
```

As you can see, I first check that the `WebPage.NavigationAction` has a request with a URL. I can't imagine when this would ever be nil, but it's optional, so I check and cancel the navigation if it's missing. Then I test for my custom scheme and allow those pages to load. In this example, all other URLs open in the default browser so I use cancel to stop them opening in the `WebView`. To test this, open one of the man pages using a toolbar button and scroll to the end of the page where I added an external link.

This sample demonstrates two other `WebView` features:

By default, a `WebView` allows bouncing so the page appears to scroll sideways even though it all fits. This is really obvious is you use a trackpad and swipe sideways. To turn off this behavior, add this:

```swift
.scrollBounceBehavior(.basedOnSize, axes: [.horizontal])
```

Vertical scrolling still works and bounces, but horizontal does not, unless the content doesn't fit.

The other feature is searching in the page. Presenting the find interface works much like presenting a sheet - add a Boolean and connect it up:

```swift
@State private var findNavigatorIsPresented = false

// ...

WebView(page)
  .replaceDisabled(true)  // doesn't work yet
  .findNavigator(isPresented: $findNavigatorIsPresented)
```

I added a toolbar button to toggle `findNavigatorIsPresented` for showing and hiding the interface. I have included the `replaceDisabled(true)` modifier but it doesn't work, at least not yet or maybe only not in a `WebView`. The modifier doesn't stop the replace interface from appearing, but replacing doesn't actually work. Maybe this is how it is supposed to work, but I would prefer this to hide the replace button completely.

### 5. JavaScripting

SwiftUI's WebView provides an asynchronous method for calling Javascript on the page. In this example, I load a page from my web site and once it's loaded, I send a JavaScript command to gather all the H3 headers so I can make them into a navigation menu in the toolbar.

While I could use navigation event tracking to detect when the page has finished loading, instead I using `Task` with a sleep loop to wait until `page.isLoading` becomes false:


Once I have the list of headers, I add them to a toolbar menu for jumping around the page:


In the WWDC video, the presenter demonstrated a similar technique, although without sharing the actual JavaScript. When testing, I found it easier to write my JavaScript functions outside Swift, so the project includes my test.js file.

Another interesting demo was detecting the scroll and setting the selected section to match. I started by putting the sections into a toolbar menu with a selection parameter. When the selected section changed, I scrolled the web view to that section.

The problem with this was that when I started detecting the scroll, it also set the selected section, which scrolled to the top of the current section every time. To get around this, I made the toolbar menu a set of buttons with scroll actions. They did not set the selected section, but their titles showed a leading checkmark for the selected section. The scroll detector worked out the visible section and adjusted this display without altering the scroll.

I had an issue with the longer section names which were truncated when another section was checked. For some reason, this was fixed by using string interpolation instead of the string itself!

The scripts varied in what parameters they needed and what they returned. For parameters, you supply a `[String: Any]` dictionary with the keys being the JavaScript variable name and the values being the data sent.

The return data type is `Any?` so can be cast or mapped into the correct type for use in the Swift code.

### 6. Browser

The final example attempts to emulate a full browser. There is a URL entry field at the top and a WebView below it.

As a side-note, why can't I use a URL formatter on a `TextField`? I've tried using the sample from the Swift definition file but it doesn't compile.

The new section is tracking the browser history and adding back and forward buttons. These use the `page.backForwardList` to create their menus with a default action that goes back one or forward one.

At first, I assumed that `page.load()` required a URL, but when a typo worked, I realized that I could ask it to load a `WebPage.BackForwardList.Item` directly.

I had a problem with the back and forward menus which made me think that the list was not updating correctly. After re-purposing the refresh button to list the history items, I worked out that the menus were not being refreshed when the data changed.

To solve this, I needed to add an `id` to each menu. I needed something hashable that changed on every load, so I chose `page.isLoaded`. I realize that this is updating the menus twice as often as needed, but it works and I don't think it is too inefficient.

The other feature here is the refresh button. If you've done any web dev, you'll be familiar with the technique of reloading from origin so that you get all the latest files instead of any cached versions. Hold down the Option key to switch the refresh button to reload from origin mode.

The only issue that I haven't tackled is opening links in new tabs or windows. On this site, all external links are setbto open in a new tab and they just fail to load. I wonder is this something that a navigation decider could handle?

### Summary

After waiting several years for this view to arrive, I am not disappointed. The SwiftUI team have done a great job of integrating SwiftUI and WebKit with some modernizations that WebKit is still missing.

For my personal use, I'll be updating Man Reader to use this web view. The find-in-page, custom scheme handling and scroll detection will be great. I also have to re-write the sectioms in my books that use `WKWebView` but that will be part of the general macOS/Xcode 26 update cycle.

If you have any feedback about this article, please contact me using one of the links below or through the [Contact][contact] page. And if you found this useful, please [buy me a coffee][kofi].

[contact]: /contact/
[kofi]: https://ko-fi.com/trozware
[1]: /post/2025/swiftui-mac-2025/#web-view
[2]: https://developer.apple.com/videos/play/wwdc2025/231
[3]: https://github.com/trozware/swiftui-webview
[4]: /manreader/