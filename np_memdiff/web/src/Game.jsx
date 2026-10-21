import { useEffect, useRef, useState } from 'react'

const hex = () => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')

function generate({ rows, columns, diffs }) {
  const n = rows * columns
  const a = Array.from({ length: n }, hex)
  const b = a.slice()
  const targets = new Set()
  while (targets.size < Math.min(diffs, n - 1)) targets.add(Math.floor(Math.random() * n))
  targets.forEach((i) => { let v; do v = hex(); while (v === a[i]); b[i] = v })
  return { a, b, targets }
}

function Image({ title, side, bytes, cols, rows, cur, found, missed, onPick }) {
  return (
    <div className="pane">
      <h2>{title}</h2>
      {Array.from({ length: rows }, (_, r) => (
        <div className="row" key={r}>
          <span className="addr">0x{(0xC000 + r * cols).toString(16).toUpperCase().padStart(4, '0')}</span>
          {Array.from({ length: cols }, (_, c) => {
            const i = r * cols + c
            const cls = ['b',
              side === 'B' && i === cur && 'cur',
              side === 'A' && i === cur && 'ghost',
              found.has(i) && 'found',
              side === 'B' && missed.has(i) && 'miss'].filter(Boolean).join(' ')
            return <span key={i} className={cls} onClick={side === 'B' ? () => onPick(i) : undefined}>{bytes[i]}</span>
          })}
        </div>
      ))}
    </div>
  )
}

export default function Game({ cfg, onEnd }) {
  const { rows, columns: cols, diffs, strikes: maxStrikes, seconds } = cfg
  const [data] = useState(() => generate(cfg))
  const [cur, setCur] = useState(0)
  const [found, setFound] = useState(() => new Set())
  const [missed, setMissed] = useState(() => new Set())
  const [strikes, setStrikes] = useState(maxStrikes)
  const [left, setLeft] = useState(seconds * 1000)
  const [won, setWon] = useState(false)
  const [over, setOver] = useState(false)
  const overRef = useRef(false)

  const finish = (ok, why) => {
    if (overRef.current) return
    overRef.current = true
    setOver(true)
    if (ok) { setWon(true); setTimeout(() => onEnd(true), 1100) }
    else onEnd(false, why)
  }

  const mark = (i) => {
    if (overRef.current || found.has(i) || missed.has(i)) return
    if (data.targets.has(i)) {
      const next = new Set(found).add(i)
      setFound(next)
      if (next.size === data.targets.size) finish(true)
    } else {
      setMissed(new Set(missed).add(i))
      const left = strikes - 1
      setStrikes(left)
      if (left <= 0) finish(false, 'too many strikes')
    }
  }

  // countdown
  useEffect(() => {
    const t0 = Date.now(), total = seconds * 1000
    const id = setInterval(() => {
      const rem = Math.max(0, total - (Date.now() - t0))
      setLeft(rem)
      if (rem <= 0) finish(false, 'timed out')
    }, 100)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keyboard: WASD + arrows, Enter/Space to mark, Esc to disconnect
  useEffect(() => {
    const onKey = (e) => {
      if (overRef.current) return
      const r = Math.floor(cur / cols), c = cur % cols
      const k = e.key, code = e.code
      let n = cur
      if (k === 'ArrowLeft' || code === 'KeyA') n = r * cols + Math.max(0, c - 1)
      else if (k === 'ArrowRight' || code === 'KeyD') n = r * cols + Math.min(cols - 1, c + 1)
      else if (k === 'ArrowUp' || code === 'KeyW') n = Math.max(0, r - 1) * cols + c
      else if (k === 'ArrowDown' || code === 'KeyS') n = Math.min(rows - 1, r + 1) * cols + c
      else if (k === 'Enter' || k === ' ') { e.preventDefault(); return mark(cur) }
      else if (k === 'Escape') return finish(false, 'disconnected')
      else return
      e.preventDefault()
      setCur(n)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const shared = { cols, rows, cur, found, missed, onPick: (i) => { setCur(i); mark(i) } }

  return (
    <div className="game">
      <div className="sub">
        {won
          ? 'NODE MERIDIAN — BYPASS COMPLETE — access granted'
          : `NODE MERIDIAN — MEMORY DIFF — bypass in progress [${(left / 1000).toFixed(1)}s]`}
      </div>
      <div className="panes">
        <Image title="IMAGE A" side="A" bytes={data.a} {...shared} />
        <Image title="IMAGE B" side="B" bytes={data.b} {...shared} />
      </div>
      <div className="stat">
        <span>FOUND {found.size}/{data.targets.size}</span>
        <span>STRIKES LEFT {strikes}</span>
      </div>
      <div className="track"><div className="bar" style={{ width: `${(left / (seconds * 1000)) * 100}%` }} /></div>
      <div className="hint">[WASD / ←↑↓→] move [ENTER] mark byte [ESC] disconnect</div>
    </div>
  )
}
