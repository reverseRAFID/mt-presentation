import { SLIDES, TOTAL_SECONDS, formatClock } from '../content/deck'

interface Props {
  index: number
  elapsed: number
  running: boolean
}

export function PresenterPanel({ index, elapsed, running }: Props) {
  const slide = SLIDES[index]
  const nextSlide = SLIDES[index + 1]
  const startsAt = index === 0 ? 0 : SLIDES[index - 1].endsAt
  const drift = elapsed - startsAt
  const status = !running ? 'idle' : drift > 15 ? 'behind' : drift < -10 ? 'ahead' : 'on time'

  return (
    <aside className="presenter" aria-label="Presenter view">
      <div>
        <p className="presenter__label">
          Slide {index + 1} of {SLIDES.length}
        </p>
        <p style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 600, margin: '2px 0 0' }}>{slide.title}</p>
      </div>

      <div className="presenter__clock">
        <div className={`presenter__stat ${status === 'behind' ? 'presenter__stat--behind' : status === 'ahead' ? 'presenter__stat--ahead' : ''}`}>
          <span className="presenter__label">Elapsed · {running ? status : 'press t to start'}</span>
          <b>{formatClock(elapsed)}</b>
        </div>
        <div className="presenter__stat">
          <span className="presenter__label">This slide should end by</span>
          <b>{formatClock(slide.endsAt)}</b>
        </div>
        <div className="presenter__stat">
          <span className="presenter__label">Budget</span>
          <b>
            {slide.endsAt - startsAt}s · {slide.words}w
          </b>
        </div>
        <div className="presenter__stat">
          <span className="presenter__label">Remaining of 5:00</span>
          <b>{formatClock(TOTAL_SECONDS - elapsed)}</b>
        </div>
      </div>

      <div className="presenter__notes">
        <h3>Say</h3>
        <blockquote>{slide.spoken}</blockquote>
        <h3>Notes</h3>
        <p>{slide.notes}</p>
      </div>

      <div className="presenter__next">
        <span className="presenter__label">Next</span>
        <p style={{ margin: '2px 0 0', fontWeight: 500 }}>{nextSlide ? `${index + 2} · ${nextSlide.title}` : 'End of deck · hold for Q&A'}</p>
      </div>

      <div className="presenter__keys">
        <span>
          <kbd>→</kbd> next
        </span>
        <span>
          <kbd>←</kbd> back
        </span>
        <span>
          <kbd>1</kbd>–<kbd>9</kbd> jump
        </span>
        <span>
          <kbd>f</kbd> fullscreen
        </span>
        <span>
          <kbd>s</kbd> notes
        </span>
        <span>
          <kbd>t</kbd> start clock
        </span>
        <span>
          <kbd>r</kbd> reset clock
        </span>
      </div>
    </aside>
  )
}
