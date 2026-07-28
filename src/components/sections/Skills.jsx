import { Suspense, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import SkillsOrbit from '../three/SkillsOrbit'
import { skills } from '../../data/skills'

gsap.registerPlugin(ScrollTrigger)

/**
 * Skills Section
 * 3D orbit canvas (top) + skill cards list (below).
 * Entrance animations on scroll.
 */
export default function Skills() {
  const prefersReduced = useReducedMotion()
  const sectionRef     = useRef()
  const cardsRef       = useRef()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current?.querySelectorAll('.skill-card'),
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{
        padding: 'clamp(80px, 10vw, 140px) 5vw',
        background: 'linear-gradient(180deg, #080f1f 0%, #0d1631 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Skills section"
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 80px)' }}>
        <span className="section-tag">Tech Stack</span>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 700, color: '#e2e8f5',
          margin: '16px auto 0',
        }}>
          My <span className="gradient-text">Skills</span>
        </h2>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          color: '#8892a4', marginTop: 12,
          fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
          maxWidth: 500, margin: '12px auto 0',
        }}>
          Technologies I work with to build full-stack web applications
        </p>
      </div>

      {/* 3D orbit canvas */}
      <div
        aria-label="Interactive 3D skill nodes"
        style={{
          height: 'clamp(420px, 55vw, 580px)',
          maxWidth: 900,
          margin: '0 auto 60px',
          borderRadius: 24,
          overflow: 'hidden',
          background: 'rgba(13,22,49,0.35)',
          border: '1px solid rgba(79,142,247,0.1)',
          boxShadow: '0 0 80px rgba(79,142,247,0.06)',
        }}
      >
        {/* Camera at y=2.8, z=9 → ~17° elevation: rings as elegant perspective ellipses */}
        <Canvas
          camera={{ position: [0, 2.8, 9], fov: 46 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <SkillsOrbit />
          </Suspense>
        </Canvas>
      </div>

      {/* Skill cards */}
      <div
        ref={cardsRef}
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 14,
        }}
      >
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="skill-card glass-card"
            style={{
              padding: '24px 20px',
              textAlign: 'center',
              opacity: prefersReduced ? 1 : 0,
              cursor: 'default',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)'
              e.currentTarget.style.boxShadow = `0 12px 40px ${skill.glowColor}`
              e.currentTarget.style.borderColor = skill.color + '40'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = 'rgba(79,142,247,0.15)'
            }}
          >
            {/* Color dot */}
            <div style={{
              width: 48, height: 48,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${skill.color}40 0%, transparent 70%)`,
              border: `2px solid ${skill.color}60`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: 22,
            }}>
              {skill.icon}
            </div>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.95rem', fontWeight: 600,
              color: skill.color, marginBottom: 6,
            }}>
              {skill.name}
            </h3>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem', color: '#8892a4',
            }}>
              {skill.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
