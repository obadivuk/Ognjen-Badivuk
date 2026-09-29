import { useRef } from 'react'
import { motion, useScroll, useSpring, useInView } from 'framer-motion'
import { experience } from '../data/resume'
import SectionHeading from './ui/SectionHeading'
import { EASE, viewport } from '../lib/motion'

function Node({ active }) {
  return (
    <span className="relative grid h-4 w-4 place-items-center">
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-accent bg-ink"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={viewport}
        transition={{ type: 'spring', stiffness: 380, damping: 20 }}
      />
      <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
      {active && (
        <span className="absolute inset-0 animate-ping rounded-full border border-accent/60" />
      )}
    </span>
  )
}

function Bullet({ text, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: 18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewport}
      transition={{ duration: 0.6, ease: EASE, delay: 0.1 + index * 0.07 }}
      className="group flex gap-3.5"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="mt-[7px] h-3 w-3 shrink-0 stroke-accent/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:stroke-accent"
        strokeWidth="2.5"
      >
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-sm leading-relaxed text-sage/75 transition-colors duration-300 group-hover:text-white/90">
        {text}
      </span>
    </motion.li>
  )
}

function TimelineEntry({ job, i }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
      className="relative pl-10 sm:pl-16"
    >
      {/* Node sits on the rail */}
      <div className="absolute left-0 top-2 sm:left-[22px]">
        <Node active={job.current} />
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-sage/10 bg-surface/55 p-6 backdrop-blur-xl transition-all duration-500 hover:border-accent/35 hover:bg-surface/85 hover:shadow-glow sm:p-8">
        {/* Hover wash */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.07] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {job.role}
                </h3>
                {job.current && (
                  <span className="rounded-full border border-accent/40 bg-accent/15 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                    Current
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm font-medium text-accent">{job.company}</p>
            </div>
            <p className="shrink-0 font-mono text-xs text-sage/50">{job.period}</p>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-sage/70">{job.blurb}</p>

          <ul className="mt-6 space-y-3.5">
            {job.points.map((p, k) => (
              <Bullet key={k} text={p} index={k} />
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-2 border-t border-sage/10 pt-5">
            {job.stack.map((tech, k) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewport}
                transition={{ duration: 0.4, ease: EASE, delay: k * 0.05 }}
                className="rounded-md border border-sage/10 bg-ink/60 px-2.5 py-1 font-mono text-[11px] text-sage/70 transition-colors duration-300 hover:border-accent/40 hover:text-accent"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function Experience() {
  const railRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 0.7', 'end 0.7'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  return (
    <section id="experience" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="02"
          eyebrow="Experience"
          title="Three years, one mission: data that arrives."
          subtitle="From 200+ scrapers as a junior to architecting the framework they all run on."
        />

        <div ref={railRef} className="relative">
          {/* Static rail */}
          <div className="absolute left-[7px] top-2 h-full w-px bg-sage/10 sm:left-[29px]" />
          {/* Progress rail that draws itself as you scroll */}
          <motion.div
            className="absolute left-[7px] top-2 h-full w-px origin-top bg-gradient-to-b from-accent via-accent to-accent/0 sm:left-[29px]"
            style={{ scaleY }}
          />

          <div className="space-y-10 sm:space-y-14">
            {experience.map((job, i) => (
              <TimelineEntry key={`${job.company}-${job.role}`} job={job} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
