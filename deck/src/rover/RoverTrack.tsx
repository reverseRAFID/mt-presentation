import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { SLIDES } from '../content/deck'
import { TRAVEL } from './motion'
import { overlay, type StageRect } from './overlay'
import { MAP, groundPy, stationX } from './terrain'

/* The mission map, and the deck's progress bar: a strip of Utah along the foot of
   every slide with nine stations on it. The ground behind the rover is inked in
   as it goes, so how far along the strip it has driven is how far through the
   talk you are.

   Two layers, because the rover itself lives in a canvas between them: the
   country it is driving through, and the few rocks it passes in front of. The
   whole map is quiet while a slide is being read and comes up while it drives. */

const STOPS = SLIDES.map((_, i) => {
  const x = stationX(i, SLIDES.length)
  return { x, y: groundPy(x) }
})

function Sheet({ rect, z, children }: { rect: StageRect; z: number; children: React.ReactNode }) {
  return (
    <div style={overlay(rect, z)}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" aria-hidden="true">
        {children}
      </svg>
    </div>
  )
}

export function RoverTrack({ index, rect, reduced }: { index: number; rect: StageRect | null; reduced: boolean }) {
  const prev = useRef(index)
  const [driving, setDriving] = useState(false)

  useEffect(() => {
    if (prev.current === index) return
    prev.current = index
    if (reduced) return
    setDriving(true)
    const id = window.setTimeout(() => setDriving(false), (TRAVEL.dur + 0.45) * 1000)
    return () => window.clearTimeout(id)
  }, [index, reduced])

  if (!rect || rect.width < 10) return null
  const progress = SLIDES.length < 2 ? 1 : index / (SLIDES.length - 1)
  const ease = { duration: reduced ? 0 : TRAVEL.dur * (TRAVEL.goEnd - TRAVEL.goStart), delay: reduced ? 0 : TRAVEL.dur * TRAVEL.goStart, ease: [0.65, 0, 0.35, 1] as const }

  return (
    <>
      <Sheet rect={rect} z={4}>
        <defs>
          <linearGradient id="mt-haze" x1="0" y1={MAP.hazeFrom} x2="0" y2={MAP.hazeTo} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          <mask id="mt-far">
            <rect x="-60" y="-60" width="2040" height="1260" fill="url(#mt-haze)" />
          </mask>
          <linearGradient id="mt-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--line-2)" stopOpacity="0.85" />
            <stop offset="1" stopColor="var(--peach-2)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* the country: quiet under a slide, up while the rover is crossing it */}
        <motion.g animate={{ opacity: driving ? 1 : 0.62 }} transition={{ duration: reduced ? 0 : 0.4 }}>
          <g mask="url(#mt-far)">
            {MAP.ridges.map((r) => (
              <path key={r.fill} d={r.d} fill={r.fill} stroke={r.fill} strokeWidth="2" opacity={r.opacity} />
            ))}
          </g>
          {MAP.behind.map((d, i) => (
            <path key={i} d={d} fill="var(--line-2)" stroke="var(--ink-3)" strokeWidth="1.6" opacity="0.8" />
          ))}
          <path d={MAP.ground} fill="var(--peach)" opacity="0.4" />
          <path d={MAP.band} fill="url(#mt-band)" />
          {MAP.rocks.map((r, i) => (
            <g key={i}>
              <path d={r.body} fill="var(--line-2)" />
              <path d={r.edge} fill="none" stroke="var(--ink-3)" strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
          <path d={MAP.crest} fill="none" stroke="var(--ink-3)" strokeWidth="3" strokeLinecap="round" />
        </motion.g>

        {/* the bar: the stretch already driven, inked over the ground */}
        <motion.path
          d={MAP.rail}
          fill="none"
          stroke="var(--red)"
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: progress }}
          animate={{ pathLength: progress }}
          transition={ease}
        />

        {/* the stations */}
        {STOPS.map((s, i) => (
          <motion.path
            key={i}
            d="M0 -9 9 0 0 9 -9 0Z"
            strokeWidth="3"
            strokeLinejoin="round"
            style={{ translateX: s.x, translateY: s.y }}
            initial={false}
            animate={{
              fill: i < index ? 'var(--red)' : i === index ? 'var(--orange)' : 'var(--paper)',
              stroke: i <= index ? 'var(--red)' : 'var(--line-2)',
              scale: i === index ? 1.45 : 1,
            }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : i <= index ? TRAVEL.dur * 0.55 : 0 }}
          />
        ))}

        {/* journey's end: on the last slide every station lights in a wave */}
        {index === SLIDES.length - 1 &&
          !reduced &&
          STOPS.map((s, i) => (
            <motion.circle
              key={`ring${i}`}
              cx={s.x}
              cy={s.y}
              r="13"
              fill="none"
              stroke="var(--red)"
              strokeWidth="2.5"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 2.6], opacity: [0.9, 0] }}
              transition={{ duration: 1.7, delay: 1.6 + i * 0.07, repeat: Infinity, repeatDelay: 2.4, ease: 'easeOut' }}
            />
          ))}
      </Sheet>

      <Sheet rect={rect} z={6}>
        <motion.g animate={{ opacity: driving ? 1 : 0.62 }} transition={{ duration: reduced ? 0 : 0.4 }}>
          {MAP.front.map((d, i) => (
            <path key={i} d={d} fill="var(--line-2)" stroke="var(--ink-3)" strokeWidth="2" />
          ))}
        </motion.g>
      </Sheet>
    </>
  )
}
