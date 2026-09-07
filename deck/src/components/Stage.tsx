import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import type { StageRect } from '../rover/overlay'

export const STAGE_W = 1920
export const STAGE_H = 1080

/* Scales a fixed 1920×1080 sheet to fit its container; never reflows. */
export function Stage({ children, onRect }: { children: ReactNode; onRect: (r: StageRect) => void }) {
  const area = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ scale: 1, left: 0, top: 0 })

  useLayoutEffect(() => {
    const el = area.current
    if (!el) return
    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      const scale = Math.min(width / STAGE_W, height / STAGE_H)
      const left = (width - STAGE_W * scale) / 2
      const top = (height - STAGE_H * scale) / 2
      setFit({ scale, left, top })
      const r = el.getBoundingClientRect()
      onRect({ left: r.left + left, top: r.top + top, width: STAGE_W * scale, height: STAGE_H * scale })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [onRect])

  return (
    <div className="stage-area" ref={area}>
      <div className="stage" style={{ transform: `translate(${fit.left}px, ${fit.top}px) scale(${fit.scale})` }}>
        {children}
      </div>
    </div>
  )
}
