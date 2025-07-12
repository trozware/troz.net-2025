---
title: "Man Reader 2.1"
date: 2025-04-29T09:23:53+10:00
layout: layouts/post.njk
draft: false
categories: ["Man Reader", "macOS"]
---

I've just released Man Reader 2.1. Visually, this is very similar to the previous version, but there are a lot of quality of life improvements under the hood.

The most important feature of this release is that the app no longer crashes when typing fast into the search field. Sorry it took me so long to fix this, which was due to the way the app communicated between the AppKit list in the sidebar and the SwiftUI search field. SwiftUI lists have become a lot more performant, so I put a lot of effort into trying to make the entire app SwiftUI but in the end, it was just too sluggish so I reverted to AppKit, but with added traps to avoid crashing.

<!--more-->

<a href="https://apps.apple.com/app/id522583774" class="mac_app_button" title="Download on the Mac App Store" rel="noreferrer nofollow noopener external" target="_blank"></a>

Here is a list of the other improvements:

- Use **Command-L** to focus on the man page list at any time. **Shift-Tab** will focus on the main search field. **Tab** cycles through everything including the man page itself, so if it looks like nothing has focus, you can use the arrow keys to scroll the page.
- The menus correctly identify and target the front most window and tab - tabs were not always correctly identified before.
- **Pages with Notes** is a new category in the Sections menus.
- The full path to the selected man page is displayed in the bottom status bar.
- In-page searching is more efficient and searches for 2 characters instead of waiting for 3.
- Accessibility support is improved with more complete VoiceOver descriptions of controls.
- The selected section for each window or tab is now remembered between launches.
- The app quits when the last window is closed. I'm not sure if I should make this an option, so if you have strong feelings about this, please contact me.
- Pages from non-standard locations now have the correct bookmarked scopes to appear.
- The man page display loads faster and no longer scrolls sideways or flickers.
- The list of man pages has the option to use alternating row backgrounds.

---

My experiments with using SwiftUI lists were interesting. They have definitely improved a lot over the last year, but they still can't compete with AppKit lists once you get more than about 5,000 entries. Maybe this years updates will change that as I love the simplicity of using SwiftUI.

[3]: http://itunes.apple.com/app/man-reader/id522583774?mt=12
