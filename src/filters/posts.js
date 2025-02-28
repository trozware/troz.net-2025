export const postSummary = (post) => {
  if (post.content) {
    const excerpt = post.content.toString()
    if (excerpt.includes('<!--more-->')) {
        const parts = excerpt.split('<!--more-->')
        return parts[0]
    } else {
        let summary = ''
        let numChars = 0

        const lines = excerpt.split('</p>')
        for (const line of lines) {
            summary += line + '</p>'
            numChars += line.length

          if (numChars > 500) {
            break
          }
        }
        return summary
    }
  } else {
    return post.data.description
  }
}

export const postInfo = (content) => {
    return `${wordCount(content)} words • ${readingTime(content)}`
}

const wordCount = (content) => {
  const regExpCode = /<pre class=(.|\n)*?<\/pre>/gm
  const fixedContent = content.replace(regExpCode, "")
  const wordCount = fixedContent.split(/\s+/).length
  return wordCount.toLocaleString()
}

const readingTime = (content) => {
  const time = timeToRead(content)
  return time > 1 ? `${time} minutes  reading time.` : `${time} minute  reading time.`
}

const timeToRead = (content) => {
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
