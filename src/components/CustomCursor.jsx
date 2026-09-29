import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useIsTouch } from '../hooks/usePointer'

/**
 * Two-part cursor: a hard dot that tracks 1:1 and a soft ring that lags behind
 * on a spring. Anything with `data-cursor="hover"` expands the ring;
 * `data-cursor="view"` swaps it for a labelled disc.
 */
export default function CustomCursor() {
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const enabled = !isTouch && !reduced

  const [variant, setVariant] = useState('default')
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  const dotX = useSpring(x, { stiffness: 1100, damping: 60, mass: 0.25 })
  const dotY = useSpring(y, { stiffness: 1100, damping: 60, mass: 0.25 })
  const ringX = useSpring(x, { stiffness: 170, damping: 20, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 170, damping: 20, mass: 0.6 })

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('has-custom-cursor')
      return
    }
    document.body.classList.add('has-custom-cursor')

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)

      const target = e.target instanceof Element ? e.target.closest('[data-cursor]') : null
      if (target) {
        const mode = target.getAttribute('data-cursor')
        setVariant(mode)
        setLabel(target.getAttribute('data-cursor-label') || '')
      } else {
        setVariant('default')
        setLabel('')
      }
    }

    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [enabled, visible, x, y])

  if (!enabled) return null

  const ringSize =
    variant === 'view' ? 78 : variant === 'hover' ? 54 : variant === 'text' ? 4 : 32

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {/* Lagging ring */}
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-accent/70"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          backdropFilter: variant === 'view' ? 'blur(2px)' : 'none',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
          backgroundColor:
            variant === 'view'
              ? 'rgba(78,159,61,0.92)'
              : variant === 'hover'
              ? 'rgba(78,159,61,0.12)'
              : 'rgba(78,159,61,0)',
          borderColor: variant === 'text' ? 'rgba(163,193,173,0.8)' : 'rgba(78,159,61,0.7)',
          scale: pressed ? 0.82 : 1,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        <AnimatePresence>
          {variant === 'view' && label && (
            <motion.span
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Precise dot */}
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-accent"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: variant === 'view' ? 0 : variant === 'text' ? 2 : 6,
          height: variant === 'view' ? 0 : variant === 'text' ? 22 : 6,
          borderRadius: variant === 'text' ? 2 : 999,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
    </div>
  )
}
