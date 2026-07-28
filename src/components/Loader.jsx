import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Loader
 * Full-screen loading overlay with animated spinner + progress bar.
 * Fades out once `isLoaded` is true.
 */
export default function Loader({ isLoaded }) {
  const wrapperRef = useRef()

  useEffect(() => {
    if (isLoaded && wrapperRef.current) {
      gsap.to(wrapperRef.current, {
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          if (wrapperRef.current) {
            wrapperRef.current.style.display = 'none'
          }
        },
      })
    }
  }, [isLoaded])

  return (
    <div ref={wrapperRef} className="loader-wrapper" aria-label="Loading portfolio">
      {/* Logo initial */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: 64, height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f8ef7, #7c6af7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(79,142,247,0.4)',
          marginBottom: 24,
        }}
      >
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 28, fontWeight: 700, color: '#fff',
        }}>C</span>
      </motion.div>

      {/* Spinner ring */}
      <div className="loader-ring" role="status" />

      {/* Progress bar */}
      <div className="loader-bar-track">
        <div className="loader-bar-fill" />
      </div>

      {/* Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
          color: '#8892a4',
          letterSpacing: '0.1em',
          marginTop: 8,
        }}
      >
        loading portfolio...
      </motion.p>
    </div>
  )
}
