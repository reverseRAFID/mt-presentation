import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { useReduced } from './motionPrefs'

interface Props {
  src: string
  alt: string
  style?: CSSProperties
  className?: string
  position?: string
  /** Seconds to wait before the curtain lifts. Match the wrapping Reveal. */
  delay?: number
}

const UNCOVER = [0.4, 0.85, 0.2, 1] as const
const RISE = [0.2, 0.7, 0.25, 1] as const

/* A photograph on the drawing sheet: thin border, two orange registration corners.
   It is uncovered by a curtain of paper rather than by clipping the bitmap and fades
   up out of a slight zoom, but nothing is laid over the picture itself — no wash and
   no caption. The pictures carry themselves; the presenter names them. */
export function Frame({ src, alt, style, className, position, delay = 0 }: Props) {
  const reduced = useReduced()
  const at = reduced ? 0 : delay + 0.12
  return (
    <figure className={`frame ${className ?? ''}`} style={{ margin: 0, ...style }}>
      <div className="frame__shot">
        <motion.img
          className="frame__img"
          src={`./img/${src}`}
          alt={alt}
          style={{ objectPosition: position }}
          initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0 : 0.9, ease: RISE, delay: at }}
        />
        <motion.span
          className="frame__curtain"
          initial={{ scaleY: reduced ? 0 : 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: reduced ? 0 : 0.85, ease: UNCOVER, delay: at }}
        />
      </div>
      <span className="frame__corner frame__corner--tl" />
      <span className="frame__corner frame__corner--br" />
    </figure>
  )
}
