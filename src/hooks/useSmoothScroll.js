import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'
import { isTouchDevice } from './usePointer'

const NAV_OFFSET = 70

/**
 * Inertial smooth scrolling for mouse/trackpad. Exposes the instance on
 * `window.__lenis` so nav links can hand off to `lenis.scrollTo()` instead of
 * fighting it.
 *
 * Not created on touch devices: Lenis registers non-passive touch listeners,
 * so every swipe has to wait for the main thread before the page can move —
 * on a phone that is busy animating, scrolling stutters or doesn't start.
 * Native touch scrolling is already smooth. Also off under reduced motion.
 */
export function useSmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || isTouchDevice()) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
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
    window.__lenis.scrollTo(el, { offset: -NAV_OFFSET, duration: 1.3 })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }
}
