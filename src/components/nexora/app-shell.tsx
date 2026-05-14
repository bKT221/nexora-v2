'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Home,
  Sparkles,
  GraduationCap,
  Users,
  ShoppingBag,
  Coins,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNexoraStore, type AppTab } from '@/lib/store'

import Accueil from './accueil'
import NexaAI from './nexa-ai'
import Academie from './academie'
import Social from './social'
import Marketplace from './marketplace'

const tabs: { key: AppTab; label: string; icon: typeof Home }[] = [
  { key: 'accueil', label: 'Accueil', icon: Home },
  { key: 'nexa', label: 'IA Nexa', icon: Sparkles },
  { key: 'academie', label: 'Académie', icon: GraduationCap },
  { key: 'social', label: 'Social', icon: Users },
  { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
]

/* === Direction-aware tab transitions === */
const tabOrder: AppTab[] = ['accueil', 'nexa', 'academie', 'social', 'marketplace']

function getTabDirection(from: AppTab, to: AppTab): number {
  const fromIdx = tabOrder.indexOf(from)
  const toIdx = tabOrder.indexOf(to)
  return toIdx > fromIdx ? 1 : -1
}

export default function AppShell() {
  const { tab, setTab, nexoraCoins, level, lowDataMode, toggleLowDataMode, setView, openAuthModal } = useNexoraStore()
  const [prevTab, setPrevTab] = useState<AppTab>(tab)
  const [direction, setDirection] = useState(0)

  // Parallax on scroll for header
  const { scrollY } = useScroll()
  const headerY = useTransform(scrollY, [0, 100], [0, -5])
  const headerOpacity = useTransform(scrollY, [0, 80], [1, 0.95])

  const handleTabChange = (newTab: AppTab) => {
    if (newTab !== tab) {
      setDirection(getTabDirection(tab, newTab))
      setPrevTab(tab)
      setTab(newTab)
    }
  }

  const tabComponents: Record<AppTab, React.ReactNode> = {
    accueil: <Accueil />,
    nexa: <NexaAI />,
    academie: <Academie />,
    social: <Social />,
    marketplace: <Marketplace />,
  }

  return (
    <div className={`flex flex-col min-h-screen bg-background touch-optimize ${lowDataMode ? 'low-data-mode' : ''}`}>
      {/* Top Header with Parallax */}
      <motion.header
        className="sticky top-0 z-50 glass-strong"
        style={{ y: headerY, opacity: headerOpacity }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo — Breathing Animation */}
            <motion.h1
              className="text-xl font-extrabold text-gradient-nexora tracking-tight animate-breathe"
            >
              NEXORA
            </motion.h1>

            {/* Coin Balance — Golden Shimmer */}
            <motion.div
              className="flex items-center gap-1.5 glass-premium rounded-full px-3 py-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <Coins className="w-4 h-4 text-gold" />
              </motion.div>
              <span className="text-sm font-bold golden-shimmer">
                {nexoraCoins.toLocaleString()}
              </span>
            </motion.div>

            {/* Avatar + Level + Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="relative outline-none">
                <Avatar className="w-9 h-9 border-2 border-nexora hover:scale-110 transition-transform">
                  <AvatarFallback className="gradient-nexora text-white text-xs font-bold">
                    A
                  </AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-1.5 -right-1.5 gradient-gold text-gold-foreground border-0 text-[8px] px-1 h-4 min-w-4 flex items-center justify-center">
                  {level}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-strong border-border/50 w-48">
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-sm"
                  onClick={() => setView('admin')}
                >
                  <Settings className="w-4 h-4 text-nexora" />
                  Administration
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-sm"
                  onClick={() => openAuthModal('login')}
                >
                  <Users className="w-4 h-4 text-gold" />
                  Mon profil
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-sm"
                  onClick={() => setView('landing')}
                >
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                  Retour au site
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Low-Data Mode */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground hidden sm:inline">Éco</span>
              <Switch
                checked={lowDataMode}
                onCheckedChange={toggleLowDataMode}
                className="scale-75"
              />
            </div>

            {/* Notification Bell */}
            <button
              className="relative p-1"
              onClick={() => openAuthModal('login')}
            >
              <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background" />
            </button>
          </div>
        </div>

        {/* Animated Gradient Line Under Header */}
        <div className="header-gradient-line" />
      </motion.header>

      {/* Content Area — Directional Slide Transitions */}
      <main className="flex-1 overflow-y-auto scrollbar-thin pb-24">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={tab}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: direction * -60, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={tab === 'nexa' ? 'flex flex-col h-full' : ''}
          >
            {tabComponents[tab]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong">
        <div className="header-gradient-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        <div className="flex items-end justify-around px-2 pt-2 pb-2 safe-area-bottom">
          {tabs.map((t) => {
            const isActive = tab === t.key
            const isCenter = t.key === 'nexa'

            return (
              <button
                key={t.key}
                onClick={() => handleTabChange(t.key)}
                className="flex flex-col items-center gap-0.5 py-1 relative min-w-[56px]"
              >
                {isActive ? (
                  <motion.div
                    layoutId="activeTab"
                    className={`flex items-center justify-center rounded-2xl ${
                      isCenter ? 'p-3 -mt-4' : 'px-3 py-1.5'
                    } gradient-nexora shadow-lg glow-nexora`}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <t.icon
                      className={`text-white ${isCenter ? 'w-6 h-6' : 'w-4 h-4'}`}
                    />
                    {isCenter && (
                      <span className="ml-1.5 text-xs font-bold text-white">
                        Nexa
                      </span>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    className={`flex items-center justify-center p-1.5 ${
                      isCenter ? '-mt-2' : ''
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <t.icon
                      className={`text-muted-foreground ${
                        isCenter ? 'w-5 h-5' : 'w-4 h-4'
                      }`}
                    />
                  </motion.div>
                )}
                {!isCenter && (
                  <span
                    className={`text-[10px] ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {t.label}
                  </span>
                )}
                {isCenter && !isActive && (
                  <span className="text-[10px] text-muted-foreground">
                    IA Nexa
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {/* Safe area padding for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  )
}
