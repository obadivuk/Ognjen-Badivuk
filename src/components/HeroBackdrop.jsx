import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import { profile } from '../data/resume'

/**
 * The original full photograph, used as a barely-there parallax plate behind
 * everything in the hero. It drifts slower than the page and scales up a
 * touch, so the hero reads as two depth planes rather than one flat panel.
 *
 * Kept deliberately faint: blurred, desaturated, tinted toward the accent
 * green and feathered away at every edge so no hard rectangle is ever visible.
 */
export default function HeroBackdrop({ targetRef }) {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  })

  const yRaw = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1.08, 1.22])
  const y = useSpring(yRaw, { stiffness: 90, damping: 26, restDelta: 0.001 })
  const scale = useSpring(scaleRaw, { stiffness: 90, damping: 26, restDelta: 0.001 })

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y, scale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
      >
        <img
          src={profile.backdrop}
          srcSet={`${profile.backdropSmall} 1100w, ${profile.backdrop} 2000w`}
          sizes="100vw"
          alt=""
          role="presentation"
          decoding="async"
          loading="eager"
          className="h-full w-full object-cover object-center opacity-[0.14] blur-[3px] saturate-[0.45] contrast-[1.05] sm:opacity-[0.16] sm:blur-[2px]"
          style={{
            // Feather every edge so the photo dissolves into the page
            WebkitMaskImage:
              'radial-gradient(120% 95% at 55% 42%, #000 18%, rgba(0,0,0,0.55) 48%, transparent 78%)',
            maskImage:
              'radial-gradient(120% 95% at 55% 42%, #000 18%, rgba(0,0,0,0.55) 48%, transparent 78%)',
          }}
        />
      </motion.div>

      {/* Green duotone wash — pulls the office photo into the palette */}
      <div className="absolute inset-0 bg-accent/[0.07] mix-blend-color" />
      {/* Darkening scrim so hero copy always clears contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/35 to-ink/80 lg:via-transparent" />
    </div>
  )
}
