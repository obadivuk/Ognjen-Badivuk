/**
 * Shared easing curves + animation variants so every section moves with the
 * same "personality". Tweak here and the whole site re-times together.
 */

export const EASE = [0.16, 1, 0.3, 1] // expo-out — the signature curve of the site
export const EASE_SOFT = [0.25, 0.46, 0.45, 0.94]

export const SPRING = { type: 'spring', stiffness: 260, damping: 28, mass: 0.9 }
export const SPRING_SOFT = { type: 'spring', stiffness: 120, damping: 20, mass: 1 }
export const SPRING_SNAPPY = { type: 'spring', stiffness: 420, damping: 32, mass: 0.6 }

/** Parent that staggers its children in. */
export const staggerParent = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})

/** Rise + fade — the default reveal. */
export const fadeUp = (y = 28, duration = 0.8) => ({
  hidden: { opacity: 0, y, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration, ease: EASE },
  },
})

export const fadeIn = (duration = 0.9) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration, ease: EASE } },
})

export const slideIn = (from = 'left', distance = 60) => ({
  hidden: {
    opacity: 0,
    x: from === 'left' ? -distance : from === 'right' ? distance : 0,
    y: from === 'up' ? distance : from === 'down' ? -distance : 0,
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
})

/** Card entrance with a subtle 3D tip-up. */
export const card3D = {
  hidden: { opacity: 0, y: 40, rotateX: -12, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: 0.9, ease: EASE },
  },
}

/**
 * Per-character hero typography.
 *
 * `transformPerspective` is used instead of a `perspective` style on a
 * wrapper element on purpose: a wrapper with `perspective` gets its own paint
 * layer, which silently breaks `background-clip: text` on any ancestor — the
 * gradient name renders completely invisible. Baking the perspective into the
 * character's own transform keeps the 3D tip-up without that side effect.
 */
export const charReveal = {
  hidden: { opacity: 0, y: '0.6em', rotateX: -70, transformPerspective: 800 },
  show: (i = 0) => ({
    opacity: 1,
    y: '0em',
    rotateX: 0,
    transformPerspective: 800,
    transition: { duration: 0.85, ease: EASE, delay: 0.25 + i * 0.035 },
  }),
}

/** Standard viewport config — fires once, slightly before the element is centred. */
export const viewport = { once: true, amount: 0.25, margin: '0px 0px -80px 0px' }
export const viewportEarly = { once: true, amount: 0.1, margin: '0px 0px -40px 0px' }
