import { SLIDES } from '../content/deck'
import { Logo } from './Logo'

/* The rover's mission map along the foot of the sheet is the progress bar, so all
   that is left up here is the corner lockup — both marks, the way the cover does
   it, just smaller — and the title block. The opening frame draws its own corner,
   so it gets none here. */
export function Chrome({ index }: { index: number }) {
  const slide = SLIDES[index]
  if (index === SLIDES.length - 1) return null
  return (
    <>
      {index !== 0 && (
        <div className="logo-corner lockup lockup--corner">
          <Logo width={84} />
          <span className="lockup__rule" />
          <img className="lockup__mark" src="./img/bracu-logo.png" alt="BRAC University" />
        </div>
      )}
      <div className="titleblock">
        <span className="titleblock__num">{String(index + 1).padStart(2, '0')}</span>
        <span className="titleblock__sep" />
        <span>{slide.section}</span>
        <span className="titleblock__sep" />
        <span>BRACU Mongol-Tori</span>
      </div>
    </>
  )
}
