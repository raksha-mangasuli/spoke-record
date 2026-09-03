// Read an image File and return a data URL, downscaled so its longest edge is at
// most maxDim px. Small images are returned as-is. Kept simple on purpose: the
// output lands in localStorage next to the bike photo, so full-size phone
// captures (3-5 MB) would otherwise crowd the ~5 MB quota.
export async function fileToDownscaledDataUrl(
  file: File,
  maxDim = 1600,
  quality = 0.85
): Promise<string> {
  const originalDataUrl = await readAsDataUrl(file)
  const img = await loadImage(originalDataUrl)

  const longestEdge = Math.max(img.naturalWidth, img.naturalHeight)
  if (longestEdge <= maxDim) return originalDataUrl

  const scale = maxDim / longestEdge
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.naturalWidth * scale)
  canvas.height = Math.round(img.naturalHeight * scale)

  const ctx = canvas.getContext('2d')
  if (!ctx) return originalDataUrl

  // White fill first so transparent PNGs do not flatten onto black.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/jpeg', quality)
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = src
  })
}
