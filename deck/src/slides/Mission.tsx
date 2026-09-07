import { Reveal } from '../components/Reveal'
import { Frame } from '../components/Frame'
import { Placeholder } from '../components/Placeholder'
import { IconAutonomy, IconDelivery, IconScience, IconService } from '../components/Icons'
import { MISSIONS, type Mission as MissionData } from '../content/facts'

const ICONS = { servicing: IconService, autonomous: IconAutonomy, science: IconScience, delivery: IconDelivery }

/* One layout, four missions — so the set reads as a series rather than four
   unrelated slides. `photoReady` flips a slide from placeholder to photograph the
   moment the file lands in public/img. */
export function Mission({ id, photoReady = false }: { id: MissionData['id']; photoReady?: boolean }) {
  const m = MISSIONS.find((x) => x.id === id)!
  const Icon = ICONS[id as keyof typeof ICONS]

  return (
    <div className="slide__inner">
      <Reveal className="abs" style={{ left: 0, top: 0, width: 1000 }}>
        <p className="small" style={{ marginBottom: 14 }}>
          Mission {String(m.n).padStart(2, '0')} of {MISSIONS.length}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <span style={{ color: 'var(--red)', display: 'block' }}>{Icon && <Icon size={64} />}</span>
          <h2 className="heading" style={{ fontSize: 64 }}>{m.name}</h2>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="abs" style={{ left: 0, top: 240, width: 940 }}>
        <p className="lead" style={{ fontWeight: 500 }}>{m.lead}</p>
      </Reveal>

      <div className="abs" style={{ left: 0, top: 400, width: 940 }}>
        {m.steps.map((s, i) => (
          <Reveal key={s} delay={0.2 + i * 0.09} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 20, alignItems: 'baseline', padding: '20px 0', borderBottom: '2px solid var(--line)' }}>
            <span className="dim" style={{ color: 'var(--ink-3)' }}>{String(i + 1).padStart(2, '0')}</span>
            <span className="body" style={{ color: 'var(--ink)' }}>{s}</span>
          </Reveal>
        ))}
      </div>

      {m.result && (
        <Reveal delay={0.54} className="abs" style={{ left: 0, top: 700 }}>
          <span className="chip chip--red" style={{ fontSize: 26, padding: '12px 26px' }}>{m.result}</span>
        </Reveal>
      )}

      {photoReady ? (
        <Reveal delay={0.05} y={0} scale={0.985} className="abs" style={{ left: 1000, top: 40, width: 728, height: 700 }}>
          <Frame src={m.photo} alt={m.photoNote} position={m.photoPos} delay={0.05} style={{ width: '100%', height: '100%' }} />
        </Reveal>
      ) : (
        <Placeholder file={m.photo} note={m.photoNote} delay={0.05} style={{ left: 1000, top: 40, width: 728, height: 700 }} />
      )}
    </div>
  )
}
