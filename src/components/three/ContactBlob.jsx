import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise'

/**
 * ContactBlob
 * A slowly morphing sphere using simplex-noise vertex displacement.
 * Acts as the animated background for the Contact section.
 */
export default function ContactBlob() {
  const meshRef    = useRef()
  const noise3D    = useMemo(() => createNoise3D(), [])

  // Store original positions to restore on each frame
  const originalPositions = useRef(null)

  useFrame(({ clock }) => {
    const t    = clock.getElapsedTime() * 0.5
    const mesh = meshRef.current
    if (!mesh) return

    const geo  = mesh.geometry
    const pos  = geo.attributes.position

    // Cache original positions on first frame
    if (!originalPositions.current) {
      originalPositions.current = new Float32Array(pos.array)
    }

    const orig = originalPositions.current

    for (let i = 0; i < pos.count; i++) {
      const ox = orig[i * 3]
      const oy = orig[i * 3 + 1]
      const oz = orig[i * 3 + 2]

      // Normalise to sphere surface, then apply noise
      const len  = Math.sqrt(ox * ox + oy * oy + oz * oz)
      const nx   = ox / len
      const ny   = oy / len
      const nz   = oz / len

      const n    = noise3D(nx + t, ny + t, nz + t)
      const disp = 1.0 + n * 0.35

      pos.array[i * 3]     = nx * disp * 1.8
      pos.array[i * 3 + 1] = ny * disp * 1.8
      pos.array[i * 3 + 2] = nz * disp * 1.8
    }

    pos.needsUpdate = true
    geo.computeVertexNormals()

    // Slow ambient rotation
    mesh.rotation.y = t * 0.15
    mesh.rotation.x = Math.sin(t * 0.1) * 0.1
  })

  return (
    <>
      <mesh ref={meshRef}>
        {/* Higher segment count for smoother morphing */}
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshPhongMaterial
          color="#0d1631"
          emissive="#1a2a5e"
          emissiveIntensity={0.6}
          shininess={60}
          transparent
          opacity={0.75}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe overlay to show the morphing shape */}
      <mesh>
        <sphereGeometry args={[1.82, 24, 24]} />
        <meshBasicMaterial
          color="#4f8ef7"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={2} color="#4f8ef7" />
      <pointLight position={[-3, -2, -3]} intensity={1} color="#7c6af7" />
    </>
  )
}
