import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import type { Frame } from './motion'
import { RoverMotion, stationTarget } from './motion'
import { overlay, type StageRect } from './overlay'

/* 2D Taurus for machines without WebGL. It draws in design pixels on the sheet's
   own 1920 × 1080 grid, in an overlay between the two terrain layers, so the
   stacking is the same as it is for the three.js rover. Side view facing right;
   yaw becomes a horizontal squeeze and a flip. Same parts, same proportions and
   the same motion engine as the three.js rover. */

const R2D = 180 / Math.PI
const C = {
  shell: '#fff7ec',
  panel: '#ffe6cc',
  frame: '#e82727',
  accent: '#fc9d2d',
  strut: '#b0806f',
  metal: '#efe3d6',
  rim: '#a8776a',
  tyre: '#7a4a3c',
}

/* y is measured up from the ground, so every rover coordinate below is negative. */
const WHEEL_R = 25
const WHEELS: [number, number][] = [
  [-57.5, -25],
  [57.5, -25],
  [-40, -33],
  [75, -33],
]
const SPOKES = Array.from({ length: 10 }, (_, i) => (i / 10) * 360)

function WheelArt({ far }: { far?: boolean }) {
  const r = far ? WHEEL_R * 0.88 : WHEEL_R
  return (
    <>
      <circle r={r} fill={C.tyre} />
      <circle r={r * 0.86} fill={C.rim} />
      <circle r={r * 0.7} fill={C.shell} />
      {SPOKES.map((a) => (
        <rect key={a} x={r * 0.2} y={-r * 0.045} width={r * 0.55} height={r * 0.09} fill={C.rim} transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.3} fill={C.frame} />
      <circle r={r * 0.12} fill={C.accent} />
      {!far && <path d={`M0 ${-r * 0.28} V${-r * 0.72}`} stroke={C.frame} strokeWidth={r * 0.12} strokeLinecap="round" />}
    </>
  )
}

export function RoverSvg({ index, rect, reduced }: { index: number; rect: StageRect | null; reduced: boolean }) {
  const root = useRef<SVGGElement>(null)
  const shoulder = useRef<SVGGElement>(null)
  const elbow = useRef<SVGGElement>(null)
  const head = useRef<SVGGElement>(null)
  const wheels = useRef<(SVGGElement | null)[]>([])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const motion = useMemo(() => new RoverMotion(stationTarget(index), reduced), [])

  useEffect(() => {
    motion.setTarget(stationTarget(index))
  }, [index, motion])

  const apply = useCallback((f: Frame) => {
    const px = (f.x + 9.6) * 100
    const py = (5.4 - f.y) * 100
    const facing = Math.cos(f.yaw) >= 0 ? 1 : -1
    const squeeze = 0.55 + 0.45 * Math.abs(Math.cos(f.yaw))
    const g = root.current
    if (g) {
      g.setAttribute(
        'transform',
        `translate(${px} ${py - f.hopY * 100}) rotate(${(-f.pitch + f.roll * 0.5) * R2D * facing}) scale(${f.scale * f.squashX * squeeze * facing} ${f.scale * f.squashY})`,
      )
    }
    if (shoulder.current) shoulder.current.setAttribute('transform', `translate(30 -105) rotate(${-f.shoulder * R2D})`)
    if (elbow.current) elbow.current.setAttribute('transform', `translate(36 0) rotate(${-f.elbow * R2D})`)
    if (head.current) head.current.setAttribute('transform', `translate(-40 -150) scale(${0.85 + 0.15 * Math.cos(f.headYaw)} 1)`)
    const deg = f.wheelSpin * R2D
    wheels.current.forEach((w, i) => {
      if (!w) return
      const [x, y] = WHEELS[i]
      w.setAttribute('transform', `translate(${x} ${y}) rotate(${-deg})`)
    })
  }, [])

  // Paint the current pose synchronously so the rover is in place even before the first animation frame.
  useLayoutEffect(() => {
    apply(motion.step(performance.now() / 1000, 0))
  }, [index, motion, apply])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      apply(motion.step(t / 1000, dt))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [motion, apply])

  if (!rect || rect.width < 10) return null
  return (
    <div style={overlay(rect, 5)}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ overflow: 'visible' }} aria-hidden="true">
      <g ref={root}>
        {/* far wheels and the far wheel bar */}
        {WHEELS.slice(2).map(([x, y], i) => (
          <g key={`far${i}`} ref={(el) => { wheels.current[i + 2] = el }} transform={`translate(${x} ${y})`}>
            <WheelArt far />
          </g>
        ))}
        <rect x="-63" y="-58" width="126" height="5" rx="2.5" fill={C.rim} />

        {/* mast, front-left corner: tube, camera head, radios */}
        <rect x="-42.5" y="-172" width="5" height="106" fill={C.strut} />
        <path d="M-40 -114 L-6 -101" stroke={C.strut} strokeWidth="3" strokeLinecap="round" />
        <rect x="-56" y="-108" width="16" height="3" fill={C.strut} />
        <rect x="-61" y="-113" width="11" height="6" rx="2" fill={C.panel} stroke={C.rim} strokeWidth="1.2" />
        <g ref={head}>
          <rect x="-13" y="-5" width="26" height="10" rx="3" fill={C.shell} stroke={C.rim} strokeWidth="1.5" />
          <circle cx="-8" cy="0" r="2.8" fill={C.frame} />
          <circle cx="2" cy="0" r="2.8" fill={C.frame} />
        </g>
        <rect x="-45" y="-186" width="10" height="17" rx="2" fill={C.panel} stroke={C.rim} strokeWidth="1.5" />
        <path d="M-40 -181 H-25" stroke={C.strut} strokeWidth="2" strokeLinecap="round" />
        <path d="M-40 -185 V-205" stroke={C.strut} strokeWidth="2" strokeLinecap="round" />
        <circle cx="-40" cy="-206" r="2.6" fill={C.accent} />

        {/* body: light panels in a red truss frame */}
        <rect x="-48" y="-96" width="96" height="30" fill={C.shell} />
        {[-26, 0, 26].map((x) => (
          <rect key={x} x={x - 8.5} y="-89.5" width="17" height="7.5" rx="1.5" fill={C.panel} />
        ))}
        <path d="M-48 -66 L-16 -96 M-16 -96 L16 -66 M16 -66 L48 -96" stroke={C.frame} strokeWidth="4" fill="none" strokeLinejoin="round" />
        {[33, -33].map((x) => (
          <rect key={x} x={x - 4} y="-77" width="8" height="8" fill={C.accent} transform={`rotate(45 ${x} -73)`} />
        ))}
        <rect x="-50" y="-98" width="100" height="5" fill={C.frame} />
        <rect x="-50" y="-69" width="100" height="5" fill={C.frame} />
        <rect x="-50" y="-98" width="5" height="34" fill={C.frame} />
        <rect x="45" y="-98" width="5" height="34" fill={C.frame} />
        {/* deck plate */}
        <rect x="-56" y="-101" width="112" height="5" rx="1.5" fill={C.shell} stroke={C.rim} strokeWidth="1.2" />

        {/* arm on its linear rail across the back deck */}
        <rect x="20" y="-108" width="26" height="6" rx="2" fill={C.strut} />
        <rect x="24" y="-102" width="14" height="8" rx="2" fill={C.panel} stroke={C.rim} strokeWidth="1.2" />
        <g ref={shoulder}>
          <rect x="0" y="-4.5" width="36" height="9" rx="3" fill={C.metal} stroke={C.rim} strokeWidth="1.2" />
          <rect x="0" y="-6.5" width="36" height="3" fill={C.frame} />
          <circle r="6" fill={C.accent} />
          <g ref={elbow}>
            <rect x="0" y="-3.5" width="46" height="7" rx="2.5" fill={C.metal} stroke={C.rim} strokeWidth="1.2" />
            <path d="M2 6 H42" stroke={C.strut} strokeWidth="2.5" strokeLinecap="round" />
            <circle r="5" fill={C.accent} />
            <rect x="44" y="-5" width="8" height="10" rx="2" fill={C.frame} />
            <rect x="52" y="-4" width="9" height="3" rx="1" fill={C.accent} />
            <rect x="52" y="1" width="9" height="3" rx="1" fill={C.accent} />
          </g>
        </g>

        {/* near wheel bar, brackets and wheels */}
        <rect x="-63" y="-56" width="126" height="6" rx="3" fill={C.strut} />
        <circle cx="3" cy="-53" r="5" fill={C.accent} />
        {[-57.5, 57.5].map((x) => (
          <g key={x}>
            <rect x={x - 3} y="-56" width="6" height="30" fill={C.strut} />
            <rect x={x - 4.5} y="-62" width="9" height="7" rx="1.5" fill={C.panel} stroke={C.rim} strokeWidth="1" />
          </g>
        ))}
        {WHEELS.slice(0, 2).map(([x, y], i) => (
          <g key={`near${i}`} ref={(el) => { wheels.current[i] = el }} transform={`translate(${x} ${y})`}>
            <WheelArt />
          </g>
        ))}
      </g>
      </svg>
    </div>
  )
}
