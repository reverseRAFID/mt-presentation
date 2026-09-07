import { SLIDES, type EnterKind, type IdleKind } from '../content/deck'
import { TRACK, groundWorldY, stationX } from './terrain'

/* One motion engine, two renderers (three.js and SVG). Units are world units:
   1 unit = 100 design pixels, y up, origin at the centre of the 1920×1080 sheet.

   The rover is the deck's progress bar. It parks at one of nine stations along
   the mission map, and a slide change is one leg of the drive between two of
   them: it swings onto the heading, stows its arm, crosses the ground — over the
   rolls, over the boulders — and sets itself up again on arrival. `RoverTrack`
   draws the same map it drives, so the profile and the fractions below are
   shared. */

export interface Target {
  x: number
  y: number
  scale: number
  yaw: number
  idle: IdleKind
  enter: EnterKind
}

interface Cur {
  x: number
  y: number
  scale: number
  yaw: number
}

interface Transition {
  from: Cur
  to: Target
  start: number
  dur: number
  travelYaw: number
}

export interface Frame {
  x: number
  y: number
  scale: number
  yaw: number
  pitch: number
  roll: number
  hopY: number
  squashX: number
  squashY: number
  shoulder: number
  elbow: number
  headYaw: number
  wheelSpin: number
}

export const SHOULDER = 1.15
export const ELBOW = -0.62
export const WHEEL_R = 0.25

/** Fractions of one leg, shared with the map. */
export const TRAVEL = {
  dur: 1.15,
  turnEnd: 0.18, // swung onto the heading
  goStart: 0.14, // the run starts…
  goEnd: 0.84, // …and ends
  inStart: 0.82, // arrival
}

/* Three-quarter headings. The arm end leads — that is the end the rover works
   with — so these are the two yaws at which it faces the way it is going.
   Progress runs left to right, so it rests facing the way it still has to go. */
const FACE_RIGHT = -0.62
const FACE_LEFT = -(Math.PI - 0.62)
export const REST_YAW = FACE_RIGHT

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOutBack = (t: number) => {
  const s = 0.9
  return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2)
}
const shortest = (a: number, b: number) => {
  let d = (b - a) % (Math.PI * 2)
  if (d > Math.PI) d -= Math.PI * 2
  if (d < -Math.PI) d += Math.PI * 2
  return d
}
const lerpAngle = (a: number, b: number, t: number) => a + shortest(a, b) * t

/** Where slide `index` parks the rover: its station on the map, on the ground. */
export function stationTarget(index: number): Target {
  const x = stationX(index, SLIDES.length) / 100 - 9.6
  const { idle, enter } = SLIDES[index].rover
  return { x, y: groundWorldY(x), scale: TRACK.scale, yaw: REST_YAW, idle, enter }
}

const same = (a: Target, b: Target) => a.x === b.x && a.y === b.y && a.scale === b.scale && a.yaw === b.yaw && a.idle === b.idle

export class RoverMotion {
  private cur: Cur
  private target: Target
  private pending: Target | null
  private active: Transition | null = null
  private idleYaw = 0
  private lastX: number
  private lastY: number
  private wheelSpin = 0
  private entered = false
  private reduced: boolean

  constructor(initial: Target, reduced: boolean) {
    this.reduced = reduced
    this.target = initial
    // First paint: run in from off the left of the sheet.
    this.cur = { x: initial.x - 3.2, y: initial.y, scale: initial.scale, yaw: initial.yaw }
    this.lastX = this.cur.x
    this.lastY = this.cur.y
    this.pending = { ...initial, enter: 'drive' }
  }

  setTarget(t: Target) {
    if (!this.entered) {
      this.target = t
      this.pending = { ...t, enter: 'drive' }
      return
    }
    if (!this.active && !this.pending && same(t, this.target)) return
    this.pending = t
  }

  step(now: number, dt: number): Frame {
    if (this.pending) {
      const to = this.pending
      this.pending = null
      this.target = to
      this.idleYaw = 0
      this.entered = true
      const from = { ...this.cur }
      const dx = to.x - from.x
      this.active = {
        from,
        to,
        start: now,
        dur: this.reduced ? 0.001 : TRAVEL.dur,
        travelYaw: Math.abs(dx) < 0.15 ? from.yaw : dx > 0 ? FACE_RIGHT : FACE_LEFT,
      }
    }

    let { x, y, scale, yaw } = this.cur
    let hopY = 0
    let pitch = 0
    let roll = 0
    let squashY = 1
    let squashX = 1
    let shoulder = SHOULDER
    let elbow = ELBOW
    let headYaw = 0

    const tr = this.active
    if (tr) {
      const t = this.reduced ? 1 : clamp01((now - tr.start) / tr.dur)
      const { from, to } = tr

      // the drive: along the map, at whatever height the ground is
      const u = easeInOutCubic(clamp01((t - TRAVEL.goStart) / (TRAVEL.goEnd - TRAVEL.goStart)))
      x = lerp(from.x, to.x, u)
      y = groundWorldY(x)
      scale = to.scale

      // the nose follows the slope it is on
      if (t > TRAVEL.goStart && t < TRAVEL.goEnd) {
        const h = 0.04
        const slope = (groundWorldY(x + h) - groundWorldY(x - h)) / (2 * h)
        const nose = Math.max(-0.42, Math.min(0.42, Math.atan(slope) * 0.9))
        pitch = nose * Math.sign(to.x - from.x || 1)
      }

      // swing onto the heading, hold it, then settle back to the resting one
      const arrive = clamp01((t - TRAVEL.inStart) / (1 - TRAVEL.inStart))
      if (t < TRAVEL.turnEnd) yaw = lerpAngle(from.yaw, tr.travelYaw, easeInOutCubic(t / TRAVEL.turnEnd))
      else if (t < TRAVEL.inStart) yaw = tr.travelYaw
      else {
        const a = easeInOutCubic(arrive)
        yaw = lerpAngle(tr.travelYaw, to.yaw, a) - (to.enter === 'spin' ? Math.PI * 2 * (1 - a) : 0)
      }
      if (to.enter === 'zoom') scale = to.scale * lerp(0.86, 1, easeOutBack(arrive))

      // the arm stows for the run and deploys again on arrival
      const stow = clamp01(Math.min((t - 0.03) / 0.13, (0.97 - t) / 0.13))
      shoulder = SHOULDER - 0.8 * stow
      elbow = ELBOW - 0.55 * stow

      // whatever flourish the slide asked for, on arrival
      switch (to.enter) {
        case 'hop':
          hopY = Math.sin(Math.PI * arrive) * 0.32
          if (arrive > 0.82) {
            const s = (arrive - 0.82) / 0.18
            squashY = 1 - 0.1 * Math.sin(Math.PI * s)
            squashX = 1 + 0.05 * Math.sin(Math.PI * s)
          }
          break
        case 'climb':
          pitch += 0.38 * Math.sin(Math.PI * arrive)
          break
        case 'wobble':
          roll = Math.sin(arrive * Math.PI * 5) * 0.15 * (1 - arrive)
          break
      }

      if (t >= 1) {
        this.active = null
        x = to.x
        y = to.y
        scale = to.scale
        yaw = to.yaw
      }
      this.cur = { x, y, scale, yaw }
    } else {
      const to = this.target
      switch (to.idle) {
        case 'showcase':
          yaw = to.yaw + Math.sin(now * 0.7) * 0.16
          hopY = 0.02 * Math.sin(now * 1.8)
          shoulder = SHOULDER + 0.06 * Math.sin(now * 1.1)
          headYaw = Math.sin(now * 0.5) * 0.4
          break
        case 'turntable':
          this.idleYaw += 0.45 * dt
          yaw = to.yaw + this.idleYaw
          break
        case 'bob':
          hopY = 0.015 * Math.sin(now * 2)
          headYaw = Math.sin(now * 0.8) * 0.3
          break
        case 'wave':
          shoulder = SHOULDER - 0.55
          elbow = ELBOW + 0.15 + Math.sin(now * 5) * 0.32
          headYaw = Math.sin(now * 0.9) * 0.3
          break
        case 'still':
          break
      }
      this.cur = { x, y, scale, yaw }
    }

    /* The wheels turn with the distance covered along the ground, and they turn
       about the rover's own axis — so which way that reads on screen follows the
       heading, and reversing the heading reverses them too. */
    const dx = x - this.lastX
    const dy = y - this.lastY
    this.lastX = x
    this.lastY = y
    const face = Math.cos(yaw) || 1
    const along = Math.sign(face) * Math.max(0.35, Math.abs(face))
    this.wheelSpin -= (Math.hypot(dx, dy) * Math.sign(dx || 1)) / (WHEEL_R * Math.max(0.25, scale) * along)
    if (hopY > 0.05) this.wheelSpin -= dt * 6

    return { x, y, scale, yaw, pitch, roll, hopY, squashX, squashY, shoulder, elbow, headYaw, wheelSpin: this.wheelSpin }
  }
}
