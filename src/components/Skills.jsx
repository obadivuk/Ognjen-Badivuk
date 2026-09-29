import { motion } from 'framer-motion'
import { skills, marqueeSkills } from '../data/resume'
import SectionHeading from './ui/SectionHeading'
import { EASE, viewport } from '../lib/motion'

const ICONS = {
  code: (
    <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  layers: (
    <>
      <path d="M12 2l9 5-9 5-9-5 9-5z" strokeLinejoin="round" />
      <path d="M3 12l9 5 9-5M3 17l9 5 9-5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  tool: (
    <path
      d="M14.7 6.3a4 4 0 01-5 5L4 17v3h3l5.7-5.7a4 4 0 015-5l2.6-2.6-2.6-2.6-2.6 2.6z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  spark: (
    <path
      d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7L12 2z"
      strokeLinejoin="round"
    />
  ),
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="8" ry="3.2" />
      <path d="M4 5.5v13c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2v-13" strokeLinecap="round" />
      <path d="M4 12c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2" strokeLinecap="round" />
    </>
  ),
}

function SkillCard({ group, i }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, rotateX: -8 },
        show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: EASE } },
      }}
      className="group relative overflow-hidden rounded-2xl border border-sage/10 bg-surface/55 p-6 backdrop-blur-xl transition-all duration-500 hover:border-accent/35 hover:bg-surface/85"
    >
      {/* Corner glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-center gap-3.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/10 transition-colors duration-500 group-hover:border-accent/60 group-hover:bg-accent/20">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-5 w-5 stroke-accent">
            {ICONS[group.icon]}
          </svg>
        </span>
        <div>
          <h3 className="font-display text-base font-semibold text-white">{group.category}</h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage/40">
            {String(group.items.length).padStart(2, '0')} items
          </p>
        </div>
      </div>

      <ul className="relative mt-6 flex flex-wrap gap-2">
        {group.items.map((item, k) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.45, ease: EASE, delay: 0.15 + i * 0.05 + k * 0.045 }}
            whileHover={{ y: -3 }}
            className="cursor-default rounded-lg border border-sage/12 bg-ink/60 px-3 py-1.5 text-xs text-sage/80 transition-colors duration-300 hover:border-accent/50 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(78,159,61,0.7)]"
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

/** Seamless infinite strip — the list is rendered twice and translated -50%. */
function Marquee() {
  const row = [...marqueeSkills, ...marqueeSkills]

  return (
    <div className="relative mt-16 overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
        {row.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="flex shrink-0 items-center gap-3 rounded-full border border-sage/10 bg-surface/40 px-5 py-2.5 font-mono text-xs text-sage/60 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="04"
          eyebrow="Toolkit"
          title="The stack behind the throughput."
          subtitle="Everything below is in daily production use — not a list of things I once read about."
        />

        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={{ show: { transition: { staggerChildren: 0.11 } } }}
          style={{ perspective: 1200 }}
        >
          {skills.map((group, i) => (
            <SkillCard key={group.category} group={group} i={i} />
          ))}

          {/* Philosophy tile fills the 6th slot */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className="relative overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/[0.12] via-surface/60 to-transparent p-6 backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-0 opacity-30 [background:repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(78,159,61,0.08)_10px,rgba(78,159,61,0.08)_11px)]" />
            <p className="relative font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              How I work
            </p>
            <p className="relative mt-4 font-display text-lg font-semibold leading-snug text-white">
              Test it, monitor it, then make it fast.
            </p>
            <p className="relative mt-3 text-sm leading-relaxed text-sage/70">
              TDD around the transformation core, validation at every boundary, and only then
              performance work — because an optimised pipeline that silently drops rows is worse
              than a slow one.
            </p>
          </motion.div>
        </motion.div>

        <Marquee />
      </div>
    </section>
  )
}
