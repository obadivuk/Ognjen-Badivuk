import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { summary, stats, education, certifications, profile } from '../data/resume'
import SectionHeading from './ui/SectionHeading'
import Reveal, { RevealItem } from './ui/Reveal'
import Counter from './ui/Counter'
import { EASE, viewport } from '../lib/motion'

/** Splits the summary into words that fade from sage → white as you scroll. */
function ScrollLitText({ text }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.25'],
  })

  const words = text.split(' ')

  return (
    <p ref={ref} className="text-lg leading-[1.75] text-sage/35 sm:text-xl">
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1.6) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  )
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.22, 1])
  const color = useTransform(progress, range, ['#A3C1AD', '#FFFFFF'])
  return (
    <motion.span style={{ opacity, color }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  )
}

export default function About() {
  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="01"
          eyebrow="About"
          title="Reliability is a feature."
          subtitle="Pipelines that run every day only earn trust when they fail loudly, recover quietly, and stay readable a year later."
        />

        <div className="grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          {/* Summary */}
          <div>
            <ScrollLitText text={summary} />

            {/*
              Stats — a 2×2 block, deliberately not 4-up. This sits in the
              narrow (1.35fr) column of the About split, which is ~579px at the
              max container width; four tracks leave 103px of content per cell
              and the widest figure, "40,000+", needs 138px. It would overflow
              straight into this container's `overflow-hidden`.
            */}
            <Reveal stagger staggerAmount={0.1} className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-sage/10 bg-sage/10">
              {stats.map((s) => (
                <RevealItem
                  key={s.label}
                  className="group relative bg-ink/90 p-5 transition-colors duration-500 hover:bg-surface"
                >
                  <div className="absolute inset-0 bg-accent/0 transition-colors duration-500 group-hover:bg-accent/[0.06]" />
                  {/* tabular-nums keeps the box a constant width while the
                      digits count up, instead of jittering on every frame. */}
                  <p className="relative font-display text-2xl font-bold tabular-nums text-white sm:text-3xl">
                    <Counter value={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} />
                  </p>
                  <p className="relative mt-2 text-xs leading-snug text-sage/60">{s.label}</p>
                </RevealItem>
              ))}
            </Reveal>
          </div>

          {/* Side rail: education + certifications */}
          <div className="space-y-10">
            <Reveal>
              <h3 className="eyebrow mb-5">Education</h3>
              <ul className="space-y-4">
                {education.map((e, i) => (
                  <motion.li
                    key={e.degree}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewport}
                    transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
                    className="group relative rounded-xl border border-sage/10 bg-surface/50 p-4 backdrop-blur-sm transition-all duration-500 hover:border-accent/40 hover:bg-surface"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-display text-sm font-semibold leading-snug text-white">
                        {e.degree}
                      </p>
                      {e.status === 'In Progress' && (
                        <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                          Ongoing
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-sage/60">{e.school}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-sage/40">{e.period}</p>
                  </motion.li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="eyebrow mb-5">Certifications</h3>
              <ul className="space-y-3">
                {certifications.map((c, i) => (
                  <motion.li
                    key={c.name}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewport}
                    transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <div>
                      <p className="text-sm leading-snug text-white/90">{c.name}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-sage/45">{c.issuer}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.09] to-transparent p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Based in</p>
                <p className="mt-2 font-display text-xl font-bold text-white">{profile.location}</p>
                <p className="mt-1.5 text-xs text-sage/60">
                  Working with distributed teams across data, product and platform.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
