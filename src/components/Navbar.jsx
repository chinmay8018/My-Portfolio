import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '#hero',       label: 'Home'       },
  { href: '#about',      label: 'About'      },
  { href: '#skills',     label: 'Skills'     },
  { href: '#projects',   label: 'Projects'   },
  { href: '#experience', label: 'Experience' },
  { href: '#contact',    label: 'Contact'    },
]

/**
 * Navbar
 * Fixed glassmorphism navbar with active section highlighting.
 * Collapses into a hamburger on mobile.
 */
export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [active,    setActive]    = useState('#hero')
  const [menuOpen,  setMenuOpen]  = useState(false)

  // Track scroll position for glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Intersection observer for active section
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`)
          }
        })
      },
      { threshold: 0.4 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleNav = (href) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        padding: '0 5vw',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled
          ? 'rgba(8, 15, 31, 0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(79,142,247,0.12)'
          : 'none',
        transition: 'background 0.4s, backdrop-filter 0.4s, border-bottom 0.4s',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <button
        onClick={() => handleNav('#hero')}
        aria-label="Go to top"
        style={{
          background: 'none', border: 'none', cursor: 'none',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f8ef7, #7c6af7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(79,142,247,0.4)',
        }}>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, color: '#fff' }}>C</span>
        </div>
        <span style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontWeight: 600, fontSize: '0.95rem',
          color: '#e2e8f5', letterSpacing: '0.02em',
        }}>
          Chinmay<span style={{ color: '#4f8ef7' }}>.</span>
        </span>
      </button>

      {/* Desktop links */}
      <ul style={{
        display: 'flex', gap: 6, listStyle: 'none',
        alignItems: 'center',
      }} className="hidden md:flex">
        {navLinks.map(({ href, label }) => (
          <li key={href}>
            <button
              onClick={() => handleNav(href)}
              aria-current={active === href ? 'page' : undefined}
              style={{
                border: 'none', cursor: 'none',
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: '0.9rem', fontWeight: 500,
                color: active === href ? '#4f8ef7' : '#8892a4',
                padding: '6px 14px',
                borderRadius: 50,
                transition: 'color 0.3s, background 0.3s',
                background: active === href
                  ? 'rgba(79,142,247,0.1)'
                  : 'transparent',
              }}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="mailto:chinmayjagadev.dash@gmail.com"
        className="btn-outline hidden md:flex"
        style={{ fontSize: '0.85rem', padding: '8px 20px' }}
        aria-label="Email Chinmay"
      >
        Hire Me
      </a>

      {/* Mobile hamburger */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          flexDirection: 'column', gap: 5, padding: 8,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            display: 'block', width: 24, height: 2,
            background: '#4f8ef7', borderRadius: 2,
            transition: 'all 0.3s',
            transform: menuOpen
              ? i === 0 ? 'rotate(45deg) translateY(7px)'
              : i === 1 ? 'opacity(0) scaleX(0)'
              : 'rotate(-45deg) translateY(-7px)'
              : 'none',
            opacity: menuOpen && i === 1 ? 0 : 1,
          }} />
        ))}
      </button>

      <style>{`
        .mobile-menu-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              top: 68, left: 0, right: 0,
              background: 'rgba(8,15,31,0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(79,142,247,0.12)',
              padding: '16px 5vw 24px',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}
          >
            {navLinks.map(({ href, label }) => (
              <button
                key={href}
                onClick={() => handleNav(href)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: '1rem', fontWeight: 500,
                  color: active === href ? '#4f8ef7' : '#8892a4',
                  textAlign: 'left', padding: '10px 0',
                  borderBottom: '1px solid rgba(79,142,247,0.06)',
                }}
              >
                {label}
              </button>
            ))}
            <a
              href="mailto:chinmayjagadev.dash@gmail.com"
              className="btn-primary"
              style={{ marginTop: 12, justifyContent: 'center' }}
            >
              Hire Me
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
