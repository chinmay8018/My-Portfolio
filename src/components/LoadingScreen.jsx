import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import Rocket from './Rocket'

// ─── Explosion particle colours ────────────────────────────────────────────
const PARTICLE_COLORS = [
  '#4f8ef7', '#4f8ef7', '#4f8ef7',   // electric blue (most common)
  '#7c6af7', '#7c6af7',               // violet
  '#38bdf8', '#38bdf8',               // cyan
  '#ffffff', '#ffffff',               // white flares
  '#a78bfa',                          // light purple
  '#93c5fd',                          // pale blue
  '#c4b5fd',                          // pale violet
]

// ─── Particle angles — evenly spread + a few extra random ones ─────────────
const BASE_COUNT = 16
const PARTICLE_SETUP = Array.from({ length: BASE_COUNT }, (_, i) => {
  const angle  = (i / BASE_COUNT) * 360
  const dist   = 120 + Math.random() * 120   // 120–240 px travel distance
  const size   = 4 + Math.random() * 8        // 4–12 px
  const color  = PARTICLE_COLORS[i % PARTICLE_COLORS.length]
  const delay  = Math.random() * 0.06
  return { angle, dist, size, color, delay }
})

/**
 * LoadingScreen
 *
 * GSAP timeline sequence:
 *   0.0s  Overlay visible, rocket off-screen bottom
 *   0.1s  Progress bar begins cosmetic fill
 *   0.3s  Rocket launches (curved path, 1.3s)
 *   1.6s  Screen mini-shake (50ms)
 *   1.65s Flash white (100ms)
 *   1.65s Rocket vanishes
 *   1.65s Particles burst outward (stagger 0.02s)
 *   1.65s Shockwave ring expands (400ms)
 *   1.75s Flash fades (200ms)
 *   2.0s  Overlay fades out (500ms)
 *   2.5s  onComplete → unmount
 */
export default function LoadingScreen({ onComplete }) {
  const overlayRef   = useRef()
  const rocketRef    = useRef()
  const trailRef     = useRef()
  const flashRef     = useRef()
  const ring1Ref     = useRef()
  const ring2Ref     = useRef()
  const progressRef  = useRef()
  const pctRef       = useRef()
  const particleRefs = useRef([])
  const [pct, setPct] = useState(0)

  // ── Cosmetic progress counter ─────────────────────────────────────────────
  useEffect(() => {
    let val   = 0
    const ivl = setInterval(() => {
      val += Math.random() * 4 + 1
      if (val >= 90) { clearInterval(ivl); val = 90 }
      setPct(Math.min(Math.floor(val), 90))
    }, 60)
    return () => clearInterval(ivl)
  }, [])

  // ── Main GSAP sequence ────────────────────────────────────────────────────
  useEffect(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const cx = vw / 2
    const cy = vh / 2

    const rocket   = rocketRef.current
    const trail    = trailRef.current
    const overlay  = overlayRef.current
    const flash    = flashRef.current
    const ring1    = ring1Ref.current
    const ring2    = ring2Ref.current
    const particles = particleRefs.current.filter(Boolean)

    if (!rocket || !overlay) return

    // ── Set initial positions ─────────────────────────────────────────────
    // Rocket: centered X, below screen bottom
    gsap.set(rocket, {
      x:        cx - 30,     // center (rocket width ~60px)
      y:        vh + 20,
      rotation: 0,
      opacity:  1,
      scale:    0.85,
    })
    gsap.set(trail, {
      x:     cx - 4,
      y:     vh + 80,
      opacity: 0,
      scaleY: 0,
    })
    gsap.set(flash,  { opacity: 0, display: 'block' })
    gsap.set(ring1,  { scale: 0,  opacity: 0 })
    gsap.set(ring2,  { scale: 0,  opacity: 0 })
    particles.forEach((p) => {
      gsap.set(p, { x: cx, y: cy, scale: 0, opacity: 0 })
    })

    // ── Build GSAP timeline ───────────────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => {
        setPct(100)
        onComplete?.()
      },
    })

    // 1. Brief pause — show overlay + progress
    tl.to({}, { duration: 0.25 })

    // 2. Trail appears (slightly before rocket launch)
    tl.to(trail, {
      opacity: 0.7,
      scaleY:  1,
      duration: 0.2,
      ease: 'power1.out',
    })

    // 3. Rocket launch — curved path via keyframes on x + straight y tween
    //    x: slight left-right wobble for realism
    //    y: power2.in acceleration
    tl.to(rocket, {
      keyframes: [
        {
          x:        cx - 18,
          y:        vh * 0.55,
          scale:    0.9,
          rotation: -3,
          duration: 0.45,
          ease:     'power1.in',
        },
        {
          x:        cx + 12,
          y:        vh * 0.28,
          scale:    1.0,
          rotation:  2,
          duration: 0.45,
          ease:     'power2.in',
        },
        {
          x:        cx - 30,   // back to center (cx - half width)
          y:        cy - 30,
          scale:    1.15,
          rotation:  0,
          duration: 0.4,
          ease:     'power3.in',
        },
      ],
    }, '<')                    // starts at same time as trail

    // Trail follows rocket (update its position continuously)
    tl.to(trail, {
      y:       cy + 60,
      scaleY:  2.5,
      opacity: 0.9,
      duration: 1.3,
      ease:    'power2.in',
    }, '<')

    // 4. Subtle screen shake just before impact
    tl.to(overlay, {
      x:        6,
      duration: 0.04,
      yoyo:     true,
      repeat:   3,
      ease:     'none',
    })

    // 5. Flash + blast (rocket vanish, particles, rings — all at same time)
    // 5a. Flash white
    tl.to(flash, {
      opacity:  1,
      duration: 0.08,
      ease:     'power3.out',
    })

    // 5b. Rocket + trail vanish instantly
    tl.set([rocket, trail], { opacity: 0 })

    // 5c. Shockwave ring 1 (fast, large)
    tl.to(ring1, {
      scale:   8,
      opacity: [0.9, 0],
      duration: 0.55,
      ease:    'power2.out',
    }, '<')

    // 5d. Shockwave ring 2 (slightly delayed, smaller)
    tl.to(ring2, {
      scale:   5,
      opacity: [0.6, 0],
      duration: 0.45,
      ease:    'power2.out',
    }, '<0.08')

    // 5e. Particles burst outward
    PARTICLE_SETUP.forEach((cfg, i) => {
      const rad = (cfg.angle * Math.PI) / 180
      const tx  = cx + Math.cos(rad) * cfg.dist
      const ty  = cy + Math.sin(rad) * cfg.dist
      tl.to(particles[i], {
        x:        tx,
        y:        ty,
        scale:    1,
        opacity:  [0, 1, 0.8, 0],
        duration: 0.5 + Math.random() * 0.25,
        ease:     'power2.out',
        delay:    cfg.delay,
      }, '<')
    })

    // 5f. Flash fades out
    tl.to(flash, {
      opacity:  0,
      duration: 0.25,
      ease:     'power2.in',
    }, '<0.08')

    // 6. Brief pause with glow settling
    tl.to({}, { duration: 0.15 })

    // 7. Overlay fades + scales out — reveal portfolio
    tl.to(overlay, {
      opacity:  0,
      scale:    1.04,
      duration: 0.55,
      ease:     'power2.inOut',
    })

    return () => tl.kill()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={overlayRef}
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          99999,
        background:      '#060a14',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        overflow:        'hidden',
        transformOrigin: 'center center',
      }}
      aria-label="Loading portfolio"
      role="status"
    >
      {/* ── Background radial glow at center ── */}
      <div style={{
        position:     'absolute',
        top: '50%', left: '50%',
        transform:    'translate(-50%, -50%)',
        width:        300, height: 300,
        borderRadius: '50%',
        background:   'radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%)',
        pointerEvents:'none',
      }} />

      {/* ── Grid overlay (subtle) ── */}
      <div style={{
        position:    'absolute', inset: 0,
        backgroundImage:
          'linear-gradient(rgba(79,142,247,0.03) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(79,142,247,0.03) 1px, transparent 1px)',
        backgroundSize:   '48px 48px',
        pointerEvents:    'none',
      }} />

      {/* ── White flash ── */}
      <div
        ref={flashRef}
        style={{
          position:     'absolute', inset: 0,
          background:
            'radial-gradient(ellipse at center, #ffffff 0%, rgba(79,142,247,0.6) 40%, transparent 70%)',
          pointerEvents: 'none',
          display:       'none',
        }}
      />

      {/* ── Shockwave ring 1 ── */}
      <div
        ref={ring1Ref}
        style={{
          position:     'absolute',
          top: '50%', left: '50%',
          transform:    'translate(-50%, -50%) scale(0)',
          width:        60, height: 60,
          borderRadius: '50%',
          border:       '2px solid #4f8ef7',
          boxShadow:    '0 0 20px #4f8ef7, inset 0 0 20px rgba(79,142,247,0.3)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Shockwave ring 2 ── */}
      <div
        ref={ring2Ref}
        style={{
          position:     'absolute',
          top: '50%', left: '50%',
          transform:    'translate(-50%, -50%) scale(0)',
          width:        80, height: 80,
          borderRadius: '50%',
          border:       '1.5px solid #7c6af7',
          boxShadow:    '0 0 16px #7c6af7',
          pointerEvents: 'none',
        }}
      />

      {/* ── Explosion particles ── */}
      {PARTICLE_SETUP.map((cfg, i) => (
        <div
          key={i}
          ref={(el) => { particleRefs.current[i] = el }}
          style={{
            position:     'fixed',
            top:          0, left: 0,
            width:        cfg.size,
            height:       cfg.size,
            borderRadius: cfg.size > 8 ? '2px' : '50%',   // squares for larger sparks
            background:   cfg.color,
            boxShadow:    `0 0 ${cfg.size * 1.5}px ${cfg.color}`,
            pointerEvents:'none',
            transform:    'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* ── Flame trail div ── */}
      <div
        ref={trailRef}
        style={{
          position:        'fixed',
          top:             0, left: 0,
          width:           8,
          height:          100,
          transformOrigin: 'top center',
          background:
            'linear-gradient(180deg, #fff 0%, #4f8ef7 35%, #7c6af7 65%, transparent 100%)',
          borderRadius:    4,
          filter:          'blur(3px)',
          pointerEvents:   'none',
        }}
      />

      {/* ── Rocket ── */}
      <div
        ref={rocketRef}
        style={{
          position:      'fixed',
          top:           0, left: 0,
          pointerEvents: 'none',
          filter:        'drop-shadow(0 0 12px #4f8ef7)',
        }}
      >
        <Rocket size={60} rotation={0} color="#4f8ef7" opacity={1} />
      </div>

      {/* ── Center logo (stays during load, vanishes in flash) ── */}
      <div style={{
        position:        'absolute',
        top: '50%', left: '50%',
        transform:       'translate(-50%, -60%)',
        textAlign:       'center',
        pointerEvents:   'none',
        userSelect:      'none',
      }}>
        {/* Initial — shown until rocket arrives */}
        <div style={{
          fontFamily:  "'Space Grotesk', sans-serif",
          fontSize:    'clamp(1rem, 2vw, 1.25rem)',
          fontWeight:  300,
          letterSpacing:'0.3em',
          color:       'rgba(136,146,164,0.55)',
          marginBottom: 8,
          textTransform:'uppercase',
        }}>
          chinmay.dev
        </div>
      </div>

      {/* ── Bottom bar: name + progress ── */}
      <div style={{
        position:      'absolute',
        bottom:        32, left: 0, right: 0,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           12,
        pointerEvents: 'none',
      }}>
        {/* Name */}
        <div style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      '0.72rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color:         'rgba(136,146,164,0.5)',
        }}>
          Chinmay Jagadev Dash
        </div>

        {/* Progress bar track */}
        <div style={{
          width:        180,
          height:       2,
          background:   'rgba(79,142,247,0.12)',
          borderRadius: 9999,
          overflow:     'hidden',
        }}>
          <div
            ref={progressRef}
            style={{
              height:           '100%',
              width:            `${pct}%`,
              background:       'linear-gradient(90deg, #4f8ef7, #7c6af7)',
              borderRadius:     9999,
              transition:       'width 0.25s ease-out',
              boxShadow:        '0 0 8px rgba(79,142,247,0.5)',
            }}
          />
        </div>

        {/* Percentage */}
        <div ref={pctRef} style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      '0.65rem',
          color:         'rgba(79,142,247,0.5)',
          letterSpacing: '0.1em',
        }}>
          {pct}%
        </div>
      </div>
    </div>
  )
}
