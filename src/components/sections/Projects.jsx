import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { projects } from '../../data/projects'

gsap.registerPlugin(ScrollTrigger)

/**
 * ProjectCard
 * Card with 3D tilt-on-hover effect (CSS perspective transform),
 * Framer Motion entrance, GitHub link, and tech tags.
 */
function ProjectCard({ project, index }) {
  const cardRef  = useRef()
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect   = cardRef.current.getBoundingClientRect()
    const cx     = rect.left + rect.width  / 2
    const cy     = rect.top  + rect.height / 2
    const rx     = ((e.clientY - cy) / (rect.height / 2)) * -12  // tilt X
    const ry     = ((e.clientX - cx) / (rect.width  / 2)) *  12  // tilt Y
    cardRef.current.style.transform =
      `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform =
      'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)'
    setHovered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: 'easeOut' }}
    >
      <div
        ref={cardRef}
        className="project-card glass-card"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          padding: '28px 24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s',
          boxShadow: hovered
            ? `0 20px 60px ${project.color}22, 0 0 0 1px ${project.color}30`
            : '0 4px 24px rgba(0,0,0,0.3)',
          willChange: 'transform',
        }}
      >
        {/* Top: Icon + color accent bar */}
        <div style={{
          height: 4,
          background: `linear-gradient(90deg, ${project.color}, transparent)`,
          borderRadius: 2,
          marginBottom: 20,
          opacity: hovered ? 1 : 0.4,
          transition: 'opacity 0.3s',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 32 }} aria-hidden="true">{project.icon}</span>
          {/* GitHub link */}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} on GitHub`}
            style={{
              color: '#8892a4',
              transition: 'color 0.3s',
              display: 'flex', alignItems: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = project.color}
            onMouseLeave={(e) => e.currentTarget.style.color = '#8892a4'}
          >
            {/* GitHub icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.16c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.1rem', fontWeight: 700,
          color: '#e2e8f5', marginBottom: 8,
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.9rem', color: '#8892a4',
          lineHeight: 1.65, marginBottom: 20,
          flex: 1,
        }}>
          {project.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.tags.map((tag) => (
            <span key={tag} style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: project.color,
              background: `${project.color}15`,
              border: `1px solid ${project.color}30`,
              padding: '3px 10px',
              borderRadius: 50,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* View on GitHub */}
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title} repository`}
          style={{
            marginTop: 20,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.85rem', fontWeight: 600,
            color: project.color,
            textDecoration: 'none',
            transition: 'gap 0.25s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.gap = '10px'}
          onMouseLeave={(e) => e.currentTarget.style.gap = '6px'}
        >
          View Repository
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </motion.div>
  )
}

/**
 * Projects Section
 */
export default function Projects() {
  const sectionRef = useRef()

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        padding: 'clamp(80px, 10vw, 140px) 5vw',
        background: 'linear-gradient(180deg, #0d1631 0%, #080f1f 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Projects section"
    >
      {/* Decorative blur orbs */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '20%', right: '-10%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 80px)' }}>
          <span className="section-tag">Work</span>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700, color: '#e2e8f5',
            margin: '16px auto 0',
          }}>
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#8892a4', marginTop: 12,
            fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
          }}>
            A selection of things I've built
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* GitHub CTA */}
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <a
            href="https://github.com/chinmay8018"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            aria-label="View all projects on GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.16c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View All on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
