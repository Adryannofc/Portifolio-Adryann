import { useEffect, useRef } from 'react'

export function useDiagReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.setAttribute('data-revealed', 'true')
            obs.disconnect()
          }
        },
        { threshold: 0.10 }
      )
      obs.observe(el)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return ref
}
