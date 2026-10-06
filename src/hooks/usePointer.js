import { useEffect, useState } from 'react'

const TOUCH_QUERY = '(hover: none), (pointer: coarse)'

/** Synchronous check, safe to call during the first render. */
export function isTouchDevice() {
  return typeof window !== 'undefined' && window.matchMedia(TOUCH_QUERY).matches
}

/** True on devices without a precise pointer (phones, tablets). */
export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(isTouchDevice)

  useEffect(() => {
    const mq = window.matchMedia(TOUCH_QUERY)
    const update = () => setIsTouch(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isTouch
}

/** Tracks which section is currently in view, for the nav indicator. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5, 1] }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [ids])

  return active
}
