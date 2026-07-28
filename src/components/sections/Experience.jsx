import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experiences } from '../../data/experience'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import Rocket from '../Rocket'

gsap.registerPlugin(ScrollTrigger)

/**
 * Experience Section
 *
 * Scroll animation:
 *  • A rocket travels down the centre timeline as the user scrolls.
 *  • The blue line GROWS behind the rocket (rocket is always at its tip).
 *  • Each card/dot fades + slides in precisely when the rocket reaches it.
 */
export default function Experience() {
  const prefersReduced = useReducedMotion()
  const sectionRef     = useRef()
  const lineRef        = useRef()    // the growing vertical line
  const rocketRef      = useRef()    // rocket that travels down the line
  const entriesRef     = useRef()    // the flex column of entries (used to measure total height)
  const dotsRef        = useRef([])  // glowing dots on the centre axis
  const cardsRef       = useRef([])  // card containers

  useEffect(() => {
    const section = sectionRef.current
    const entries = entriesRef.current
    const line    = lineRef.current
    const rocket  = rocketRef.current
    if (!section || !entries || !line || !rocket) return

    let tl

    const buildTimeline = () => {
      if (tl) tl.kill()

      const totalH = entries.offsetHeight
      if (!totalH) return

      // Reset initial positions
      gsap.set(line,   { scaleY: 0, transformOrigin: 'top center' })
      gsap.set(rocket, { y: 0, opacity: 0 })
      dotsRef.current.forEach((d) => d && gsap.set(d, { scale: 0, opacity: 0 }))
      cardsRef.current.forEach((c, i) => {
        if (!c) return
        const fromLeft = i % 2 === 0
        gsap.set(c, { opacity: 0, x: fromLeft ? -40 : 40 })
      })

      tl = gsap.timeline({
        scrollTrigger: {
          trigger:             entries,
          start:               'top 75%',
          end:                 'bottom 65%',
          scrub:               0.6,
          invalidateOnRefresh: true,
        },
      })

      // Rocket entrance
      tl.to(rocket, { opacity: 1, duration: 0.05 })

      const children = Array.from(entries.children)
      const count    = children.length

      children.forEach((child, i) => {
        const dotY     = child.offsetTop + child.offsetHeight / 2
        const progress = Math.min(dotY / totalH, 1)

        // Line grows to dot position
        tl.to(line, { scaleY: progress, ease: 'none', duration: 1 / count })

        // Rocket travels to dot position (rocket height ~36px -> centered at dotY - 18)
        tl.to(rocket, { y: dotY - 18, ease: 'none', duration: 1 / count }, '<')

        // Dot activates when rocket reaches it
        const dot = dotsRef.current[i]
        if (dot) {
          tl.to(dot, { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' }, '<0.6')
        }

        // Card slides in
        const card = cardsRef.current[i]
        if (card) {
          tl.to(card, { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' }, '<')
        }
      })
    }

    const timer = setTimeout(() => {
      buildTimeline()
      ScrollTrigger.refresh()
    }, 150)

    window.addEventListener('resize', buildTimeline)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', buildTimeline)
      if (tl) tl.kill()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        padding:    'clamp(80px, 10vw, 140px) 5vw',
        background: 'linear-gradient(180deg, #080f1f 0%, #050b18 100%)',
        position:   'relative',
        overflow:   'hidden',
      }}
      aria-label="Experience section"
    >
      {/* Background glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '30%', left: '-15%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(124,106,247,0.07) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 90px)' }}>
          <span className="section-tag">Career</span>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize:   'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700, color: '#e2e8f5',
            margin: '16px auto 0',
          }}>
            My <span className="gradient-text">Experience</span>
          </h2>
        </div>

        {/* ── Timeline container ─────────────────────────────────────────── */}
        <div style={{ position: 'relative' }}>

          {/* ── Vertical background track (faint) ── */}
          <div aria-hidden="true" style={{
            position:        'absolute',
            left:            'calc(50% - 1px)',
            top:             0, bottom: 0,
            width:           2,
            background:      'rgba(79,142,247,0.1)',
            borderRadius:    2,
          }} />

          {/* ── Growing accent line (drawn by rocket) ── */}
          <div
            aria-hidden="true"
            ref={lineRef}
            style={{
              position:        'absolute',
              left:            'calc(50% - 1px)',
              top:             0, bottom: 0,
              width:           2,
              background:      'linear-gradient(180deg, #4f8ef7 0%, #7c6af7 60%, #38bdf8 100%)',
              boxShadow:       '0 0 8px rgba(79,142,247,0.5)',
              borderRadius:    2,
              transformOrigin: 'top center',
              transform:       prefersReduced ? 'none' : 'scaleY(0)',
            }}
          />

          {/* ── Rocket that travels down the line ── */}
          <div
            aria-hidden="true"
            ref={rocketRef}
            style={{
              position:      'absolute',
              left:          'calc(50% - 18px)',    // horizontally centred
              top:           0,
              zIndex:        10,
              filter:        'drop-shadow(0 0 10px #4f8ef7) drop-shadow(0 0 20px #4f8ef780)',
              pointerEvents: 'none',
            }}
          >
            {/* Rocket pointing downward (rotation=180 → nose down) */}
            <Rocket size={36} rotation={180} color="#4f8ef7" opacity={1} />
          </div>

          {/* ── Entries ────────────────────────────────────────────────── */}
          <div
            ref={entriesRef}
            style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           'clamp(40px, 6vw, 72px)',
            }}>
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0
              return (
                <div
                  key={exp.id}
                  style={{
                    display:             'grid',
                    gridTemplateColumns: '1fr 64px 1fr',
                    alignItems:          'center',
                    gap:                 0,
                    minHeight:           120,
                  }}
                >
                  {/* Left card or spacer */}
                  {isLeft ? (
                    <div
                      ref={(el) => { cardsRef.current[i] = el }}
                      style={{ paddingRight: 28 }}
                    >
                      <ExperienceCard exp={exp} align="right" />
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Centre dot ── aligned to the timeline line */}
                  <div style={{
                    display:        'flex',
                    justifyContent: 'center',
                    alignItems:     'center',
                  }}>
                    <div
                      ref={(el) => { dotsRef.current[i] = el }}
                      style={{
                        width:        18,
                        height:       18,
                        borderRadius: '50%',
                        background:   exp.color,
                        boxShadow:    `0 0 18px ${exp.color}, 0 0 36px ${exp.color}60`,
                        border:       '3px solid #050b18',
                        zIndex:       5,
                        flexShrink:   0,
                        transform:    prefersReduced ? 'none' : 'scale(0)',
                      }}
                    />
                  </div>

                  {/* Right card or spacer */}
                  {!isLeft ? (
                    <div
                      ref={(el) => { cardsRef.current[i] = el }}
                      style={{ paddingLeft: 28 }}
                    >
                      <ExperienceCard exp={exp} align="left" />
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <style>{`
        @media (max-width: 640px) {
          #experience [data-exp-grid] {
            grid-template-columns: 32px 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

// ── Shared card component ────────────────────────────────────────────────────
function ExperienceCard({ exp, align }) {
  return (
    <div
      className="glass-card"
      style={{
        padding:     '22px 24px',
        borderLeft:  align === 'left'  ? `3px solid ${exp.color}` : 'none',
        borderRight: align === 'right' ? `3px solid ${exp.color}` : 'none',
        position:    'relative',
        overflow:    'hidden',
      }}
    >
      {/* Subtle colour glow in card */}
      <div style={{
        position:     'absolute',
        top: 0, [align === 'left' ? 'left' : 'right']: 0,
        width:        60, height: '100%',
        background:   `linear-gradient(${align === 'left' ? '90deg' : '270deg'}, ${exp.color}12, transparent)`,
        pointerEvents:'none',
      }} />

      {/* Duration badge */}
      <span style={{
        fontFamily:  "'JetBrains Mono', monospace",
        fontSize:    '0.68rem',
        color:       exp.color,
        background:  `${exp.color}18`,
        border:      `1px solid ${exp.color}35`,
        padding:     '3px 10px',
        borderRadius: 50,
        display:     'inline-block',
        marginBottom: 10,
        letterSpacing:'0.06em',
      }}>
        {exp.duration}
      </span>

      <h3 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize:   '1.05rem', fontWeight: 700,
        color:      '#e2e8f5', marginBottom: 4,
      }}>
        {exp.role}
      </h3>

      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize:   '0.88rem', color: exp.color,
        fontWeight: 600, marginBottom: 4,
      }}>
        {exp.company}
      </p>

      <p style={{
        fontFamily:   "'JetBrains Mono', monospace",
        fontSize:     '0.7rem', color: '#8892a4',
        marginBottom: 14, letterSpacing: '0.04em',
      }}>
        📍 {exp.location}
      </p>

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {exp.contributions.map((item, j) => (
          <li key={j} style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize:   '0.85rem', color: '#8892a4',
            lineHeight: 1.6,
            paddingLeft: 16,
            position:   'relative',
          }}>
            <span style={{
              position:     'absolute', left: 0, top: 9,
              width: 5, height: 5,
              borderRadius: '50%',
              background:   exp.color,
            }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
