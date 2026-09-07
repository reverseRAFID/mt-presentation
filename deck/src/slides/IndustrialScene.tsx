import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useReduced } from '../components/motionPrefs'
import { Joint } from './RoverScene'

/* Industrial work, not competition work: an operator on a pendant runs the arm
   through a pick-and-place cycle on a production line. Four beats, on a loop —
   pick from the belt, lift, swing over to the bin, release — with the control
   signal running from the operator's console to the arm the whole time. Same
   spring-driven joints as the rover's arm on slide 3. */

const W = 820
const H = 288
const FLOOR = 240
const STEP = 1400

const BASE = { x: 400, y: 204 }
const L1 = 110
const L2 = 90

/* shoulder, elbow — screen degrees — for pick, lift, swing, release */
const POSE: [number, number][] = [
  [-18, 64],
  [-50, 38],
  [-122, -118],
  [-100, -62],
]

const BELT = { x0: 494, x1: 810, top: 222 }
const PICK_X = 572
const BIN = { x: 262, w: 78, top: 198 }
const CONSOLE = { x: 196, y: 128 }

const ease = [0.22, 1, 0.36, 1] as const

function Part({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-13" y="-16" width="26" height="16" rx="3" fill="var(--red)" />
      <rect x="-9" y="-12" width="18" height="3" rx="1.5" fill="#fff" opacity="0.55" />
    </g>
  )
}

function Operator({ reduced, step }: { reduced: boolean; step: number }) {
  const tilt = step % 2 ? 14 : -14
  return (
    <g>
      {/* legs, hi-vis, hard hat */}
      <g transform={`translate(96 ${FLOOR})`}>
        <path d="M-9 0 V-48 M9 0 V-48" stroke="var(--ink-3)" strokeWidth="13" strokeLinecap="round" fill="none" />
        <rect x="-21" y="-112" width="42" height="64" rx="14" fill="var(--orange)" stroke="var(--ink-3)" strokeWidth="2.5" />
        <path d="M-21 -92 H21 M-21 -78 H21" stroke="#fff" strokeWidth="4" opacity="0.8" />
        <circle cx="0" cy="-134" r="20" fill="#fff" stroke="var(--ink-3)" strokeWidth="2.5" />
        <path d="M-22 -138 a22 16 0 0 1 44 0 Z" fill="var(--red)" />
        <path d="M-24 -137 H26" stroke="var(--red)" strokeWidth="5" strokeLinecap="round" />
        {/* the arm on the pendant */}
        <path d={`M14 -100 L${CONSOLE.x - 96 - 10} ${CONSOLE.y - FLOOR + 30}`} stroke="var(--orange)" strokeWidth="13" strokeLinecap="round" fill="none" />
      </g>

      {/* the console on its stand, and the joystick the operator is on */}
      <g transform={`translate(${CONSOLE.x} ${CONSOLE.y})`}>
        <path d={`M0 44 V${FLOOR - CONSOLE.y}`} stroke="var(--ink-3)" strokeWidth="6" strokeLinecap="round" />
        <path d={`M-22 ${FLOOR - CONSOLE.y} H22`} stroke="var(--ink-3)" strokeWidth="6" strokeLinecap="round" />
        <rect x="-36" y="0" width="72" height="46" rx="7" fill="#fff" stroke="var(--ink-3)" strokeWidth="2.5" />
        <rect x="-28" y="7" width="34" height="24" rx="3" fill="var(--peach)" />
        <motion.rect x="-24" y="12" width="14" height="4" rx="2" fill="var(--red)" animate={reduced ? undefined : { opacity: [1, 0.25, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
        <rect x="-24" y="20" width="22" height="4" rx="2" fill="var(--orange)" />
        <g transform="translate(20 8)">
          <Joint angle={reduced ? 0 : tilt} reduced={reduced}>
            <path d="M0 0 V-26" stroke="var(--ink-3)" strokeWidth="5" strokeLinecap="round" />
            <circle cy="-30" r="7" fill="var(--red)" />
          </Joint>
          <circle r="6" fill="var(--ink-3)" />
        </g>
      </g>
    </g>
  )
}

export function IndustrialScene() {
  const reduced = useReduced()
  const [step, setStep] = useState(0)
  const live = !reduced

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % POSE.length), STEP)
    return () => window.clearInterval(id)
  }, [reduced])

  const [shoulder, elbow] = POSE[reduced ? 1 : step]
  const carrying = step === 1 || step === 2
  const rollers = Array.from({ length: 10 }, (_, i) => BELT.x0 + 14 + i * 32)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label="An operator running the arm through a pick-and-place cycle">
      {/* the floor */}
      <rect x="-10" y={FLOOR} width={W + 20} height={H - FLOOR + 10} fill="var(--peach)" opacity="0.45" />
      <path d={`M-10 ${FLOOR} H${W + 10}`} stroke="var(--ink-3)" strokeWidth="3" strokeLinecap="round" />

      <Operator reduced={reduced} step={step} />

      {/* the control signal, console to arm */}
      <path d={`M${CONSOLE.x + 34} ${CONSOLE.y - 8} Q300 60 ${BASE.x - 10} ${BASE.y - 24}`} fill="none" stroke="var(--red)" strokeWidth="3" opacity="0.2" strokeLinecap="round" />
      <motion.path
        d={`M${CONSOLE.x + 34} ${CONSOLE.y - 8} Q300 60 ${BASE.x - 10} ${BASE.y - 24}`}
        fill="none"
        stroke="var(--red)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="9 12"
        animate={live ? { strokeDashoffset: [0, -42] } : undefined}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
      />

      {/* the bin, with what has already been placed */}
      <path d={`M${BIN.x} ${BIN.top} V${FLOOR} H${BIN.x + BIN.w} V${BIN.top}`} fill="var(--paper-2)" stroke="var(--ink-3)" strokeWidth="3" strokeLinejoin="round" />
      <Part x={BIN.x + 22} y={FLOOR - 2} />
      <Part x={BIN.x + 54} y={FLOOR - 2} />
      {step === 3 && (
        <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.35, ease }}>
          <Part x={BIN.x + 38} y={FLOOR - 20} />
        </motion.g>
      )}

      {/* the line: belt, rollers turning, and the next part coming down it */}
      <rect x={BELT.x0} y={BELT.top} width={BELT.x1 - BELT.x0} height="14" rx="6" fill="var(--ink-3)" />
      <path d={`M${BELT.x0 + 8} ${BELT.top + 3} H${BELT.x1 - 8}`} stroke="var(--line-2)" strokeWidth="2" strokeDasharray="10 8" opacity="0.8" />
      {rollers.map((x) => (
        <motion.g
          key={x}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={live ? { rotate: -360 } : undefined}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx={x} cy={FLOOR - 9} r="8" fill="#fff" stroke="var(--ink-3)" strokeWidth="2.5" />
          <path d={`M${x - 5} ${FLOOR - 9} H${x + 5}`} stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      ))}
      {[BELT.x0 + 20, BELT.x1 - 20].map((x) => (
        <path key={x} d={`M${x} ${BELT.top + 14} V${FLOOR - 16}`} stroke="var(--ink-3)" strokeWidth="4" />
      ))}
      {step === 0 && (
        <motion.g initial={{ x: live ? 190 : 0 }} animate={{ x: 0 }} transition={{ duration: live ? 1.05 : 0, ease: 'easeOut' }}>
          <Part x={PICK_X} y={BELT.top} />
        </motion.g>
      )}

      {/* the arm: pedestal, shoulder, elbow, gripper — and the part when it has one */}
      <g transform={`translate(${BASE.x} ${FLOOR})`}>
        <path d="M-46 0 H46" stroke="var(--ink-3)" strokeWidth="8" strokeLinecap="round" />
        <rect x="-16" y={BASE.y - FLOOR} width="32" height={FLOOR - BASE.y} rx="6" fill="#fff" stroke="var(--red)" strokeWidth="4" />
      </g>
      <g transform={`translate(${BASE.x} ${BASE.y})`}>
        <circle r="16" fill="var(--peach-2)" stroke="var(--ink-3)" strokeWidth="3" />
        <Joint angle={shoulder} reduced={reduced}>
          <path d={`M0 0 H${L1}`} stroke="#efe3d6" strokeWidth="20" strokeLinecap="round" />
          <path d={`M0 0 H${L1}`} stroke="var(--red)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <circle r="10" fill="var(--orange)" />
          <g transform={`translate(${L1} 0)`}>
            <Joint angle={elbow} reduced={reduced}>
              <path d={`M0 0 H${L2}`} stroke="#efe3d6" strokeWidth="16" strokeLinecap="round" />
              <path d={`M0 0 H${L2}`} stroke="var(--red)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              <circle r="9" fill="var(--orange)" />
              <g transform={`translate(${L2} 0)`}>
                <rect x="-6" y="-9" width="14" height="18" rx="4" fill="var(--ink-3)" />
                <path d={`M8 ${carrying ? -8 : -13} h16 M8 ${carrying ? 8 : 13} h16`} stroke="var(--red)" strokeWidth="6" strokeLinecap="round" />
                {carrying && (
                  <g transform="translate(24 0) rotate(90)">
                    <Part x={0} y={8} />
                  </g>
                )}
              </g>
            </Joint>
          </g>
        </Joint>
      </g>
    </svg>
  )
}
