import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { Stage } from './components/Stage'
import { Chrome } from './components/Chrome'
import type { StageRect } from './rover/overlay'
import { RoverSvg } from './rover/RoverSvg'
import { RoverTrack } from './rover/RoverTrack'
import { hasWebGL } from './rover/webgl'
import { PresenterPanel } from './presenter/PresenterPanel'
import { SLIDE_COMPONENTS } from './slides'
import { SLIDES } from './content/deck'
import { useDeck } from './useDeck'
import { ReducedContext } from './components/motionPrefs'

const WEBGL = hasWebGL()
/* three.js only ships to machines that can run it. */
const RoverCanvas = lazy(() => import('./rover/RoverCanvas').then((m) => ({ default: m.RoverCanvas })))
/* ?static disables all motion — the same path as prefers-reduced-motion. */
const STATIC = new URLSearchParams(window.location.search).has('static')

export default function App() {
  const { index, presenter, elapsed, running, next, prev } = useDeck()
  const [rect, setRect] = useState<StageRect | null>(null)
  const [hint, setHint] = useState(true)
  const reduced = (useReducedMotion() ?? false) || STATIC
  const onRect = useCallback((r: StageRect) => setRect(r), [])

  useEffect(() => {
    const id = window.setTimeout(() => setHint(false), 5000)
    return () => window.clearTimeout(id)
  }, [])

  // Re-measure when the presenter panel opens or closes.
  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [presenter])

  const Slide = SLIDE_COMPONENTS[index]
  /* The opening and closing frames are photographs, not drawing sheets. */
  const bleed = index === 0 || index === SLIDES.length - 1

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('a, button')) return
    if (!rect) return
    if (e.clientX < rect.left + rect.width * 0.25) prev()
    else next()
  }

  return (
    <ReducedContext.Provider value={reduced}>
    <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
    <div className={`app ${presenter ? 'app--presenter' : ''}`}>
      <div onClick={onClick} style={{ display: 'contents' }}>
        <Stage onRect={onRect}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={SLIDES[index].id}
              className={`slide ${bleed ? 'slide--plain' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.14 }}
              aria-label={`Slide ${index + 1}: ${SLIDES[index].title}`}
            >
              <Slide />
            </motion.section>
          </AnimatePresence>
          <Chrome index={index} />
        </Stage>
      </div>
      <RoverTrack index={index} rect={rect} reduced={reduced} />
      {!WEBGL && <RoverSvg index={index} rect={rect} reduced={reduced} />}
      {presenter && <PresenterPanel index={index} elapsed={elapsed} running={running} />}
      {WEBGL && (
        <Suspense fallback={null}>
          <RoverCanvas index={index} rect={rect} reduced={reduced} />
        </Suspense>
      )}
      <AnimatePresence>
        {hint && (
          <motion.div className="hint" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <kbd>→</kbd> next · <kbd>←</kbd> back · <kbd>f</kbd> fullscreen · <kbd>s</kbd> presenter notes
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </MotionConfig>
    </ReducedContext.Provider>
  )
}
