import { motion } from 'framer-motion'
import { projects } from '../data/resume'
import SectionHeading from './ui/SectionHeading'
import TiltCard from './ui/TiltCard'
import { EASE, viewport } from '../lib/motion'

function ProjectCard({ p, featured }) {
  return (
    <TiltCard
      className="group h-full"
      max={featured ? 7 : 9}
      data-cursor="hover"
    >
      <div className="flex h-full flex-col p-7 sm:p-8">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-xs text-accent/60">{p.index}</span>
          <span className="rounded-full border border-sage/12 bg-ink/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-sage/55">
            {p.context}
          </span>
        </div>

        <h3
          className={`mt-6 font-display font-bold leading-tight tracking-tight text-white ${
            featured ? 'text-2xl sm:text-3xl' : 'text-xl'
          }`}
        >
          {p.name}
        </h3>
        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-accent/80">
          {p.role}
        </p>

        <p className="mt-5 text-sm leading-relaxed text-sage/70">{p.description}</p>

        {/* Metrics */}
        <div className="mt-7 flex flex-wrap gap-x-7 gap-y-4">
          {p.metrics.map((m) => (
            <div key={m.k}>
              <p className="font-display text-lg font-bold text-white">{m.k}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-sage/45">
                {m.v}
              </p>
            </div>
          ))}
        </div>

        {/* Tags pinned to the bottom */}
        <div className="mt-auto flex flex-wrap gap-2 pt-7">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-sage/10 bg-ink/50 px-2.5 py-1 font-mono text-[11px] text-sage/65 transition-colors duration-300 hover:border-accent/40 hover:text-accent"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom accent line that widens on hover */}
      <span className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-accent to-transparent transition-all duration-700 group-hover:w-full" />
    </TiltCard>
  )
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="03"
          eyebrow="Featured Work"
          title="Systems, not screenshots."
          subtitle="Backend work rarely has a pretty UI — so here's what it actually does, measured."
        />

        {/* Featured pair */}
        <motion.div
          className="grid gap-6 lg:grid-cols-2"
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={{ show: { transition: { staggerChildren: 0.14 } } }}
        >
          {featured.map((p) => (
            <motion.div
              key={p.index}
              variants={{
                hidden: { opacity: 0, y: 48, rotateX: -10 },
                show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.95, ease: EASE } },
              }}
            >
              <ProjectCard p={p} featured />
            </motion.div>
          ))}
        </motion.div>

        {/* Supporting grid */}
        <motion.div
          className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
        >
          {rest.map((p) => (
            <motion.div
              key={p.index}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.85, ease: EASE } },
              }}
            >
              <ProjectCard p={p} />
            </motion.div>
          ))}
        </motion.div>

        {/* Footnote — these are derived from CV achievements, not public repos */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 text-center font-mono text-[11px] text-sage/35"
        >
          Work delivered inside private production systems at Better Collective.
        </motion.p>
      </div>
    </section>
  )
}
