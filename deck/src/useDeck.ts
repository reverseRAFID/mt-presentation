import { useCallback, useEffect, useRef, useState } from 'react'
import { SLIDES } from './content/deck'

const COUNT = SLIDES.length

function readHash(): number {
  const n = parseInt(window.location.hash.replace('#', ''), 10)
  return Number.isFinite(n) && n >= 1 && n <= COUNT ? n - 1 : 0
}

export function useDeck() {
  const [index, setIndex] = useState(readHash)
  /* Typed slide numbers, so a two-digit deck can still be jumped into. */
  const typed = useRef({ buf: '', at: 0 })
  const [presenter, setPresenter] = useState(false)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const go = useCallback((i: number) => setIndex(Math.min(COUNT - 1, Math.max(0, i))), [])
  const next = useCallback(() => {
    setIndex((i) => Math.min(COUNT - 1, i + 1))
    setStartedAt((s) => s ?? Date.now())
  }, [])
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])

  useEffect(() => {
    window.history.replaceState(null, '', `#${index + 1}`)
  }, [index])

  useEffect(() => {
    const onHash = () => setIndex(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (startedAt == null) return
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [startedAt])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
        case 'Enter':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault()
          prev()
          break
        case 'Home':
          go(0)
          break
        case 'End':
          go(COUNT - 1)
          break
        case 'f':
        case 'F':
          if (document.fullscreenElement) void document.exitFullscreen()
          else void document.documentElement.requestFullscreen()
          break
        case 's':
        case 'S':
          setPresenter((p) => !p)
          break
        case 't':
        case 'T':
          setStartedAt((s) => (s == null ? Date.now() : s))
          break
        case 'r':
        case 'R':
          setStartedAt(null)
          break
        default: {
          if (!/^[0-9]$/.test(e.key)) break
          const at = Date.now()
          const buf = (at - typed.current.at < 800 ? typed.current.buf : '') + e.key
          typed.current = { buf, at }
          const n = parseInt(buf, 10)
          if (n >= 1 && n <= COUNT) go(n - 1)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, next, prev])

  const elapsed = startedAt == null ? 0 : (now - startedAt) / 1000

  return { index, presenter, elapsed, running: startedAt != null, go, next, prev }
}
