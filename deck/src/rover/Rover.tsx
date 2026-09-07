import { useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { RoundedBox } from '@react-three/drei'
import { WHEEL_R } from './motion'

/* Taurus, the 2026 rover, built from primitives so the deck loads no model file.
   The proportions come off the CAD sheet in `public/img/rover-cad.png`:
   a low flat body inside a red truss frame, a straight wheel bar down each side,
   four large airless wheels, the antenna mast on the front-left corner and the
   seven-axis arm on a linear rail across the back deck.
   Colours are the logo inks and the paper's own tints — nothing black. */

export const COLORS = {
  shell: '#fff7ec',
  panel: '#ffe6cc',
  frame: '#e82727',
  accent: '#fc9d2d',
  strut: '#b0806f',
  metal: '#efe3d6',
  rim: '#a8776a',
  tyre: '#7a4a3c',
}

export interface RoverHandles {
  wheels: THREE.Group[]
  shoulder: THREE.Group | null
  elbow: THREE.Group | null
  mastHead: THREE.Group | null
}

interface Props {
  handles: React.RefObject<RoverHandles>
}

/* ── Dimensions. 1 world unit = 100 design pixels; the rover is ~1.8 long. ── */
const WHEEL_W = 0.19
const WHEEL_X = 0.575 // half wheelbase
const WHEEL_Z = 0.55 // half track — the rover is nearly as wide as it is long
const BAR_Z = 0.42 // the wheel bar runs just outboard of the body…
const BAR_Y = 0.545 // …and clears the top of the wheels, so it reads as a beam
const BODY_X = 0.48
const BODY_Z = 0.4
const BODY_LO = 0.66 // the body is carried well above the bar, as on the real frame
const BODY_HI = 0.96
const DECK_Y = BODY_HI // top of the body = underside of the deck plate
const MAST_X = -0.4
const MAST_Z = -0.34 // hard against the front-left corner, as on the CAD

type Xyz = [number, number, number]

/** One box, positioned and rotated, ready to be merged into a batch. */
interface Part {
  geo: THREE.BufferGeometry
  pos: Xyz
  rot?: Xyz
}

/* The wheels repeat 14 grousers and 10 spokes four times over. Merging each set
   into one geometry keeps the whole rover under about forty draw calls. */
function merge(parts: Part[]): THREE.BufferGeometry {
  const moved = parts.map((p) => {
    const g = p.geo.clone()
    g.applyMatrix4(
      new THREE.Matrix4().compose(
        new THREE.Vector3(...p.pos),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(...(p.rot ?? [0, 0, 0]))),
        new THREE.Vector3(1, 1, 1),
      ),
    )
    return g
  })
  const out = mergeGeometries(moved)!
  for (const g of moved) g.dispose()
  return out
}

/** A square-section strut between two points, in any direction. */
function Strut({ from, to, thick = 0.035, color = COLORS.strut }: { from: Xyz; to: Xyz; thick?: number; color?: string }) {
  const a = new THREE.Vector3(...from)
  const b = new THREE.Vector3(...to)
  const dir = b.clone().sub(a)
  const len = dir.length()
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
  return (
    <mesh position={a.clone().add(b).multiplyScalar(0.5)} quaternion={quat}>
      <boxGeometry args={[thick, len, thick]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
    </mesh>
  )
}

/* ── Airless wheel: a grousered band, ten swept spokes, a red hub ── */
function useWheelGeometry() {
  return useMemo(() => {
    const grouser = new THREE.BoxGeometry(0.038, 0.058, WHEEL_W * 1.02)
    const tread = merge(
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2
        return { geo: grouser, pos: [Math.cos(a) * WHEEL_R, Math.sin(a) * WHEEL_R, 0] as Xyz, rot: [0, 0, a] as Xyz }
      }),
    )
    grouser.dispose()

    const blade = new THREE.BoxGeometry(WHEEL_R * 0.66, 0.02, WHEEL_W * 0.44)
    const spokes = merge(
      Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2
        const m = WHEEL_R * 0.6
        return { geo: blade, pos: [Math.cos(a) * m, Math.sin(a) * m, 0] as Xyz, rot: [0, 0, a + 0.24] as Xyz }
      }),
    )
    blade.dispose()

    return { tread, spokes }
  }, [])
}

type WheelGeo = ReturnType<typeof useWheelGeometry>

function Wheel({ position, geo, register }: { position: Xyz; geo: WheelGeo; register: (g: THREE.Group | null) => void }) {
  return (
    <group position={position} ref={register}>
      {/* band */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[WHEEL_R * 0.95, WHEEL_R * 0.95, WHEEL_W, 24, 1, true]} />
        <meshStandardMaterial color={COLORS.tyre} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geo.tread}>
        <meshStandardMaterial color={COLORS.tyre} roughness={0.95} />
      </mesh>
      {/* rim hoop and spokes — the wheel is open, there is no tyre to puncture */}
      <mesh>
        <torusGeometry args={[WHEEL_R * 0.86, 0.018, 6, 26]} />
        <meshStandardMaterial color={COLORS.rim} roughness={0.7} />
      </mesh>
      <mesh geometry={geo.spokes}>
        <meshStandardMaterial color={COLORS.rim} roughness={0.7} />
      </mesh>
      {/* hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[WHEEL_R * 0.3, WHEEL_R * 0.3, WHEEL_W * 0.9, 16]} />
        <meshStandardMaterial color={COLORS.frame} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, WHEEL_W * 0.48]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[WHEEL_R * 0.13, WHEEL_R * 0.13, WHEEL_W * 0.14, 12]} />
        <meshStandardMaterial color={COLORS.accent} roughness={0.5} />
      </mesh>
    </group>
  )
}

/* ── Deck plate: a flat octagon, corners cut, overhanging the body ── */
function useDeckGeometry() {
  return useMemo(() => {
    const hx = 0.56
    const hz = 0.47
    const c = 0.16
    const s = new THREE.Shape()
    s.moveTo(-hx + c, -hz)
    s.lineTo(hx - c, -hz)
    s.lineTo(hx, -hz + c)
    s.lineTo(hx, hz - c)
    s.lineTo(hx - c, hz)
    s.lineTo(-hx + c, hz)
    s.lineTo(-hx, hz - c)
    s.lineTo(-hx, -hz + c)
    s.closePath()
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: false })
    g.rotateX(-Math.PI / 2) // shape lies in XZ, thickness runs up +Y
    return g
  }, [])
}

export function RoverModel({ handles }: Props) {
  const h = handles.current
  const wheelGeo = useWheelGeometry()
  const deckGeo = useDeckGeometry()

  const wheelPositions: Xyz[] = [
    [WHEEL_X, WHEEL_R, WHEEL_Z],
    [-WHEEL_X, WHEEL_R, WHEEL_Z],
    [WHEEL_X, WHEEL_R, -WHEEL_Z],
    [-WHEEL_X, WHEEL_R, -WHEEL_Z],
  ]

  return (
    <group>
      {/* ══ body: light panels held in a red truss frame ══ */}
      <RoundedBox args={[BODY_X * 2 - 0.03, BODY_HI - BODY_LO - 0.03, BODY_Z * 2 - 0.03]} radius={0.02} smoothness={3} position={[0, (BODY_LO + BODY_HI) / 2, 0]}>
        <meshStandardMaterial color={COLORS.shell} roughness={0.62} />
      </RoundedBox>

      {/* frame rails on all twelve edges */}
      {[BODY_LO, BODY_HI].map((y) =>
        [BODY_Z, -BODY_Z].map((z) => (
          <mesh key={`x${y}${z}`} position={[0, y, z]}>
            <boxGeometry args={[BODY_X * 2 + 0.04, 0.04, 0.04]} />
            <meshStandardMaterial color={COLORS.frame} roughness={0.55} />
          </mesh>
        )),
      )}
      {[BODY_LO, BODY_HI].map((y) =>
        [BODY_X, -BODY_X].map((x) => (
          <mesh key={`z${y}${x}`} position={[x, y, 0]}>
            <boxGeometry args={[0.04, 0.04, BODY_Z * 2]} />
            <meshStandardMaterial color={COLORS.frame} roughness={0.55} />
          </mesh>
        )),
      )}
      {[BODY_X, -BODY_X].map((x) =>
        [BODY_Z, -BODY_Z].map((z) => (
          <mesh key={`v${x}${z}`} position={[x, (BODY_LO + BODY_HI) / 2, z]}>
            <boxGeometry args={[0.04, BODY_HI - BODY_LO, 0.04]} />
            <meshStandardMaterial color={COLORS.frame} roughness={0.55} />
          </mesh>
        )),
      )}
      {/* diagonal bracing, the way it reads on the real frame */}
      {[BODY_Z + 0.005, -BODY_Z - 0.005].map((z) => (
        <group key={`brace${z}`}>
          <Strut from={[-BODY_X, BODY_LO, z]} to={[-BODY_X / 3, BODY_HI, z]} thick={0.026} color={COLORS.frame} />
          <Strut from={[-BODY_X / 3, BODY_HI, z]} to={[BODY_X / 3, BODY_LO, z]} thick={0.026} color={COLORS.frame} />
          <Strut from={[BODY_X / 3, BODY_LO, z]} to={[BODY_X, BODY_HI, z]} thick={0.026} color={COLORS.frame} />
        </group>
      ))}

      {/* air vents down both flanks */}
      {[BODY_Z + 0.012, -BODY_Z - 0.012].map((z) =>
        [-0.26, 0, 0.26].map((x) => (
          <mesh key={`vent${z}${x}`} position={[x, 0.86, z]}>
            <boxGeometry args={[0.17, 0.075, 0.012]} />
            <meshStandardMaterial color={COLORS.panel} roughness={0.7} />
          </mesh>
        )),
      )}
      {/* batteries, slung on the outside of the frame */}
      {[-0.26, -0.08].map((x) => (
        <mesh key={`bat${x}`} position={[x, 0.74, -BODY_Z - 0.035]}>
          <boxGeometry args={[0.14, 0.1, 0.06]} />
          <meshStandardMaterial color={COLORS.metal} roughness={0.6} />
        </mesh>
      ))}
      {/* kill switch */}
      <mesh position={[-BODY_X - 0.03, 0.91, -0.18]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.05, 12]} />
        <meshStandardMaterial color={COLORS.frame} roughness={0.45} />
      </mesh>
      {/* jamdani diamonds etched into the shell */}
      {[0.33, -0.33].map((x) => (
        <mesh key={`jam${x}`} position={[x, 0.73, BODY_Z + 0.014]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.075, 0.075, 0.01]} />
          <meshStandardMaterial color={COLORS.accent} roughness={0.6} />
        </mesh>
      ))}

      {/* deck plate */}
      <mesh geometry={deckGeo} position={[0, DECK_Y, 0]}>
        <meshStandardMaterial color={COLORS.shell} roughness={0.55} />
      </mesh>
      {/* inertial navigation puck on the deck */}
      <mesh position={[-0.14, 1.03, 0.12]}>
        <cylinderGeometry args={[0.05, 0.055, 0.032, 14]} />
        <meshStandardMaterial color={COLORS.panel} roughness={0.6} />
      </mesh>

      {/* ══ running gear: wheel bar, brackets, motors, wheels ══ */}
      {[BAR_Z, -BAR_Z].map((z) => {
        const out = Math.sign(z)
        return (
          <group key={`bar${z}`}>
            <mesh position={[0, BAR_Y, z]}>
              <boxGeometry args={[WHEEL_X * 2 + 0.12, 0.055, 0.055]} />
              <meshStandardMaterial color={COLORS.strut} roughness={0.6} metalness={0.1} />
            </mesh>
            {/* rocker-bogie pivot, and the post that carries the body on it */}
            <mesh position={[0.03, BAR_Y + 0.03, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.1, 14]} />
              <meshStandardMaterial color={COLORS.accent} roughness={0.5} />
            </mesh>
            <Strut from={[0.03, BAR_Y + 0.03, z]} to={[0.03, BODY_LO, z * 0.9]} thick={0.045} />
            {[WHEEL_X, -WHEEL_X].map((x) => (
              <group key={`leg${x}`}>
                <mesh position={[x, BAR_Y, (z + out * WHEEL_Z) / 2]}>
                  <boxGeometry args={[0.055, 0.045, WHEEL_Z - BAR_Z + 0.05]} />
                  <meshStandardMaterial color={COLORS.strut} roughness={0.6} />
                </mesh>
                <mesh position={[x, (BAR_Y + WHEEL_R) / 2 + 0.02, out * (WHEEL_Z - WHEEL_W / 2 - 0.026)]}>
                  <boxGeometry args={[0.06, BAR_Y - WHEEL_R + 0.1, 0.04]} />
                  <meshStandardMaterial color={COLORS.strut} roughness={0.6} />
                </mesh>
                {/* drive motor, sat on the bar over the hub */}
                <mesh position={[x, BAR_Y + 0.055, out * (WHEEL_Z - WHEEL_W / 2 - 0.03)]}>
                  <boxGeometry args={[0.085, 0.07, 0.065]} />
                  <meshStandardMaterial color={COLORS.panel} roughness={0.6} />
                </mesh>
              </group>
            ))}
          </group>
        )
      })}
      {wheelPositions.map((p, i) => (
        <Wheel
          key={i}
          position={p}
          geo={wheelGeo}
          register={(g) => {
            if (g) h.wheels[i] = g
          }}
        />
      ))}

      {/* ══ antenna mast, front-left corner ══ */}
      <mesh position={[MAST_X, 1.19, MAST_Z]}>
        <boxGeometry args={[0.05, 1.06, 0.05]} />
        <meshStandardMaterial color={COLORS.strut} roughness={0.55} metalness={0.1} />
      </mesh>
      <Strut from={[MAST_X, 1.14, MAST_Z]} to={[-0.06, DECK_Y + 0.05, 0.02]} thick={0.028} />
      {/* triple-band antenna on its outrigger, down at deck level */}
      <mesh position={[MAST_X - 0.08, 1.02, MAST_Z]}>
        <boxGeometry args={[0.15, 0.03, 0.04]} />
        <meshStandardMaterial color={COLORS.strut} roughness={0.6} />
      </mesh>
      <mesh position={[MAST_X - 0.15, 1.05, MAST_Z]}>
        <cylinderGeometry args={[0.055, 0.055, 0.028, 14]} />
        <meshStandardMaterial color={COLORS.panel} roughness={0.6} />
      </mesh>
      {/* radio head, horizontal whip and vertical element on top */}
      <mesh position={[MAST_X, 1.78, MAST_Z]}>
        <boxGeometry args={[0.1, 0.17, 0.095]} />
        <meshStandardMaterial color={COLORS.panel} roughness={0.6} />
      </mesh>
      <mesh position={[MAST_X + 0.15, 1.81, MAST_Z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.009, 0.009, 0.3, 8]} />
        <meshStandardMaterial color={COLORS.strut} roughness={0.5} />
      </mesh>
      <mesh position={[MAST_X, 1.95, MAST_Z]}>
        <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
        <meshStandardMaterial color={COLORS.strut} roughness={0.5} />
      </mesh>
      <mesh position={[MAST_X, 2.06, MAST_Z]}>
        <sphereGeometry args={[0.024, 12, 12]} />
        <meshStandardMaterial color={COLORS.accent} roughness={0.5} />
      </mesh>
      {/* stereo camera head — the one part that looks around */}
      <group position={[MAST_X, 1.5, MAST_Z]} ref={(g) => { h.mastHead = g }}>
        <RoundedBox args={[0.26, 0.1, 0.11]} radius={0.022} smoothness={3}>
          <meshStandardMaterial color={COLORS.shell} roughness={0.55} />
        </RoundedBox>
        {[-0.07, 0.07].map((z) => (
          <mesh key={z} position={[-0.13, 0, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.028, 0.028, 0.022, 14]} />
            <meshStandardMaterial color={COLORS.frame} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* ══ seven-axis arm on its linear rail across the back deck ══ */}
      <mesh position={[0.3, DECK_Y + 0.065, 0]}>
        <boxGeometry args={[0.06, 0.045, 0.76]} />
        <meshStandardMaterial color={COLORS.strut} roughness={0.55} metalness={0.15} />
      </mesh>
      {[0.36, -0.36].map((z) => (
        <mesh key={`rail${z}`} position={[0.3, DECK_Y + 0.055, z]}>
          <boxGeometry args={[0.09, 0.07, 0.06]} />
          <meshStandardMaterial color={COLORS.metal} roughness={0.6} />
        </mesh>
      ))}
      <group position={[0.3, DECK_Y + 0.09, 0]}>
        {/* yaw */}
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.075, 0.085, 0.09, 18]} />
          <meshStandardMaterial color={COLORS.panel} roughness={0.6} />
        </mesh>
        <group position={[0, 0.1, 0]} rotation={[0, 0, 1.15]} ref={(g) => { h.shoulder = g }}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.13, 16]} />
            <meshStandardMaterial color={COLORS.accent} roughness={0.55} />
          </mesh>
          {/* link 1 */}
          <mesh position={[0.18, 0, 0]}>
            <boxGeometry args={[0.36, 0.085, 0.075]} />
            <meshStandardMaterial color={COLORS.metal} roughness={0.55} />
          </mesh>
          <mesh position={[0.18, 0.05, 0]}>
            <boxGeometry args={[0.36, 0.02, 0.078]} />
            <meshStandardMaterial color={COLORS.frame} roughness={0.55} />
          </mesh>
          <group position={[0.36, 0, 0]} rotation={[0, 0, -0.62]} ref={(g) => { h.elbow = g }}>
            {/* pitch */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.115, 16]} />
              <meshStandardMaterial color={COLORS.accent} roughness={0.55} />
            </mesh>
            {/* link 2: a main tube with a parallel strut under it */}
            <mesh position={[0.23, 0.01, 0]}>
              <boxGeometry args={[0.46, 0.06, 0.055]} />
              <meshStandardMaterial color={COLORS.metal} roughness={0.55} />
            </mesh>
            <mesh position={[0.21, -0.05, 0]}>
              <boxGeometry args={[0.4, 0.024, 0.024]} />
              <meshStandardMaterial color={COLORS.strut} roughness={0.6} />
            </mesh>
            {/* roll, wrist and the adaptive gripper */}
            <mesh position={[0.48, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.045, 0.045, 0.07, 14]} />
              <meshStandardMaterial color={COLORS.frame} roughness={0.5} />
            </mesh>
            <mesh position={[0.54, 0.01, 0]}>
              <boxGeometry args={[0.06, 0.06, 0.06]} />
              <meshStandardMaterial color={COLORS.shell} roughness={0.55} />
            </mesh>
            {[-0.032, 0.032].map((z) => (
              <mesh key={z} position={[0.61, 0.01, z]} rotation={[z > 0 ? 0.16 : -0.16, 0, 0]}>
                <boxGeometry args={[0.1, 0.026, 0.026]} />
                <meshStandardMaterial color={COLORS.accent} roughness={0.5} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  )
}
