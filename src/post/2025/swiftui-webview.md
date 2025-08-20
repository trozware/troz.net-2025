---
title: "SwiftUI WebView"
date: 2025-08-15 11:11:18
layout: layouts/post.njk
draft: true
categories: ['Swift', 'SwiftUI', 'WebView']
---

At WWDC 2025, Apple announced that SwiftUI would now have its own `WebView`. I touched on this briefly in my [SwiftUI for Mac 2025][1] article, but this view has a lot of features that I wanted to explore and document.

My primary source was the WWDC video: [Meet WebKit for SwiftUI][2] but as usual, there is a lot of detail hidden in the video and some of the sample code doesn't work in the later betas. I'm currently using macOS Tahoe 26 beta 7 and Xcode 26 beta 6.

<!--more-->

I've written a sample app demonstrating various aspects of the new `WebView`, which you can download from [GitHub][3]. This will let you follow along with my descriptions below. The numbered sections in this article correspond to the files in the **WebView Samples** folder of the project.

### 1. WebURLView

The simplest way to use a `WebView` is to provide it with a URL:

```swift
WebView(url: URL(string: "https://www.swift.org"))
```

The URL is optional, so there's no need to force-unwrap it.

This is easy to use but doesn't allow any progress tracking or customization so I think I would rarely choose this option.

### 2. WebPageLoad

In the next example, I created a `WebPage` and used it to populate the `WebView`.

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

In Apple's examples, they always use `URL(string: "about:blank")!` for the `baseURL`, but using `Bundle.main.resourceURL!` lets me include a link to a stylesheet that's inside the app bundle:

![Web page showing local HTML][i1]

### 3. TrackLoad

In the WWDC video, they demonstrated how to track the navigation events. The code in the video does not work - it doesn't even compile. But after some trial and error, I worked out how to track these events.

When the view first appears, a `task` starts monitoring the events:

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

This detects the `WebPage.NavigationEvent` types: `startedProvisionalNavigation`, `receivedServerRedirect`, `committed` and `finished`. Each of the possible thrown `WebPage.NavigationError` events is also monitored.

This seems like overkill for most use cases, but this code shows how to set it up. The key is that `page.navigations` is an `AsyncSequence<WebPage.NavigationEvent, any Error>`.

![Tracking events][i2]

As an added extra, this example uses the value of `page.isLoading` to show or hide a `ProgressView`. This is what I'll mostly use for tracking loads and providing user feedback during a load. If you want to get fancy, you can provide the `ProgressView` with a `value`:

```swift
if page.isLoading {
  ProgressView(value: page.estimatedProgress)
}
```

This changes it from an indeterminate spinner to a progress bar.

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

My scheme handler struct conforms to `URLSchemeHandler` and has the required `reply(for:)` method to process the request. It tries to read the relevant file from the app bundle and if the file exists, uses its data to create a `URLResponse` and then to emit the response and the file data or any error in an `AsyncSequence`.

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

For example, when I try to open `manpage://cal.html`, this reads the **cal.html** file from the bundle, uses it's URL and length to create a `URLResponse` and then yields the response and the file data before finishing the stream.

If there's a problem with the file, the stream finishes by throwing an error.

This example also uses `WebPage.NavigationDeciding` to work out what to do with other schemes. Back in the initial setup phase, I created a decider and provided it to the `WebPage`, along with the configuration.

```swift
let navigationDecider = NavigationDecider()

page = WebPage(
  configuration: configuration,
  navigationDecider: navigationDecider
)
```

My decider class conforms to `WebPage.NavigationDeciding` and has a `decidePolicy` method that checks the supplied URL and works out what to do with it:

```swift
class NavigationDecider: WebPage.NavigationDeciding {
  func decidePolicy(
    for action: WebPage.NavigationAction, 
    preferences: inout WebPage.NavigationPreferences
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

As you can see, I first check that the `WebPage.NavigationAction` has a request with a URL. I can't imagine when this would ever be nil, but it's optional, so I check and cancel the navigation if it's missing. Then I test for my custom scheme and allow those pages to load. In this example, all other URLs open in the default browser so I return `cancel` to stop them opening in the `WebView`. To test this, open one of the man pages using a toolbar button and scroll to the end of the page where I added an external link.

**Note**: In macOS Tahoe 26 beta 7 and Xcode 26 beta 6, this external navigation prints what appears to be a crash log in the console, but the app does not crash.

This example demonstrates two other `WebView` features:

By default, a `WebView` allows bouncing so the page appears to scroll sideways even though it all fits. This is really obvious is you use a track pad and swipe sideways. To turn off this behavior, add this:

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

I added a toolbar button to toggle `findNavigatorIsPresented` for showing and hiding the interface. I have included the `replaceDisabled(true)` modifier but it doesn't work in a `WebView`. The modifier doesn't stop the replace interface from appearing, but replacing doesn't actually work:

![Find navigator][i3]

Interestingly, in a `TextEditor`, it is possible to hide the replace button by adding the `replaceDisabled(true)` modifier, but the number of matches doesn't appear.

### 5. JavaScripting

SwiftUI's WebView provides an asynchronous method for calling Javascript on the page. In this example, I load a page from my web site and once it's loaded, I send a JavaScript command to gather all the **H3** headers so I can make them into a navigation menu in the toolbar.

While I could use navigation event tracking to detect when the page has finished loading, instead I use a loop containing `Task.sleep` to wait until `page.isLoading` becomes false:

```swift
func loadPage() {
  Task {
    sections = []
    let url = URL(string: pageAddress)!
    page.load(URLRequest(url: url))

    while page.isLoading {
      try? await Task.sleep(for: .milliseconds(100))
    }
    listHeaders()
  }
}
```

Once I have the list of headers, I add them to a toolbar menu for jumping around the page:

![JavaScript populated sections menu][i4]

In the WWDC video, the presenter demonstrated a similar technique, although without sharing the actual JavaScript. When testing, I found it easier to write and debug my JavaScript functions directly in the browser, so the project repo includes my **jsTests.js** file.

The methods that use JavaScript are gathered into an extension on the `JavaScripting` view. I start by using multi-line strings to create the scripts, interpolating data from the view as needed. Then a `Task` uses `try await page.callJavaScript(js)` to call the JavaScript and get the result.

The result is of type `Any?` so then I try to cast it into the type I want. Here's the full method for listing the section headers:

```swift
func listHeaders() {
  let js = """
    const headers = document.querySelectorAll("\(headerElement)")
    return [...headers].map(header => ({
      id: header.textContent.replaceAll(" ", "-").toLowerCase(),
      title: header.textContent
    }))
    """

  Task {
    do {
      let jsResult = try await page.callJavaScript(js)
      if let headers = jsResult as? [[String: Any]] {
        let pageSections = headers.map {
          SectionLink(jsEntry: $0)
        }
        await MainActor.run {
          sections = pageSections
        }
      }
    } catch {
      print(error)
    }
  }
}
```

`SectionLink` is a struct that contains the section title and ID and has a custom `init` that takes a `[String: Any]` dictionary.

In this case, I interpolated `headerElement` directly into the JavaScript string, but you can also pass it to `callJavaScript` using the `arguments` parameter. Here's how I pass in a title for working out how to scroll to its section:

```swift
let result = try await page.callJavaScript(
  js,
  arguments: ["sectionTitle": section.title]
)
```

The JavaScript now has access to the `sectionTitle` variable, which contains the title of the section to scroll to. This returns the vertical offset of the section, which I then use to scroll the web view to that position.

Managing the web view's scrolling has several components. First, an `@State` property holds a `ScrollPosition`.

```swift
@State private var currentScroll = ScrollPosition()
```

Next, bind this property to the `WebView` using `webViewScrollPosition`:

```swift
WebView(page)
  .webViewScrollPosition($currentScroll)
```

Finally, when the JavaScript returns a value for the section offset, use this property to adjust the scroll:

```swift
withAnimation(.easeInOut(duration: 0.25)) {
  currentScroll.scrollTo(y: offset)
}
```

The animation makes the scroll look better, instead of jumping suddenly to the new location.

Another interesting part of the WWDC demo was detecting the scroll and setting the selected section to match. I had started by putting the sections into a `Picker` with a selection parameter. When the selected section changed, I scrolled the web view to that section.

That worked fine until I started detecting the scroll, which also set the selected section, which reset the scroll to the top of the current section every time. To get around this, I made the toolbar item into a menu with a set of buttons with scroll actions. They did not set the selected section, but their titles showed a leading checkmark for the selected section. The scroll detector worked out the visible section and set the selected section without altering the scroll.

To monitor the scroll position, I added this modifier to the `WebView`:

```swift
.webViewOnScrollGeometryChange(for: CGFloat.self, of: \.contentOffset.y) { _, newValue in
  adjustSelectionTo(scrollPosition: newValue)
}
```

The `adjustSelectionTo(scrollPosition:)` method uses another chunk of JavaScript to work out which section is now visible and the result of this is used to update the selected section property.

I had an issue with the longer section names which were truncated when another section was checked. This was fixed by using string interpolation instead of the string itself when showing the title without the checkmark. I'm not sure why this works, but I assume string interpolation forces the view to re-calculate its width each time.

### 6. Browser

The final example attempts to emulate a browser. There is a URL entry `TextField` at the top and a `WebView` below it.

The new part here is tracking the browser history and adding back and forward buttons. These use the `page.backForwardList` to create their menus with a primary action that goes back one or forward one.

![Browser history][i5]

At first, I assumed that `page.load()` required a `URL` or a `URLRequest`, but then I realized that I could also ask it to load a `WebPage.BackForwardList.Item` directly.

I had a problem with the back and forward menus which made me think that the history was not updating correctly. After temporarily re-purposing the refresh button to list the history items, I worked out that history list was correct but the menus were not being updated when the list changed.

To solve this, I added an `id` to each menu that would trigger an update when its value changed. I needed something hashable that changed on every load, so I chose `page.isLoading`. I realize that this is updating the menus twice as often as needed, but it works and I don't think it is too inefficient.

The other feature here is the refresh button. If you've done any web dev, you'll be familiar with the technique of reloading from origin so that you get all the latest files instead of any cached versions. Hold down the Option key to switch the refresh button to reload from origin mode.

The only issue that I haven't tackled is opening links in new tabs or windows. On this site, all external links are set to open in a new tab and they just fail to load. I wonder is this something that a navigation decider could handle?

### Summary

After waiting several years for this view to arrive, I am not disappointed. The SwiftUI team have done a great job of integrating SwiftUI and WebKit with some modernizations that WebKit is still missing.

For my personal use, I'll be updating Man Reader to use this web view. The find-in-page, custom scheme handling and scroll detection will be great. I also have to re-write the sections in my books that use `WKWebView` but that will be part of the general macOS/Xcode 26 update cycle.

All the sample code from this article is on [GitHub][3] so I encourage you to download it and see how it works. Make changes, and please let me know if you find any errors or can suggest improvements using one of the links below or through the [Contact][contact] page. And if you found this article useful, please [buy me a coffee][kofi].

[contact]: /contact/
[kofi]: https://ko-fi.com/trozware
[1]: /post/2025/swiftui-mac-2025/#web-view
[2]: https://developer.apple.com/videos/play/wwdc2025/231
[3]: https://github.com/trozware/swiftui-webview
[4]: /manreader/
[i1]: /images/2025/web_page.png
[i2]: /images/2025/web_track.png
[i3]: /images/2025/web_find.png
[i4]: /images/2025/web_js.png
[i5]: /images/2025/web_browser.png