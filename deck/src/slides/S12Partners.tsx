import { Reveal } from '../components/Reveal'
import { useReduced } from '../components/motionPrefs'
import { COLLABORATION, PARTNERS, PREVIOUS_PARTNER, SPONSORS } from '../content/facts'
import { IndustrialScene } from './IndustrialScene'

/* Industry–academia collaboration: the partnerships are what outlast the season.
   No company names on the sheet — the logos say who; the lines say what was
   built together. Logos are SVGs in public/img/partners/, cropped to their
   artwork so each one fills its tile. The lower band shows the kind of work it
   leads to: an operator on an industrial arm, not a rover in a desert. Everyone
   else behind the team goes past on a slow conveyor along the foot of the
   sheet, so the sheet never has to hold all of them at once. The strip below
   that stays clear for the rover, as on every other slide. */

function Logo({ slot, name, className, height }: { slot: string; name: string; className: string; height?: number }) {
  return (
    <div className={className} style={{ height }}>
      <img src={`./img/partners/${slot}`} alt={name} />
    </div>
  )
}

/* The list twice over, moved left by half its width on a loop, is a belt with
   no seam. Still when motion is reduced — the first few then simply stand. */
function Conveyor() {
  const reduced = useReduced()
  const belt = [...SPONSORS, ...SPONSORS]
  return (
    <div className={`marquee${reduced ? ' marquee--still' : ''}`} aria-label="Sponsors and suppliers">
      <div className="marquee__track">
        {belt.map((s, i) => (
          <img key={`${s.slot}-${i}`} src={`./img/partners/${s.slot}`} alt={i < SPONSORS.length ? s.name : ''} aria-hidden={i >= SPONSORS.length} />
        ))}
      </div>
    </div>
  )
}

export function S12Partners() {
  return (
    <div className="slide__inner">
      <Reveal className="abs" style={{ left: 0, top: 0, width: 1400 }}>
        <h2 className="heading">Beyond the competition.</h2>
        <p className="small" style={{ marginTop: 8 }}>Industry–academia collaboration</p>
      </Reveal>

      <Reveal delay={0.1} className="abs" style={{ left: 0, top: 104, width: 1180 }}>
        <p className="lead" style={{ color: 'var(--ink-2)', fontSize: 31 }}>
          Working with industry does not just empower the team — it puts real industrial requirements in front of us, and we
          solve them.
        </p>
      </Reveal>

      {/* the global partners: one tile each, and what each collaboration produced */}
      <Reveal delay={0.2} className="abs small" style={{ left: 0, top: 204 }}>
        Global industry partners
      </Reveal>
      <div className="abs" style={{ left: 0, top: 236, width: 1728, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 }}>
        {PARTNERS.map((p, i) => (
          <Reveal key={p.slot} delay={0.26 + i * 0.07} y={10}>
            <Logo slot={p.slot} name={p.name} className="logo-slot" height={112} />
            <p className="small" style={{ marginTop: 10, fontSize: 19, lineHeight: 1.28 }}>{p.what}</p>
          </Reveal>
        ))}
      </div>

      {/* the work it leads to: an operator on an industrial arm, at nine-tenths size */}
      <Reveal delay={0.7} y={0} className="abs" style={{ left: 0, top: 430, width: 738, height: 259 }}>
        <div style={{ width: 820, height: 288, transform: 'scale(0.9)', transformOrigin: 'top left' }}>
          <IndustrialScene />
        </div>
      </Reveal>

      {/* why: two reasons it is not about the rulebook, sharing the band's height */}
      <div className="abs" style={{ left: 768, top: 428, width: 522, height: 262, display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12 }}>
        {COLLABORATION.map((c, i) => (
          <Reveal
            key={c.k}
            delay={0.66 + i * 0.08}
            y={8}
            className="card"
            style={{ padding: '14px 20px', borderRadius: 18, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <p className="body" style={{ fontWeight: 500, fontSize: 24, lineHeight: 1.15, marginBottom: 4 }}>{c.k}</p>
            <p className="small" style={{ fontSize: 18, lineHeight: 1.3 }}>{c.v}</p>
          </Reveal>
        ))}
      </div>

      {/* the one that came before: the trust of the country's largest conglomerate */}
      <Reveal delay={0.9} y={8} className="abs card card--blush" style={{ left: 1310, top: 428, width: 418, height: 262, padding: '16px 20px' }}>
        <Logo slot={PREVIOUS_PARTNER.slot} name={PREVIOUS_PARTNER.name} className="logo-slot" height={100} />
        <p className="small" style={{ margin: '10px 0 2px', fontSize: 19 }}>Previous partner</p>
        <p className="body" style={{ fontWeight: 500, fontSize: 23, lineHeight: 1.2 }}>{PREVIOUS_PARTNER.line}</p>
        <p className="small" style={{ marginTop: 4, fontSize: 18 }}>{PREVIOUS_PARTNER.when}</p>
      </Reveal>

      {/* everyone else behind the team, going past on the belt */}
      <Reveal delay={1.0} y={6} className="abs" style={{ left: 0, top: 712, width: 1728, height: 64, display: 'flex', alignItems: 'center', gap: 24 }}>
        <p className="small" style={{ flex: '0 0 150px', fontSize: 18, lineHeight: 1.25 }}>Also behind the team</p>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Conveyor />
        </div>
      </Reveal>
    </div>
  )
}
