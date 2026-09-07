/* The three.js rover needs a WebGL context. When the venue laptop cannot give us one,
   the SVG rover takes over with the same motion engine. */
export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') ?? c.getContext('webgl')
    if (!gl) return false
    const ext = gl.getExtension('WEBGL_lose_context')
    ext?.loseContext()
    return true
  } catch {
    return false
  }
}
