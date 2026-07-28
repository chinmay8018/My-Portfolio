import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * CustomCursor
 * Dot + trailing ring cursor.
 * - Dot follows mouse directly (instant)
 * - Ring follows with a lag (GSAP lerp)
 * - Both expand on hoverable elements
 */
export default function CustomCursor() {
  const dotRef  = useRef()
  const ringRef = useRef()

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Current ring position (for lerp)
    const ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let   raf     = null

    const onMove = (e) => {
      const { clientX: x, clientY: y } = e

      // Dot — instant
      gsap.set(dot, { x, y })

      // Ring — lerp toward cursor each frame
      const lerp = () => {
        ringPos.x += (x - ringPos.x) * 0.12
        ringPos.y += (y - ringPos.y) * 0.12
        gsap.set(ring, { x: ringPos.x, y: ringPos.y })
        raf = requestAnimationFrame(lerp)
      }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(lerp)
    }

    // Hover state for interactive elements
    const addHover = () => {
      dot.classList.add('hovering')
      ring.classList.add('hovering')
    }
    const removeHover = () => {
      dot.classList.remove('hovering')
      ring.classList.remove('hovering')
    }

    const bindHoverEls = () => {
      const els = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, .project-card'
      )
      els.forEach((el) => {
        el.addEventListener('mouseenter', addHover)
        el.addEventListener('mouseleave', removeHover)
      })
    }

    // Run once + re-bind when DOM changes
    bindHoverEls()
    const observer = new MutationObserver(bindHoverEls)
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
