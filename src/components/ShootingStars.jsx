import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

const STAR_COLORS = ['#4f8ef7', '#7c6af7', '#38bdf8', '#ffffff', '#a78bfa']

let starId = 0

/**
 * ShootingStars
 * Renders random falling/shooting stars across the full viewport.
 * Runs continuously in the background with random delays, lengths, and angles.
 */
export default function ShootingStars() {
  const prefersReduced = useReducedMotion()
  const [stars, setStars] = useState([])
  const timerRef = useRef(null)

  const spawnStar = useCallback(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800

    // Random start position (top half or top/right edges)
    const startX = Math.random() * (vw * 1.2) - vw * 0.1
    const startY = Math.random() * (vh * 0.5) - 50

    // Distance to travel
    const length = 120 + Math.random() * 180   // tail length in px
    const travel = 250 + Math.random() * 450   // travel distance along path
    const angle  = 35 + Math.random() * 20     // falling angle in degrees (top-left to bottom-right trajectory)

    // Calculate end position based on angle
    const rad = (angle * Math.PI) / 180
    const endX = startX + Math.cos(rad) * travel
    const endY = startY + Math.sin(rad) * travel

    const duration = 0.7 + Math.random() * 0.8
    const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]

    const newStar = {
      id: ++starId,
      startX,
      startY,
      endX,
      endY,
      length,
      angle,
      duration,
      color,
    }

    setStars((prev) => [...prev.slice(-4), newStar]) // keep max 5 active

    // Schedule next shooting star (1.5s - 4.5s random interval)
    const nextDelay = 1500 + Math.random() * 3000
    timerRef.current = setTimeout(spawnStar, nextDelay)
  }, [])

  useEffect(() => {
    if (prefersReduced) return

    // Initial delay before first shooting star
    timerRef.current = setTimeout(spawnStar, 1000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [prefersReduced, spawnStar])

  if (prefersReduced) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1, // Behind main UI text, above background
        overflow: 'hidden',
      }}
    >
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{
              x: star.startX,
              y: star.startY,
              opacity: 0,
              scale: 0.2,
            }}
            animate={{
              x: star.endX,
              y: star.endY,
              opacity: [0, 1, 0.8, 0],
              scale: [0.3, 1, 1, 0.2],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: star.duration,
              ease: 'easeOut',
            }}
            onAnimationComplete={() => {
              setStars((prev) => prev.filter((s) => s.id !== star.id))
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: star.length,
              height: 2,
              transformOrigin: 'left center',
              transform: `rotate(${star.angle}deg)`,
              background: `linear-gradient(90deg, ${star.color} 0%, ${star.color}bb 30%, transparent 100%)`,
              borderRadius: 9999,
              boxShadow: `0 0 10px ${star.color}, 0 0 20px ${star.color}80`,
              filter: `drop-shadow(0 0 6px ${star.color})`,
            }}
          >
            {/* Glowing head at leading edge of shooting star */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: -2,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: `0 0 8px #ffffff, 0 0 14px ${star.color}`,
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
