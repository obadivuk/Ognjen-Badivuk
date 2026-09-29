import { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion'

/**
 * 3D tilt card with a cursor-tracking spotlight and a glowing accent border.
 * The spotlight is a radial gradient positioned from the same motion values
 * that drive the rotation, so the highlight always sits under the cursor.
 */
export default function TiltCard({
  children,
  className = '',
  max = 9,
  scale = 1.02,
  spotlight = true,
  glow = true,
  ...rest
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [hovered, setHovered] = useState(false)

  // Normalised pointer position, -0.5 → 0.5
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  // Raw pixel position for the spotlight
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const spring = { stiffness: 220, damping: 22, mass: 0.6 }
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring)

  const spotX = useSpring(mx, { stiffness: 300, damping: 30 })
  const spotY = useSpring(my, { stiffness: 300, damping: 30 })
  const spotlightBg = useMotionTemplate`radial-gradient(420px circle at ${spotX}px ${spotY}px, rgba(78,159,61,0.16), transparent 62%)`

  const handleMove = (e) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const localX = e.clientX - rect.left
    const localY = e.clientY - rect.top
    px.set(localX / rect.width - 0.5)
    py.set(localY / rect.height - 0.5)
    mx.set(localX)
    my.set(localY)
  }

  const handleLeave = () => {
    setHovered(false)
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{ perspective: 1100 }}
      className={className}
      {...rest}
    >
      <motion.div
        style={{
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{ scale: hovered && !reduced ? scale : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className={`relative h-full rounded-2xl ${glow ? 'glow-border' : ''}`}
      >
        {/* Ambient green halo behind the card on hover */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-accent/20 blur-3xl"
          animate={{ opacity: hovered && !reduced ? 1 : 0 }}
          transition={{ duration: 0.45 }}
        />

        <div className="relative h-full overflow-hidden rounded-2xl border border-sage/10 bg-surface/80 backdrop-blur-xl shadow-card">
          {spotlight && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{ background: spotlightBg }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
          )}
          <div className="relative z-[2] h-full" style={{ transform: 'translateZ(28px)' }}>
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
