import chroma from 'chroma-js'

export function getPersistentColor(seed: string) {
  const base64seed = btoa(seed)

  // 1. Simple hashing function to turn a string into a number
  let hash = 0
  for (let i = 0; i < base64seed.length; i++) {
    hash = base64seed.charCodeAt(i) + ((hash << 5) - hash)
  }

  // 2. Map the hash to a 0-360 degree Hue
  // We use Math.abs to ensure a positive number
  const hue = Math.abs(hash) % 360

  // 3. Return a color with consistent Lightness and Saturation
  // L: 65 (not too dark, not too bright), C: 50 (pleasant saturation)
  return chroma.lch(65, 50, hue).hex()
}
