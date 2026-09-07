import { motion } from 'motion/react'
import { useReduced } from '../components/motionPrefs'
import { Reveal, EASE } from '../components/Reveal'
import { SEASONS } from '../content/facts'

/* The one orchestrated moment in the deck: the line draws itself, stops on 2024, then finishes. */
const W = 1728
const H = 680
const PAD = { l: 90, r: 120, t: 70, b: 120 }
const MAX_RANK = 24

const xOf = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / (SEASONS.length - 1)
const yOf = (rank: number) => PAD.t + ((rank - 1) * (H - PAD.t - PAD.b)) / (MAX_RANK - 1)

function seg(indices: number[]) {
  return indices
    .map((i, k) => {
      const s = SEASONS[i]
      return `${k === 0 ? 'M' : 'L'}${xOf(i)} ${yOf(s.rank ?? 1)}`
    })
    .join(' ')
}

export function S10Seasons() {
  const reduced = useReduced()
  const T = (delay: number, duration: number) => ({ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: EASE })
  const pointDelay = [0.3, 0.55, 0.85, 0, 1.0, 1.25, 1.5, 2.45, 2.75]
  const stroke = 'var(--orange)'

  return (
    <div className="slide__inner">
      <Reveal className="abs" style={{ left: 0, top: 0 }}>
        <h2 className="heading">Eight seasons. One direction.</h2>
        <p className="small" style={{ marginTop: 8 }}>Global rank at the University Rover Challenge · lower is better</p>
      </Reveal>


      <svg className="abs" style={{ left: 0, top: 90 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Rank by year: 13, 11, 3 on design review, cancelled, 16, 16, 21, 8, 7">
        {[1, 5, 10, 15, 20].map((r) => (
          <g key={r}>
            <line x1={PAD.l - 20} x2={W - PAD.r + 20} y1={yOf(r)} y2={yOf(r)} stroke="var(--line)" strokeWidth="2" strokeDasharray={r === 1 ? undefined : '2 10'} />
            <text x={PAD.l - 34} y={yOf(r) + 8} textAnchor="end" fontFamily="var(--mono)" fontSize="22" fill="var(--ink-3)">
              {r === 1 ? '1st' : r}
            </text>
          </g>
        ))}
        {SEASONS.map((s, i) => (
          <text key={s.year} x={xOf(i)} y={H - 16} textAnchor="middle" fontFamily="var(--mono)" fontSize="24" fill="var(--ink)">
            {s.year}
          </text>
        ))}

        {/* 2018 → 2019 */}
        <motion.path d={seg([0, 1])} stroke={stroke} strokeWidth="8" fill="none" strokeLinecap="round" initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={T(0.3, 0.3)} />
        {/* 2019 → 2020, design review only */}
        <motion.path d={seg([1, 2])} stroke={stroke} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="4 14" initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={T(0.6, 0.3)} />
        {/* 2021 cancelled */}
        <motion.line x1={xOf(3)} x2={xOf(3)} y1={PAD.t} y2={H - PAD.b} stroke="var(--line-2)" strokeWidth="3" strokeDasharray="6 10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={T(0.9, 0.2)} />
        <motion.text x={xOf(3)} y={yOf(12)} textAnchor="middle" fontFamily="var(--body)" fontSize="22" fill="var(--ink-2)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={T(0.9, 0.2)}>
          <tspan x={xOf(3)}>finals</tspan>
          <tspan x={xOf(3)} dy="26">cancelled</tspan>
        </motion.text>
        {/* 2022 → 2024: draws, then holds on the low point */}
        <motion.path d={seg([4, 5, 6])} stroke={stroke} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={T(1.0, 0.6)} />
        {/* 2024 → 2026: the comeback */}
        <motion.path d={seg([6, 7, 8])} stroke="var(--red)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={T(2.4, 0.6)} />

        {SEASONS.map((s, i) => {
          if (s.rank == null) return null
          const cx = xOf(i)
          const cy = yOf(s.rank)
          const isLow = s.year === 2024
          const isBest = s.year === 2026
          const r = isLow || isBest ? 16 : 11
          return (
            <motion.g key={s.year} initial={{ opacity: 0, scale: reduced ? 1 : 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={T(pointDelay[i], 0.3)} style={{ transformOrigin: `${cx}px ${cy}px` }}>
              <circle cx={cx} cy={cy} r={r} fill={s.kind === 'sar' ? 'var(--paper)' : isLow ? 'var(--red)' : isBest ? 'var(--red)' : 'var(--orange)'} stroke={s.kind === 'sar' ? stroke : 'var(--paper)'} strokeWidth={s.kind === 'sar' ? 5 : 4} />
              <text x={cx} y={isLow ? cy + 58 : cy - 26} textAnchor="middle" fontFamily="var(--display)" fontWeight="700" fontSize={isLow || isBest ? 40 : 30} fill={isLow || isBest ? 'var(--red)' : 'var(--ink)'}>
                {s.label}
              </text>
              {s.note && (
                <text x={cx} y={isLow ? cy + 92 : cy - 66} textAnchor="middle" fontFamily="var(--body)" fontSize="22" fill="var(--ink-2)">
                  {s.note}
                </text>
              )}
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}
