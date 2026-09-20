'use strict'

/**
 * The 12 fixed colors of the remote, plus the multicolor cycle.
 * Hue and saturation are derived from the hex values so that the native
 * color wheel can be snapped onto the closest available color.
 */
const COLORS = [
  { id: 'COLOR_ORANGE', hex: '#ff7a00' },
  { id: 'COLOR_APPLE_GREEN', hex: '#7fdb2e' },
  { id: 'COLOR_NAVY_BLUE', hex: '#1b2e8c' },
  { id: 'COLOR_WHITE', hex: '#ffffff' },
  { id: 'COLOR_TEAL', hex: '#0e7c7b' },
  { id: 'COLOR_LILAC', hex: '#c8a2e0' },
  { id: 'COLOR_YELLOW', hex: '#ffd400' },
  { id: 'COLOR_CYAN', hex: '#00e5ff' },
  { id: 'COLOR_PINK', hex: '#ff3d9e' },
  { id: 'COLOR_LIGHT_PINK', hex: '#ffb6d5' },
  { id: 'COLOR_MINT_BLUE', hex: '#7fffd4' },
  { id: 'COLOR_MAGENTA', hex: '#e5008f' },
]

/**
 * Converts `#rrggbb` to the hue/saturation range Homey uses (0..1).
 */
function hexToHueSaturation(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  if (delta === 0) return { hue: 0, saturation: 0 }

  let hue
  if (max === r) hue = ((g - b) / delta) % 6
  else if (max === g) hue = (b - r) / delta + 2
  else hue = (r - g) / delta + 4

  hue = (hue * 60 + 360) % 360

  return { hue: hue / 360, saturation: delta / max }
}

const PALETTE = COLORS.map(color => ({ ...color, ...hexToHueSaturation(color.hex) }))

/**
 * Finds the remote color closest to a point on the native color wheel.
 * Hue is compared on a circle, and weighted by saturation so that washed out
 * picks land on white instead of on a random hue.
 */
function nearestColor(hue, saturation) {
  let best = null
  let bestDistance = Infinity

  for (const color of PALETTE) {
    let hueDelta = Math.abs(hue - color.hue)
    if (hueDelta > 0.5) hueDelta = 1 - hueDelta

    const saturationDelta = saturation - color.saturation
    const meanSaturation = (saturation + color.saturation) / 2
    const distance = (hueDelta * 2 * meanSaturation) ** 2 + saturationDelta ** 2

    if (distance < bestDistance) {
      bestDistance = distance
      best = color
    }
  }

  return best
}

function getColor(id) {
  return PALETTE.find(color => color.id === id) ?? null
}

module.exports = { PALETTE, nearestColor, getColor }
