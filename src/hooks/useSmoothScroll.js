import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'

/**
 * Inertial smooth scrolling. Exposes the instance on `window.__lenis` so nav
 * links can hand off to `lenis.scrollTo()` instead of fighting it.
 * Disabled entirely when the user prefers reduced motion.
 */
export function useSmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    window.__lenis = lenis

    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      delete window.__lenis
    }
  }, [reduced])
}

/** Scroll to a section id, via Lenis when available. */
export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -70, duration: 1.3 })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
