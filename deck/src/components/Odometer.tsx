import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { EASE } from './Reveal'
import { useReduced } from './motionPrefs'

/* A number that arrives the way a mechanical counter does: each digit is a
   strip of 0–9 behind a slot, rolled up one full turn and on to its figure.
   The units run a little longer than the tens, so the wheels settle from the
   left. Whatever follows the number pops in once the wheels have stopped. */

const STRIP = Array.from({ length: 20 }, (_, i) => i % 10) // 0–9 twice: one full turn, then the figure

interface Props {
  value: number
  suffix?: string
  /** Font size in px; the slot is 0.9 of it, like .bignum's line-height. */
  size: number
  delay?: number
  className?: string
  style?: CSSProperties
}

export function Odometer({ value, suffix, size, delay = 0, className, style }: Props) {
  const reduced = useReduced()
  const digits = String(value).split('').map(Number)
  const cell = size * 0.9
  const settle = delay + 1.0 + digits.length * 0.25
  return (
    <span className={`odo${className ? ` ${className}` : ''}`} style={{ fontSize: size, ...style }} aria-label={`${value}${suffix ?? ''}`}>
      {digits.map((d, i) => (
        <span key={i} className="odo__col" style={{ height: cell }} aria-hidden="true">
          <motion.span
            className="odo__strip"
            initial={{ y: reduced ? -(10 + d) * cell : 0 }}
            animate={{ y: -(10 + d) * cell }}
            transition={{ duration: reduced ? 0 : 1.1 + i * 0.25, ease: EASE, delay: reduced ? 0 : delay }}
          >
            {STRIP.map((k, j) => (
              <span key={j} className="odo__cell" style={{ height: cell }}>
                {k}
              </span>
            ))}
          </motion.span>
        </span>
      ))}
      {suffix && (
        <motion.span
          className="odo__suffix"
          aria-hidden="true"
          initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.5, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.4, ease: EASE, delay: reduced ? 0 : settle }}
        >
          {suffix}
        </motion.span>
      )}
    </span>
  )
}
