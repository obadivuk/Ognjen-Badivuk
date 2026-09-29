import { motion } from 'framer-motion'
import { fadeUp, staggerParent, viewport } from '../../lib/motion'

/**
 * Scroll-triggered reveal. Wrap anything.
 *
 * <Reveal delay={0.1}>…</Reveal>
 * <Reveal stagger>…children each animate in sequence…</Reveal>
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  duration = 0.8,
  stagger = false,
  staggerAmount = 0.08,
  className = '',
  as = 'div',
  ...rest
}) {
  const MotionTag = motion[as] || motion.div

  if (stagger) {
    return (
      <MotionTag
        className={className}
        variants={staggerParent(staggerAmount, delay)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        {...rest}
      >
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      className={className}
      variants={fadeUp(y, duration)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/** Child of a <Reveal stagger> parent. */
export function RevealItem({ children, className = '', y = 24, as = 'div', ...rest }) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag className={className} variants={fadeUp(y)} {...rest}>
      {children}
    </MotionTag>
  )
}
