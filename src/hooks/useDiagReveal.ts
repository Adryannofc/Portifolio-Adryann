import { useEffect, useState, useCallback } from 'react'

export function useDiagReveal<T extends HTMLElement>(delay = 0) {
  const [node, setNode] = useState<T | null>(null)

  const ref = useCallback((el: T | null) => {
    setNode(el)
  }, [])

  useEffect(() => {
    if (!node) return
    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            node.setAttribute('data-revealed', 'true')
            obs.disconnect()
          }
        },
        { threshold: 0.10 }
      )
      obs.observe(node)
    }, delay)
    return () => clearTimeout(timer)
  }, [node, delay])

  return ref
}
