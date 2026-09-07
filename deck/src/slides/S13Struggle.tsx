import { Reveal } from '../components/Reveal'
import { TeamScene } from './TeamScene'
import { Frame } from '../components/Frame'
import { Placeholder } from '../components/Placeholder'
import { STRUGGLES } from '../content/facts'

/* The emotional centre: the two runs that went wrong, and what they were for.
   Add a year here once its photograph is sitting in public/img. */
const READY: Record<number, boolean> = { 2024: true, 2025: true, 2026: true }

export function S13Struggle() {
  return (
    <div className="slide__inner">
      <Reveal className="abs" style={{ left: 0, top: 0, width: 1728 }}>
        <h2 className="heading">The part that is not on the spec sheet.</h2>
        <p className="lead" style={{ marginTop: 16, color: 'var(--ink-2)', maxWidth: 1500 }}>
          Competition is a part of learning. It is what turns a group of students into people who can be handed a broken
          thing and a deadline.
        </p>
      </Reveal>

      {STRUGGLES.map((s, i) => (
        <div key={s.year} className="abs" style={{ left: i * 590, top: 214, width: 548 }}>
          {READY[s.year] ? (
            <Reveal delay={0.1 + i * 0.1} y={0} scale={0.985}>
              <Frame src={s.photo} alt={s.photoNote} delay={0.1 + i * 0.1} style={{ height: 200 }} position="center 55%" />
            </Reveal>
          ) : (
            <Placeholder file={s.photo} note={s.photoNote} delay={0.1 + i * 0.1} style={{ position: 'relative', left: 0, top: 0, width: '100%', height: 200 }} />
          )}
          <Reveal delay={0.2 + i * 0.1} style={{ marginTop: 22 }}>
            <span className="chip chip--red" style={{ fontSize: 21, padding: '7px 16px' }}>URC {s.year}</span>
            <p className="body" style={{ fontWeight: 500, fontSize: 26, lineHeight: 1.22, marginTop: 14 }}>{s.what}</p>
            <p className="small" style={{ fontSize: 20, lineHeight: 1.32, marginTop: 10 }}>{s.fix}</p>
            <p className="small" style={{ fontSize: 18, marginTop: 10, color: 'var(--red)' }}>{s.lesson}</p>
          </Reveal>
        </div>
      ))}

      {/* the strip between the stories and the map: the team, mid-repair */}
      <Reveal delay={0.5} y={6} className="abs" style={{ left: 0, top: 672, width: 1728, height: 112 }}>
        <TeamScene />
      </Reveal>
    </div>
  )
}
