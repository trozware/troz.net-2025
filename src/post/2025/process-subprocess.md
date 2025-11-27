---
title: 'Moving from Process to Subprocess'
date: 2025-11-27T10:12:50+10:00
layout: layouts/post.njk
draft: true
categories: ['macOS', 'Terminal', 'Process', 'Subprocess']
---

For many years, I've used `Process` to call Terminal commands from my macOS apps. `Process` is an old technology, formerly known as `NSTask`. It works, but it's complicated to set up and it can have issues. The Swift language team have now published a modern alternative called [`Subprocess`][1]. Since I'm currently using `Process` in my [Man Reader][2] app and in my [macOS Apps Step by Step][3] book, I thought it was time to assess the new option and see if I should swap to it.

<!--more-->

I started by creating a sample project using the macOS App template. Then I added the package dependency by searching for `https://github.com/swiftlang/swift-subprocess`. This also adds `swift-system` which the ReadMe says _provides idiomatic interfaces to system calls and low-level currency types_. Next, I removed the **App Sandbox** in **Target -> Signing & Capabilities**. Man Reader gets round the sandbox restrictions using temporary entitlements and security-scoped bookmarks, but I didn't want to complicate my tests with those. I set up my sample app with two tabs so I could directly compare `Subprocess` and `Process`. Each tab has the same buttons that run the same Terminal commands, but using the two different methods. I also switched the build settings to use **Swift 6** as I am gradually adopting this in all my projects.

![Subprocess Test App][i2]

The first step was to try a simple command with no parameters. In **SubprocessView.swift**, I imported the `Subprocess` library, and set the **whoami** button to call this method using a `Task`:

```swift
func runWhoami() async {
  let output = try? await run(
    .name("whoami"),
    output: .string(limit: 4096)
  )
  print(output ?? "no result from whoami")
}
```

This is based on the first example in the Subprocess ReadMe. It uses `ls` but I used `whoami` in my book, so I changed to that. I resumed the Live Preview, clicked the button, and the Canvas console showed this, which I've split on to two lines here for readability:

```text
CollectedResult<StringOutput<UTF8>, DiscardedOutput>(processIdentifier: 14711,
terminationStatus: exited(0), standardOutput: Optional("sarah\n"), standardError: ())
```

There are immediate benefits to using Subprocess. I didn't have to specify the full path to the `whoami` command, and I didn't have to set up a pipe and a file handle to see the result. The type of `result` is a `CollectedResult` which contains the `processIdentifier`, `terminationStatus`, `standardOutput` and `standardError`. A `terminationStatus` of 0 means the command completed successfully.

> **NOTE**: If I had wanted to use a particular version of `whoami`, I could have specified the full path like this:
>
> ```swift
> let output = try? await run(
>   .path("/usr/bin/whoami"),
>   output: .string(limit: 4096)
> )
> ```
>
> This option requires `import System` in order to have access to the `FilePath` type.

To get the output I wanted into a `String`, I added:

```swift
let result = output?.standardOutput ?? "unknown"
print("whoami: \(result)")
```

Next I wanted to test sending arguments. I added a new **ping** button and set it to call this method:

```swift
func runPing() async {
  let commandName = "ping"
  let arguments = ["-c", "5", "apple.com"]

  let output = try? await run(
    .name(commandName),
    arguments: arguments,
    output: .string(limit: 4096)
  )
  print(output?.standardOutput ?? "no result from ping")
}
```

That's when I found out that `arguments` must be an array of `Arguments`, not `Strings`. This was solved by changing the second setup line to:

```swift
let arguments = Arguments(["-c", "5", "apple.com"])
```

This worked, but there was no output for about 5 seconds, then it all appeared. Reading further down the Subprocess ReadMe I saw a way to stream the output as an `AsyncSequence`, so after a bit of experimentation and some help from ChatGPT, I arrived at this `runPing` method:

```swift
func runPing() async {
  let commandName = "ping"
  let arguments = Arguments(["-c", "5", "apple.com"])

  async let pingResult = run(
    .name(commandName),
    arguments: arguments
  ) { execution, standardOutput in
    for try await line in standardOutput.lines() {
      print(line.trimmingCharacters(in: .whitespacesAndNewlines))
    }
  }
  if let result = try? await pingResult {
    print("Ping result = \(result)")
  } else {
    print("No result from ping")
  }
}
```

It's essential to `await pingResult` or the method ends before any data arrives.

This worked, but I was still getting the complete output at the end, and not seeing each line as it arrived. To help in my research, I selected **Build Documentation** from the **Product** menu which gave me the docs for `Subprocess` in Xcode's Developer Documentation. There are a lot of custom types, but only one function - `run` - which has 14 different versions. Seven of these variants expect an `Executable`, which is what I've been using when I specify a `.name`. The others expect a `Configuration` which is a way of combining an executable and its arguments plus other configuration details, into a single object.

I also discovered that the versions that streamed data had a `preferredBufferSize` setting. The docs say:

> Larger buffer sizes may improve performance for subprocesses that produce large amounts of output, while smaller buffer sizes may reduce memory usage and improve responsiveness for interactive applications.

I set the `preferredBufferSize` to 32 and watched the lines come in one by one. It would be great if there was an option to buffer until a line feed, but this is workable.

This basically covers how I use `Process` in [macOS Apps Step by Step][3], so now on to what [Man Reader][2] needs. It uses `find` to search for man pages, `man` with a `-w` argument to find the path to a man page, and `mandoc` with `col` to get the formatted page data. This adds two new challenges: `find` will return a _lot_ of data and `mandoc` needs to pipe its output to `col`.

Starting with `find`, Man Reader searches the `/opt` and `/usr` directories by default. On my system, `/opt` contains 32504 man pages and `/usr` has 2979. For both of these, I was able to use the basic form of `run`, but I set the output string limit to `Int.max`. This is _way_ more than necessary, but better to be safe.

```swift
func findManPages(in directory: String) async {
  let commandName = "find"
  let arguments = Arguments([directory, "-path", "*/man/*.*"])

  let config = Configuration(.name(commandName), arguments: arguments)
  let output = try? await run(config, output: .string(limit: Int.max))

  if let result = output?.standardOutput {
    let pages = result.components(separatedBy: .newlines)
    print("found \(pages.count) man pages in \(directory)")
    print("string length = \(result.count)")
  } else {
    print("error finding man pages in \(directory)")
  }
}
```

This time, I used a `Configuration` to assemble the command and its arguments, then passed that to the appropriate version of `run`.

I tested streaming the results, but that was more CPU intensive, even when using the default `preferredBufferSize`. I added some timing routines so I could compare it to the `Process` version. On my Mac, searching `/usr` takes between 400 and 500 milliseconds, and searching `/opt` takes between 1.2 and 2.5 seconds. Since this is all async code, the app remains totally responsive during this time.

The last problem I needed to solve was how to pipe the output from one command to another. When using `Process`, this is surprisingly easy - you create a pipe and set it as the `standardOutput` for the first command. Then you set the same pipe as the `standardInput` for the second command.

Checking the `run` options, I can see that some variants have an `input` parameter. So if I get the output from the first command, I can set it as the input for the second. The command I want to run is:

```sh
mandoc -T ascii /usr/share/man/man1/ls.1 | col -b
```

Here's what I came up with. This has the page to the `ls` man page hard-coded for testing:

```swift
func runPipedCommands() async {
  let manPagePath = "/usr/share/man/man1/ls.1"

  let commandName1 = "mandoc"
  let arguments1 = Arguments(["-T", "ascii", manPagePath])

  let commandName2 = "col"
  let arguments2 = Arguments(["-b"])

  let output1 = try? await run(
    .name(commandName1),
    arguments: arguments1,
    output: .string(limit: 100_000)
  )

  guard let outputString = output1?.standardOutput else {
    print("no output from \(commandName1)")
    return
  }

  // Uncomment the next two lines to see what happens without `col`
  //    print(outputString)
  //    return

  let output2 = try? await run(
    .name(commandName2),
    arguments: arguments2,
    input: .string(outputString),
    output: .string(limit: 100_000)
  )

  if let result = output2?.standardOutput {
    print(result)
  } else {
    print("no output from \(commandName2)")
  }
}
```

If you want to see why the `col -b` part is essential, uncomment the two marked lines and you'll see a result that starts like this:

![mandoc wihout col][i1]

The second tab has the same buttons with the same commands, but they run using `Process`. For the `find` command, the times are much the same, but I have to stream the incoming data as I did with `pipe`. Without this, the app freezes and the process never completes.

After these experiments, I **will** be moving to `Subprocess` in both the book and the app. Over the years I have added many tweaks, fail-safes, and workarounds to handle all the things that can go wrong with `Process`, but it will be great to use a more modern API without these issues. Sadly, I can't use it everywhere. I have a client app that uses `Process` but it has to support systems back to macOS 11 and it looks like`Subprocess` only goes back to macOS 13.

My sample app is available on GitHub: [https://github.com/trozware/subprocess-tests](https://github.com/trozware/subprocess-tests).

If you have any feedback about this article, please contact me using one of the links below or through the [Contact][contact] page. And if you found this useful, please [buy me a coffee][kofi].

[contact]: /contact/
[kofi]: https://ko-fi.com/trozware
[1]: https://github.com/swiftlang/swift-subprocess
[2]: /manreader/
[3]: /books/macos_apps_step_by_step/
[i1]: /images/2025/mandoc_no_col.png
[i2]: /images/2025/subprocess_app.png
