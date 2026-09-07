/* Line icons drawn at 48px, 3px stroke, round joins. Used for the four URC missions. */
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export function IconScience({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" {...base} aria-hidden="true">
      <path d="M19 6h10M21 6v13L9 38a3 3 0 0 0 3 5h24a3 3 0 0 0 3-5L27 19V6" />
      <path d="M14 32h20" />
    </svg>
  )
}

export function IconDelivery({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" {...base} aria-hidden="true">
      <path d="M8 16 24 8l16 8v16l-16 8-16-8Z" />
      <path d="M8 16l16 8 16-8M24 24v16" />
    </svg>
  )
}

export function IconService({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" {...base} aria-hidden="true">
      <path d="M30 8a9 9 0 0 0-9 12L8 33a4 4 0 0 0 6 6l13-13a9 9 0 0 0 12-9l-5 5-6-1-1-6Z" />
    </svg>
  )
}

export function IconAutonomy({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" {...base} aria-hidden="true">
      <circle cx="10" cy="38" r="4" />
      <circle cx="38" cy="10" r="4" />
      <path d="M13 35c6-2 8-8 6-13s0-11 7-12M35 13c-6 2-8 8-6 13" strokeDasharray="1 7" />
      <path d="M27 30l6 6M33 30l-6 6" />
    </svg>
  )
}

/* Rover glyph for the "eight rovers" row. */
export function RoverGlyph({ size = 64, active = false }: { size?: number; active?: boolean }) {
  const c = active ? 'var(--red)' : 'var(--orange)'
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 64 48" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="14" y="18" width="34" height="12" rx="3" fill={active ? 'var(--blush)' : 'var(--peach)'} />
      <path d="M22 18V8h6M44 18l6-10" />
      <circle cx="16" cy="38" r="6" fill="var(--paper)" />
      <circle cx="46" cy="38" r="6" fill="var(--paper)" />
      <path d="M22 30l-6 8M40 30l6 8" />
    </svg>
  )
}
