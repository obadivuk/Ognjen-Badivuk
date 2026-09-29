import { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { profile } from '../data/resume'
import { EASE } from '../lib/motion'

/**
 * The hero profile disc.
 *
 * A perfectly circular crop of the background-removed cutout, wearing a
 * glowing accent ring, two counter-rotating orbits and a continuous float.
 * The disc tilts in 3D toward the cursor; the subject inside parallaxes a
 * little further than the ring, which is what gives it depth.
 *
 * Sizing is fluid — `clamp()` on the width keeps it proportional from a
 * 320px phone up to a wide desktop without a single media query.
 */
export default function Portrait() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [failed, setFailed] = useState(false)

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 150, damping: 20, mass: 0.7 }

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [12, -12]), spring)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-16, 16]), spring)
  // The subject drifts further than the frame → parallax inside the circle
  const subjectX = useSpring(useTransform(px, [-0.5, 0.5], [-18, 18]), spring)
  const subjectY = useSpring(useTransform(py, [-0.5, 0.5], [-12, 12]), spring)

  const onMove = (e) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 1200 }}
      className="relative mx-auto w-[min(78vw,340px)] sm:w-[min(60vw,400px)] lg:w-[min(34vw,440px)]"
      initial={{ opacity: 0, scale: 0.86, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.3, ease: EASE, delay: 0.45 }}
    >
      {/* Continuous float wraps the whole assembly */}
      <motion.div
        animate={reduced ? {} : { y: [0, -16, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative aspect-square w-full"
        >
          {/* ── Orbits ─────────────────────────────────────────── */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="absolute h-[124%] w-[124%] animate-spin-slow rounded-full border border-dashed border-sage/12" />
            <div className="absolute h-[112%] w-[112%] animate-spin-slower rounded-full border border-accent/15" />
            {/* Satellite dot riding the outer orbit */}
            <div className="absolute h-[124%] w-[124%] animate-spin-slow">
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_3px_rgba(78,159,61,0.8)]" />
            </div>
          </div>

          {/* Expanding halo pulse */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="absolute h-full w-full animate-pulse-ring rounded-full border border-accent/25" />
          </div>

          {/* Ambient bloom behind the disc */}
          <div className="pointer-events-none absolute inset-[8%] rounded-full bg-accent/25 blur-[60px]" />

          {/* ── The disc ───────────────────────────────────────── */}
          <motion.div
            style={{ z: 40 }}
            className="relative h-full w-full rounded-full p-[3px]"
          >
            {/* Glowing accent ring — a rotating conic gradient behind the photo */}
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(78,159,61,0.15),#4E9F3D_25%,rgba(163,193,173,0.5)_45%,rgba(78,159,61,0.15)_70%,#4E9F3D_100%)] opacity-90 animate-spin-med" />
            {/* Soft outer glow */}
            <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_1px_rgba(78,159,61,0.45),0_0_70px_-10px_rgba(78,159,61,0.85)]" />

            {/* Photo well */}
            <div className="relative h-full w-full overflow-hidden rounded-full border border-accent/30 bg-gradient-to-b from-[#20302a] via-surface to-ink">
              {/* Inner vignette so the cutout sits on something */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(78,159,61,0.22),transparent_62%)]" />

              {!failed ? (
                <motion.img
                  src={profile.portrait}
                  srcSet={`${profile.portraitSmall} 520w, ${profile.portrait} 1000w`}
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 60vw, 34vw"
                  alt={`${profile.name} — ${profile.title}`}
                  onError={() => setFailed(true)}
                  draggable={false}
                  width={1000}
                  height={1000}
                  loading="eager"
                  decoding="async"
                  style={{ x: subjectX, y: subjectY, scale: 1.06 }}
                  className="relative h-full w-full select-none object-cover object-top drop-shadow-[0_18px_40px_rgba(0,0,0,0.6)]"
                />
              ) : (
                <PortraitPlaceholder />
              )}

              {/* Glass sheen sweeping across the top-left */}
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.09] via-transparent to-transparent" />
              {/* Bottom fade into the page */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink/70 to-transparent" />
            </div>
          </motion.div>

          {/* ── Floating stat badges ───────────────────────────── */}
          <motion.div
            className="absolute -left-2 top-[12%] hidden sm:block lg:-left-6"
            style={{ z: 110 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.25 }}
          >
            <div className="animate-float rounded-xl border border-sage/15 bg-surface/90 px-3.5 py-2.5 shadow-card backdrop-blur-xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage/60">
                Daily jobs
              </p>
              <p className="font-display text-lg font-bold text-accent">17,000+</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-2 bottom-[14%] hidden sm:block lg:-right-6"
            style={{ z: 110 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.4 }}
          >
            <div
              className="animate-float rounded-xl border border-sage/15 bg-surface/90 px-3.5 py-2.5 shadow-card backdrop-blur-xl"
              style={{ animationDelay: '1.4s' }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage/60">
                Full run
              </p>
              <p className="font-display text-lg font-bold text-accent">&lt; 3 hours</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Ground reflection */}
      <div className="pointer-events-none absolute -bottom-4 left-1/2 h-14 w-[60%] -translate-x-1/2 rounded-[100%] bg-accent/25 blur-2xl" />
    </motion.div>
  )
}

function PortraitPlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-accent/30 bg-accent/10">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 stroke-accent" strokeWidth="1.5">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20a7.5 7.5 0 0115 0" strokeLinecap="round" />
        </svg>
      </div>
      <p className="font-display text-sm font-semibold text-white">Portrait slot</p>
      <code className="rounded bg-ink/70 px-2 py-1 font-mono text-[10px] text-accent">
        public/ognjen-portrait.webp
      </code>
    </div>
  )
}
