import type { CSSProperties } from 'react'

/* The stage is a CSS-scaled sheet, so anything that has to sit above or below
   the WebGL rover is drawn as a fixed overlay at the stage's true pixel size
   instead of inside it. All of them share these coordinates. */
export interface StageRect {
  left: number
  top: number
  width: number
  height: number
}

export function overlay(rect: StageRect, zIndex: number): CSSProperties {
  return { position: 'fixed', left: rect.left, top: rect.top, width: rect.width, height: rect.height, pointerEvents: 'none', zIndex }
}
