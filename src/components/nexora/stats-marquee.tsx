'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Trophy, Globe, BookOpen, Cpu, Wallet, Star, Quote } from 'lucide-react'

const statsRow1 = [
  { icon: Users, label: '150K+', desc: 'Utilisateurs', color: 'text-nexora' },
  { icon: Trophy, label: '98%', desc: 'Taux de réussite', color: 'text-gold' },
  { icon: Globe, label: '15+', desc: 'Pays', color: 'text-emerald' },
  { icon: BookOpen, label: '5M+', desc: 'Quiz complétés', color: 'text-nexora' },
  { icon: Cpu, label: '89K+', desc: 'Requêtes IA', color: 'text-gold' },
  { icon: Wallet, label: '2.8M+', desc: 'FCFA reversés', color: 'text-amber' },
]

const testimonialsRow2 = [
  {
    text: "Nexora m'a aidé à réussir mon BAC !",
    author: 'Aminata',
    country: 'Sénégal',
  },
  {
    text: "Mon business a décollé grâce aux outils IA",
    author: 'Moussa',
    country: 'Mali',
  },
  {
    text: "La meilleure app pour les étudiants africains",
    author: 'Kwame',
    country: 'Ghana',
  },
  {
    text: "J'apprends même sans connexion internet",
    author: 'Fatou',
    country: 'Guinée',
  },
  {
    text: "Le Mobile Money intégré, c'est génial !",
    author: 'Ibrahim',
    country: 'Côte d\'Ivoire',
  },
  {
    text: "Grâce à Nexora, j'ai eu mon BTS",
    author: 'Aïcha',
    country: 'Cameroun',
  },
]

function MarqueeRow({
  items,
  direction = 'left',
  speed = 40,
  isPaused,
  children: _children,
}: {
  items: typeof statsRow1 | typeof testimonialsRow2
  direction?: 'left' | 'right'
  speed?: number
  isPaused: boolean
  children?: React.ReactNode
}) {
  const isStats = 'icon' in items[0]
  const duration = speed

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        className="flex gap-4"
        style={{
          animation: `${direction === 'left' ? 'marquee-left' : 'marquee-right'} ${duration}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {/* Double the items for seamless loop */}
        {[...items, ...items, ...items].map((item, i) => {
          if (isStats) {
            const stat = item as (typeof statsRow1)[0]
            const Icon = stat.icon
            return (
              <div
                key={`stat-${i}`}
                className="glass rounded-full px-5 py-2.5 flex items-center gap-3 shrink-0 hover:glow-nexora transition-shadow cursor-default"
              >
                <Icon className={`size-4 ${stat.color}`} />
                <span className="font-bold text-sm">{stat.label}</span>
                <span className="text-xs text-muted-foreground">{stat.desc}</span>
              </div>
            )
          }

          const testimonial = item as (typeof testimonialsRow2)[0]
          return (
            <div
              key={`test-${i}`}
              className="glass rounded-2xl px-5 py-3 flex items-center gap-3 shrink-0 max-w-sm hover:glow-gold transition-shadow cursor-default"
            >
              <Quote className="size-4 text-gold shrink-0" />
              <div className="min-w-0">
                <p className="text-xs leading-relaxed truncate">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  — {testimonial.author}, {testimonial.country}
                </p>
              </div>
              <Star className="size-3 text-amber shrink-0 fill-amber" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function StatsMarquee() {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h3 className="text-xl sm:text-2xl font-bold">
            Rejoint par <span className="text-gradient-nexora">des milliers</span> d&apos;Africains
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Des résultats qui parlent d&apos;eux-mêmes
          </p>
        </motion.div>

        <div
          className="space-y-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <MarqueeRow items={statsRow1} direction="left" speed={45} isPaused={isPaused} />
          <MarqueeRow items={testimonialsRow2} direction="right" speed={55} isPaused={isPaused} />
        </div>
      </div>

      {/* CSS keyframes for marquee */}
      <style jsx global>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}
