import { Suspense, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import AboutSphere from '../three/AboutSphere'

gsap.registerPlugin(ScrollTrigger)

const bioLines = [
  'I design elegant front-ends,',
  'build robust back-ends,',
  'and architect efficient databases —',
  'turning ideas into real, working software.',
  '',
  'Currently leveling up in',
  'cloud architecture & system design.',
]

const stats = [
  { value: '5+', label: 'Projects Built' },
  { value: '3+', label: 'Tech Stacks' },
  { value: '∞', label: 'Curiosity' },
]

/**
 * About Section
 * Split layout: bio text (left) + interactive 3D wireframe sphere (right).
 * GSAP ScrollTrigger stagger animation on bio lines.
 */
export default function About() {
  const prefersReduced = useReducedMotion()
  const sectionRef     = useRef()
  const linesRef       = useRef()
  const statsRef       = useRef()

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      // Stagger bio lines in on scroll
      gsap.fromTo(
        linesRef.current?.querySelectorAll('.bio-line'),
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      )

      // Stats fade up
      gsap.fromTo(
        statsRef.current?.querySelectorAll('.stat-item'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
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
      id="about"
      ref={sectionRef}
      style={{
        padding: 'clamp(80px, 10vw, 140px) 5vw',
        background: 'linear-gradient(180deg, #050b18 0%, #080f1f 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="About section"
    >
      {/* Background grid */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'linear-gradient(rgba(79,142,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'clamp(40px, 6vw, 80px)',
        alignItems: 'center',
      }}>
        {/* ── Left: Bio Text ── */}
        <div>
          <span className="section-tag">About Me</span>

          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: '#e2e8f5',
            margin: '16px 0 28px',
          }}>
            I Build Things<br />
            <span className="gradient-text">for the Web</span>
          </h2>

          {/* Bio lines */}
          <div ref={linesRef} style={{ marginBottom: 36 }}>
            {bioLines.map((line, i) =>
              line === '' ? (
                <div key={i} style={{ height: 16 }} />
              ) : (
                <p
                  key={i}
                  className="bio-line"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                    color: i < 4 ? '#c8d4e8' : '#8892a4',
                    lineHeight: 1.7,
                    opacity: prefersReduced ? 1 : 0,
                  }}
                >
                  {line}
                </p>
              )
            )}
          </div>

          {/* Stats */}
          <div ref={statsRef} style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {stats.map((s) => (
              <div key={s.label} className="stat-item" style={{
                opacity: prefersReduced ? 1 : 0,
              }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '2rem', fontWeight: 700,
                  background: 'linear-gradient(135deg, #4f8ef7, #7c6af7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.75rem', color: '#8892a4',
                  letterSpacing: '0.05em',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
            <a
              href="https://github.com/chinmay8018"
              target="_blank" rel="noopener noreferrer"
              className="btn-primary"
              aria-label="Visit Chinmay's GitHub"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/chinmayjagadev-dash-6b5723227/"
              target="_blank" rel="noopener noreferrer"
              className="btn-outline"
              aria-label="Visit Chinmay's LinkedIn"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* ── Right: 3D Sphere ── */}
        <div style={{
          height: 'clamp(320px, 45vw, 500px)',
          borderRadius: 24,
          overflow: 'hidden',
          position: 'relative',
          background: 'rgba(13,22,49,0.4)',
          border: '1px solid rgba(79,142,247,0.12)',
          boxShadow: '0 0 60px rgba(79,142,247,0.08)',
        }}>
          {/* Drag hint */}
          <div style={{
            position: 'absolute', bottom: 14, left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.68rem', color: '#8892a4',
            letterSpacing: '0.1em', zIndex: 10,
            background: 'rgba(5,11,24,0.6)',
            padding: '4px 12px', borderRadius: 50,
          }}>
            drag to rotate
          </div>

          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <AboutSphere />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  )
}
