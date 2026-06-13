import { useState, useEffect, useCallback } from 'react'

interface Options {
  duration?: number
  delay?: number
  decimals?: number
}

export function useCountUp<T extends Element = Element>(
  target: number,
  { duration = 1200, delay = 0, decimals = 0 }: Options = {}
) {
  const [node, setNode] = useState<T | null>(null)
  const [value, setValue] = useState(0)
  const ref = useCallback((el: T | null) => setNode(el), [])

  useEffect(() => {
    if (!node) return
    let timerId: ReturnType<typeof setTimeout>
    let rafId: number

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()
        timerId = setTimeout(() => {
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - (1 - p) ** 3
            setValue(parseFloat((eased * target).toFixed(decimals)))
            if (p < 1) rafId = requestAnimationFrame(tick)
            else setValue(target)
          }
          rafId = requestAnimationFrame(tick)
        }, delay)
      },
      { threshold: 0.1 }
    )

    obs.observe(node)
    return () => {
      obs.disconnect()
      clearTimeout(timerId)
      cancelAnimationFrame(rafId)
    }
  }, [node, target, duration, delay, decimals])

  return { value, ref }
}
