export function normalizeThumbstick (input : number, deadZone = 0) {
  const rel = (input - 128) / 128
  if (Math.abs(rel) <= deadZone) return 0
  return Math.min(1, Math.max(-1, rel))
}

export function normalizeTrigger (input : number, deadZone = 0) {
  return Math.min(1, Math.max(deadZone, input / 255))
}
