import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { navLinks, profile } from '../data/resume'
import { scrollToSection } from '../hooks/useSmoothScroll'
import { useActiveSection } from '../hooks/usePointer'
import { Magnetic } from './ui/Magnetic'
import { EASE } from '../lib/motion'

export default function Navbar() {
  const ids = useMemo(() => navLinks.map((l) => l.id), [])
  const active = useActiveSection(ids)
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))

  /**
   * Lock scrolling while the mobile sheet is open.
   *
   * Deliberately NOT `body { overflow: hidden }` — body overflow propagates to
   * the viewport, and several browsers reset scrollTop to 0 when that happens,
   * so the page silently jumps to the top when the menu closes. Pausing Lenis
   * stops wheel/touch scrolling without touching layout; the `overflow` route
   * is only used as a fallback when Lenis is off (reduced motion), and even
   * then the scroll offset is captured and restored by hand.
   */
  useEffect(() => {
    const lenis = window.__lenis

    if (lenis) {
      if (open) lenis.stop()
      else lenis.start()
      return () => lenis.start()
    }

    if (!open) return
    const y = window.scrollY
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      window.scrollTo(0, y)
    }
  }, [open])

  const go = (id) => {
    setOpen(false)
    // Let the sheet close before scrolling so the two don't fight
    setTimeout(() => scrollToSection(id), open ? 220 : 0)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-[70] px-4 pt-4 sm:px-6"
      >
        <nav
          className={`container-x flex items-center justify-between rounded-full border transition-all duration-500 ${
            scrolled
              ? 'border-sage/10 bg-ink/70 py-2.5 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl'
              : 'border-transparent bg-transparent py-4'
          }`}
        >
          {/* Monogram */}
          <button
            onClick={() => go('home')}
            data-cursor="hover"
            className="group flex items-center gap-2.5"
            aria-label="Back to top"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-accent/40 bg-accent/10 font-display text-sm font-bold text-accent">
              OB
              <span className="absolute inset-0 rounded-xl bg-accent/30 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-tight text-white sm:block">
              {profile.name}
            </span>
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => go(link.id)}
                  data-cursor="hover"
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    active === link.id ? 'text-white' : 'text-sage/70 hover:text-white'
                  }`}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-accent/30 bg-accent/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Magnetic strength={0.3}>
              <a
                href={`mailto:${profile.email}`}
                data-cursor="hover"
                className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink transition-all duration-300 hover:bg-accent-soft hover:shadow-glow sm:inline-block"
              >
                Let's talk
              </a>
            </Magnetic>

            {/* Burger */}
            <button
              onClick={() => setOpen((v) => !v)}
              data-cursor="hover"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-sage/15 md:hidden"
            >
              <motion.span
                className="absolute h-px w-4 bg-white"
                animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                transition={{ duration: 0.3, ease: EASE }}
              />
              <motion.span
                className="absolute h-px w-4 bg-white"
                animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                transition={{ duration: 0.3, ease: EASE }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[65] bg-ink/95 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.ul
              className="flex h-full flex-col items-center justify-center gap-2"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
            >
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  variants={{
                    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
                    show: { opacity: 1, y: 0, filter: 'blur(0px)' },
                  }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <button
                    onClick={() => go(link.id)}
                    className="flex items-baseline gap-4 px-6 py-3 font-display text-3xl font-bold tracking-tight text-white"
                  >
                    <span className="font-mono text-xs text-accent">
                      0{i + 1}
                    </span>
                    {link.label}
                  </button>
                </motion.li>
              ))}
              <motion.li
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="mt-8"
              >
                <a
                  href={`mailto:${profile.email}`}
                  className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-ink"
                >
                  {profile.email}
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
