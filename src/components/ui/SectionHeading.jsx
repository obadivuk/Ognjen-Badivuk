import { motion } from 'framer-motion'
import { EASE, viewport } from '../../lib/motion'

/**
 * Consistent section header: monospace index + eyebrow, large display title,
 * and a hairline rule that draws itself across on entry.
 */
export default function SectionHeading({ index, eyebrow, title, subtitle, align = 'left' }) {
  const centered = align === 'center'

  return (
    <div className={`mb-14 sm:mb-20 ${centered ? 'text-center' : ''}`}>
      <motion.div
        className={`flex items-center gap-4 ${centered ? 'justify-center' : ''}`}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {index && <span className="font-mono text-xs text-accent/70">{index}</span>}
        <span className="eyebrow">{eyebrow}</span>
        <motion.span
          aria-hidden
          className="h-px flex-1 origin-left bg-gradient-to-r from-accent/60 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewport}
          transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          style={{ maxWidth: centered ? 120 : undefined }}
        />
      </motion.div>

      <motion.h2
        className={`mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl ${
          centered ? 'mx-auto' : ''
        }`}
        initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={viewport}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      >
        <span className="text-gradient">{title}</span>
      </motion.h2>

      {subtitle && (
        <motion.p
          className={`mt-5 max-w-2xl text-base leading-relaxed text-sage/80 sm:text-lg ${
            centered ? 'mx-auto' : ''
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.8, ease: EASE, delay: 0.22 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
