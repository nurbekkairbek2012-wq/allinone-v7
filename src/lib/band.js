// IELTS bands are only ever reported in 0.5 increments (4.0, 4.5, 5.0, 5.5, 6.0, ...)
// Never values like 5.3 or 6.7 — this rounds any raw computed number to the
// nearest valid IELTS band, clamped to the official 1.0–9.0 range.
export function toIeltsBand(raw) {
  const n = parseFloat(raw)
  if (Number.isNaN(n)) return 0
  const rounded = Math.round(n * 2) / 2
  return Math.min(9, Math.max(1, rounded))
}

// Same as toIeltsBand but returns a fixed string for display, e.g. "6.5"
export function toIeltsBandStr(raw) {
  return toIeltsBand(raw).toFixed(1)
}
