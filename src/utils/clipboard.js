/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
export async function copyToClipboard(text) {
  // 优先使用 Clipboard API (HTTPS 环境)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (e) {
      return fallbackCopy(text)
    }
  } else {
    // 降级方案: 用 textarea + execCommand
    return fallbackCopy(text)
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    const successful = document.execCommand('copy')
    return successful
  } catch (e) {
    console.error('复制失败:', e)
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}