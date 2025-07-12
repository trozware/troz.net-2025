---
title: "Swift Measurements"
date: 2025-04-16 09:47:17
layout: layouts/post.njk
draft: false
categories: ['Swift']
---

Recently, I was working with units and unit conversions in Swift. After a while, I then remembered that Swift has a built-in structure for doing this: `Measurement`. This article is an introduction to the power and usage of `Measurement`.

<!--more-->

To use a `Measurement`, you initialize it with a value and a unit type. The value must be a `Double` and the unit type specifies the type of measurement and the scale of the units. Here's an example of specifying a length in centimeters:

```swift
let length = 1234.56
let lengthMeasurement = Measurement(value: length, unit: UnitLength.centimeters)
```

There are many supported unit types. They all begin with `Unit`, so start typing and see what you get. Once you have the unit type, enter a period and code completion will suggest all the possible units for that type. There's a huge range, including some very obscure ones:

![Measurement init][i1]

I'm running this in a playground and when I print `lengthMeasurement` I get `1234.56 cm` as you'd expect.

The magic happens when you start formatting the `Measurement`. 

```swift
let formattedLength = lengthMeasurement.formatted()
print(formattedLength)
```

Running this code gave me **12 m** which is a much more readable version.

Playing around with larger and smaller values, I got it to show **cm**, **m** or **km**. It even added in the thousands separator when I went to a really big number. Strangely, I couldn't get it to use a smaller unit than the one I started with. Even with 0.00001 cm, it still didn't use **mm**, so I guess the lesson there is to start with the smallest units you want to show.

Now for the super cool bit. I went into **System Settings -> General -> Language & Region** and changed **Measurement system** from **Metric** to **US**. Running the playground now, my original value of 1234.56 cm gave a formatted value of **41 ft**! A larger value gave me **mi** (miles) and a smaller one showed **in** (inches). So the formatting uses the system setting to choose what units to show. There's no need to convert measurements to suit your user's locale - a formatted `Measurement` does that for you!

### Converting

But what if you want to show the conversion? I like to cook and most recipes online assume the everyone uses Fahrenheit for their ovens. My thanks to all the recipe writers who show Celsius as well, it's greatly appreciated.

As you can imagine, I spend some time in the kitchen talking to my wrist so that my Apple Watch and Siri can do the conversion for me:

![Temperature conversion][i2]

In this screenshot, the result of my query shows both Fahrenheit and Celsius. Let's try that in the playground.

Firstly, `Measurement` can do conversions, like this:

```swift
let fahrenheit = 400.0
let fahrenheitMeasurement = Measurement(
  value: fahrenheit,
  unit: UnitTemperature.fahrenheit
)
print(fahrenheitMeasurement)

let celsiusMeasurement = fahrenheitMeasurement.converted(to: .celsius)
print(celsiusMeasurement)
```

This prints **400.0 °F** and **204.44444444444832 °C**. If you need to access the numeric result of the conversion, you can get the `Double` using `celsiusMeasurement.value`.

But as you'd expect, if you use `formatted`, both versions are shown in Celsius because that's my system setting:

```swift
print("\(fahrenheitMeasurement.formatted()) = \(celsiusMeasurement.formatted())")
```

This prints **204.444444°C = 204.444444°C** which while factually indisputable, is not at all helpful. And it shows far too many decimal places - my oven is not that accurate!.

Here's where we can use a `MeasurementFormatter` which allows us to specify several parameters:

```swift
let formatter = MeasurementFormatter()
formatter.unitOptions = .providedUnit
formatter.numberFormatter.maximumFractionDigits = 0
formatter.unitStyle = .medium
```

With this in place, I tried:

```swift
let formattedFahrenheit = formatter.string(from: fahrenheitMeasurement)
let formattedCelsius = formatter.string(from: celsiusMeasurement)

print("\(formattedFahrenheit) = \(formattedCelsius)")
```

And got **400°F = 204°C** which is even more useful for cooking than the display my watch showed.

The key for showing both temperatures was to set the `unitOptions` to `providedUnit` which made it use the unit specified in the `Measurement`.
After that, `numberFormatter` is a standard `NumberFormatter` with all its options. `unitStyle` can be `short`, `medium` or `long`. The default is `medium` but I specified it so I could experiment with the different styles.

So any time you find yourself working with units and conversions, give `Measurement` a try. It handles localization, conversion and formatting for you.

If you have any feedback about this article, please contact me using one of the links below or through the [Contact][contact] page. And if you found this useful, please [buy me a coffee][kofi].

[contact]: /contact/
[kofi]: https://ko-fi.com/trozware
 
[i1]: /images/2025/measure_init.png
[i2]: /images/2025/watch_convert.png