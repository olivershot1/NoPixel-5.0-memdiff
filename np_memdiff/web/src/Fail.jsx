import { useEffect, useState } from 'react'

export default function Fail({ why, onDone }) {
  const [left, setLeft] = useState(6)

  useEffect(() => {
    if (left <= 0) { onDone(); return }
    const t = setTimeout(() => setLeft((n) => n - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left])

  return (
    <div className="fail">
      <div className="failTitle">CHALLENGE FAILED</div>
      <div className="failLine">
        {why === 'timed out' ? 'The session dropped before the bypass finished.' : 'The chip cooked itself halfway in.'}
      </div>
      <div className="failSub">intrusion countermeasures tripped — terminal releasing in {left}s</div>
      <div className="legal">unauthorized access to this system is a felony — LSPA-IT 4.2.1 -- Made By Olivershot1</div>
    </div>
  )
}
