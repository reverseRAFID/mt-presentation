import { motion } from 'motion/react'
import { useReduced } from '../components/motionPrefs'
import { Reveal, EASE } from '../components/Reveal'
import { TEAM } from '../content/facts'

/* How the team is put together, drawn as the chart it actually is: the chain of
   command, then the split into the six sub-teams that build the rover and the two
   that never touch it. It assembles in the order it is spoken — node, connector,
   node — so the audience is never ahead of the presenter. */

const FLOW_TOP = 218
const FLOW_H = 548

/* Local coordinates, design pixels, origin at the top-left of the flow area. */
const NODE_W = 244
const NODE_H = 74
const CHAIN_X = [0, 290, 580]
const TRUNK_X = CHAIN_X[2] + NODE_W / 2
const BUS_Y = 118
const GROUP_Y = 154
const GROUP_H = 70
const DROP_Y = GROUP_Y + GROUP_H
const CARDS_Y = DROP_Y + 42
const LEFT_W = 1080
const LEFT_C = LEFT_W / 2
const RIGHT_X = 1140
const RIGHT_W = 588
const RIGHT_C = RIGHT_X + RIGHT_W / 2

const t = (delay: number, reduced: boolean, duration = 0.45) => ({
  duration: reduced ? 0 : duration,
  delay: reduced ? 0 : delay,
  ease: EASE,
})

/** One drawn connector, inked in as the eye reaches it. */
function Wire({ d, delay, reduced }: { d: string; delay: number; reduced: boolean }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="var(--line-2)"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: reduced ? 1 : 0 }}
      animate={{ pathLength: 1 }}
      transition={t(delay, reduced, 0.5)}
    />
  )
}

function Arrow({ x, y, delay, reduced }: { x: number; y: number; delay: number; reduced: boolean }) {
  return (
    <motion.path
      d={`M${x} ${y - 7} L${x + 11} ${y} L${x} ${y + 7} Z`}
      fill="var(--line-2)"
      initial={{ opacity: reduced ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={t(delay, reduced, 0.3)}
    />
  )
}

function Node({ x, y, w, h, delay, tone, children }: { x: number; y: number; w: number; h: number; delay: number; tone?: string; children: React.ReactNode }) {
  return (
    <Reveal delay={delay} y={10} className={`abs flow-node ${tone ?? ''}`} style={{ left: x, top: y, width: w, height: h }}>
      {children}
    </Reveal>
  )
}

/** A sub-team: what it is called, and what it is actually responsible for. */
function Unit({ name, what, delay, tone }: { name: string; what: string; delay: number; tone: string }) {
  return (
    <Reveal delay={delay} y={8} className={`card ${tone}`} style={{ padding: '16px 20px', borderRadius: 18 }}>
      <p className="flow-unit__name">{name}</p>
      <p className="flow-unit__what">{what}</p>
    </Reveal>
  )
}

export function S02About() {
  const reduced = useReduced()

  return (
    <div className="slide__inner">
      <Reveal className="abs" style={{ left: 0, top: 0, width: 860 }}>
        <h2 className="statement" style={{ fontSize: 58 }}>
          We are dreamers
          <br />
          and problem solvers.
        </h2>
        <div className="rule" style={{ margin: '20px 0 0' }} />
      </Reveal>

      <Reveal delay={0.1} className="abs" style={{ left: 880, top: 2, width: 848 }}>
        <p className="lead" style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span className="bignum" style={{ fontSize: 64 }}>{TEAM.members}</span>
          <span style={{ fontWeight: 500 }}>undergraduates</span>
        </p>
        <p className="small" style={{ margin: '4px 0 14px' }}>
          {TEAM.university} · {TEAM.departments.length} departments
        </p>
        <div className="chips" style={{ gap: 9 }}>
          {TEAM.departments.map((d, i) => (
            <span key={d} className={`chip ${i % 2 ? 'chip--peach' : ''}`} style={{ fontSize: 20, padding: '6px 14px' }}>
              {d}
            </span>
          ))}
        </div>
      </Reveal>

      <div className="abs" style={{ left: 0, top: FLOW_TOP, width: 1728, height: FLOW_H }}>
        <svg className="abs" style={{ inset: 0 }} width="1728" height={FLOW_H} aria-hidden="true">
          <Wire d={`M${CHAIN_X[0] + NODE_W} ${NODE_H / 2} H${CHAIN_X[1] - 14}`} delay={0.34} reduced={reduced} />
          <Arrow x={CHAIN_X[1] - 14} y={NODE_H / 2} delay={0.66} reduced={reduced} />
          <Wire d={`M${CHAIN_X[1] + NODE_W} ${NODE_H / 2} H${CHAIN_X[2] - 14}`} delay={0.62} reduced={reduced} />
          <Arrow x={CHAIN_X[2] - 14} y={NODE_H / 2} delay={0.94} reduced={reduced} />
          <Wire
            d={`M${TRUNK_X} ${NODE_H} V${BUS_Y} M${LEFT_C} ${BUS_Y} H${RIGHT_C} M${LEFT_C} ${BUS_Y} V${GROUP_Y - 2} M${RIGHT_C} ${BUS_Y} V${GROUP_Y - 2}`}
            delay={1.0}
            reduced={reduced}
          />
          <Wire d={`M${LEFT_C} ${DROP_Y} V${CARDS_Y - 8} M${RIGHT_C} ${DROP_Y} V${CARDS_Y - 8}`} delay={1.5} reduced={reduced} />
        </svg>

        {/* the chain of command */}
        {TEAM.leadership.map((role, i) => (
          <Node key={role} x={CHAIN_X[i]} y={0} w={NODE_W} h={NODE_H} delay={0.14 + i * 0.28} tone={i === 0 ? 'flow-node--lead' : undefined}>
            <span className="flow-node__rank">{String(i + 1).padStart(2, '0')}</span>
            <span className="flow-node__name">{role}</span>
          </Node>
        ))}
        {/* the two branches */}
        <Node x={LEFT_C - 230} y={GROUP_Y} w={460} h={GROUP_H} delay={1.24} tone="flow-node--tech">
          <span className="flow-node__name">{TEAM.technical.length} technical sub-teams</span>
        </Node>
        <Node x={RIGHT_C - 250} y={GROUP_Y} w={500} h={GROUP_H} delay={1.34} tone="flow-node--soft">
          <span className="flow-node__name">{TEAM.nonTechnical.length} non-technical sub-teams</span>
        </Node>

        <div className="abs" style={{ left: 0, top: CARDS_Y, width: LEFT_W, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
          {TEAM.technical.map((s, i) => (
            <Unit key={s.name} name={s.name} what={s.what} delay={1.62 + i * 0.07} tone="card--peach" />
          ))}
        </div>

        <div className="abs" style={{ left: RIGHT_X, top: CARDS_Y, width: RIGHT_W, display: 'grid', gap: 22 }}>
          {TEAM.nonTechnical.map((s, i) => (
            <Unit key={s.name} name={s.name} what={s.what} delay={1.76 + i * 0.1} tone="card--blush" />
          ))}
        </div>
      </div>
    </div>
  )
}
