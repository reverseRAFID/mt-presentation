import { Reveal } from '../components/Reveal'
import { Frame } from '../components/Frame'
import { Odometer } from '../components/Odometer'
import { OUTREACH } from '../content/facts'

const PHOTOS = [
  { src: 'outreach-vnsc.jpg', alt: 'School students around the rover' },
  { src: 'outreach-hypersonic.jpg', alt: 'A student trying the rover arm', pos: 'center 30%' },
  { src: 'auditorium.jpg', alt: 'A full auditorium at an outreach talk' },
  { src: 'emk-presentation.jpg', alt: 'Presenting at the EMK Center' },
]

/* Achievements do not come from working alone: the outreach half of the year. */
export function S11Outreach() {
  return (
    <div className="slide__inner">
      <Reveal className="abs" style={{ left: 0, top: 0, width: 1200 }}>
        <h2 className="heading">We also build future engineers!</h2>
      </Reveal>

      <Reveal delay={0.1} className="abs card card--white" style={{ left: 0, top: 130, width: 620 }}>
        <p className="lead" style={{ fontWeight: 500, lineHeight: 1.15 }}>
          <Odometer className="bignum" value={OUTREACH.institutions} suffix="+" size={104} delay={0.35} style={{ display: 'flex', marginBottom: 8 }} />
          schools and colleges across Bangladesh
        </p>
        <p className="small" style={{ marginTop: 10 }}>STEM sessions in the past {OUTREACH.years} years</p>
      </Reveal>

      <Reveal delay={0.2} className="abs" style={{ left: 0, top: 480, width: 620 }}>
        <p className="small" style={{ marginBottom: 14 }}>And we mentor school teams into</p>
        <div className="chips" style={{ gap: 12 }}>
          {OUTREACH.mentors.map((m) => (
            <span key={m} className="chip chip--orange" style={{ fontSize: 24 }}>{m}</span>
          ))}
        </div>
        <p className="body" style={{ color: 'var(--ink-2)', marginTop: 22, maxWidth: 580 }}>
          We belive that the next generation of engineers and scientists will be the ones to take humanity to Mars. We are proud to mentor them, and to show them that they can do it too.
        </p>
      </Reveal>

      <Reveal delay={0.06} y={0} scale={0.985} className="abs" style={{ left: 680, top: 90, width: 1048, height: 440 }}>
        <Frame src="team-lazy-go.jpg" alt="Team Lazy Go with the Bangladesh flag at the World Robot Olympiad in Singapore" delay={0.06} style={{ width: '100%', height: '100%' }} position="center 52%" />
      </Reveal>

      <div className="abs" style={{ left: 680, top: 560, width: 1048, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
        {PHOTOS.map((p, i) => (
          <Reveal key={p.src} delay={0.3 + i * 0.06} y={10}>
            <Frame src={p.src} alt={p.alt} position={p.pos} delay={0.3 + i * 0.06} style={{ height: 186, '--pad': '6px' } as React.CSSProperties} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
