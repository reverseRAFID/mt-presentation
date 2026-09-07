import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoverModel, type RoverHandles } from './Rover'
import { RoverMotion, stationTarget } from './motion'
import { overlay, type StageRect } from './overlay'

/* Camera: perspective, fov 35, placed so the z=0 plane spans exactly
   19.2 × 10.8 world units — 1 unit = 100 design pixels. */
const FOV = 35
const VIEW_H = 10.8
const CAM_Z = VIEW_H / 2 / Math.tan((FOV / 2) * (Math.PI / 180))

function RoverRig({ index, reduced }: { index: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const handles = useRef<RoverHandles>({ wheels: [], shoulder: null, elbow: null, mastHead: null })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const motion = useMemo(() => new RoverMotion(stationTarget(index), reduced), [])

  useEffect(() => {
    motion.setTarget(stationTarget(index))
  }, [index, motion])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const f = motion.step(state.clock.elapsedTime, Math.min(dt, 0.05))
    const h = handles.current
    for (const w of h.wheels) w.rotation.z = f.wheelSpin
    if (h.shoulder) h.shoulder.rotation.z = f.shoulder
    if (h.elbow) h.elbow.rotation.z = f.elbow
    if (h.mastHead) h.mastHead.rotation.y = f.headYaw

    g.position.set(f.x, f.y + f.hopY, 0)
    g.rotation.set(f.roll, f.yaw, f.pitch)
    g.scale.set(f.scale * f.squashX, f.scale * f.squashY, f.scale * f.squashX)
  })

  return (
    <group ref={group}>
      <RoverModel handles={handles} />
    </group>
  )
}

export function RoverCanvas({ index, rect, reduced }: { index: number; rect: StageRect | null; reduced: boolean }) {
  if (!rect || rect.width < 10) return null
  return (
    <div style={overlay(rect, 5)}>
      <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 100 }} style={{ background: 'transparent' }}>
        <hemisphereLight args={['#ffffff', '#ffe0c0', 1.6]} />
        <directionalLight position={[5, 9, 7]} intensity={2.4} />
        <directionalLight position={[-6, 4, -3]} intensity={0.8} color="#ffd6a8" />
        <RoverRig index={index} reduced={reduced} />
      </Canvas>
    </div>
  )
}
