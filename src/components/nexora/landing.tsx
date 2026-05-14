'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import {
  Sun,
  Moon,
  Menu,
  X,
  WifiOff,
  Bot,
  GraduationCap,
  Wallet,
  Users,
  ShoppingCart,
  Smartphone,
  Globe,
  Cpu,
  Check,
  ChevronRight,
  Clock,
  Star,
  ArrowRight,
  Heart,
  Sparkles,
  Play,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNexoraStore } from '@/lib/store'
import ParticleBackground from './particle-background'
import AnimatedCounter from './animated-counter'
import PremiumFeaturesShowcase from './premium-features-showcase'
import StatsMarquee from './stats-marquee'
import NexoraShare from './nexora-share'

interface LandingProps {
  onEnterApp?: () => void
  onToggleTheme?: () => void
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const features = [
  {
    icon: WifiOff,
    title: 'Offline-First',
    emoji: '🌍',
    description:
      'Apprenez et travaillez sans internet. Synchronisation intelligente quand la connexion revient.',
    color: 'text-emerald',
    glowClass: 'hover:glow-nexora',
  },
  {
    icon: Bot,
    title: 'IA Nexa',
    emoji: '🤖',
    description:
      'Assistant intelligent multimodal — texte, voix, image. Résume vos PDF, corrige vos exercices.',
    color: 'text-nexora',
    glowClass: 'hover:glow-nexora',
  },
  {
    icon: GraduationCap,
    title: 'Académie',
    emoji: '📚',
    description:
      'Parcours BFEM, BAC, BTS, Licence. Quiz en duel, fiches de révision IA, bibliothèque offline.',
    color: 'text-gold',
    glowClass: 'hover:glow-gold',
  },
  {
    icon: Wallet,
    title: 'Mobile Money',
    emoji: '💰',
    description:
      'Wave, Orange, MTN, Moov intégrés. Payez cours et services directement.',
    color: 'text-amber',
    glowClass: 'hover:glow-gold',
  },
  {
    icon: Users,
    title: 'Réseau Social',
    emoji: '🤝',
    description:
      'Communautés, groupes d\'études, mentorat. Partagez vos réussites.',
    color: 'text-emerald',
    glowClass: 'hover:glow-nexora',
  },
  {
    icon: ShoppingCart,
    title: 'Marketplace',
    emoji: '🛒',
    description:
      'Vendez cours, documents, services freelance. Devenez entrepreneur digital.',
    color: 'text-gold',
    glowClass: 'hover:glow-gold',
  },
]

const ecosystemPillars = [
  { icon: Smartphone, label: 'Mobile App', angle: 0 },
  { icon: Globe, label: 'Web & PWA', angle: 72 },
  { icon: Cpu, label: 'IA Hybride', angle: 144 },
  { icon: WifiOff, label: 'Offline-First', angle: 216 },
  { icon: Wallet, label: 'Mobile Money', angle: 288 },
]

const examPathways = ['BFEM', 'BAC', 'BTS', 'BT', 'Licence']

const pricingPlans = [
  {
    name: 'Gratuit',
    price: '0',
    unit: 'FCFA/mois',
    features: [
      'Accès limité IA',
      'Publicité non intrusive',
      'Cours de base',
      'Mode offline limité',
    ],
    cta: 'Commencer',
    recommended: false,
    borderClass: 'border-border',
    badgeVariant: 'secondary' as const,
  },
  {
    name: 'Nexora Gold',
    price: '2 500',
    unit: 'FCFA/mois',
    features: [
      'IA illimitée',
      'Offline total',
      'Sans pubs',
      'Badges exclusifs',
      'Support prioritaire',
      'Accès anticipé',
    ],
    cta: 'Passer Gold',
    recommended: true,
    borderClass: 'border-gold',
    badgeVariant: 'default' as const,
  },
  {
    name: 'Pack Examen',
    price: '1 500',
    unit: 'FCFA/pack',
    features: [
      'Accès 30 jours',
      'Corrigés détaillés',
      'Examens blancs',
      'Fiches de révision',
    ],
    cta: 'Acheter le pack',
    recommended: false,
    borderClass: 'border-border',
    badgeVariant: 'secondary' as const,
  },
]

/* === Typing Animation Component === */
function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 45)
    return () => clearInterval(interval)
  }, [started, text])

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="typing-cursor-glow" />
      )}
    </span>
  )
}

/* === Floating Geometric Shape === */
function FloatingShape({
  className,
  type,
  size,
  duration,
  delay: shapeDelay,
}: {
  className?: string
  type: 'hexagon' | 'circle' | 'diamond' | 'triangle'
  size: number
  duration: number
  delay: number
}) {
  const shapeContent = () => {
    switch (type) {
      case 'hexagon':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <path
              d="M50 5L93.3 27.5V72.5L50 95L6.7 72.5V27.5L50 5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        )
      case 'diamond':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <path
              d="M50 5L95 50L50 95L5 50L50 5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        )
      case 'triangle':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <path
              d="M50 10L90 85L10 85L50 10Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        )
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        )
    }
  }

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.15, 0.35, 0.15],
        y: [0, -30, 0],
        x: [0, 15, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: shapeDelay,
      }}
    >
      {shapeContent()}
    </motion.div>
  )
}

/* === Mouse Follower Particle === */
function MouseParticle() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let particles: HTMLDivElement[] = []

    const createParticle = (x: number, y: number) => {
      const particle = document.createElement('div')
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: oklch(0.6 0.2 155 / 60%);
        pointer-events: none;
        z-index: 9999;
        left: ${x}px;
        top: ${y}px;
        transition: all 0.8s ease-out;
        box-shadow: 0 0 6px oklch(0.6 0.2 155 / 40%);
      `
      document.body.appendChild(particle)
      particles.push(particle)

      requestAnimationFrame(() => {
        particle.style.opacity = '0'
        particle.style.transform = `translate(${(Math.random() - 0.5) * 40}px, ${(Math.random() - 0.5) * 40}px) scale(0)`
      })

      setTimeout(() => {
        particle.remove()
        particles = particles.filter((p) => p !== particle)
      }, 800)
    }

    const handleMove = (e: MouseEvent) => {
      if (Math.random() > 0.7) {
        createParticle(e.clientX, e.clientY)
      }
    }

    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      particles.forEach((p) => p.remove())
    }
  }, [])

  return <div ref={containerRef} className="hidden" />
}

/* === Gradient Orb Following Scroll === */
function ScrollGradientOrb() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const progress = Math.min(scrollY / 2000, 1)

  return (
    <motion.div
      className="fixed pointer-events-none z-0"
      style={{
        left: '50%',
        top: `${20 + progress * 60}%`,
        width: 300 + progress * 200,
        height: 300 + progress * 200,
        x: '-50%',
      }}
      animate={{
        opacity: [0.05, 0.12, 0.05],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className="w-full h-full rounded-full blur-[100px]"
        style={{
          background: `radial-gradient(circle, oklch(0.55 0.17 155 / ${0.15 + progress * 0.1}) 0%, oklch(0.75 0.16 80 / ${0.1 + progress * 0.05}) 50%, transparent 70%)`,
        }}
      />
    </motion.div>
  )
}

/* === 3D Phone Mockup Component === */
function PhoneMockup3D() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      className="flex-shrink-0 relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <div className="relative w-[260px] sm:w-[280px] h-[520px] sm:h-[560px]">
          {/* Phone Body */}
          <div className="absolute inset-0 rounded-[3rem] glass-premium border-2 border-nexora/20 animate-glow shimmer-border">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 rounded-b-2xl bg-background/80 backdrop-blur-sm" />
            {/* Screen Content */}
            <div className="absolute inset-4 top-10 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-4 p-4">
              <motion.div
                className="w-14 h-14 rounded-2xl gradient-nexora flex items-center justify-center glow-nexora"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="size-8 text-nexora-foreground" />
              </motion.div>
              <div className="text-center">
                <p className="text-shimmer font-bold text-lg">NEXORA</p>
                <p className="text-xs text-muted-foreground mt-1">Votre avenir, entre vos mains</p>
              </div>
              {/* Mini Feature Icons */}
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[GraduationCap, Bot, Wallet, Users, ShoppingCart, WifiOff].map(
                  (Icon, i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 rounded-xl glass flex items-center justify-center"
                      whileHover={{ scale: 1.15, rotateZ: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Icon className="size-5 text-nexora" />
                    </motion.div>
                  )
                )}
              </div>
            </div>
            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-foreground/20" />
          </div>
          {/* Floating Badge 1 */}
          <motion.div
            className="absolute -top-4 -right-4 glass-premium rounded-2xl px-3 py-2 flex items-center gap-2 floating-badge"
          >
            <div className="w-6 h-6 rounded-full gradient-nexora flex items-center justify-center">
              <Check className="size-3.5 text-nexora-foreground" />
            </div>
            <span className="text-xs font-medium">150K+ Users</span>
          </motion.div>
          {/* Floating Badge 2 */}
          <motion.div
            className="absolute -bottom-2 -left-6 glass-premium rounded-2xl px-3 py-2 flex items-center gap-2 floating-badge"
            style={{ animationDelay: '1.5s' }}
          >
            <div className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center">
              <Star className="size-3.5 text-gold-foreground" />
            </div>
            <span className="text-xs font-medium golden-shimmer">4.9 ★ Rating</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function NexoraLanding({ onEnterApp, onToggleTheme }: LandingProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const setView = useNexoraStore((s) => s.setView)
  const lowDataMode = useNexoraStore((s) => s.lowDataMode)

  const handleEnterApp = () => {
    if (onEnterApp) {
      onEnterApp()
    } else {
      setView('app')
    }
  }

  const navLinks = [
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'Académie', href: '#academy' },
    { label: 'Marketplace', href: '#marketplace' },
    { label: 'Tarifs', href: '#pricing' },
  ]

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden touch-optimize ${lowDataMode ? 'low-data-mode' : ''}`}>
      <MouseParticle />
      <ScrollGradientOrb />

      {/* ===== NAVIGATION BAR ===== */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 rounded-lg gradient-nexora flex items-center justify-center"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="size-5 text-nexora-foreground" />
              </motion.div>
              <span className="text-xl font-bold text-gradient-nexora">NEXORA</span>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-nexora rounded-full transition-all group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleTheme}
                aria-label="Toggle theme"
              >
                <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button
                className="gradient-nexora text-nexora-foreground font-semibold hover:opacity-90 transition-opacity ripple"
                onClick={handleEnterApp}
              >
                Télécharger
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleTheme}
                aria-label="Toggle theme"
              >
                <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Animated gradient line under header */}
        <div className="header-gradient-line" />

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden glass-strong border-t border-border overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    {link.label}
                  </a>
                ))}
                <Button
                  className="gradient-nexora text-nexora-foreground font-semibold w-full mt-2"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleEnterApp()
                  }}
                >
                  Télécharger
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative gradient-hero min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 gradient-mesh pointer-events-none" />

        {/* Particle Background */}
        <ParticleBackground />

        {/* Decorative Floating Orbs with Morphing */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-nexora/10 blur-3xl morph-blob"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gold/8 blur-3xl morph-blob"
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ animationDelay: '2s' }}
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-emerald/8 blur-3xl morph-blob"
            animate={{ x: [0, 15, 0], y: [0, -25, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{ animationDelay: '4s' }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-amber/6 blur-3xl morph-blob"
            animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            style={{ animationDelay: '6s' }}
          />
        </div>

        {/* Floating Geometric Shapes */}
        <FloatingShape type="hexagon" size={60} duration={18} delay={0} className="top-[15%] left-[8%] text-nexora/25" />
        <FloatingShape type="circle" size={40} duration={14} delay={2} className="top-[25%] right-[12%] text-gold/20" />
        <FloatingShape type="diamond" size={50} duration={20} delay={4} className="bottom-[20%] left-[15%] text-emerald/20" />
        <FloatingShape type="triangle" size={35} duration={16} delay={1} className="top-[60%] right-[8%] text-amber/20" />
        <FloatingShape type="hexagon" size={45} duration={22} delay={3} className="bottom-[35%] right-[25%] text-nexora/15" />
        <FloatingShape type="circle" size={30} duration={12} delay={5} className="top-[40%] left-[5%] text-gold/15" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={staggerItem}>
                <Badge variant="outline" className="mb-6 border-nexora/30 text-nexora text-sm px-4 py-1 shimmer-border">
                  <Sparkles className="size-3.5 mr-1" />
                  Super-App #1 en Afrique
                </Badge>
              </motion.div>

              <motion.h1
                variants={staggerItem}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
              >
                La{' '}
                <span className="text-shimmer">Super-App</span>
                <br />
                Africaine
              </motion.h1>

              <motion.p
                variants={staggerItem}
                className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0"
              >
                <TypingText text="Éducation, Business, Social et IA — Tout-en-Un" delay={1200} />
              </motion.p>

              <motion.p
                variants={staggerItem}
                className="mt-3 text-sm text-gold italic">
                Power in your hands, offline or online.
              </motion.p>

              <motion.div
                variants={staggerItem}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  className="gradient-nexora text-nexora-foreground font-bold text-base px-8 py-6 glow-nexora hover:opacity-90 transition-opacity ripple shimmer-border"
                  onClick={handleEnterApp}
                >
                  Commencer gratuitement
                  <ArrowRight className="size-5 ml-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 border-nexora/30 hover:bg-nexora/10 particle-sparkle"
                >
                  <Play className="size-5 mr-1" />
                  Voir la démo
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: 3D Phone Mockup */}
          <PhoneMockup3D />
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative z-10 w-full max-w-4xl mx-auto px-4 pb-12"
        >
          <div className="glass-premium rounded-2xl p-6 grid grid-cols-3 gap-4 text-center shimmer-border">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gradient-nexora"><AnimatedCounter value={150} suffix="K+" /></p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Utilisateurs</p>
            </div>
            <div className="border-x border-border">
              <p className="text-2xl sm:text-3xl font-bold text-gradient-gold"><AnimatedCounter value={98} suffix="%" /></p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Taux de réussite</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gradient-nexora"><AnimatedCounter value={15} suffix="+" /></p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Pays</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 border-nexora/30 text-nexora">
              Fonctionnalités
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Pourquoi <span className="text-shimmer">Nexora</span> ?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Une plateforme tout-en-un conçue pour le continent africain, pensée pour fonctionner
              avec ou sans connexion.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.div key={feature.title} variants={staggerItem}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -6 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Card className={`glass h-full cursor-pointer transition-all duration-300 hover-lift particle-sparkle py-6`}>
                      <CardContent className="flex flex-col gap-4 p-0 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl gradient-nexora flex items-center justify-center shrink-0">
                            <Icon className="size-6 text-nexora-foreground" />
                          </div>
                          <span className="text-2xl" role="img" aria-label={feature.title}>
                            {feature.emoji}
                          </span>
                        </div>
                        <h3 className={`text-lg font-semibold ${feature.color}`}>
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== PREMIUM FEATURES SHOWCASE ===== */}
      <PremiumFeaturesShowcase />

      {/* ===== ECOSYSTEM SECTION ===== */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 aurora-bg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 border-gold/30 text-gold shimmer-border">
              Écosystème
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Un <span className="text-gradient-gold">Écosystème</span> Complet
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Cinq piliers interconnectés pour une expérience sans précédent.
            </p>
          </motion.div>

          {/* Ecosystem Diagram */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="relative flex items-center justify-center py-8"
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Central Hub */}
              <motion.div
                variants={staggerItem}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full gradient-nexora flex items-center justify-center glow-nexora animate-glow">
                  <span className="text-nexora-foreground font-extrabold text-lg sm:text-xl">
                    NEXORA
                  </span>
                </div>
              </motion.div>

              {/* Connecting Lines (SVG) */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 400"
                fill="none"
              >
                {ecosystemPillars.map((pillar) => {
                  const rad = (pillar.angle * Math.PI) / 180
                  const cx = 200 + 140 * Math.cos(rad)
                  const cy = 200 + 140 * Math.sin(rad)
                  return (
                    <motion.line
                      key={pillar.label}
                      x1="200"
                      y1="200"
                      x2={cx}
                      y2={cy}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-nexora/30"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  )
                })}
              </svg>

              {/* Pillar Nodes */}
              {ecosystemPillars.map((pillar) => {
                const rad = (pillar.angle * Math.PI) / 180
                const offset = 35 // percentage from center
                const x = 50 + offset * Math.cos(rad)
                const y = 50 + offset * Math.sin(rad)
                const Icon = pillar.icon
                return (
                  <motion.div
                    key={pillar.label}
                    variants={staggerItem}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="glass-premium rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-2 cursor-pointer transition-shadow duration-300 hover:glow-nexora"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-nexora flex items-center justify-center">
                        <Icon className="size-5 sm:size-6 text-nexora-foreground" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-medium text-center whitespace-nowrap">
                        {pillar.label}
                      </span>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== ACADEMY SHOWCASE ===== */}
      <section id="academy" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 border-emerald/30 text-emerald">
              Académie
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Votre <span className="text-gradient-nexora">Succès</span> Commence Ici
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Des parcours adaptés à chaque examen, avec un accompagnement IA personnalisé.
            </p>
          </motion.div>

          {/* Exam Pathways */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {examPathways.map((exam) => (
              <motion.div key={exam} variants={staggerItem} whileHover={{ scale: 1.1 }}>
                <Badge
                  className="px-5 py-2.5 text-sm font-semibold gradient-nexora text-nexora-foreground border-0 cursor-pointer hover:opacity-90 transition-opacity shimmer-border"
                >
                  {exam}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          {/* Quiz Preview Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto"
          >
            <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Card className="glass-premium glow-nexora shimmer-border">
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <Badge className="gradient-nexora text-nexora-foreground border-0">
                      <GraduationCap className="size-3.5 mr-1" />
                      Quiz BAC — Mathématiques
                    </Badge>
                    <div className="flex items-center gap-1.5 text-amber">
                      <Clock className="size-4" />
                      <span className="text-sm font-mono font-bold">04:32</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium text-sm">
                      Q3 : Résolvez l&apos;équation x² + 5x + 6 = 0
                    </p>
                    <div className="space-y-2">
                      {['x = -2 ou x = -3', 'x = 2 ou x = 3', 'x = -1 ou x = -6', 'x = 1 ou x = 6'].map(
                        (option, i) => (
                          <div
                            key={option}
                            className={`flex items-center gap-3 p-3 rounded-lg glass cursor-pointer transition-all duration-200 hover-lift ${
                              i === 0 ? 'border border-emerald/50 bg-emerald/10' : ''
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                i === 0
                                  ? 'gradient-nexora text-nexora-foreground'
                                  : 'glass text-muted-foreground'
                              }`}
                            >
                              {String.fromCharCode(65 + i)}
                            </div>
                            <span className={`text-sm ${i === 0 ? 'font-medium' : 'text-muted-foreground'}`}>
                              {option}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Question 3 sur 20</span>
                    <span className="text-emerald font-medium">Bonne réponse ! +15 XP</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Academy Stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-6 max-w-md mx-auto mt-12"
          >
            <motion.div variants={staggerItem} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-gradient-nexora">50K+</p>
              <p className="text-sm text-muted-foreground mt-1">Quiz complétés</p>
            </motion.div>
            <motion.div variants={staggerItem} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-gradient-gold">85%</p>
              <p className="text-sm text-muted-foreground mt-1">Amélioration des notes</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS MARQUEE ===== */}
      <StatsMarquee />

      {/* ===== PREMIUM SECTION ===== */}
      <section id="pricing" className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 border-gold/30 text-gold">
              Premium
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Passez au <span className="text-gradient-gold">Niveau Supérieur</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Des formules adaptées à vos ambitions, accessibles via Mobile Money.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {pricingPlans.map((plan) => (
              <motion.div key={plan.name} variants={staggerItem}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="h-full"
                >
                  <Card
                    className={`glass h-full flex flex-col hover-lift ${
                      plan.recommended
                        ? 'border-gold/50 glow-gold shimmer-border'
                        : ''
                    }`}
                  >
                    <CardContent className="flex flex-col flex-1 p-6 gap-0">
                      {plan.recommended && (
                        <Badge className="gradient-gold text-gold-foreground border-0 self-start mb-4">
                          <Star className="size-3 mr-1" />
                          Recommandé
                        </Badge>
                      )}
                      {!plan.recommended && <div className="h-7" />}

                      <h3
                        className={`text-xl font-bold ${
                          plan.recommended ? 'text-gradient-gold' : ''
                        }`}
                      >
                        {plan.name}
                      </h3>

                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold">{plan.price}</span>
                        <span className="text-sm text-muted-foreground">FCFA</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{plan.unit}</p>

                      <ul className="mt-6 space-y-3 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <Check className="size-4 text-emerald shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`mt-6 w-full font-semibold ripple ${
                          plan.recommended
                            ? 'gradient-gold text-gold-foreground hover:opacity-90'
                            : 'gradient-nexora text-nexora-foreground hover:opacity-90'
                        }`}
                        onClick={handleEnterApp}
                      >
                        {plan.cta}
                        <ChevronRight className="size-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== MARKETPLACE TEASER ===== */}
      <section id="marketplace" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="glass-premium rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shimmer-border"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden aurora-bg opacity-30" />

            <div className="relative z-10">
              <Badge variant="outline" className="mb-4 border-amber/30 text-amber">
                <ShoppingCart className="size-3.5 mr-1" />
                Marketplace
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Vendez. Gagnez. <span className="text-gradient-gold">Prospérez.</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg mb-8">
                Créez et vendez vos cours, documents et services freelance directement sur Nexora.
                Devenez entrepreneur digital dès aujourd&apos;hui.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="gradient-gold text-gold-foreground font-bold hover:opacity-90 ripple"
                  onClick={handleEnterApp}
                >
                  Ouvrir ma boutique
                  <ArrowRight className="size-5 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== NEXORA SHARE ===== */}
      <NexoraShare />

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Prêt à transformer
              <br />
              <span className="text-shimmer">votre avenir</span> ?
            </h2>
            <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto">
              Rejoignez des milliers d&apos;Africains qui utilisent Nexora chaque jour pour apprendre,
              travailler et réussir.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-nexora text-nexora-foreground font-bold text-base px-10 py-7 glow-nexora hover:opacity-90 transition-opacity ripple shimmer-border"
                onClick={handleEnterApp}
              >
                Rejoignez Nexora
                <ArrowRight className="size-5 ml-1" />
              </Button>
            </div>

            {/* App Store Badges */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <div className="glass-premium rounded-xl px-5 py-3 flex items-center gap-3 cursor-pointer hover:glow-nexora transition-all hover-lift">
                <Smartphone className="size-5 text-nexora" />
                <div className="text-left">
                  <p className="text-[10px] text-muted-foreground leading-none">Disponible sur</p>
                  <p className="text-sm font-semibold leading-tight">Google Play</p>
                </div>
              </div>
              <div className="glass-premium rounded-xl px-5 py-3 flex items-center gap-3 cursor-pointer hover:glow-nexora transition-all hover-lift">
                <Globe className="size-5 text-nexora" />
                <div className="text-left">
                  <p className="text-[10px] text-muted-foreground leading-none">Accédez via</p>
                  <p className="text-sm font-semibold leading-tight">Web & PWA</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="mt-auto border-t border-border glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Copyright */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg gradient-nexora flex items-center justify-center">
                  <Sparkles className="size-4 text-nexora-foreground" />
                </div>
                <span className="text-lg font-bold text-gradient-nexora">NEXORA</span>
              </div>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Nexora. Tous droits réservés.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">À propos</a>
              <a href="#" className="hover:text-foreground transition-colors">Conditions</a>
              <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>

            {/* Social & Made in Africa */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex gap-3">
                <a href="#" aria-label="Twitter" className="glass rounded-lg p-2 hover:glow-nexora transition-shadow">
                  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" aria-label="Facebook" className="glass rounded-lg p-2 hover:glow-nexora transition-shadow">
                  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="glass rounded-lg p-2 hover:glow-nexora transition-shadow">
                  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                Made with <Heart className="size-3 text-red-500 inline" /> en Afrique
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
