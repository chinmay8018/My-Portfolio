import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Navbar        from './components/Navbar'
import CustomCursor  from './components/CustomCursor'
import RocketLayer   from './components/RocketLayer'
import ShootingStars from './components/ShootingStars'
import Hero          from './components/sections/Hero'
import About         from './components/sections/About'
import Skills        from './components/sections/Skills'
import Projects      from './components/sections/Projects'
import Experience    from './components/sections/Experience'
import Contact       from './components/sections/Contact'
import { useReducedMotion } from './hooks/useReducedMotion'

/**
 * App
 * Top-level composition.
 *
 * Loading flow:
 *   1. <LoadingScreen> plays its 2.5s GSAP sequence (rocket launch → blast → reveal)
 *   2. onComplete() fires → loaderDone = true → LoadingScreen unmounts
 *   3. Main content transitions in (opacity 0 → 1)
 *   4. Hero section's own GSAP entrance animation kicks off
 */
export default function App() {
  const [loaderDone, setLoaderDone] = useState(false)
  const prefersReduced              = useReducedMotion()

  const handleLoaderComplete = () => setLoaderDone(true)

  return (
    <>
      {/* ── Rocket launch intro (unmounts after sequence) ── */}
      {!loaderDone && (
        <LoadingScreen onComplete={handleLoaderComplete} />
      )}

      {/* ── Custom cursor ── */}
      {!prefersReduced && <CustomCursor />}

      {/* ── Ambient rocket & shooting stars layers ── */}
      {loaderDone && (
        <>
          <RocketLayer />
          <ShootingStars />
        </>
      )}

      {/* ── Subtle film grain ── */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* ── Fixed navigation ── */}
      <Navbar />

      {/* ── Main content — fades in as loader exits ── */}
      <main
        id="main-content"
        style={{
          opacity:    loaderDone ? 1 : 0,
          transition: 'opacity 0.6s ease-out',
          // Keep content in DOM for GSAP/Three.js to initialise during load
          visibility: 'visible',
        }}
      >
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
