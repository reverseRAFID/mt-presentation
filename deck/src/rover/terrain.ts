/* The mission map: one strip of Utah lying under the whole deck, and the deck's
   progress bar. Nine stations run left to right, one per slide; the rover is
   parked at whichever one you are on and the ground behind it is inked in as you
   go. Mesas on the skyline, boulders on the floor, all of it drawn in design
   pixels on the 1920 × 1080 sheet.

   The map is built once. The picture and the drive read the same profile, so the
   wheels are always on the rock. */

export const TRACK = {
  left: 152,
  right: 1788,
  /** Where the line sits before the country moves under it. */
  ground: 1018,
  /** The rover, at map size. */
  scale: 0.6,
}

const SEED = 20260507
const n1 = (v: number) => v.toFixed(1)

function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = rng(SEED)

/* Long rolls across the whole sheet, then boulders sitting on top of them. Both
   are kept shallow: the strip has to stay clear of whatever the slide is saying. */
const ROLLS = Array.from({ length: 4 }, (_, i) => ({ f: 1.3 + i * 1.1 + rand() * 0.6, a: 2 + rand() * 3.4, p: rand() * 6.283 }))
const DOMES = Array.from({ length: 7 }, (_, i) => ({
  x: 130 + (i * 1660) / 6 + (rand() - 0.5) * 120,
  h: 8 + rand() * 7,
  w: 38 + rand() * 34,
}))

/** Height of the floor, in design pixels, at a design x. */
export function groundPy(px: number): number {
  let v = TRACK.ground
  for (const r of ROLLS) v -= r.a * Math.sin((px / 1920) * Math.PI * 2 * r.f + r.p)
  for (const d of DOMES) {
    const u = (px - d.x) / d.w
    if (u > -1 && u < 1) v -= d.h * Math.cos((u * Math.PI) / 2) ** 2
  }
  return v
}

/** The same floor in world units, for the motion engine. */
export const groundWorldY = (wx: number) => 5.4 - groundPy((wx + 9.6) * 100) / 100

/** Where slide `i` of `n` parks, in design pixels. */
export function stationX(i: number, n: number): number {
  return n < 2 ? (TRACK.left + TRACK.right) / 2 : TRACK.left + ((TRACK.right - TRACK.left) * i) / (n - 1)
}

/** A rock: a closed curve through nine jittered radii, squashed and sitting flat. */
function blob(cx: number, cy: number, r: number, squash: number): string {
  const n = 9
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    const rr = r * (0.74 + rand() * 0.46)
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * squash] as [number, number]
  })
  const mid = (i: number) => {
    const p = pts[i % n]
    const q = pts[(i + 1) % n]
    return `${n1((p[0] + q[0]) / 2)} ${n1((p[1] + q[1]) / 2)}`
  }
  let d = `M${mid(0)}`
  for (let i = 1; i <= n; i++) d += `Q${n1(pts[i % n][0])} ${n1(pts[i % n][1])} ${mid(i)}`
  return `${d}Z`
}

/** A mesa skyline: a flat horizon with flat-topped buttes standing off it. */
function mesa(horizon: number, amp: number): string {
  let d = `M-60 ${n1(horizon)}`
  let x = -60 + rand() * 220
  while (x < 1960) {
    const w = 150 + rand() * 320
    const h = amp * (0.3 + rand() * 0.7)
    const sh = Math.min(w * 0.28, 76)
    d += `L${n1(x)} ${n1(horizon)}L${n1(x + sh)} ${n1(horizon - h)}L${n1(x + w - sh)} ${n1(horizon - h)}L${n1(x + w)} ${n1(horizon)}`
    x += w + 70 + rand() * 330
  }
  return `${d}L1980 ${n1(horizon)}L1980 1140L-60 1140Z`
}

function polyline(from: number, to: number, step: number): string {
  const pts: string[] = []
  const dir = to >= from ? step : -step
  for (let px = from; dir > 0 ? px <= to : px >= to; px += dir) pts.push(`${n1(px)} ${n1(groundPy(px))}`)
  pts.push(`${n1(to)} ${n1(groundPy(to))}`)
  return `M${pts.join('L')}`
}

const crest = polyline(-60, 1980, 10)

/* ── the map, built once ── */
export const MAP = {
  /** Fades the skyline into the paper instead of cutting a silhouette across the slide. */
  hazeFrom: TRACK.ground - 190,
  hazeTo: TRACK.ground - 30,
  ridges: [
    { d: mesa(TRACK.ground - 92, 96), fill: 'var(--peach)', opacity: 0.45 },
    { d: mesa(TRACK.ground - 46, 56), fill: 'var(--peach-2)', opacity: 0.55 },
  ],
  ground: `${crest}L1980 1140L-60 1140Z`,
  band: (() => {
    const under: string[] = []
    for (let px = 1980; px >= -60; px -= 10) under.push(`${n1(px)} ${n1(groundPy(px) + 96)}`)
    return `${crest}L${under.join('L')}Z`
  })(),
  crest,
  /** The lumps the rover has to climb, drawn as rocks in the floor. */
  rocks: DOMES.map((d) => {
    const edge = polyline(d.x - d.w, d.x + d.w, 6)
    return { body: `${edge}L${n1(d.x + d.w)} ${n1(groundPy(d.x + d.w) + 70)}L${n1(d.x - d.w)} ${n1(groundPy(d.x - d.w) + 70)}Z`, edge }
  }),
  /** Boulders standing on the floor beyond the rover. */
  behind: Array.from({ length: 9 }, () => {
    const px = 40 + rand() * 1840
    const r = 9 + rand() * 12
    return blob(px, groundPy(px) - r * 0.6, r, 0.64)
  }),
  /** Boulders near enough to the camera that the rover passes behind them. */
  front: Array.from({ length: 4 }, (_, i) => {
    const px = 120 + i * 470 + rand() * 260
    const r = 24 + rand() * 20
    return blob(px, groundPy(px) + 30 + rand() * 26, r, 0.72)
  }),
  /** The rail the progress runs along: the floor between the first and last station. */
  rail: polyline(TRACK.left, TRACK.right, 10),
}
