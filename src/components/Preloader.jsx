import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { profile } from '../data/resume'
import { EASE } from '../lib/motion'

/**
 * Brief entry curtain: counts to 100, then wipes away upward to reveal the
 * hero. Skipped entirely under prefers-reduced-motion.
 */
export default function Preloader({ onDone }) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(!reduced)

  useEffect(() => {
    if (reduced) {
      onDone?.()
      return
    }

    let raf
    const start = performance.now()
    const DURATION = 1400

    const tick = (t) => {
      const p = Math.min((t - start) / DURATION, 1)
      // ease-out so the last numbers slow down
      setProgress(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        setTimeout(() => {
          setVisible(false)
          onDone?.()
        }, 260)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink"
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: EASE }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-center"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
              {profile.title}
            </p>
            <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {profile.name}
            </p>
          </motion.div>

          <div className="mt-10 h-px w-56 overflow-hidden bg-sage/15">
            <motion.div
              className="h-full bg-accent"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-4 font-mono text-xs tabular-nums text-sage/40">
            {String(progress).padStart(3, '0')}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
