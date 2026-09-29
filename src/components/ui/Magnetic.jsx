import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { SPRING_SNAPPY } from '../../lib/motion'

/**
 * Magnetic wrapper — the element leans toward the cursor while it's nearby and
 * springs home on leave. Inner content moves slightly further than the shell,
 * which is what sells the effect.
 */
export function Magnetic({ children, strength = 0.35, innerStrength = 0.6, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, SPRING_SNAPPY)
  const sy = useSpring(y, SPRING_SNAPPY)

  const ix = useMotionValue(0)
  const iy = useMotionValue(0)
  const six = useSpring(ix, { stiffness: 350, damping: 30 })
  const siy = useSpring(iy, { stiffness: 350, damping: 30 })

  const handleMove = (e) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    x.set(dx * strength)
    y.set(dy * strength)
    ix.set(dx * (innerStrength - strength))
    iy.set(dy * (innerStrength - strength))
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
    ix.set(0)
    iy.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      <motion.div style={{ x: six, y: siy }}>{children}</motion.div>
    </motion.div>
  )
}

/**
 * The site's primary call-to-action: magnetic, with a green glow that blooms
 * on hover and a sheen that sweeps across the label.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  type = 'button',
  className = '',
  download = false,
  ...rest
}) {
  const base =
    'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300'

  const variants = {
    solid: 'bg-accent text-ink hover:bg-accent-soft',
    outline: 'border border-sage/25 bg-white/[0.02] text-white hover:border-accent/70 hover:text-white',
    ghost: 'text-sage hover:text-white',
  }

  const content = (
    <>
      {/* Bloom that grows from the centre on hover */}
      <span className="pointer-events-none absolute inset-0 -z-10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 bg-accent/60" />
      {/* Sweeping sheen */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </>
  )

  const cls = `${base} ${variants[variant]} ${className}`

  return (
    <Magnetic strength={0.28} innerStrength={0.45}>
      {href ? (
        <motion.a
          href={href}
          onClick={onClick}
          data-cursor="hover"
          className={cls}
          whileTap={{ scale: 0.96 }}
          {...(download ? { download: true } : {})}
          {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
          {...rest}
        >
          {content}
        </motion.a>
      ) : (
        <motion.button
          type={type}
          onClick={onClick}
          data-cursor="hover"
          className={cls}
          whileTap={{ scale: 0.96 }}
          {...rest}
        >
          {content}
        </motion.button>
      )}
    </Magnetic>
  )
}
