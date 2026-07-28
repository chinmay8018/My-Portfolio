import { Suspense, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import HeroScene from '../three/HeroScene'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * Hero Section
 * Full-screen Three.js canvas starfield background.
 * HTML text overlay with GSAP entrance animation.
 * Scroll-down cue at bottom.
 */
export default function Hero() {
  const prefersReduced = useReducedMotion()
  const isMobile       = typeof window !== 'undefined' && window.innerWidth < 768

  const textRef = useRef()
  useEffect(() => {
    if (prefersReduced || !textRef.current) return
    // Entrance stagger on load
    gsap.fromTo(
      textRef.current.querySelectorAll('.hero-animate'),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, delay: 0.3, ease: 'power3.out' }
    )
  }, [prefersReduced])

  const scrollDown = () =>
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 600,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 60% 50%, #0d1631 0%, #050b18 70%)',
      }}
      aria-label="Hero section"
    >
      {/* ── 3D Canvas Background ── */}
      {!prefersReduced && (
        <div
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
          aria-hidden="true"
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 55 }}
            dpr={Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <HeroScene isMobile={isMobile} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Static fallback for reduced motion */}
      {prefersReduced && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 0,
            background: 'radial-gradient(ellipse at center, #1a2a5e 0%, #050b18 70%)',
          }}
        />
      )}

      {/* ── Vignette overlay ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(5,11,24,0.85) 100%)',
        }}
      />

      {/* ── Text overlay ── */}
      <div
        ref={textRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 24px',
        }}
      >
        {/* Mono tag */}
        <div
          className="hero-animate section-tag"
          style={{ opacity: prefersReduced ? 1 : 0 }}
        >
          &lt; software.developer /&gt;
        </div>

        {/* Main heading */}
        <h1
          className="hero-animate"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2.4rem, 7vw, 5.5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 16, marginBottom: 16,
            color: '#e2e8f5',
            opacity: prefersReduced ? 1 : 0,
          }}
        >
          Chinmay{' '}
          <span className="gradient-text">Jagadev</span>
          <br />
          Dash
        </h1>

        {/* Subtitle */}
        <p
          className="hero-animate"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            fontWeight: 400,
            color: '#8892a4',
            marginBottom: 12,
            opacity: prefersReduced ? 1 : 0,
          }}
        >
          Software Developer
        </p>

        {/* Tagline */}
        <p
          className="hero-animate"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
            color: '#4f8ef7',
            marginBottom: 40,
            opacity: prefersReduced ? 1 : 0,
            background: 'rgba(79,142,247,0.08)',
            padding: '6px 18px',
            borderRadius: 50,
            border: '1px solid rgba(79,142,247,0.2)',
          }}
        >
          Building scalable web apps with React &amp; .NET
        </p>

        {/* CTAs */}
        <div
          className="hero-animate"
          style={{
            display: 'flex', gap: 16, flexWrap: 'wrap',
            justifyContent: 'center',
            opacity: prefersReduced ? 1 : 0,
          }}
        >
          <a
            href="#projects"
            className="btn-primary"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
            }}
            aria-label="View projects"
          >
            View Projects
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href="#contact"
            className="btn-outline"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            aria-label="Contact Chinmay"
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.button
        onClick={scrollDown}
        aria-label="Scroll down"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 3, duration: 0.6 },
          y: { delay: 3, duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          position: 'absolute', bottom: 36, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3, background: 'none', border: 'none', cursor: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}
      >
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem', color: '#8892a4', letterSpacing: '0.1em',
        }}>
          scroll
        </span>
        <div style={{
          width: 24, height: 36,
          border: '1.5px solid rgba(79,142,247,0.4)',
          borderRadius: 12, position: 'relative',
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{
            width: 4, height: 8,
            background: '#4f8ef7',
            borderRadius: 2,
            marginTop: 6,
            animation: 'scrollDot 1.8s ease-in-out infinite',
          }} />
        </div>
      </motion.button>

      <style>{`
        @keyframes scrollDot {
          0%   { transform: translateY(0); opacity: 1; }
          70%  { transform: translateY(12px); opacity: 0.2; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </section>
  )
}
