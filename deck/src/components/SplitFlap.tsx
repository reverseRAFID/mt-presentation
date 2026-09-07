import { useEffect, useRef, useState } from 'react'
import { useReduced } from './motionPrefs'

/* A departure board. One light cell per character. When the text changes, each
   cell flips a handful of times — sampling the alphabet on the way from the
   letter it is showing to the one it needs — and lands; cells further right
   start a beat later, so the new name ripples in from the left over the old one.
   Nothing is cleared in between: one name flips straight into the next.

   Each cell's letter is a pure function of how long it has been flipping, so a
   throttled timer only makes it catch up, never lose its place. */

const ALPHABET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&.-\'@'
const L = ALPHABET.length
const TICK = 78 // ms per flip
const STAGGER = 22 // ms between one cell starting and the next
const FLIPS = 4 // flips a cell makes on its way to a new letter

interface Props {
  text: string
  cells: number
  small?: boolean
  /** Cells to pick out, by index — used to colour a word on the row. */
  hot?: (i: number) => boolean
}

const fit = (text: string, cells: number) => text.toUpperCase().slice(0, cells).padEnd(cells, ' ')
const idx = (c: string) => Math.max(0, ALPHABET.indexOf(c))

export function SplitFlap({ text, cells, small = false, hot }: Props) {
  const reduced = useReduced()
  const target = fit(text, cells)
  const [chars, setChars] = useState<string[]>(() => target.split(''))
  const shown = useRef<string[]>(target.split(''))

  useEffect(() => {
    if (reduced) {
      shown.current = target.split('')
      setChars(shown.current)
      return
    }
    const from = shown.current.slice(0, cells)
    while (from.length < cells) from.push(' ')
    const t0 = performance.now()
    // How far round the drum each cell has to travel, and whether it moves at all.
    const dist = from.map((c, i) => (idx(target[i]) - idx(c) + L) % L)

    const id = window.setInterval(() => {
      const now = performance.now()
      let landed = true
      const next = from.map((c, i) => {
        if (dist[i] === 0) return c
        const k = Math.floor((now - t0 - i * STAGGER) / TICK)
        if (k < 0) {
          landed = false
          return c
        }
        if (k >= FLIPS) return target[i]
        landed = false
        return ALPHABET[(idx(c) + Math.round((dist[i] * k) / FLIPS)) % L]
      })
      shown.current = next
      setChars(next)
      if (landed) window.clearInterval(id)
    }, TICK)
    return () => window.clearInterval(id)
  }, [target, cells, reduced])

  return (
    <div className="board__row" aria-label={text}>
      {chars.map((c, i) => (
        <span key={i} className={`flap ${small ? 'flap--small' : ''} ${hot?.(i) ? 'flap--hot' : ''}`}>
          <span key={c} className="flap__char">
            {c === ' ' ? ' ' : c}
          </span>
        </span>
      ))}
    </div>
  )
}
