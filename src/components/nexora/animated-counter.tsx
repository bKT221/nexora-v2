'use client'

import { useEffect, useRef } from 'react'
import {
  useMotionValue,
  useTransform,
  animate,
  motion,
} from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  decimals?: number
}

function formatNumber(num: number, decimals: number = 0): string {
  const fixed = num.toFixed(decimals)
  const parts = fixed.split('.')
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F')
  return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart
}

export default function AnimatedCounter({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const motionVal = useMotionValue(0)
  const display = useTransform(motionVal, (latest) => {
    return `${prefix}${formatNumber(latest, decimals)}${suffix}`
  })
  const nodeRef = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const controls = animate(motionVal, value, {
      duration: duration / 1000,
      ease: [0.25, 0.46, 0.45, 0.94],
    })

    return () => controls.stop()
  }, [value, duration, motionVal])

  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = latest
      }
    })
    return () => unsubscribe()
  }, [display])

  return (
    <motion.span
      ref={nodeRef}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {prefix}0{suffix}
    </motion.span>
  )
}
