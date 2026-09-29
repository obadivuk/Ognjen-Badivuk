import { motion, useScroll, useSpring } from 'framer-motion'

/** Hairline progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[80] h-[2px] w-full origin-left bg-gradient-to-r from-accent-deep via-accent to-accent-soft shadow-[0_0_14px_rgba(78,159,61,0.8)]"
      style={{ scaleX }}
    />
  )
}
