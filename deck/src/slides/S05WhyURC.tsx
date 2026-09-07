import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useReduced } from '../components/motionPrefs'
import { Reveal, EASE } from '../components/Reveal'
import { SplitFlap } from '../components/SplitFlap'
import { ENTRANTS, JFK, TIMELINE, TOP_BY_COUNTRY, URC } from '../content/facts'

const EVERY = 3600
const ROW = 24
const OURS = 'BRAC University'

/* The season, stop by stop — the two dates the Mars Society publishes and the
   three stages you have to survive to get to them. */
function Timeline() {
  return (
    <div className="timeline">
      {TIMELINE.map((m, i) => (
        <Reveal key={m.label} delay={0.36 + i * 0.1} y={8} className={`timeline__stop ${m.hard ? 'timeline__stop--hard' : ''}`}>
          <p className="timeline__when">{m.when}</p>
          <p className="timeline__label">{m.label}</p>
          <p className="timeline__detail">{m.detail}</p>
        </Reveal>
      ))}
    </div>
  )
}

/** Cut a name to the board's width at a word boundary, not mid-word. */
function clip(text: string, cells: number) {
  if (text.length <= cells) return text
  const cut = text.slice(0, cells + 1).lastIndexOf(' ')
  return cut > cells * 0.55 ? text.slice(0, cut) : text.slice(0, cells)
}

/* Participating universities: the board walks the world country by country,
   showing each one's top teams. Ours comes up in red when its turn arrives. */
function Board() {
  const reduced = useReduced()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setI((v) => (v + 1) % TOP_BY_COUNTRY.length), EVERY)
    return () => window.clearInterval(id)
  }, [reduced])

  const e = TOP_BY_COUNTRY[i]
  const ours = e.uni === OURS

  return (
    <div className="board">
      <SplitFlap text={clip(e.uni, ROW)} cells={ROW} hot={ours ? () => true : undefined} />
      <SplitFlap text={clip(e.team, ROW)} cells={ROW} small />
      <div className="board__status">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={i}
            className="small"
            style={{ fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
          >
            <span style={{ color: e.finalist ? 'var(--red)' : 'var(--ink-3)', fontWeight: 500 }}>{e.finalist ? 'FINALIST' : 'ENTERED'}</span>
            {' · '}
            {e.country.toUpperCase()}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* The whole field: all 116, eighteen at a time, in the country order the Mars
   Society lists them. The pages dissolve through in about half a minute, so
   every name is on the sheet while the slide is up — and none of it moves
   while you are trying to read it. */
const PAGE = 18
const PAGE_EVERY = 5200

function Roster() {
  const reduced = useReduced()
  const pages = useMemo(() => Array.from({ length: Math.ceil(ENTRANTS.length / PAGE) }, (_, k) => ENTRANTS.slice(k * PAGE, (k + 1) * PAGE)), [])
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setPage((v) => (v + 1) % pages.length), PAGE_EVERY)
    return () => window.clearInterval(id)
  }, [reduced, pages.length])

  return (
    <div className="roster" aria-label={`All ${ENTRANTS.length} teams that entered`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={page}
          className="roster__grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
        >
          {pages[page].map((e, k) => (
            <motion.span
              key={e.team}
              className={`roster__item ${e.finalist ? 'roster__item--final' : ''}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : k * 0.022, ease: EASE }}
            >
              <b>{e.team}</b> · {e.uni}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="roster__pages" aria-hidden="true">
        {pages.map((_, k) => (
          <span key={k} className={`roster__dot ${k === page ? 'roster__dot--on' : ''}`} />
        ))}
        <span className="roster__count">
          {String(page + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

export function S05WhyURC() {
  return (
    <div className="slide__inner">
      <Reveal className="abs" style={{ left: 0, top: 0, width: 1728 }}>
        <p className="small" style={{ marginBottom: 14 }}>Why the hardest one?</p>
        <blockquote className="quote" style={{ fontSize: 46, maxWidth: 1400 }}>{JFK.quote}</blockquote>
        <p className="small" style={{ marginTop: 14 }}>
          {JFK.who} · {JFK.where}
        </p>
      </Reveal>

      <Reveal delay={0.18} className="abs" style={{ left: 0, top: 226, width: 960 }}>
        <p className="lead" style={{ fontWeight: 500 }}>
          We chose the University Rover Challenge as our benchmark for exactly that reason. {URC.teams} teams enter. {URC.finalists} reach
          the <b>Mars Desert Research Station</b>
        </p>
      </Reveal>

      <div className="abs" style={{ left: 0, top: 396, width: 1728 }}>
        <Reveal delay={0.3} className="small" style={{ marginBottom: 6 }}>
          The season
        </Reveal>
        <Timeline />
      </div>

      <Reveal delay={0.12} className="abs" style={{ left: 1010, top: 226, width: 718 }}>
        <p className="small" style={{ marginBottom: 12 }}>Participating universities</p>
        <Board />
      </Reveal>

      <Reveal delay={0.6} y={0} className="abs" style={{ left: 0, top: 586, width: 1728 }}>
        <p className="small" style={{ marginBottom: 8 }}>
          All {URC.teams} teams that entered · {URC.countries} countries
        </p>
        <Roster />
      </Reveal>
    </div>
  )
}
