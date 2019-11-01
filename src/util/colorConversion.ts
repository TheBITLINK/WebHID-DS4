export function processHue (p : number, q : number, t : number) {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1/6) return p + (q - p) * 6 * t
  if (t < 1/2) return q
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
  return p
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * 
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 * 
 * @param h - The hue
 * @param s - The saturation
 * @param l - The lightness
 * @returns The RGB representation
 */
export function hslToRgb (h : number, s : number, l : number) {
  const outColor = { r: 0, g: 0, b: 0 }

  if (s === 0) {
    outColor.r = outColor.g = outColor.b = l * 255 // Achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q

    outColor.r = processHue(p, q, h + 1 / 3) * 255
    outColor.g = processHue(p, q, h) * 255
    outColor.b = processHue(p, q, h - 1 / 3) * 255
  }

  return outColor
}
