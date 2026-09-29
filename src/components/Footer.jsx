import { motion } from 'framer-motion'
import { profile, navLinks } from '../data/resume'
import { scrollToSection } from '../hooks/useSmoothScroll'
import { Magnetic } from './ui/Magnetic'
import { EASE, viewport } from '../lib/motion'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-sage/10 pb-10 pt-16">
      <div className="container-x">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.7, ease: EASE }}
              className="font-display text-lg font-bold tracking-tight text-white"
            >
              {profile.name}
            </motion.p>
            <p className="mt-1.5 font-mono text-xs text-sage/45">
              {profile.title} · {profile.location}
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToSection(l.id)}
                data-cursor="hover"
                className="font-mono text-xs text-sage/50 transition-colors duration-300 hover:text-accent"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <Magnetic strength={0.3}>
            <button
              onClick={() => scrollToSection('home')}
              data-cursor="hover"
              aria-label="Back to top"
              className="group grid h-12 w-12 place-items-center rounded-full border border-sage/15 transition-all duration-500 hover:border-accent/60 hover:shadow-glow"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                className="h-4 w-4 stroke-sage transition-all duration-300 group-hover:-translate-y-0.5 group-hover:stroke-accent"
              >
                <path d="M12 19V5M6 11l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </Magnetic>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-sage/10 pt-6 sm:flex-row">
          <p className="font-mono text-[11px] text-sage/30">
            © {year} {profile.name}. Built with React, Tailwind & Framer Motion.
          </p>
          <p className="font-mono text-[11px] text-sage/30">
            Designed &amp; engineered in {profile.location}.
          </p>
        </div>
      </div>
    </footer>
  )
}
