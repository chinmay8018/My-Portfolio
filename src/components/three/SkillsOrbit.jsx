import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '../../data/skills'

// ─── Constants ────────────────────────────────────────────────────────────────
const INNER_RADIUS = 1.7   // radius of the inner orbital ring
const OUTER_RADIUS = 3.0   // radius of the outer orbital ring
// No group-level tilt — camera angle handles the perspective

const innerSkills = skills.filter((s) => s.ring === 'inner')
const outerSkills = skills.filter((s) => s.ring === 'outer')

// ─── OrbitalRing ─────────────────────────────────────────────────────────────
// Renders a visible guide ring (torus) at the given radius
function OrbitalRing({ radius, opacity = 0.12 }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.005, 8, 128]} />
      <meshBasicMaterial color="#4f8ef7" transparent opacity={opacity} />
    </mesh>
  )
}

// ─── SkillNode ────────────────────────────────────────────────────────────────
// A single skill sphere that orbits at a fixed radius.
// angle = baseAngle + elapsed * speed (advances every frame)
function SkillNode({ skill, baseAngle, radius, speed, hovered, onHover }) {
  const meshRef = useRef()
  const glowRef = useRef()
  const labelRef = useRef()
  const color   = useMemo(() => new THREE.Color(skill.color), [skill.color])
  const isHov   = hovered === skill.id

  useFrame(({ clock }) => {
    const angle = baseAngle + clock.getElapsedTime() * speed

    // Flat orbit: y stays 0 (the whole group is tilted at scene level)
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    if (meshRef.current) {
      meshRef.current.position.set(x, 0, z)
      const s = isHov ? 1.55 : 1.0
      meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1)
    }
    if (glowRef.current) {
      glowRef.current.position.set(x, 0, z)
      const gs = isHov ? 2.0 : 1.0
      glowRef.current.scale.lerp(new THREE.Vector3(gs, gs, gs), 0.1)
    }
  })

  return (
    <group>
      {/* Glow halo (slightly larger, very transparent) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial
          color={skill.color}
          transparent
          opacity={isHov ? 0.3 : 0.07}
        />
      </mesh>

      {/* Core sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); onHover(skill.id) }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHov ? 3.5 : 1.4}
          roughness={0.1}
          metalness={0.2}
        />

        {/* Label — always faces camera */}
        <Html
          ref={labelRef}
          center
          distanceFactor={6}
          style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
          occlude={false}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 500,
              color: skill.color,
              textShadow: `0 0 10px ${skill.color}`,
              background: 'rgba(5,11,24,0.8)',
              padding: '2px 8px',
              borderRadius: 20,
              border: `1px solid ${skill.color}50`,
              marginTop: 26,
              opacity: isHov ? 1 : 0.85,
              transition: 'opacity 0.25s, transform 0.25s',
              transform: isHov ? 'scale(1.15)' : 'scale(1)',
            }}
          >
            {skill.name}
          </div>
        </Html>
      </mesh>
    </group>
  )
}

// ─── ConnectingLine ───────────────────────────────────────────────────────────
// Thin line from center to each node (optional visual guide)
function CenterGlow() {
  return (
    <mesh>
      <sphereGeometry args={[0.18, 24, 24]} />
      <meshStandardMaterial
        color="#4f8ef7"
        emissive="#4f8ef7"
        emissiveIntensity={3}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

// ─── SkillsOrbit ─────────────────────────────────────────────────────────────
export default function SkillsOrbit() {
  const [hovered, setHovered] = useState(null)
  const sceneRef = useRef()

  // Compute evenly-spaced base angles for each ring
  const innerAngles = useMemo(
    () => innerSkills.map((_, i) => (i / innerSkills.length) * Math.PI * 2),
    []
  )
  const outerAngles = useMemo(
    () => outerSkills.map((_, i) => (i / outerSkills.length) * Math.PI * 2),
    []
  )

  // Gently nod slightly over time for a living feeling
  useFrame(({ clock }) => {
    if (sceneRef.current) {
      const t = clock.getElapsedTime()
      sceneRef.current.rotation.x = Math.sin(t * 0.15) * 0.04
      sceneRef.current.rotation.y = Math.sin(t * 0.08) * 0.04
    }
  })

  return (
    <group ref={sceneRef}>
      {/* ── Orbital ring guides ── */}
      <OrbitalRing radius={INNER_RADIUS} opacity={0.18} />
      <OrbitalRing radius={OUTER_RADIUS} opacity={0.12} />

      {/* ── Center glow ── */}
      <CenterGlow />

      {/* ── Inner ring nodes (slower) ── */}
      {innerSkills.map((skill, i) => (
        <SkillNode
          key={skill.id}
          skill={skill}
          baseAngle={innerAngles[i]}
          radius={INNER_RADIUS}
          speed={0.35}           // inner ring spins faster
          hovered={hovered}
          onHover={setHovered}
        />
      ))}

      {/* ── Outer ring nodes (even slower) ── */}
      {outerSkills.map((skill, i) => (
        <SkillNode
          key={skill.id}
          skill={skill}
          baseAngle={outerAngles[i]}
          radius={OUTER_RADIUS}
          speed={0.18}           // outer ring spins slower (realistic orbital mechanics)
          hovered={hovered}
          onHover={setHovered}
        />
      ))}

      {/* ── Lighting ── */}
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#4f8ef7" distance={8} />
      <pointLight position={[4, 4, 4]} intensity={0.8} color="#7c6af7" />
    </group>
  )
}
