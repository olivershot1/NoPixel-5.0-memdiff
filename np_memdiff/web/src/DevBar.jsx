import { useEffect, useState } from 'react'

// Browser-only test bar (never rendered inside FiveM)
export default function DevBar({ onStart }) {
  const [v, setV] = useState({ diffs: 4, strikes: 2, columns: 8, rows: 10, seconds: 26 })
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value })
  const run = (e) => { e?.currentTarget?.blur(); onStart(v) }

  useEffect(() => { onStart(v) }, []) // autostart on load


  return (
    <div className="dev">
      <button onClick={run}>Start hack</button>
      {[['find', 'diffs'], ['strikes', 'strikes'], ['cols', 'columns'], ['rows', 'rows'], ['secs', 'seconds']].map(([label, key]) => (
        <label key={key}>{label} <input type="number" value={v[key]} onChange={set(key)} /></label>
      ))}
    </div>
  )
}
