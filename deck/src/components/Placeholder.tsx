import type { CSSProperties } from 'react'
import { Reveal } from './Reveal'

interface Props {
  /** The file to drop into public/img — the name the slide will look for. */
  file: string
  /** What the picture should show. */
  note: string
  delay?: number
  style?: CSSProperties
}

/* A photograph that has not been supplied yet. It says exactly which file to save
   and what should be in it; once the file is in public/img, swap this for
   <Frame src={file} … /> and nothing else has to change. */
export function Placeholder({ file, note, delay = 0, style }: Props) {
  return (
    <Reveal delay={delay} y={0} className="abs placeholder" style={style}>
      <svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="2.5" y="5" width="19" height="15" rx="3" />
        <circle cx="12" cy="12.5" r="3.6" />
        <path d="M8 5l1.4-2h5.2L16 5" />
      </svg>
      <p className="placeholder__note">{note}</p>
      <p className="placeholder__file">img/{file}</p>
    </Reveal>
  )
}
