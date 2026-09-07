import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useReduced } from './motionPrefs'
import { FINALISTS } from '../content/facts'

const OURS = 'BRACU Mongol-Tori'
const EVERY = 1900

/* The finalists, one at a time, on a card that flips like a departure board.
   Ours comes up in red when its turn arrives. */
export function FlipBoard() {
  const reduced = useReduced()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setI((v) => (v + 1) % FINALISTS.length), EVERY)
    return () => window.clearInterval(id)
  }, [reduced])

  const t = FINALISTS[i]
  const ours = t.team === OURS
  return (
    <div className="flip" aria-live="off">
      <div className="flip__slot">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={i}
            className="flip__card"
            initial={{ rotateX: reduced ? 0 : -88, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: reduced ? 0 : 88, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="flip__team" style={{ color: ours ? 'var(--red)' : 'var(--ink)' }}>
              {t.team}
            </p>
            <p className="flip__uni">{t.uni}</p>
            <p className="flip__country">{t.country}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flip__rail" aria-hidden="true">
        {FINALISTS.map((f, k) => (
          <span key={f.team} className="flip__tick" style={{ background: k === i ? 'var(--red)' : f.team === OURS ? 'var(--orange)' : 'var(--line-2)' }} />
        ))}
      </div>
      <p className="small flip__count">
        {String(i + 1).padStart(2, '0')} / {FINALISTS.length} finalists
      </p>
    </div>
  )
}
