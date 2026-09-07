import { Reveal } from '../components/Reveal'
import { Frame } from '../components/Frame'
import { BENCHMARKS } from '../content/facts'

/* The hinge of the talk: you have built a thing, and you have no idea whether it
   is any good. */
export function S04Benchmark() {
  return (
    <div className="slide__inner">
      <Reveal className="abs" style={{ left: 0, top: 0, width: 1100 }}>
        <h2 className="heading">We built a rover.</h2>
        <h2 className="heading" style={{ color: 'var(--red)' }}>How do you know it is any good?</h2>
      </Reveal>

      <Reveal delay={0.12} className="abs" style={{ left: 0, top: 210, width: 940 }}>
        <p className="lead" style={{ color: 'var(--ink-2)' }}>
          Benchmarking our system against the best in the world is the only way to know whether we are competitive. We have chosen a few competitions that are relevant to our rover's capabilities...
        </p>
      </Reveal>

      <div className="abs" style={{ left: 0, top: 400, width: 940, display: 'grid', gap: 22 }}>
        {BENCHMARKS.map((b, i) => (
          <Reveal key={b.code} delay={0.22 + i * 0.1} className={`card ${b.chosen ? 'card--blush' : ''}`} style={{ display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 28, alignItems: 'center', padding: '24px 32px' }}>
            <span className="bignum" style={{ fontSize: 52, color: b.chosen ? 'var(--red)' : 'var(--ink-3)' }}>{b.code}</span>
            <span className="body" style={{ fontWeight: 500 }}>
              {b.name}
              {b.chosen && <span className="chip chip--red" style={{ marginLeft: 20, fontSize: 20, padding: '6px 16px' }}>we chose this one</span>}
            </span>
            <span className="small">{b.where}</span>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.05} y={0} scale={0.985} className="abs" style={{ left: 1000, top: 60, width: 728, height: 700 }}>
        <Frame src="urc-2023.jpg" alt="A rover crossing the Utah desert at the Mars Desert Research Station" delay={0.05} style={{ width: '100%', height: '100%' }} />
      </Reveal>
    </div>
  )
}
