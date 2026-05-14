'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
}

const PARTICLE_COLORS = [
  'oklch(0.6 0.2 155)', // nexora
  'oklch(0.8 0.16 80)', // gold
  'oklch(0.55 0.17 155)', // emerald
  'oklch(0.75 0.16 65)', // amber
  'oklch(0.6 0.2 155)', // nexora variant
]

const CONNECTION_DISTANCE = 140
const MAX_PARTICLES_DESKTOP = 70
const MAX_PARTICLES_MOBILE = 35

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const dimensionsRef = useRef({ width: 0, height: 0 })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 })
  const mousePosRef = useRef({ x: 0, y: 0 })

  const createParticle = useCallback((width: number, height: number): Particle => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2, // float upward
      radius: Math.random() * 2.5 + 1,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2,
    }
  }, [])

  const initParticles = useCallback(() => {
    const isMobile = dimensionsRef.current.width < 768
    const count = isMobile ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP
    particlesRef.current = []
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(
        createParticle(dimensionsRef.current.width, dimensionsRef.current.height)
      )
    }
  }, [createParticle])

  useEffect(() => {
    const unsubscribeX = smoothMouseX.on('change', (v) => {
      mousePosRef.current.x = v
    })
    const unsubscribeY = smoothMouseY.on('change', (v) => {
      mousePosRef.current.y = v
    })
    return () => {
      unsubscribeX()
      unsubscribeY()
    }
  }, [smoothMouseX, smoothMouseY])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = window.devicePixelRatio || 1
      const rect = parent.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
      dimensionsRef.current = { width: rect.width, height: rect.height }
      initParticles()
    }

    const handleMouseMove = (e: MouseEvent) => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      const { width, height } = dimensionsRef.current
      if (width === 0 || height === 0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, width, height)

      const parallaxStrength = 0.02
      const offsetX = (mousePosRef.current.x - width / 2) * parallaxStrength
      const offsetY = (mousePosRef.current.y - height / 2) * parallaxStrength

      const particles = particlesRef.current

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        // Slight horizontal drift
        p.vx += (Math.random() - 0.5) * 0.01
        p.vx = Math.max(-0.5, Math.min(0.5, p.vx))

        // Wrap around
        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x + offsetX - (particles[j].x + offsetX)
          const dy = particles[i].y + offsetY - (particles[j].y + offsetY)
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.3
            const gradient = ctx.createLinearGradient(
              particles[i].x + offsetX,
              particles[i].y + offsetY,
              particles[j].x + offsetX,
              particles[j].y + offsetY
            )
            gradient.addColorStop(0, `oklch(0.6 0.2 155 / ${opacity})`)
            gradient.addColorStop(1, `oklch(0.8 0.16 80 / ${opacity})`)

            ctx.beginPath()
            ctx.moveTo(particles[i].x + offsetX, particles[i].y + offsetY)
            ctx.lineTo(particles[j].x + offsetX, particles[j].y + offsetY)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const drawX = p.x + offsetX
        const drawY = p.y + offsetY

        // Glow
        ctx.beginPath()
        ctx.arc(drawX, drawY, p.radius * 3, 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace(')', ` / ${p.alpha * 0.15})`).replace('oklch', 'oklch')
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace(')', ` / ${p.alpha})`)
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initParticles, mouseX, mouseY, smoothMouseX, smoothMouseY])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
