export const postInfo = (content) => {
  return `${wordCount(content)} words • ${readingTime(content)}`
}

export const wordCount = (content) => {
  const regExpCode = /<pre class=(.|\n)*?<\/pre>/gm
  const fixedContent = content.replace(regExpCode, "")
  const wordCount = fixedContent.split(/\s+/).length
  return wordCount
}

export const readingTime = (content) => {
  const time = timeToRead(content)
  return time > 1 ? `${time} minutes` : `${time} minute`
}

export const timeToRead = (content) => {
  const getPlainText = content => {
    const html = content.templateContent || content
    if (typeof html !== "string") {
      throw new Error("Time-to-read's input must be a string or template")
    }

    const htmlTags = String.raw`<\/?[a-z0-9]+\b[^>]*>`
    // regex = '<!--' + the minimal amount of 0 or more characters + '-->'
    const htmlComments = String.raw`<!--[^]*?-->`
    // remove any tags or comments
    return html.replace(
      new RegExp(String.raw`${htmlTags}|${htmlComments}`, "gi"),
      ""
    )
  }

  const rawText = getPlainText(content)
  const wpm = 225
  const words = rawText.trim().split(/\s+/).length
  const time = Math.ceil(words / wpm)
  return time
}
