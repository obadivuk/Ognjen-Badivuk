import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { profile } from '../data/resume'
import { EASE, charReveal } from '../lib/motion'
import { MagneticButton } from './ui/Magnetic'
import { scrollToSection } from '../hooks/useSmoothScroll'
import { useIsTouch } from '../hooks/usePointer'
import Portrait from './Portrait'
import HeroBackdrop from './HeroBackdrop'

/**
 * Splits a word into per-character spans that tip up into place in sequence.
 *
 * The gradient lives on each character rather than on a shared ancestor: a
 * 3D-transformed child gets its own paint layer, and `background-clip: text`
 * on an ancestor cannot reach into it — the word renders invisible. Because
 * the ramp is vertical and every glyph shares the same line-box height, a
 * per-character gradient is pixel-identical to a per-word one.
 */
function KineticWord({ text, charClass = '', startIndex = 0 }) {
  return (
    <span className="inline-block">
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          custom={startIndex + i}
          variants={charReveal}
          initial="hidden"
          animate="show"
          className={`inline-block origin-bottom ${charClass}`}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

/** Cycles the discipline list beneath the title. */
function RotatingDiscipline() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % profile.disciplines.length), 2400)
    return () => clearInterval(id)
  }, [])

  return (
    /*
     * The mask has to be as wide as the WIDEST discipline, not the current
     * one: the words range from "PHP" to "Data Pipelines", and a fixed width
     * clips the long ones against `overflow-hidden`.
     *
     * Rather than measuring in JS — which races the webfont load and reports
     * the fallback face's metrics on first paint — every word is rendered
     * invisibly, stacked in a single grid cell. The grid track sizes itself to
     * the widest of them and the browser re-does that for free once Sora
     * loads. The visible word is absolutely positioned so it never influences
     * that width. The rotator is the last thing on its line, so the reserved
     * trailing space is not visible.
     *
     * The height/negative-margin pair is deliberate too: a 1.2em mask cuts the
     * descender off "Data Pipelines". Growing the box to 1.4em opens clipping
     * room below the baseline, and pulling 0.2em back off the bottom margin
     * keeps the inline box aligned with the text beside it — the word's own
     * baseline never moves, only the clip region gets taller.
     */
    <span className="relative inline-grid h-[1.4em] -mb-[0.2em] overflow-hidden align-bottom">
      {profile.disciplines.map((d) => (
        <span
          key={d}
          aria-hidden
          className="invisible col-start-1 row-start-1 whitespace-nowrap font-semibold"
        >
          {d}
        </span>
      ))}

      <AnimatePresence mode="wait">
        <motion.span
          key={profile.disciplines[i]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="absolute inset-0 whitespace-nowrap font-semibold text-accent"
        >
          {profile.disciplines[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const isTouch = useIsTouch()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Parallax: content drifts up and fades as you scroll past
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 220])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const blur = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(6px)'])

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20 lg:pt-24"
    >
      {/* Full original photograph as a faint, slow-moving depth plate */}
      <HeroBackdrop targetRef={ref} />

      <div className="container-x relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          {/* ── Copy ─────────────────────────────────────────────── */}
          {/* A scroll-driven filter re-rasterises the whole block every frame — too slow on phones */}
          <motion.div style={{ y: contentY, opacity, filter: isTouch ? undefined : blur }}>
            {/* Availability chip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-sage/15 bg-surface/60 py-1.5 pl-2.5 pr-4 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-sage/80">
                {profile.location} · Open to work
              </span>
            </motion.div>

            {/* Name */}
            <h1 className="font-display text-[clamp(2.9rem,8.5vw,6.2rem)] font-extrabold leading-[0.92] tracking-[-0.03em]">
              <span className="block">
                <KineticWord text={profile.firstName} charClass="char-gradient" />
              </span>{' '}
              <span className="relative block">
                <KineticWord
                  text={profile.lastName}
                  charClass="char-gradient-accent"
                  startIndex={profile.firstName.length}
                />
                {/* Underline sweep */}
                <motion.span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[3px] origin-left rounded-full bg-gradient-to-r from-accent via-accent-soft to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.4, ease: EASE, delay: 1 }}
                  style={{ width: '62%' }}
                />
              </span>
            </h1>

            {/* Title + rotating discipline */}
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}
              className="mt-7 font-display text-lg text-white/90 sm:text-xl lg:text-2xl"
            >
              {profile.title}
              {/* Separator and rotator travel together so the slash can never
                  be left dangling at the end of a wrapped line. */}
              <span className="inline-block whitespace-nowrap">
                <span className="mx-3 text-sage/30">/</span>
                <RotatingDiscipline />
              </span>
            </motion.p>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 1.1 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-sage/80 sm:text-lg"
            >
              {profile.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 1.25 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticButton onClick={() => scrollToSection('projects')} variant="solid">
                View my work
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticButton>

              <MagneticButton href={profile.resumeFile} variant="outline" download>
                Download CV
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-accent" strokeWidth="2">
                  <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticButton>
            </motion.div>

            {/* Contact strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 1.5 }}
              className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-sage/10 pt-6 font-mono text-xs text-sage/60"
            >
              <a
                href={`mailto:${profile.email}`}
                data-cursor="hover"
                className="transition-colors hover:text-accent"
              >
                {profile.email}
              </a>
              <a
                href={`tel:${profile.phone.replace(/\s/g, '')}`}
                data-cursor="hover"
                className="transition-colors hover:text-accent"
              >
                {profile.phone}
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="hover"
                className="transition-colors hover:text-accent"
              >
                {profile.linkedinLabel}
              </a>
            </motion.div>
          </motion.div>

          {/* ── Portrait ─────────────────────────────────────────── */}
          <motion.div style={{ y: portraitY, opacity }} className="order-first lg:order-last">
            <Portrait />
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.button
        onClick={() => scrollToSection('about')}
        data-cursor="hover"
        aria-label="Scroll to about"
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2.5 lg:flex"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 1.8 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage/45">Scroll</span>
        <span className="relative flex h-10 w-6 justify-center overflow-hidden rounded-full border border-sage/20">
          <motion.span
            className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent"
            animate={{ y: [0, 16, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.button>
    </section>
  )
}
