import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import ContactBlob from '../three/ContactBlob'

const socialLinks = [
  {
    label: 'Email',
    href: 'mailto:chinmayjagadev.dash@gmail.com',
    display: 'chinmayjagadev.dash@gmail.com',
    color: '#4f8ef7',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/chinmay8018',
    display: 'github.com/chinmay8018',
    color: '#a78bfa',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.16c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/chinmayjagadev-dash-6b5723227/',
    display: 'linkedin.com/in/chinmayjagadev-dash',
    color: '#38bdf8',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM6.99 20.45H3.69V9h3.3v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z"/>
      </svg>
    ),
  },
]

/**
 * Contact Section
 * Morphing blob canvas background + contact form + social links.
 */
export default function Contact() {
  const prefersReduced = useReducedMotion()
  const [formState, setFormState]   = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted]   = useState(false)
  const [sending,   setSending]     = useState(false)
  const [errors,    setErrors]      = useState({})

  const validate = () => {
    const e = {}
    if (!formState.name.trim())    e.name    = 'Name is required'
    if (!formState.email.trim() || !/\S+@\S+\.\S+/.test(formState.email))
      e.email = 'Valid email required'
    if (!formState.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSending(true)
    // Simulate send (wire up your preferred service: Formspree, EmailJS, etc.)
    await new Promise((r) => setTimeout(r, 1200))
    setSending(false)
    setSubmitted(true)
  }

  return (
    <section
      id="contact"
      style={{
        padding: 'clamp(80px, 10vw, 140px) 5vw',
        background: 'linear-gradient(180deg, #050b18 0%, #080f1f 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '80vh',
      }}
      aria-label="Contact section"
    >
      {/* ── Morphing blob canvas (background) ── */}
      {!prefersReduced && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-5%', top: '10%',
            width: 'min(500px, 50vw)',
            height: 'min(500px, 50vw)',
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <ContactBlob />
            </Suspense>
          </Canvas>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 80px)' }}>
          <span className="section-tag">Contact</span>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700, color: '#e2e8f5',
            margin: '16px auto 0',
          }}>
            Let's <span className="gradient-text">Work Together</span>
          </h2>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#8892a4', marginTop: 12,
            fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
          }}>
            Have a project in mind? I'd love to hear from you.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(32px, 5vw, 64px)',
          alignItems: 'start',
        }}>
          {/* ── Social links ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.2rem', fontWeight: 600,
              color: '#e2e8f5', marginBottom: 28,
            }}>
              Get In Touch
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={`Contact via ${link.label}`}
                  whileHover={{ x: 8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="glass-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 20px',
                    textDecoration: 'none',
                    color: link.color,
                  }}
                >
                  <span style={{
                    width: 40, height: 40,
                    borderRadius: '50%',
                    background: `${link.color}15`,
                    border: `1px solid ${link.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {link.icon}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.7rem', color: '#8892a4',
                      letterSpacing: '0.08em', marginBottom: 2,
                    }}>
                      {link.label}
                    </div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '0.85rem', fontWeight: 500,
                    }}>
                      {link.display}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── Contact form ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'backOut' }}
                className="glass-card"
                style={{
                  padding: '48px 32px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '1.3rem', fontWeight: 700,
                  color: '#4f8ef7', marginBottom: 12,
                }}>
                  Message Sent!
                </h3>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: '#8892a4', lineHeight: 1.7,
                }}>
                  Thank you for reaching out. I'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact form"
                style={{
                  display: 'flex', flexDirection: 'column', gap: 20,
                }}
              >
                {/* Name */}
                <div className="form-group">
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    placeholder=" "
                    autoComplete="name"
                    value={formState.name}
                    onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
                    className="form-input"
                    aria-required="true"
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    style={{ borderColor: errors.name ? '#f87171' : undefined }}
                  />
                  <label htmlFor="contact-name" className="form-label">Your Name</label>
                  {errors.name && (
                    <span id="name-error" style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.7rem', color: '#f87171',
                      marginTop: 4, display: 'block',
                    }}>
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    placeholder=" "
                    autoComplete="email"
                    value={formState.email}
                    onChange={(e) => setFormState((p) => ({ ...p, email: e.target.value }))}
                    className="form-input"
                    aria-required="true"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    style={{ borderColor: errors.email ? '#f87171' : undefined }}
                  />
                  <label htmlFor="contact-email" className="form-label">Email Address</label>
                  {errors.email && (
                    <span id="email-error" style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.7rem', color: '#f87171',
                      marginTop: 4, display: 'block',
                    }}>
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="form-group">
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder=" "
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))}
                    className="form-input"
                    aria-required="true"
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    style={{
                      resize: 'vertical',
                      minHeight: 120,
                      borderColor: errors.message ? '#f87171' : undefined,
                    }}
                  />
                  <label htmlFor="contact-message" className="form-label">Message</label>
                  {errors.message && (
                    <span id="message-error" style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.7rem', color: '#f87171',
                      marginTop: 4, display: 'block',
                    }}>
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  className="btn-primary"
                  disabled={sending}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    justifyContent: 'center',
                    opacity: sending ? 0.8 : 1,
                    cursor: sending ? 'wait' : 'none',
                  }}
                  aria-label={sending ? 'Sending message...' : 'Send message'}
                >
                  {sending ? (
                    <>
                      <span style={{
                        width: 16, height: 16,
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        display: 'inline-block',
                      }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </>
                  )}
                </motion.button>

                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem', color: '#8892a4',
                  textAlign: 'center',
                }}>
                  Or email directly: <a
                    href="mailto:chinmayjagadev.dash@gmail.com"
                    style={{ color: '#4f8ef7' }}
                  >chinmayjagadev.dash@gmail.com</a>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: 'clamp(60px, 8vw, 100px)',
        paddingTop: 32,
        borderTop: '1px solid rgba(79,142,247,0.1)',
        position: 'relative', zIndex: 1,
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8rem', color: '#8892a4',
        }}>
          Designed &amp; Built by{' '}
          <span style={{ color: '#4f8ef7', fontWeight: 600 }}>Chinmay Jagadev Dash</span>
          {' '}· {new Date().getFullYear()}
        </p>
      </div>
    </section>
  )
}
