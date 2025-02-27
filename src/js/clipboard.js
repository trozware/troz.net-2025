document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('pre')
  
  codeBlocks.forEach((codeBlock) => {
    const copyButton = document.createElement('button')
    copyButton.className = 'copy-button'
    copyButton.innerHTML = 'Copy'
    
    // Add button to code block container
    codeBlock.style.position = 'relative'
    codeBlock.appendChild(copyButton)
    
    copyButton.addEventListener('click', async () => {
      const code = codeBlock.querySelector('code').innerText

      try {
        await navigator.clipboard.writeText(code);
        copyButton.innerHTML = 'Copied!';
        setTimeout(() => {
          copyButton.innerHTML = 'Copy';
        }, 2000);
      } catch (err) {
        copyButton.innerHTML = 'Error'
      }
    })
  })
})
