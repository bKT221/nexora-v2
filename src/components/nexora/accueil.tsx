'useuse client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  Home,
  Star,
  Flame,
  BookOpen,
  Target,
  Timer,
  Camera,
  Mic,
  WifiOff,
  Share2,
  Zap,
  TrendingUp,
  Trophy,
  Gift,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useNexoraStore } from '@/lib/store'

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bonjour'
  if (h < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

function getTimeEmoji(): string {
  const h = new Date().getHours()
  if (h < 12) return '☀️'
  if (h < 18) return '🌤️'
  return '🌙'
}

/* === Animated Number Counter === */
function AnimatedNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
  const motionVal = useMotionValue(0)
  const display = useTransform(motionVal, (latest) => Math.round(latest).toLocaleString())
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

  return <span ref={nodeRef}>0</span>
}

/* === Animated Progress Bar with Gradient === */
function GradientProgress({ value, className = '' }: { value: number; className?: string }) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true
    const timer = setTimeout(() => setAnimatedValue(value), 300)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div ref={ref} className={`relative h-2 rounded-full bg-muted/30 overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full progress-gradient"
        initial={{ width: 0 }}
        animate={{ width: `${animatedValue}%` }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  )
}

/* === Circular Progress with Animation === */
function AnimatedCircularProgress({ value, size = 64, className = '' }: { value: number; size?: number; className?: string }) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 400)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          className="text-muted/30"
          strokeWidth="3"
        />
        <motion.path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          className="text-emerald"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ strokeDasharray: '0, 100' }}
          animate={{ strokeDasharray: `${animatedValue}, 100` }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-emerald">
        {value}%
      </span>
    </div>
  )
}

export default function Accueil() {
  const { profile, setProfile, xp, level, streak, lowDataMode, nexoraCoins } = useNexoraStore()
  const [activeSection, setActiveSection] = useState<'home' | 'activity'>('home')

  const levelProgress = xp % 300
  const levelMax = 300

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="px-4 pb-6 pt-2 space-y-5"
    >
      {/* Low-Data Mode Banner */}
      {lowDataMode && (
        <motion.div variants={slideUp} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber/10 border border-amber/20 text-amber text-sm">
          <WifiOff className="w-4 h-4" />
          <span>Mode économie de données activé</span>
        </motion.div>
      )}

      {/* Welcome Banner with Animated Gradient */}
      <motion.div variants={slideUp}>
        <div className="welcome-gradient rounded-2xl p-5 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/5 blur-xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {getGreeting()}, Amadou ! {getTimeEmoji()}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {profile === 'etudiant'
                    ? 'Prêt à apprendre et progresser aujourd\'hui ?'
                    : 'Construisons votre succès business aujourd\'hui !'}
                </p>
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="text-4xl"
              >
                👋
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Switcher */}
      <motion.div variants={slideUp} className="flex items-center gap-2">
        <button
          onClick={() => setProfile('etudiant')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
            profile === 'etudiant'
              ? 'gradient-nexora text-white shadow-lg shimmer-border'
              : 'glass text-muted-foreground hover:text-foreground'
          }`}
        >
          🎓 Étudiant
        </button>
        <button
          onClick={() => setProfile('entrepreneur')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
            profile === 'entrepreneur'
              ? 'gradient-gold text-gold-foreground shadow-lg shimmer-border'
              : 'glass text-muted-foreground hover:text-foreground'
          }`}
        >
          💼 Entrepreneur
        </button>
      </motion.div>

      {/* Stats Row — with Animated Counters */}
      <motion.div variants={slideUp} className="grid grid-cols-3 gap-3">
        {/* XP Card */}
        <motion.div
          className="glass-premium rounded-xl p-4 text-center space-y-2 hover-lift particle-sparkle"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div className="flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 text-nexora" />
            <span className="text-xs text-muted-foreground">XP</span>
          </div>
          <p className="text-xl font-bold text-gradient-nexora">
            <AnimatedNumber value={xp} />
          </p>
          <GradientProgress value={(levelProgress / levelMax) * 100} />
        </motion.div>

        {/* Level Card */}
        <motion.div
          className="glass-premium rounded-xl p-4 text-center space-y-2 hover-lift particle-sparkle"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div className="flex items-center justify-center gap-1">
            <Star className="w-4 h-4 text-gold" />
            <span className="text-xs text-muted-foreground">Niveau</span>
          </div>
          <p className="text-xl font-bold text-gradient-gold">
            <AnimatedNumber value={level} />
          </p>
          <p className="text-xs text-muted-foreground">Prochain: {level + 1}</p>
        </motion.div>

        {/* Streak Card */}
        <motion.div
          className="glass-premium rounded-xl p-4 text-center space-y-2 hover-lift pulse-border"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-amber" />
            <span className="text-xs text-muted-foreground">Série</span>
          </div>
          <p className="text-xl font-bold text-amber">
            <AnimatedNumber value={streak} />
          </p>
          <p className="text-xs">🔥 jours</p>
        </motion.div>
      </motion.div>

      {/* Daily Challenge Card — Pulsing Border */}
      <motion.div variants={slideUp}>
        <motion.div
          className="glass-premium rounded-xl p-4 pulse-border relative overflow-hidden"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div className="absolute inset-0 pointer-events-none aurora-bg opacity-20" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-10 h-10 rounded-xl gradient-nexora flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Trophy className="w-5 h-5 text-nexora-foreground" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold">Défi du jour</p>
                  <p className="text-xs text-muted-foreground">Complétez 3 quiz pour gagner 50 XP</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="gradient-nexora text-nexora-foreground border-0 text-xs">
                  <Gift className="w-3 h-3 mr-1" />
                  +50 XP
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">1/3 quiz complétés</span>
                <span className="text-nexora font-medium">33%</span>
              </div>
              <GradientProgress value={33} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Smart Cards - Horizontal Scroll */}
      <motion.div variants={slideUp}>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Pour vous
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1">
          {/* Continue Reading Card */}
          <motion.div
            className="glass-premium rounded-xl p-4 min-w-[240px] space-y-3 shrink-0 hover-lift particle-sparkle"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-nexora" />
              <span className="text-sm font-medium">Continuer la lecture</span>
            </div>
            <p className="text-xs text-muted-foreground">Mathématiques — Chapitre 5</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progression</span>
                <span className="text-nexora font-medium">65%</span>
              </div>
              <GradientProgress value={65} />
            </div>
          </motion.div>

          {/* Daily Objective Card */}
          <motion.div
            className="glass-premium rounded-xl p-4 min-w-[200px] space-y-3 shrink-0 hover-lift"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald" />
              <span className="text-sm font-medium">Objectif du jour</span>
            </div>
            <p className="text-xs text-muted-foreground">Gagnez 50 XP aujourd&apos;hui</p>
            <div className="flex items-center justify-center">
              <AnimatedCircularProgress value={65} />
            </div>
          </motion.div>

          {/* Pending Quiz Card */}
          <motion.div
            className="glass-premium rounded-xl p-4 min-w-[220px] space-y-3 shrink-0 hover-lift particle-sparkle"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-amber" />
              <span className="text-sm font-medium">Quiz en attente</span>
            </div>
            <p className="text-xs text-muted-foreground">Physique-Chimie — 15 min</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-amber border-amber/30">
                <Timer className="w-3 h-3 mr-1" />
                23:45:12
              </Badge>
              <button className="text-xs text-nexora font-medium hover:underline">
                Commencer →
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions - 2x2 Grid */}
      <motion.div variants={slideUp}>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Actions rapides
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Camera, label: 'Scanner de documents', gradient: 'gradient-nexora', textColor: 'text-white', bg: '' },
            { icon: Mic, label: 'Dictaphone IA', gradient: 'gradient-gold', textColor: 'text-gold-foreground', bg: '' },
            { icon: WifiOff, label: 'Transferts Offline', gradient: '', textColor: 'text-emerald', bg: 'bg-emerald/20' },
            { icon: Share2, label: 'Nexora Share', gradient: '', textColor: 'text-amber', bg: 'bg-amber/20' },
          ].map((action) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.label}
                className="glass-premium rounded-xl p-4 flex flex-col items-center gap-2 hover-lift particle-sparkle group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full ${action.gradient || action.bg} flex items-center justify-center`}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Icon className={`w-5 h-5 ${action.textColor}`} />
                </motion.div>
                <span className="text-xs font-medium">{action.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Section Toggle */}
      <motion.div variants={slideUp} className="flex gap-1 glass rounded-xl p-1">
        <button
          onClick={() => setActiveSection('home')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
            activeSection === 'home' ? 'gradient-nexora text-white' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="w-3 h-3 inline mr-1" />
          Résumé
        </button>
        <button
          onClick={() => setActiveSection('activity')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
            activeSection === 'activity' ? 'gradient-nexora text-white' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="w-3 h-3 inline mr-1" />
          Activité
        </button>
      </motion.div>

      {/* Animated Section Switching */}
      <AnimatePresence mode="wait">
        {activeSection === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Coin Balance Card */}
            <div className="glass-premium rounded-xl p-4 hover-lift">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Star className="w-5 h-5 text-gold-foreground" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium">Nexora Coins</p>
                    <p className="text-xs text-muted-foreground">Gagnez des pièces en apprenant</p>
                  </div>
                </div>
                <span className="text-lg font-bold golden-shimmer">
                  <AnimatedNumber value={nexoraCoins} />
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="activity"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {/* Activity Feed */}
            <div className="glass-premium rounded-xl px-4 py-3 flex items-center gap-3 hover-lift">
              <div className="w-8 h-8 rounded-full gradient-nexora flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Vous avez gagné 25 XP en Maths</p>
                <p className="text-xs text-muted-foreground">Il y a 2h</p>
              </div>
              <span className="text-nexora text-xs font-medium">+25 XP</span>
            </div>

            <div className="glass-premium rounded-xl px-4 py-3 flex items-center gap-3 hover-lift">
              <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-emerald" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Nouveau cours disponible : SVT BTS</p>
                <p className="text-xs text-muted-foreground">Il y a 5h</p>
              </div>
              <Badge variant="outline" className="text-emerald border-emerald/30 text-[10px] shrink-0">
                Nouveau
              </Badge>
            </div>

            <div className="glass-premium rounded-xl px-4 py-3 flex items-center gap-3 hover-lift">
              <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 text-gold-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Série de 7 jours atteinte ! 🎉</p>
                <p className="text-xs text-muted-foreground">Hier</p>
              </div>
              <span className="text-gold text-xs font-medium golden-shimmer">+100 XP</span>
            </div>

            <div className="glass-premium rounded-xl px-4 py-3 flex items-center gap-3 hover-lift">
              <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4 text-amber" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Badge &quot;Champion Quiz&quot; débloqué ! 🏆</p>
                <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
              </div>
              <span className="text-amber text-xs font-medium">Nouveau</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
