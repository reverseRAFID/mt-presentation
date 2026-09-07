import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'motion/react'
import { useReduced } from './motionPrefs'

/* Entering elements: short distance, ease-out, fast. Nothing bounces. */
export const EASE = [0.22, 1, 0.36, 1] as const

interface Props {
  children: ReactNode
  delay?: number
  y?: number
  scale?: number
  className?: string
  style?: CSSProperties
}

export function Reveal({ children, delay = 0, y = 14, scale = 1, className, style }: Props) {
  const reduced = useReduced()
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: reduced ? 0 : y, scale: reduced ? 1 : scale }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduced ? 0 : 0.5, ease: EASE, delay: reduced ? 0 : delay }}
    >
      {children}
    </motion.div>
  )
}
