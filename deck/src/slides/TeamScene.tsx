import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useReduced } from '../components/motionPrefs'
import { Joint } from './RoverScene'

/* Between the three stories and the map: what the team looks like when the
   thing breaks. Five people on one line of ground, left to right: two at the
   control table, one raising the antenna mast, two on the rover with a wheel
   off — with the link running from the table to the mast and the mast's waves
   going out toward the rover, and the one parked on the map below. Everything loops quietly, on a two-beat; nothing
   moves when motion is reduced. Drawn at the operator's scale from the
   industrial scene and shrunk to fit the strip. */

const W = 1728
const H = 112
const GROUND = 98
const S = 0.52
const at = (px: number) => px / S
const STEP = 1000

const spin = { transformBox: 'fill-box', transformOrigin: 'center' } as const

/** An invisible circle that puts the bounding-box centre on the pivot, so a
    CSS rotate turns about it. */
function Pivot({ r }: { r: number }) {
  return <circle r={r} fill="none" stroke="none" />
}

/* Feet at the origin, facing right unless flipped. Children draw in the frame
   of the torso, shoulder at (14, -52): arms, tools, whatever they hold. */
function Person({ x, flip, pose = 'stand', children }: { x: number; flip?: boolean; pose?: 'stand' | 'crouch' | 'sit'; children?: React.ReactNode }) {
  const legs = pose === 'crouch' ? 'M-12 0 V-24 M12 0 V-24' : pose === 'sit' ? 'M26 0 V-30 H0' : 'M-9 0 V-48 M9 0 V-48'
  const lift = pose === 'crouch' ? 24 : pose === 'sit' ? 30 : 48
  return (
    <g transform={`translate(${x} 0) scale(${flip ? -1 : 1} 1)`}>
      {pose === 'sit' && <rect x="-24" y="-30" width="44" height="30" rx="4" fill="var(--paper-2)" stroke="var(--ink-3)" strokeWidth="3" />}
      <path d={legs} stroke="var(--ink-3)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <g transform={`translate(0 ${-lift})`}>
        <rect x="-21" y="-64" width="42" height="64" rx="14" fill="var(--orange)" stroke="var(--ink-3)" strokeWidth="2.5" />
        <path d="M-21 -44 H21 M-21 -30 H21" stroke="#fff" strokeWidth="4" opacity="0.8" />
        <circle cx="0" cy="-86" r="20" fill="#fff" stroke="var(--ink-3)" strokeWidth="2.5" />
        <path d="M-22 -90 a22 16 0 0 1 44 0 Z" fill="var(--red)" />
        <path d="M-24 -89 H26" stroke="var(--red)" strokeWidth="5" strokeLinecap="round" />
        {children}
      </g>
    </g>
  )
}

function Arm({ to }: { to: [number, number] }) {
  return <path d={`M14 -52 L${to[0]} ${to[1]}`} stroke="var(--orange)" strokeWidth="13" strokeLinecap="round" fill="none" />
}

function Wheel({ x, y, r = 24 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="var(--ink-3)" />
      <circle r={r * 0.7} fill="var(--paper-2)" />
      {[0, 60, 120].map((a) => (
        <path key={a} d={`M${-r * 0.6} 0 H${r * 0.6}`} stroke="var(--line-2)" strokeWidth="4" strokeLinecap="round" transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.27} fill="var(--red)" />
    </g>
  )
}

/* ── the rover with a wheel off ─────────────────────────────────────────────── */

function BrokenRover({ x, live, step, reduced }: { x: number; live: boolean; step: number; reduced: boolean }) {
  const hub: [number, number] = [50, -24]
  return (
    <g transform={`translate(${x} 0)`}>
      {/* a jack stand where the wheel should be, and the wheel that is on */}
      <path d="M50 0 L62 -22 H38 Z" fill="var(--paper-2)" stroke="var(--ink-3)" strokeWidth="3" strokeLinejoin="round" />
      <Wheel x={-50} y={-24} />
      <path d="M-56 -48 H56" stroke="var(--ink-3)" strokeWidth="5" strokeLinecap="round" />
      <rect x="-64" y="-100" width="128" height="48" rx="7" fill="#fff" stroke="var(--red)" strokeWidth="5" />
      <path d="M-64 -52 L-22 -100 M-22 -52 L22 -100 M22 -52 L64 -100" stroke="var(--red)" strokeWidth="2.5" fill="none" opacity="0.4" />
      <rect x="-74" y="-112" width="148" height="12" rx="4" fill="var(--paper-2)" stroke="var(--ink-3)" strokeWidth="3" />
      {/* mast and camera head, arm folded on the deck */}
      <path d="M-54 -112 V-160" stroke="var(--ink-3)" strokeWidth="5" strokeLinecap="round" />
      <rect x="-74" y="-184" width="40" height="24" rx="6" fill="#fff" stroke="var(--ink-3)" strokeWidth="3" />
      <circle cx="-66" cy="-172" r="4.5" fill="var(--red)" />
      <circle cx="-52" cy="-172" r="4.5" fill="var(--red)" />
      <path d="M48 -112 L10 -130 L60 -134" stroke="#efe3d6" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="48" cy="-112" r="8" fill="var(--orange)" />
      {/* the mechanic, crouched at the bare hub, spanner going back and forth */}
      <Person x={100} flip pose="crouch">
        <Arm to={[42, -14]} />
      </Person>
      <g transform={`translate(${hub[0]} ${hub[1]})`}>
        <circle r="9" fill="var(--ink-3)" />
        <Joint angle={reduced ? -20 : step % 2 ? 22 : -34} reduced={reduced}>
          <path d="M0 0 L46 -34" stroke="var(--ink-3)" strokeWidth="7" strokeLinecap="round" />
          <path d="M40 -38 l14 -10 M46 -26 l14 -10" stroke="var(--ink-3)" strokeWidth="7" strokeLinecap="round" />
        </Joint>
        <motion.g animate={live ? { opacity: [0, 1, 0] } : undefined} transition={{ duration: STEP / 1000, repeat: Infinity, times: [0.35, 0.5, 0.65] }} opacity={0}>
          <path d="M-18 -14 l-6 -6 M-22 2 l-8 0 M-16 14 l-6 6" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" />
        </motion.g>
      </g>
      {/* the second pair of hands, holding the wheel that is coming off */}
      <Person x={190} flip>
        <Arm to={[48, -4]} />
        <Wheel x={56} y={4} r={22} />
      </Person>
      {/* toolbox */}
      <rect x="-150" y="-30" width="54" height="30" rx="4" fill="var(--red)" stroke="var(--ink-3)" strokeWidth="2.5" />
      <path d="M-134 -30 v-8 h22 v8" stroke="var(--ink-3)" strokeWidth="3" fill="none" />
    </g>
  )
}

/* ── the control table ──────────────────────────────────────────────────────── */

function Laptop({ x, live }: { x: number; live: boolean }) {
  return (
    <g transform={`translate(${x} -64)`}>
      <rect x="-30" y="-4" width="60" height="5" rx="2" fill="var(--ink-3)" />
      <rect x="-27" y="-46" width="54" height="42" rx="4" fill="#fff" stroke="var(--ink-3)" strokeWidth="2.5" />
      <rect x="-21" y="-40" width="42" height="30" rx="2" fill="var(--peach)" />
      <path d="M-16 -22 q10 -12 22 -4 t14 -8" stroke="var(--orange)" strokeWidth="2" fill="none" opacity="0.8" />
      <motion.g animate={live ? { x: [0, 10, 4, 0], y: [0, -6, 4, 0] } : undefined} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
        <circle cx="-8" cy="-22" r="3.5" fill="var(--red)" />
      </motion.g>
    </g>
  )
}

function ControlTable({ x, live, step, reduced }: { x: number; live: boolean; step: number; reduced: boolean }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path d="M-96 -64 H96" stroke="var(--ink-3)" strokeWidth="6" strokeLinecap="round" />
      <path d="M-84 -64 V0 M84 -64 V0" stroke="var(--ink-3)" strokeWidth="5" strokeLinecap="round" />
      <Laptop x={-34} live={live} />
      <Laptop x={40} live={live} />
      {/* the driver, seated, on the joystick */}
      <Person x={-132} pose="sit">
        <Arm to={[52, -22]} />
      </Person>
      <g transform="translate(-72 -70)">
        <Joint angle={reduced ? 0 : step % 2 ? 14 : -14} reduced={reduced}>
          <path d="M0 0 V-24" stroke="var(--ink-3)" strokeWidth="5" strokeLinecap="round" />
          <circle cy="-28" r="7" fill="var(--red)" />
        </Joint>
        <circle r="6" fill="var(--ink-3)" />
      </g>
      {/* the spotter behind the table, pointing at the screen */}
      <Person x={150} flip>
        <g transform="translate(14 -52)">
          <Joint angle={reduced ? -18 : step % 2 ? -26 : -12} reduced={reduced}>
            <path d="M0 0 L60 8" stroke="var(--orange)" strokeWidth="13" strokeLinecap="round" />
            <path d="M60 8 l14 -2" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          </Joint>
        </g>
      </Person>
      {/* a coil of cable under the table */}
      <ellipse cx="0" cy="-8" rx="26" ry="8" fill="none" stroke="var(--ink-3)" strokeWidth="3" />
      <ellipse cx="0" cy="-14" rx="26" ry="8" fill="none" stroke="var(--ink-3)" strokeWidth="3" />
    </g>
  )
}

/* ── the mast ───────────────────────────────────────────────────────────────── */

function Waves({ x, y, live }: { x: number; y: number; live: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(20)`}>
      {[0, 1, 2].map((i) => {
        const r = 18 + i * 14
        return (
          <motion.path
            key={i}
            d={`M0 ${-r} A${r} ${r} 0 0 1 0 ${r}`}
            fill="none"
            stroke="var(--red)"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ opacity: live ? 0 : 0.6 }}
            animate={live ? { opacity: [0, 0.95, 0] } : undefined}
            transition={{ duration: 1.4, delay: i * 0.3, repeat: Infinity, repeatDelay: 0.3, ease: 'easeOut' }}
          />
        )
      })}
    </g>
  )
}

function Mast({ x, live }: { x: number; live: boolean }) {
  const TOP = -176
  return (
    <g transform={`translate(${x} 0)`}>
      {/* tripod, pole, and the winch that raises it */}
      <path d="M-34 0 L-6 -70 M34 0 L6 -70 M0 0 V-70" stroke="var(--ink-3)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d={`M0 -70 V${TOP}`} stroke="var(--ink-3)" strokeWidth="7" strokeLinecap="round" />
      <path d={`M0 -110 V${TOP}`} stroke="var(--line-2)" strokeWidth="3" strokeDasharray="8 8" />
      <g transform="translate(-14 -58)">
        <motion.g style={spin} animate={live ? { rotate: 360 } : undefined} transition={{ duration: 1.7, repeat: Infinity, ease: 'linear' }}>
          <Pivot r={22} />
          <circle r="10" fill="#fff" stroke="var(--ink-3)" strokeWidth="3" />
          <path d="M0 0 L16 -12" stroke="var(--ink-3)" strokeWidth="5" strokeLinecap="round" />
          <circle cx="16" cy="-12" r="4.5" fill="var(--red)" />
        </motion.g>
      </g>
      {/* the directional antenna, scanning */}
      <g transform={`translate(0 ${TOP})`}>
        <motion.g style={spin} animate={live ? { rotate: [-9, 9, -9] } : undefined} transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}>
          <Pivot r={64} />
          <path d="M-16 0 H56" stroke="var(--ink-3)" strokeWidth="5" strokeLinecap="round" />
          {[-2, 14, 30, 46].map((bx, i) => (
            <path key={bx} d={`M${bx} ${-16 + i * 2.5} V${16 - i * 2.5}`} stroke="var(--red)" strokeWidth="4.5" strokeLinecap="round" />
          ))}
        </motion.g>
        <circle r="8" fill="var(--orange)" stroke="var(--ink-3)" strokeWidth="2.5" />
      </g>
      <Waves x={78} y={TOP + 10} live={live} />
      {/* the rigger: one hand on the pole, the other on the winch */}
      <Person x={-62}>
        <Arm to={[58, -48]} />
        <Arm to={[46, -8]} />
      </Person>
    </g>
  )
}

/* ── the strip ──────────────────────────────────────────────────────────────── */

export function TeamScene() {
  const reduced = useReduced()
  const live = !reduced
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setStep((s) => s + 1), STEP)
    return () => window.clearInterval(id)
  }, [reduced])

  const TABLE = at(300)
  const MAST = at(860)
  const ROVER = at(1400)
  const link = `M${TABLE + 40} -118 Q${(TABLE + MAST) / 2} -214 ${MAST - 12} -150`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label="The team at work: a wheel coming off the rover, two people at the control table, one raising the antenna mast">
      <path d={`M0 ${GROUND} H${W}`} stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <g transform={`translate(0 ${GROUND}) scale(${S})`}>
        {/* the link from the table to the mast */}
        <path d={link} fill="none" stroke="var(--red)" strokeWidth="3" opacity="0.18" strokeLinecap="round" />
        <motion.path
          d={link}
          fill="none"
          stroke="var(--red)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="10 14"
          animate={live ? { strokeDashoffset: [0, -48] } : undefined}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
        />
        <ControlTable x={TABLE} live={live} step={step} reduced={reduced} />
        <Mast x={MAST} live={live} />
        <BrokenRover x={ROVER} live={live} step={step} reduced={reduced} />
      </g>
    </svg>
  )
}
