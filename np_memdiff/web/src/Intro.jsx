import { useEffect, useState } from 'react'

const LINES = [
  ['external hardware detected', 'UNSIGNED BREACH CHIP'],
  ['firmware handshake', 'BURNED'],
  ['routing to lock controller', 'NODE HALCYON'],
  ['core bolt actuators', 'ARMED'],
  ['> bypass the controller before the session drops', null]
]

export default function Intro({ onDone }) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const timers = LINES.map((_, i) => setTimeout(() => setShown(i + 1), 400 + i * 450))
    timers.push(setTimeout(onDone, 400 + LINES.length * 450 + 1100))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="intro">
      {LINES.slice(0, shown).map(([label, value]) => (
        <div className="ln" key={label}>
          {value === null ? label : <>{label} {'.'.repeat(Math.max(3, 36 - label.length))} <b>{value}</b></>}
        </div>
      ))}
      <div className="legal">unauthorized access to this system is a felony — LSPA-IT 4.2.1 -- Made By Olivershot1</div>
    </div>
  )
}
