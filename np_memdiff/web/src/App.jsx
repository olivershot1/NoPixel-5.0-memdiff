import { useCallback, useEffect, useRef, useState } from 'react'
import Intro from './Intro.jsx'
import Game from './Game.jsx'
import Fail from './Fail.jsx'
import DevBar from './DevBar.jsx'
import { IN_GAME, normalize, post } from './nui.js'

export default function App() {
  // session: null (hidden) | { id, cfg, phase: 'intro' | 'game' | 'fail', why }
  const [session, setSession] = useState(null)
  const idRef = useRef(0)

  const start = useCallback((cfg) => {
    setSession({ id: ++idRef.current, cfg: normalize(cfg), phase: 'intro' })
  }, [])

  const close = useCallback((ok) => { setSession(null); post(ok) }, [])

  useEffect(() => {
    const onMsg = (e) => { if (e.data?.action === 'start') start(e.data) }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [start])

  // Esc during the intro = disconnect
  useEffect(() => {
    if (session?.phase !== 'intro') return
    const onKey = (e) => { if (e.key === 'Escape') close(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [session?.phase, close])

  const onGameEnd = (ok, why) => {
    if (ok || why === 'disconnected') close(ok)
    else setSession((s) => s && { ...s, phase: 'fail', why })
  }

  const cfg = session?.cfg
  const width = cfg ? Math.max(940, 2 * (cfg.columns * 34 + 64 + 34) + 72) : 940

  return (
    <>
      {!IN_GAME && <DevBar onStart={start} />}
      {session && (
        <div className="screen">
          <div className="term" style={{ width: `min(100%, ${width}px)` }}>
            <div className="top">
              <span>LS PORT AUTHORITY // RESTRICTED</span>
              <span>TTY-0 BREACH SHELL</span>
            </div>
            {session.phase === 'intro' && (
              <Intro key={session.id} onDone={() => setSession((s) => s && { ...s, phase: 'game' })} />
            )}
            {session.phase === 'game' && <Game key={session.id} cfg={cfg} onEnd={onGameEnd} />}
            {session.phase === 'fail' && <Fail why={session.why} onDone={() => close(false)} />}
          </div>
        </div>
      )}
    </>
  )
}
