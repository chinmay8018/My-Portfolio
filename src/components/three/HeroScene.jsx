import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLES  (starfield background)
// ─────────────────────────────────────────────────────────────────────────────
function Particles({ count = 600 }) {
  const mesh = useRef()

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors    = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r     = 4 + Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      const t = Math.random()
      colors[i * 3]     = 0.31 + t * 0.18
      colors[i * 3 + 1] = 0.42 + t * 0.14
      colors[i * 3 + 2] = 0.97
    }
    return { positions, colors }
  }, [count])

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = clock.getElapsedTime() * 0.03
      mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.015) * 0.05
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color"    array={colors}    count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.028} vertexColors transparent opacity={0.65} sizeAttenuation />
    </points>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SATELLITE  — body + solar panels + antenna, tilted elliptical orbit
// ─────────────────────────────────────────────────────────────────────────────
function Satellite({ mouseRef }) {
  const orbitRef = useRef()
  const selfRef  = useRef()

  const PANEL_EMISSIVE = useMemo(() => new THREE.Color('#4f8ef7'), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    const orbitAngle = t * (Math.PI * 2) / 26
    const R  = 2.7
    const rx = Math.cos(orbitAngle) * R
    const ry = Math.sin(orbitAngle) * 0.55
    const rz = Math.sin(orbitAngle) * R * 0.65

    const mx = mouseRef?.current?.x ?? 0
    const my = mouseRef?.current?.y ?? 0

    if (orbitRef.current) {
      orbitRef.current.position.set(
        rx + mx * 0.06,
        ry + my * 0.04,
        rz - 0.5
      )
    }

    if (selfRef.current) {
      selfRef.current.rotation.y = t * 0.55
      selfRef.current.rotation.z = Math.sin(t * 0.4) * 0.18
      selfRef.current.rotation.x = Math.cos(t * 0.28) * 0.1
    }
  })

  return (
    <group ref={orbitRef}>
      <group ref={selfRef} scale={[0.55, 0.55, 0.55]}>
        {/* Central body */}
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.38, 0.28]} />
          <meshStandardMaterial
            color="#6a7e96"
            metalness={0.65}
            roughness={0.35}
          />
        </mesh>

        {/* Body highlight stripe */}
        <mesh position={[0, 0.05, 0.145]}>
          <boxGeometry args={[0.29, 0.08, 0.005]} />
          <meshStandardMaterial
            color="#4f8ef7"
            emissive="#4f8ef7"
            emissiveIntensity={0.6}
            roughness={0.4}
          />
        </mesh>

        {/* Left solar panel */}
        <mesh position={[-0.16, 0, 0]}>
          <boxGeometry args={[0.1, 0.06, 0.06]} />
          <meshStandardMaterial color="#7a8ea0" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.48, 0, 0]}>
          <boxGeometry args={[0.52, 0.28, 0.022]} />
          <meshStandardMaterial
            color="#0d1631"
            emissive={PANEL_EMISSIVE}
            emissiveIntensity={0.45}
            metalness={0.25}
            roughness={0.65}
          />
        </mesh>

        {/* Right solar panel */}
        <mesh position={[0.16, 0, 0]}>
          <boxGeometry args={[0.1, 0.06, 0.06]} />
          <meshStandardMaterial color="#7a8ea0" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.48, 0, 0]}>
          <boxGeometry args={[0.52, 0.28, 0.022]} />
          <meshStandardMaterial
            color="#0d1631"
            emissive={PANEL_EMISSIVE}
            emissiveIntensity={0.45}
            metalness={0.25}
            roughness={0.65}
          />
        </mesh>

        {/* Antenna mast */}
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.38, 8]} />
          <meshStandardMaterial color="#c8d4e8" metalness={0.85} roughness={0.18} />
        </mesh>
      </group>

      <pointLight color="#4f8ef7" intensity={0.4} distance={1.2} />
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MOON  — 3D Moon using user's uploaded high-res photo map (/moon.png)
// ─────────────────────────────────────────────────────────────────────────────
function Moon({ isMobile }) {
  const moonRef = useRef()
  const scrollY = useRef(0)
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load('/moon.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      setTexture(tex)
    })

    const onScroll = () => {
      if (typeof window !== 'undefined') scrollY.current = window.scrollY
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const RADIUS = isMobile ? 0.28 : 0.45
  const BASE_X = isMobile ? 1.6  : 2.65
  const BASE_Y = isMobile ? 0.95 : 1.15

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (moonRef.current) {
      moonRef.current.rotation.y = t * 0.08
      const scrollOffset = scrollY.current * 0.002
      moonRef.current.position.y = BASE_Y + scrollOffset + Math.sin(t * 0.16) * 0.03
      moonRef.current.position.x = BASE_X + Math.sin(t * 0.11) * 0.04
    }
  })

  return (
    <group>
      {/* 3D Moon sphere textured with user's /moon.png */}
      <mesh ref={moonRef} position={[BASE_X, BASE_Y, 0]}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.75}
          metalness={0.05}
        />
      </mesh>

      {/* Sun directional light highlighting moon details */}
      <directionalLight
        position={[BASE_X - 2.5, BASE_Y + 2.0, 2.5]}
        intensity={2.8}
        color="#ffffff"
      />

      {/* Ambient fill */}
      <ambientLight intensity={0.4} color="#1a2640" />
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SCENE  — combines particles, satellite, and moon
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroScene({ isMobile }) {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      if (typeof window === 'undefined') return
      mouseRef.current.x = (e.clientX / window.innerWidth)  * 2 - 1
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', onMove, { passive: true })
    }
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <group>
      <ambientLight intensity={0.25} color="#1a2a4e" />
      <directionalLight
        position={[-4, 6, 3]}
        intensity={1.2}
        color="#c8d8f0"
      />

      <Particles count={isMobile ? 200 : 700} />
      <Moon isMobile={isMobile} />
    </group>
  )
}
