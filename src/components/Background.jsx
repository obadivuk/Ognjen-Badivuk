import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { isTouchDevice } from '../hooks/usePointer'

/**
 * The atmosphere layer, drawn on one canvas:
 *
 *  1. A dot grid that brightens and swells within a radius of the cursor.
 *  2. Slow-drifting particles that connect to nearby neighbours with faint
 *     accent-green lines when they cluster.
 *
 * Everything is sized to devicePixelRatio and throttled to the display's own
 * refresh via rAF. The canvas sits behind all content and never intercepts
 * pointer events.
 *
 * On touch devices there is no cursor to react to, so a single static frame
 * is drawn instead of a 60fps loop — it keeps the main thread free for
 * scrolling and stops every translucent card above from re-compositing.
 */
export default function Background() {
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let width = 0
    let height = 0
    let dpr = 1
    let particles = []
    let frame
    let running = true

    const pointer = { x: -9999, y: -9999, active: false }
    const GRID = 42
    const INFLUENCE = 170

    const resize = () => {
      const prevWidth = width
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Mobile browsers fire height-only resizes as the URL bar shows/hides
      // during scroll; reseeding then would make the particles jump.
      if (width !== prevWidth) seedParticles()
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      drawGrid()
      drawParticles()
    }

    const seedParticles = () => {
      // Density scales with viewport area, capped so phones stay smooth.
      const count = Math.min(Math.round((width * height) / 26000), 70)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.7 + 0.5,
        a: Math.random() * 0.35 + 0.12,
      }))
    }

    const drawGrid = () => {
      const cols = Math.ceil(width / GRID) + 1
      const rows = Math.ceil(height / GRID) + 1

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const gx = i * GRID
          const gy = j * GRID

          let intensity = 0
          if (pointer.active) {
            const dx = gx - pointer.x
            const dy = gy - pointer.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < INFLUENCE) intensity = 1 - dist / INFLUENCE
          }

          const radius = 0.9 + intensity * 2.1
          const alpha = 0.06 + intensity * 0.62

          ctx.beginPath()
          ctx.arc(gx, gy, radius, 0, Math.PI * 2)
          ctx.fillStyle =
            intensity > 0.02
              ? `rgba(78, 159, 61, ${alpha})`
              : `rgba(163, 193, 173, ${alpha})`
          ctx.fill()
        }
      }
    }

    const drawParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy

        // Wrap around the edges
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20

        // Gentle attraction toward the cursor
        if (pointer.active) {
          const dx = pointer.x - p.x
          const dy = pointer.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 220 && dist > 1) {
            p.x += (dx / dist) * 0.25
            p.y += (dy / dist) * 0.25
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(163, 193, 173, ${p.a})`
        ctx.fill()

        // Constellation lines between close neighbours
        for (let k = i + 1; k < particles.length; k++) {
          const q = particles[k]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d2 = dx * dx + dy * dy
          if (d2 < 15000) {
            const alpha = (1 - d2 / 15000) * 0.16
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(78, 159, 61, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
    }

    const render = () => {
      if (!running) return
      ctx.clearRect(0, 0, width, height)
      drawGrid()
      drawParticles()
      frame = requestAnimationFrame(render)
    }

    const onPointerMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
    }
    const onPointerLeave = () => {
      pointer.active = false
    }
    const onVisibility = () => {
      running = !document.hidden
      if (running) frame = requestAnimationFrame(render)
      else cancelAnimationFrame(frame)
    }

    const animate = !reduced && !isTouchDevice()
    const onResize = () => {
      resize()
      if (!animate) drawStatic()
    }

    resize()

    if (!animate) {
      drawStatic()
    } else {
      frame = requestAnimationFrame(render)
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.addEventListener('pointerleave', onPointerLeave)
      document.addEventListener('visibilitychange', onVisibility)
    }

    window.addEventListener('resize', onResize)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink noise">
      {/*
        Static aurora blobs. Radial gradients rather than `blur()` on solid
        discs: a 150px blur on a 600px element needs a backing store several
        times its size at device pixel ratio, and iOS Safari kills the tab
        when a page's layers exceed its memory budget.
      */}
      <div className="absolute left-[-24rem] top-[-28%] h-[64rem] w-[64rem] bg-[radial-gradient(closest-side,rgba(78,159,61,0.07),transparent)]" />
      <div className="absolute right-[-38rem] top-[8%] h-[76rem] w-[76rem] bg-[radial-gradient(closest-side,rgba(47,107,36,0.10),transparent)]" />
      <div className="absolute bottom-[-36%] left-[10%] h-[60rem] w-[60rem] bg-[radial-gradient(closest-side,rgba(163,193,173,0.04),transparent)]" />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Vignette so content always wins against the grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#111613_92%)]" />
    </div>
  )
}
