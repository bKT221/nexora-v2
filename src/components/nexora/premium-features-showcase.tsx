'use client'

import { useRef, useState, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { Bot, GraduationCap, Wallet, MessageSquare, Timer, Trophy, Coins, Send } from 'lucide-react'
import AnimatedCounter from './animated-counter'

interface TiltCardProps {
  children: React.ReactNode
  accentColor: string
  glowClass: string
  className?: string
}

function TiltCard({ children, accentColor, glowClass, className = '' }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 30,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px)
    y.set(py)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative group cursor-default ${className}`}
    >
      {/* Animated gradient border */}
      <div
        className={`absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${glowClass}`}
        style={{
          background: `linear-gradient(135deg, ${accentColor}40, transparent 50%, ${accentColor}40)`,
        }}
      />

      <div
        className="relative glass-strong rounded-2xl overflow-hidden h-full"
        style={{ transform: 'translateZ(0px)' }}
      >
        {/* Shimmer overlay on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          animate={{
            background: isHovered
              ? `linear-gradient(105deg, transparent 40%, ${accentColor}10 45%, ${accentColor}15 50%, ${accentColor}10 55%, transparent 60%)`
              : 'transparent',
            backgroundSize: isHovered ? '200% 100%' : '100% 100%',
          }}
          transition={{ duration: 0.3 }}
          style={{
            animation: isHovered ? 'shimmer 2s ease-in-out infinite' : 'none',
          }}
        />

        {children}
      </div>
    </motion.div>
  )
}

/* ========== IA Nexa Card Content ========== */
function IANexaContent() {
  const [typedText, setTypedText] = useState('')
  const fullText = "Bonjour ! Je suis Nexa, votre assistant IA. Comment puis-je vous aider aujourd'hui ?"

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 35)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-nexora flex items-center justify-center">
          <Bot className="size-5 text-nexora-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-nexora">IA Nexa</h3>
          <p className="text-xs text-muted-foreground">Assistant intelligent multimodal</p>
        </div>
      </div>

      {/* Chat mockup */}
      <div className="space-y-3 min-h-[160px]">
        {/* User message */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end"
        >
          <div className="gradient-nexora rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%]">
            <p className="text-sm text-nexora-foreground">Aide-moi à résumer ce cours de SVT</p>
          </div>
        </motion.div>

        {/* AI response */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-2 items-start"
        >
          <div className="w-7 h-7 rounded-lg gradient-nexora flex items-center justify-center shrink-0 mt-1">
            <MessageSquare className="size-3.5 text-nexora-foreground" />
          </div>
          <div className="glass rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[85%]">
            <p className="text-sm leading-relaxed">
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block w-0.5 h-4 bg-nexora ml-0.5 align-middle"
              />
            </p>
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 flex-wrap">
        {['Résumer PDF', 'Corriger', 'Traduire'].map((action) => (
          <motion.button
            key={action}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass rounded-full px-3 py-1.5 text-xs text-nexora border border-nexora/20 hover:border-nexora/40 transition-colors"
          >
            {action}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

/* ========== Académie Card Content ========== */
function AcademieContent() {
  const [timerValue, setTimerValue] = useState(240)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerValue((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setScore((prev) => (prev < 850 ? prev + 15 : 850))
    }, 80)
    return () => clearInterval(scoreInterval)
  }, [])

  const minutes = Math.floor(timerValue / 60)
  const seconds = timerValue % 60

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
          <GraduationCap className="size-5 text-gold-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gold">Académie</h3>
          <p className="text-xs text-muted-foreground">Quiz interactifs et révision IA</p>
        </div>
      </div>

      {/* Quiz card */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gold">BAC — Mathématiques</span>
          <div className="flex items-center gap-1.5 text-amber">
            <Timer className="size-3.5" />
            <span className="text-sm font-mono font-bold">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        <p className="text-sm font-medium">Q7 : Calculez la dérivée de f(x) = 3x² + 2x - 5</p>

        <div className="space-y-1.5">
          {["f'(x) = 6x + 2", "f'(x) = 3x + 2", "f'(x) = 6x - 5", "f'(x) = 6x² + 2"].map(
            (opt, i) => (
              <motion.div
                key={opt}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${
                  i === 0
                    ? 'bg-emerald/10 border border-emerald/30 text-emerald'
                    : 'glass text-muted-foreground'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    i === 0 ? 'gradient-nexora text-nexora-foreground' : 'glass'
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <span className={i === 0 ? 'font-medium' : ''}>{opt}</span>
              </motion.div>
            )
          )}
        </div>
      </div>

      {/* Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="size-4 text-gold" />
          <span className="text-xs text-muted-foreground">Score</span>
        </div>
        <span className="text-lg font-bold text-gradient-gold">
          <AnimatedCounter value={score} />
        </span>
      </div>
    </div>
  )
}

/* ========== Mobile Money Card Content ========== */
function MobileMoneyContent() {
  const [showCoins, setShowCoins] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCoins(true)
      setTimeout(() => setShowCoins(false), 1800)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
          <Wallet className="size-5 text-gold-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-amber">Mobile Money</h3>
          <p className="text-xs text-muted-foreground">Paiements intégrés</p>
        </div>
      </div>

      {/* Wallet interface */}
      <div className="glass rounded-xl p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 rounded-full -translate-y-8 translate-x-8 blur-xl" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Solde</p>
            <p className="text-2xl font-bold text-gradient-gold mt-0.5">
              <AnimatedCounter value={245750} prefix="" suffix="" />
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">FCFA</p>
          </div>
          <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
            <Coins className="size-5 text-gold-foreground" />
          </div>
        </div>
      </div>

      {/* Quick transfer */}
      <div className="glass rounded-xl p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full gradient-nexora flex items-center justify-center shrink-0">
          <Send className="size-4 text-nexora-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">Envoi à Aminata D.</p>
          <p className="text-[10px] text-muted-foreground">25 000 FCFA • Orange Money</p>
        </div>
        <span className="text-xs font-medium text-emerald">Envoyé</span>
      </div>

      {/* Animated coins */}
      <div className="relative h-12">
        {showCoins &&
          Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`coin-${i}`}
              initial={{ y: -30, opacity: 0, scale: 0.3 }}
              animate={{ y: 30, opacity: [0, 1, 1, 0], scale: [0.3, 1, 1, 0.8] }}
              transition={{
                duration: 1.5,
                delay: i * 0.15,
                ease: 'easeOut',
              }}
              className="absolute"
              style={{ left: `${15 + i * 17}%` }}
            >
              <div className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center shadow-lg">
                <span className="text-[8px] font-bold text-gold-foreground">₣</span>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Payment methods */}
      <div className="flex gap-2">
        {['Wave', 'Orange', 'MTN', 'Moov'].map((method) => (
          <motion.div
            key={method}
            whileHover={{ scale: 1.08 }}
            className="glass rounded-lg px-3 py-1.5 text-[10px] font-medium text-center flex-1 border border-amber/10 hover:border-amber/30 transition-colors"
          >
            {method}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ========== Main Component ========== */
export default function PremiumFeaturesShowcase() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      <div className="absolute inset-0 bg-nexora/3" />

      {/* Subtle background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-nexora/8 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-gold/8 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block glass rounded-full px-4 py-1.5 text-xs font-medium text-nexora border border-nexora/20 mb-6"
          >
            ✨ Expérience Premium
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            Une{' '}
            <span className="text-gradient-nexora">Expérience Révolutionnaire</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            L&apos;innovation africaine à son meilleur — des outils pensés pour vous, conçus pour le continent.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TiltCard
              accentColor="oklch(0.6 0.2 155)"
              glowClass="glow-nexora"
            >
              <IANexaContent />
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <TiltCard
              accentColor="oklch(0.78 0.16 80)"
              glowClass="glow-gold"
            >
              <AcademieContent />
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TiltCard
              accentColor="oklch(0.75 0.16 65)"
              glowClass="glow-gold"
            >
              <MobileMoneyContent />
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
