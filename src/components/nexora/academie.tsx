'use client'

import { motion } from 'framer-motion'
import {
  GraduationCap,
  Swords,
  Timer,
  BookOpen,
  Sparkles,
  Download,
  Check,
  Play,
  Beaker,
  FlaskConical,
  Languages,
  FileText,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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

const examPathways = [
  { label: 'BFEM', color: 'bg-nexora text-nexora-foreground' },
  { label: 'BAC', color: 'bg-gold text-gold-foreground' },
  { label: 'BTS', color: 'bg-emerald text-emerald-foreground' },
  { label: 'BT', color: 'bg-amber text-amber-foreground' },
  { label: 'Licence', color: 'bg-nexora text-nexora-foreground' },
]

const libraryItems = [
  { icon: '📐', title: 'Mathématiques Tle S', size: '45 Mo', downloaded: true },
  { icon: '⚗️', title: 'Physique-Chimie 1ère S', size: '38 Mo', downloaded: true },
  { icon: '🧬', title: 'SVT — BTS', size: '22 Mo', downloaded: false },
  { icon: '🇬🇧', title: 'Anglais — BAC', size: '31 Mo', downloaded: true },
]

export default function Academie() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="px-4 pb-6 pt-2 space-y-5"
    >
      {/* Exam Pathways */}
      <motion.div variants={slideUp}>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Parcours d&apos;examen
        </h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 -mx-1 px-1">
          {examPathways.map((p) => (
            <button
              key={p.label}
              className={`${p.color} px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 hover:scale-105 transition-transform shadow-md`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Active Course Card */}
      <motion.div variants={slideUp}>
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="gradient-nexora p-6 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-10">
              <BookOpen className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <Badge className="bg-white/20 text-white border-0 mb-2 text-[10px]">
                En cours
              </Badge>
              <h3 className="text-xl font-bold text-white">Mathématiques</h3>
              <p className="text-white/70 text-sm">Algèbre — Chapitre 5</p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-semibold text-nexora">65%</span>
              </div>
              <Progress value={65} className="h-2.5" />
            </div>
            <Button className="w-full gradient-nexora text-white border-0 hover:opacity-90">
              <Play className="w-4 h-4 mr-2" />
              Continuer
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quiz Lab Section */}
      <motion.div variants={slideUp}>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Quiz Lab
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-xl overflow-hidden">
            <div className="gradient-nexora p-4">
              <Swords className="w-8 h-8 text-white mb-2" />
              <h3 className="font-bold text-white text-sm">Mode Duel</h3>
              <p className="text-white/70 text-[10px] mt-1">
                Défiez un ami en temps réel
              </p>
            </div>
            <div className="p-3">
              <Button
                size="sm"
                className="w-full gradient-nexora text-white border-0 text-xs hover:opacity-90"
              >
                Commencer
              </Button>
            </div>
          </div>

          <div className="glass rounded-xl overflow-hidden">
            <div className="bg-amber/80 p-4">
              <Timer className="w-8 h-8 text-white mb-2" />
              <h3 className="font-bold text-white text-sm">Mode Examen</h3>
              <p className="text-white/70 text-[10px] mt-1">
                Entraînez-vous avec un chrono
              </p>
            </div>
            <div className="p-3">
              <Button
                size="sm"
                className="w-full bg-amber text-white border-0 text-xs hover:opacity-90"
              >
                Commencer
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* My Library */}
      <motion.div variants={slideUp}>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Ma bibliothèque
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1">
          {libraryItems.map((item) => (
            <div
              key={item.title}
              className="glass rounded-xl p-4 min-w-[160px] space-y-2 shrink-0"
            >
              <div className="text-2xl">{item.icon}</div>
              <p className="text-xs font-medium leading-tight">{item.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {item.size}
                </span>
                {item.downloaded ? (
                  <Check className="w-4 h-4 text-emerald" />
                ) : (
                  <Download className="w-4 h-4 text-amber" />
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Revision Sheets */}
      <motion.div variants={slideUp}>
        <div className="glass-strong rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-nexora" />
            <h3 className="font-bold">Fiches de Révision IA</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Générez des fiches synthétiques à partir de vos cours suivis
          </p>
          <Button className="w-full gradient-nexora text-white border-0 hover:opacity-90">
            <Sparkles className="w-4 h-4 mr-2" />
            Générer mes fiches
          </Button>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div variants={slideUp}>
        <div className="glass rounded-xl px-4 py-3 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">12</span> cours suivis •{' '}
            <span className="font-semibold text-foreground">47</span> quiz complétés •{' '}
            <span className="font-semibold text-emerald">85%</span> de réussite
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
