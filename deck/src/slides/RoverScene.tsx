import { useEffect, useRef } from 'react'
import { motion, useMotionValueEvent, useSpring } from 'motion/react'
import { useReduced } from '../components/motionPrefs'

/* The rover doing its job, in four acts: it searches the ground with its cameras
   and drives itself in, hands a tool to an astronaut working at a lander, drills a
   sample and reads it out on board — and the whole time it is on a link from a
   command station three kilometres back, with a ridge in the way.

   One SVG stage; the act index moves everything. The arm's two joints are turned
   by writing the SVG rotate() attribute from a spring, not by motion's CSS
   rotate: motion takes an SVG element's transform origin from its bounding box,
   and a joint nested inside another joint drags that box off the pivot. */

export interface Act {
  id: string
  label: string
  line: string
}

export const ACTS: Act[] = [
  { id: 'autonomy', label: 'Autonomous traverse', line: 'It sweeps the ground with its cameras, finds the markers itself, and drives to them over the rocks — nobody at the controls.' },
  { id: 'arm', label: 'Seven-axis arm', line: 'Seven degrees of freedom. Lifts over 5 kg, grips 7.5 cm — and puts a tool into an astronaut’s hand.' },
  { id: 'science', label: 'Onboard science', line: 'It drills where it stands, collects the sample, and runs the assay on board, looking for signs that something lived.' },
  { id: 'link', label: '3 km command link', line: 'Driven from a command station three kilometres away, with a ridge between it and the rover — no line of sight.' },
]

const W = 900
const H = 350
const GROUND = 268
const STATION_X = 62
const ROVER_X = 500
const ASTRO_X = 720
const LANDER_X = 822

/* Arm pose per act: shoulder and elbow, in degrees, measured on screen. */
const ARM: Record<number, [number, number]> = {
  0: [-84, -92], // stowed: upper arm up, forearm folded back over the deck
  1: [-10, 40], // out to the astronaut
  2: [30, 60], // down to the ground, drill vertical
  3: [-78, -94],
}

const ease = [0.22, 1, 0.36, 1] as const

const TERRAIN = `M-20 ${GROUND} L120 ${GROUND} Q182 ${GROUND - 6} 218 ${GROUND - 74}
  Q258 ${GROUND - 148} 298 ${GROUND - 74} Q334 ${GROUND - 6} 396 ${GROUND} L${W + 20} ${GROUND}`

/** A joint: rotates its children about its own origin, on a spring. Shared with
    the industrial arm on slide 12. */
export function Joint({ angle, reduced, children }: { angle: number; reduced: boolean; children: React.ReactNode }) {
  const ref = useRef<SVGGElement>(null)
  const spring = useSpring(angle, { stiffness: 120, damping: 20, mass: 0.9 })
  useEffect(() => {
    if (reduced) spring.jump(angle)
    else spring.set(angle)
  }, [angle, reduced, spring])
  useMotionValueEvent(spring, 'change', (v) => ref.current?.setAttribute('transform', `rotate(${v})`))
  return (
    <g ref={ref} transform={`rotate(${angle})`}>
      {children}
    </g>
  )
}

/** Rotation about a pivot for elements with nothing rotating inside them: the
    circle fixes the bounding box centre on the pivot. */
function Pivot({ r }: { r: number }) {
  return <circle r={r} fill="none" stroke="none" />
}

const spin = { transformBox: 'fill-box', transformOrigin: 'center' } as const

/* ── the people and the hardware ───────────────────────────────────────────── */

function Lander() {
  return (
    <g transform={`translate(${LANDER_X} ${GROUND})`}>
      <path d="M-52 0 L-30 -74 M52 0 L30 -74 M0 0 V-74" stroke="var(--ink-3)" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M-62 2 h20 M52 2 h20 M-10 2 h20" stroke="var(--ink-3)" strokeWidth="6" strokeLinecap="round" />
      <path d="M-46 -74 H46 L30 -150 H-30 Z" fill="#fff" stroke="var(--ink-3)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M-30 -150 L0 -196 L30 -150 Z" fill="var(--paper-2)" stroke="var(--ink-3)" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="0" cy="-112" r="15" fill="var(--peach)" stroke="var(--ink-3)" strokeWidth="3" />
      <path d="M-34 -92 h22 M12 -92 h22" stroke="var(--red)" strokeWidth="5" strokeLinecap="round" />
      <path d="M0 -196 V-224" stroke="var(--ink-3)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="0" cy="-228" r="5" fill="var(--orange)" />
    </g>
  )
}

function Astronaut({ reach }: { reach: boolean }) {
  return (
    <g transform={`translate(${ASTRO_X} ${GROUND})`}>
      <path d="M-11 0 V-54 M11 0 V-54" stroke="var(--ink-3)" strokeWidth="15" strokeLinecap="round" fill="none" />
      <rect x="8" y="-122" width="25" height="54" rx="9" fill="var(--peach-2)" stroke="var(--ink-3)" strokeWidth="3" />
      <rect x="-24" y="-127" width="47" height="70" rx="16" fill="#fff" stroke="var(--ink-3)" strokeWidth="3" />
      <rect x="-13" y="-108" width="26" height="14" rx="5" fill="var(--red)" />
      <motion.path
        d="M-21 -113 L-52 -92"
        stroke="#fff"
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
        style={{ transformBox: 'fill-box', transformOrigin: '100% 0%' }}
        animate={{ rotate: reach ? -36 : 0 }}
        transition={{ duration: 0.6, ease }}
      />
      <circle cx="0" cy="-153" r="30" fill="#fff" stroke="var(--ink-3)" strokeWidth="3" />
      <path d="M-19 -160 a20 17 0 0 1 35 -7 a22 20 0 0 1 -35 7z" fill="var(--peach)" />
    </g>
  )
}

function CommandStation() {
  return (
    <g transform={`translate(${STATION_X} ${GROUND})`}>
      <path d="M-34 0 H34" stroke="var(--line-2)" strokeWidth="5" strokeLinecap="round" />
      <rect x="-34" y="-48" width="68" height="40" rx="7" fill="#fff" stroke="var(--ink-3)" strokeWidth="3" />
      <rect x="-25" y="-40" width="50" height="24" rx="4" fill="var(--peach)" />
      <path d="M22 -48 V-112" stroke="var(--ink-3)" strokeWidth="5" strokeLinecap="round" />
      <path d="M11 -112 h22 M14 -124 h16" stroke="var(--red)" strokeWidth="5" strokeLinecap="round" />
    </g>
  )
}

/** Concentric waves leaving an antenna, opening toward `dir`. */
function Waves({ x, y, dir }: { x: number; y: number; dir: 1 | -1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
      {[0, 1, 2].map((i) => {
        const r = 16 + i * 13
        return (
          <motion.path
            key={i}
            d={`M0 ${-r} A${r} ${r} 0 0 1 0 ${r}`}
            fill="none"
            stroke="var(--red)"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.95, 0] }}
            transition={{ duration: 1.4, delay: i * 0.3, repeat: Infinity, repeatDelay: 0.3, ease: 'easeOut' }}
          />
        )
      })}
    </g>
  )
}

function Rover({ act, reduced }: { act: number; reduced: boolean }) {
  const [shoulder, elbow] = ARM[act] ?? ARM[0]
  const rolling = act === 0
  const drilling = act === 2
  return (
    <g>
      {/* airless wheels */}
      {[-58, 58].map((x) => (
        <motion.g
          key={x}
          style={spin}
          animate={{ rotate: rolling ? [0, -540] : 0 }}
          transition={rolling ? { duration: 3.4, ease: 'linear' } : { duration: 0.3 }}
        >
          <circle cx={x} cy={-28} r="28" fill="var(--ink-3)" />
          <circle cx={x} cy={-28} r="20" fill="var(--paper-2)" />
          {[0, 60, 120].map((a) => (
            <path key={a} d={`M${x - 17} -28 H${x + 17}`} stroke="var(--line-2)" strokeWidth="4.5" strokeLinecap="round" transform={`rotate(${a} ${x} -28)`} />
          ))}
          <circle cx={x} cy={-28} r="7.5" fill="var(--red)" />
        </motion.g>
      ))}
      <path d="M-64 -56 H64" stroke="var(--ink-3)" strokeWidth="6" strokeLinecap="round" />

      {/* body and deck */}
      <rect x="-74" y="-118" width="148" height="56" rx="8" fill="#fff" stroke="var(--red)" strokeWidth="5.5" />
      <path d="M-74 -62 L-25 -118 M-25 -62 L25 -118 M25 -62 L74 -118" stroke="var(--red)" strokeWidth="2.5" fill="none" opacity="0.4" />
      <rect x="-86" y="-131" width="172" height="14" rx="5" fill="var(--paper-2)" stroke="var(--ink-3)" strokeWidth="3" />

      {/* mast, stereo camera head, antenna */}
      <path d="M-64 -131 V-200" stroke="var(--ink-3)" strokeWidth="5.5" strokeLinecap="round" />
      <rect x="-88" y="-228" width="46" height="28" rx="7" fill="#fff" stroke="var(--ink-3)" strokeWidth="3" />
      <circle cx="-78" cy="-214" r="5" fill="var(--red)" />
      <circle cx="-62" cy="-214" r="5" fill="var(--red)" />
      <path d="M-38 -131 V-192" stroke="var(--ink-3)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="-38" cy="-197" r="5.5" fill="var(--orange)" />

      {/* the seven-axis arm on the back deck */}
      <g transform="translate(56 -128)">
        <circle r="11" fill="var(--peach-2)" stroke="var(--ink-3)" strokeWidth="3" />
        <Joint angle={shoulder} reduced={reduced}>
          <path d="M0 0 H68" stroke="#efe3d6" strokeWidth="16" strokeLinecap="round" />
          <path d="M0 0 H68" stroke="var(--ink-3)" strokeWidth="2.5" fill="none" opacity="0.45" />
          <circle r="8.5" fill="var(--orange)" />
          <g transform="translate(68 0)">
            <Joint angle={elbow} reduced={reduced}>
              <path d="M0 0 H58" stroke="#efe3d6" strokeWidth="13" strokeLinecap="round" />
              <path d="M0 0 H58" stroke="var(--ink-3)" strokeWidth="2.5" fill="none" opacity="0.45" />
              <circle r="7.5" fill="var(--orange)" />
              {/* gripper, or the drill when there is a hole to make */}
              {drilling ? (
                <g transform="translate(58 0)">
                  <rect x="-4" y="-11" width="14" height="22" rx="4" fill="var(--ink-3)" />
                  <motion.g animate={reduced ? undefined : { x: [0, 5, 0] }} transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}>
                    <path d="M10 -6 L30 -3 L34 0 L30 3 L10 6 Z" fill="var(--line-2)" stroke="var(--ink-3)" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M15 -4 L15 4 M21 -3 L21 3 M27 -2 L27 2" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" />
                  </motion.g>
                </g>
              ) : (
                <path d="M58 -10 h15 M58 10 h15" stroke="var(--red)" strokeWidth="6" strokeLinecap="round" />
              )}
            </Joint>
          </g>
        </Joint>
      </g>
    </g>
  )
}

/* ── the stage ─────────────────────────────────────────────────────────────── */

export function RoverScene({ act }: { act: number }) {
  const reduced = useReduced()
  const live = !reduced
  const CAM = { x: ROVER_X - 65, y: GROUND - 214 }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label={ACTS[act].label}>
      <path d={`${TERRAIN} L${W + 20} ${H} L-20 ${H} Z`} fill="var(--peach)" opacity="0.45" />
      <path d={TERRAIN} fill="none" stroke="var(--ink-3)" strokeWidth="3.5" strokeLinecap="round" />

      <Lander />

      {/* ── 04 · the command link, over the ridge ── */}
      <motion.g animate={{ opacity: act === 3 ? 1 : 0.18 }} transition={{ duration: 0.5 }}>
        <CommandStation />
      </motion.g>
      {act === 3 && (
        <>
          <path
            d={`M${STATION_X + 26} ${GROUND - 122} Q258 ${GROUND - 262} ${ROVER_X - 96} ${GROUND - 222}`}
            fill="none"
            stroke="var(--red)"
            strokeWidth="3"
            opacity="0.22"
            strokeLinecap="round"
          />
          <motion.path
            d={`M${STATION_X + 26} ${GROUND - 122} Q258 ${GROUND - 262} ${ROVER_X - 96} ${GROUND - 222}`}
            fill="none"
            stroke="var(--red)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="14 16"
            animate={live ? { strokeDashoffset: [0, -60] } : undefined}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          />
          {live && <Waves x={STATION_X + 32} y={GROUND - 124} dir={1} />}
          {live && <Waves x={ROVER_X - 104} y={GROUND - 218} dir={-1} />}
          <motion.text x={272} y={GROUND - 276} textAnchor="middle" fontFamily="var(--mono)" fontSize="21" fill="var(--red)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            3 km · no line of sight
          </motion.text>
        </>
      )}

      {/* ── 01 · looking for its markers, then driving to them ── */}
      {act === 0 && (
        <>
          <g transform={`translate(${CAM.x} ${CAM.y})`}>
            <motion.g style={spin} animate={live ? { rotate: [18, 50, 18] } : { rotate: 34 }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}>
              <Pivot r={320} />
              <path d="M0 0 L236 -48 L236 48 Z" fill="var(--orange)" opacity="0.2" />
              <path d="M0 0 L236 -48 M0 0 L236 48" stroke="var(--orange)" strokeWidth="2.5" opacity="0.55" fill="none" />
            </motion.g>
          </g>
          {[
            { x: 596, d: 0.5 },
            { x: 660, d: 1.1 },
          ].map((m) => (
            <motion.g key={m.x} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: m.d, ease }}>
              <path
                d={`M${m.x - 17} ${GROUND - 40} h-9 v9 M${m.x + 17} ${GROUND - 40} h9 v9 M${m.x - 17} ${GROUND - 2} h-9 v-9 M${m.x + 17} ${GROUND - 2} h9 v-9`}
                stroke="var(--red)"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
              <path d={`M${m.x} ${GROUND - 32} l10 10 -10 10 -10 -10 Z`} fill="var(--red)" />
            </motion.g>
          ))}
          <motion.path
            d={`M${ROVER_X + 96} ${GROUND + 16} H660`}
            fill="none"
            stroke="var(--orange)"
            strokeWidth="4"
            strokeDasharray="11 13"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, strokeDashoffset: live ? [0, -48] : 0 }}
            transition={{ opacity: { duration: 0.4, delay: 1.3 }, strokeDashoffset: { duration: 1.2, repeat: Infinity, ease: 'linear' } }}
          />
        </>
      )}

      {/* ── 03 · the hole, the sample, and the readout ── */}
      {act === 2 && (
        <>
          <motion.ellipse cx={ROVER_X + 115} cy={GROUND - 2} rx="17" ry="6" fill="var(--ink-3)" initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} transition={{ duration: 0.4, delay: 0.85 }} />
          {live &&
            [0, 1, 2, 3].map((i) => (
              <motion.circle
                key={i}
                cx={ROVER_X + 115}
                cy={GROUND - 8}
                r={3.5 + (i % 2)}
                fill="var(--line-2)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0], x: [0, i % 2 ? 26 : -26], y: [0, -26 - i * 4] }}
                transition={{ duration: 1, delay: 0.9 + i * 0.18, repeat: Infinity, repeatDelay: 0.5, ease: 'easeOut' }}
              />
            ))}
          {/* the sample, going up into the body */}
          <motion.rect
            x={ROVER_X + 108}
            width="15"
            height="26"
            rx="4"
            fill="var(--orange)"
            stroke="var(--ink-3)"
            strokeWidth="2.5"
            initial={{ y: GROUND - 30, opacity: 0 }}
            animate={{ y: [GROUND - 30, GROUND - 150], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, delay: 1.7, ease }}
          />
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 2.3, ease }}>
            <rect x={ROVER_X - 20} y={10} width="200" height="98" rx="14" fill="#fff" stroke="var(--line-2)" strokeWidth="3" />
            <text x={ROVER_X} y={38} fontFamily="var(--mono)" fontSize="18" fill="var(--ink-3)">
              SAMPLE · ASSAY
            </text>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x={ROVER_X} y={52 + i * 20} width="160" height="10" rx="5" fill="var(--peach)" />
                <motion.rect
                  x={ROVER_X}
                  y={52 + i * 20}
                  height="10"
                  rx="5"
                  fill={i === 1 ? 'var(--red)' : 'var(--orange)'}
                  initial={{ width: 0 }}
                  animate={{ width: 122 - i * 30 }}
                  transition={{ duration: 0.9, delay: 2.5 + i * 0.16, ease }}
                />
              </g>
            ))}
          </motion.g>
        </>
      )}

      {/* the rover: its art is drawn up from the ground contact, so the group sits
          on the ground line and only x moves */}
      <g transform={`translate(0 ${GROUND})`}>
        <motion.g
          animate={{ x: act === 0 && live ? [ROVER_X - 72, ROVER_X] : ROVER_X }}
          transition={act === 0 && live ? { duration: 3.4, ease: 'easeInOut' } : { duration: 0.5, ease }}
        >
          <Rover act={act} reduced={reduced} />
        </motion.g>
      </g>

      {/* ── 02 · the tool, changing hands ── */}
      {act === 1 && (
        <motion.rect
          y={GROUND - 128}
          width="32"
          height="15"
          rx="5"
          fill="var(--red)"
          initial={{ x: ROVER_X + 160, opacity: 0 }}
          animate={{ x: [ROVER_X + 160, ASTRO_X - 66], opacity: [0, 1, 1] }}
          transition={{ duration: 1.3, delay: 0.85, ease }}
        />
      )}

      <Astronaut reach={act === 1} />
    </svg>
  )
}
