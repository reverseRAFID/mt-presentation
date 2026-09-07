/* A measured value attached to a drawing: mono label, thin leader line, dot on the target.
   Coordinates are in the slide's inner (padded) space. */
interface Props {
  label: string
  x: number
  y: number
  tx: number
  ty: number
  align?: 'left' | 'right'
}

export function Callout({ label, x, y, tx, ty, align = 'left' }: Props) {
  const anchorX = align === 'left' ? x - 12 : x + 12
  return (
    <>
      <svg className="abs" style={{ left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }} width="1" height="1" aria-hidden="true">
        <path d={`M${tx} ${ty} L${anchorX} ${y}`} stroke="var(--red)" strokeWidth="2" fill="none" />
        <circle cx={tx} cy={ty} r="6" fill="var(--red)" />
      </svg>
      <span
        className="dim abs"
        style={{
          left: x,
          top: y - 19,
          transform: align === 'right' ? 'translateX(-100%)' : undefined,
          padding: '6px 12px',
          background: 'var(--paper)',
          border: '2px solid var(--line-2)',
          borderRadius: 8,
        }}
      >
        {label}
      </span>
    </>
  )
}
