import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/**
 * AboutSphere
 * A wireframe sphere rendered in the About section.
 * Damped OrbitControls let the user drag it.
 * Slow ambient rotation when idle.
 */
export default function AboutSphere() {
  const meshRef  = useRef()
  const groupRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Gentle ambient spin
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.2
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.15
    }
  })

  return (
    <>
      {/* Damped, auto-rotate orbit controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        autoRotate={false}
      />

      <group ref={groupRef}>
        {/* Outer wireframe sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial
            color="#4f8ef7"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Inner solid (subtle) */}
        <mesh>
          <sphereGeometry args={[1.4, 16, 16]} />
          <meshPhongMaterial
            color="#0d1631"
            emissive="#1a2a5e"
            emissiveIntensity={0.4}
            shininess={80}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Equator ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.006, 8, 80]} />
          <meshBasicMaterial color="#7c6af7" transparent opacity={0.6} />
        </mesh>

        {/* Meridian ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[1.5, 0.006, 8, 80]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
        </mesh>

        {/* Floating core sphere */}
        <mesh>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color="#4f8ef7"
            emissive="#4f8ef7"
            emissiveIntensity={2}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>

      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={1.5} color="#4f8ef7" />
    </>
  )
}
