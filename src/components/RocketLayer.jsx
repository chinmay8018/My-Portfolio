import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Rocket from './Rocket'
import { useReducedMotion } from '../hooks/useReducedMotion'

// ─── Global toggle ──────────────────────────────────────────────────────────
export const ENABLE_ROCKET_ANIMATIONS = true

// ─── Colour palette ─────────────────────────────────────────────────────────
const COLORS = ['#4f8ef7', '#7c6af7', '#38bdf8', '#a78bfa', '#60a5fa']

// ─── Auto-calculate rotation so nose points toward the destination ──────────
// The Rocket SVG has nose at TOP, so rotation=0 means nose-up.
// atan2(dx, -dy) converts a direction vector into a CSS rotation angle
// where 0° = up, 90° = right, 180° = down, -90° = left.
function directionRotation(startX, startY, endX, endY) {
  const dx = endX - startX
  const dy = endY - startY
  return Math.atan2(dx, -dy) * (180 / Math.PI)
}

// ─── Generate a random straight-line path ──────────────────────────────────
// All paths originate from the bottom half of the screen (like a rocket launch)
// and travel upward — either straight up, or at a diagonal left/right angle.
function getRandomPath() {
  const vw  = window.innerWidth
  const vh  = window.innerHeight
  const rnd = (min, max) => min + Math.random() * (max - min)

  // 5 trajectory variants — all going generally UPWARD
  const variant = Math.floor(Math.random() * 5)
  let startX, startY, endX, endY

  switch (variant) {
    case 0:
      // Straight up — random X column
      startX = rnd(vw * 0.15, vw * 0.85)
      startY = vh + 70
      endX   = startX                    // same column → perfectly vertical
      endY   = -80
      break

    case 1:
      // Slightly left of launch point (gentle left lean)
      startX = rnd(vw * 0.3, vw * 0.75)
      startY = vh + 70
      endX   = startX - rnd(vw * 0.12, vw * 0.22)
      endY   = -80
      break

    case 2:
      // Slightly right of launch point (gentle right lean)
      startX = rnd(vw * 0.25, vw * 0.7)
      startY = vh + 70
      endX   = startX + rnd(vw * 0.12, vw * 0.22)
      endY   = -80
      break

    case 3:
      // Steeper left diagonal (from bottom-right → top-left)
      startX = rnd(vw * 0.55, vw * 0.9)
      startY = vh + 70
      endX   = rnd(-80, vw * 0.25)
      endY   = -80
      break

    case 4:
    default:
      // Steeper right diagonal (from bottom-left → top-right)
      startX = rnd(vw * 0.1, vw * 0.45)
      startY = vh + 70
      endX   = rnd(vw * 0.75, vw + 80)
      endY   = -80
      break
  }

  const rotation = directionRotation(startX, startY, endX, endY)
  const duration = rnd(2.4, 3.6)
  const size     = rnd(46, 66)
  const color    = COLORS[Math.floor(Math.random() * COLORS.length)]

  return { startX, startY, endX, endY, rotation, duration, size, color }
}

// ─── Single flyby rocket ────────────────────────────────────────────────────
function FlybyRocket({ id, path, onDone }) {
  return (
    <motion.div
      key={id}
      initial={{
        x:       path.startX,
        y:       path.startY,
        opacity: 0,
        scale:   0.6,
      }}
      animate={{
        x:       path.endX,
        y:       path.endY,
        opacity: [0, 1, 1, 1, 0],
        scale:   [0.6, 1.05, 1.05, 1, 0.9],
      }}
      transition={{
        duration: path.duration,
        ease:     'easeIn',          // rockets accelerate — starts slow, builds speed
        times:    [0, 0.12, 0.5, 0.88, 1],
      }}
      onAnimationComplete={onDone}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        pointerEvents: 'none',
        zIndex:        50,
        filter: `drop-shadow(0 0 10px ${path.color}) drop-shadow(0 0 24px ${path.color}90)`,
      }}
    >
      <Rocket
        size={path.size}
        rotation={path.rotation}   // nose always faces the destination
        color={path.color}
        opacity={1}
      />
    </motion.div>
  )
}

// ─── Ambient slow-drifting rockets ──────────────────────────────────────────
// Two always-present rockets drifting upward at very low speed via CSS keyframes.
const AMBIENT_STYLES = [
  {
    // Left column, slow
    animName:    'ambUp1',
    startLeft:   '18vw',
    size:        38,
    color:       '#4f8ef7',
    opacity:     0.35,
    duration:    '28s',
    delay:       '0s',
    rotation:    0,
  },
  {
    // Right column, slightly faster, violet
    animName:    'ambUp2',
    startLeft:   '74vw',
    size:        30,
    color:       '#7c6af7',
    opacity:     0.28,
    duration:    '22s',
    delay:       '-11s',
    rotation:    0,
  },
]

// ─── RocketLayer ─────────────────────────────────────────────────────────────
let _id = 0
export default function RocketLayer() {
  const prefersReduced = useReducedMotion()
  const isMobile       = typeof window !== 'undefined' && window.innerWidth < 768
  const [rockets, setRockets] = useState([])
  const timerRef = useRef(null)

  const launchNext = useCallback(() => {
    setRockets((prev) => {
      if (prev.length >= 3) return prev
      const path = getRandomPath()
      return [...prev, { id: ++_id, path }]
    })
    // Random interval: 3.5s – 9s
    timerRef.current = setTimeout(launchNext, 3500 + Math.random() * 5500)
  }, [])

  const remove = useCallback((id) => {
    setRockets((prev) => prev.filter((r) => r.id !== id))
  }, [])

  useEffect(() => {
    if (!ENABLE_ROCKET_ANIMATIONS) return
    // First launch after loading screen clears (~2.5s)
    timerRef.current = setTimeout(launchNext, 2600)
    return () => clearTimeout(timerRef.current)
  }, [launchNext])

  if (!ENABLE_ROCKET_ANIMATIONS) return null

  return (
    <>
      {/* CSS for ambient upward-drifting rockets */}
      <style>{`
        @keyframes ambUp1 {
          0%   { transform: translateY(105vh); opacity: 0; }
          8%   { opacity: 0.35; }
          92%  { opacity: 0.35; }
          100% { transform: translateY(-15vh);  opacity: 0; }
        }
        @keyframes ambUp2 {
          0%   { transform: translateY(105vh); opacity: 0; }
          8%   { opacity: 0.28; }
          92%  { opacity: 0.28; }
          100% { transform: translateY(-15vh);  opacity: 0; }
        }
      `}</style>

      {/* Ambient — always visible background rockets (nose pointing UP) */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 48 }}>
        {(isMobile ? AMBIENT_STYLES.slice(0, 1) : AMBIENT_STYLES).map((cfg) => (
          <div
            key={cfg.animName}
            style={{
              position:  'fixed',
              bottom:    0,
              left:      cfg.startLeft,
              animation: `${cfg.animName} ${cfg.duration} ${cfg.delay} linear infinite`,
              filter:    `drop-shadow(0 0 8px ${cfg.color})`,
            }}
          >
            <Rocket
              size={cfg.size}
              rotation={cfg.rotation}    // 0 = nose up — drifting straight upward
              color={cfg.color}
              opacity={cfg.opacity}
            />
          </div>
        ))}
      </div>

      {/* Randomly timed flyby rockets */}
      <AnimatePresence>
        {rockets.map((r) => (
          <FlybyRocket
            key={r.id}
            id={r.id}
            path={r.path}
            onDone={() => remove(r.id)}
          />
        ))}
      </AnimatePresence>
    </>
  )
}
