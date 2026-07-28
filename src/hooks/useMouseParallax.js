import { useEffect, useRef, useCallback } from 'react'

/**
 * useMouseParallax
 * Returns a ref to attach to your target element, and a normalized
 * mouse position { x, y } in range [-1, 1] via a shared ref.
 *
 * Usage:
 *   const { mouseRef } = useMouseParallax()
 *   // mouseRef.current.x => -1 to 1
 */
export function useMouseParallax() {
  const mouseRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    // Normalize to [-1, 1]
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
    mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return { mouseRef }
}
