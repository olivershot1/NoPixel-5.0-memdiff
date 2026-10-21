// FiveM serves the UI from a cfx-nui-* host; anything else is browser test mode.
export const IN_GAME = window.location.hostname.startsWith('cfx-nui-') || !!window.invokeNative

export const clamp = (v, lo, hi, def) => Math.max(lo, Math.min(hi, Math.floor(Number(v)) || def))

export const normalize = (c = {}) => ({
  diffs: clamp(c.diffs, 1, 40, 4),
  strikes: clamp(c.strikes, 1, 20, 2),
  seconds: clamp(c.seconds, 5, 300, 26),
  columns: clamp(c.columns, 3, 16, 8),
  rows: clamp(c.rows, 3, 16, 10)
})

export function post(success) {
  if (!IN_GAME) { console.log('[np_memdiff] result:', success); return }
  const res = window.GetParentResourceName ? window.GetParentResourceName() : 'np_memdiff_react'
  fetch(`https://${res}/result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success })
  })
}
