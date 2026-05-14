'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wifi,
  Bluetooth,
  Search,
  FileText,
  Video,
  Image,
  FileType,
  Upload,
  Check,
  ChevronRight,
  Smartphone,
  Signal,
  X,
} from 'lucide-react'

const nearbyDevices = [
  { name: 'Aminata D.', device: 'Galaxy A54', signal: 3, avatar: 'AD', color: 'gradient-nexora' },
  { name: 'Moussa K.', device: 'iPhone 13', signal: 2, avatar: 'MK', color: 'gradient-gold' },
  { name: 'Fatou S.', device: 'Redmi Note 12', signal: 1, avatar: 'FS', color: 'gradient-nexora' },
]

const fileTypes = [
  { icon: FileText, label: 'PDF', color: 'text-nexora' },
  { icon: Video, label: 'Vidéo', color: 'text-gold' },
  { icon: Image, label: 'Image', color: 'text-emerald' },
  { icon: FileType, label: 'Document', color: 'text-amber' },
]

function SignalStrength({ level }: { level: number }) {
  return (
    <div className="flex items-end gap-[2px]">
      {[1, 2, 3].map((bar) => (
        <div
          key={bar}
          className={`w-[3px] rounded-full transition-colors ${
            bar <= level ? 'bg-nexora' : 'bg-muted-foreground/20'
          }`}
          style={{ height: `${bar * 4 + 2}px` }}
        />
      ))}
    </div>
  )
}

function RadarAnimation() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Radar rings */}
      {[0.3, 0.6, 0.9].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-nexora/20"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* Sweep line */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left"
          style={{
            background: 'linear-gradient(to right, oklch(0.6 0.2 155), transparent)',
          }}
        />
      </motion.div>

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-3 h-3 rounded-full gradient-nexora animate-glow" />
      </div>

      {/* Device blips */}
      {[
        { x: '25%', y: '30%', delay: 0.5 },
        { x: '70%', y: '25%', delay: 1.2 },
        { x: '60%', y: '70%', delay: 1.8 },
      ].map((blip, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-nexora"
          style={{ left: blip.x, top: blip.y }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: blip.delay }}
        />
      ))}
    </div>
  )
}

function TransferProgress({ progress, complete }: { progress: number; complete: boolean }) {
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-muted/30"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.6 0.2 155)" />
            <stop offset="100%" stopColor="oklch(0.8 0.16 80)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {complete ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Check className="size-8 text-emerald" />
          </motion.div>
        ) : (
          <span className="text-sm font-bold">{Math.round(progress)}%</span>
        )}
      </div>
    </div>
  )
}

function ConfettiBurst() {
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 200,
    y: (Math.random() - 0.5) * 200 - 50,
    rotation: Math.random() * 360,
    scale: Math.random() * 0.5 + 0.3,
    color: [
      'oklch(0.6 0.2 155)',
      'oklch(0.8 0.16 80)',
      'oklch(0.55 0.17 155)',
      'oklch(0.75 0.16 65)',
    ][i % 4],
  }))

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: p.scale,
            opacity: 0,
            rotate: p.rotation,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

type ShareStep = 'search' | 'devices' | 'transfer' | 'success'

export default function NexoraShare() {
  const [step, setStep] = useState<ShareStep>('search')
  const [isSearching, setIsSearching] = useState(false)
  const [transferProgress, setTransferProgress] = useState(0)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      setStep('devices')
    }, 2500)
  }

  const handleSelectDevice = (name: string) => {
    setSelectedDevice(name)
    setStep('transfer')
  }

  useEffect(() => {
    if (step === 'transfer') {
      const interval = setInterval(() => {
        setTransferProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStep('success'), 500)
            return 100
          }
          return prev + 2
        })
      }, 60)
      return () => clearInterval(interval)
    }
  }, [step])

  const handleReset = () => {
    setStep('search')
    setTransferProgress(0)
    setSelectedDevice(null)
  }

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block glass rounded-full px-4 py-1.5 text-xs font-medium text-nexora border border-nexora/20 mb-6">
            📡 Nexora Share
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            Partagez <span className="text-gradient-nexora">sans limites</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Transférez des fichiers entre appareils proches — Wi-Fi Direct, Bluetooth, hors ligne.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <div className="relative glass-strong rounded-3xl overflow-hidden">
            {/* Animated gradient border */}
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-nexora/30 via-gold/20 to-emerald/30 opacity-50" />

            <div className="relative p-6 space-y-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Search */}
                {step === 'search' && (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <RadarAnimation />

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="w-full gradient-nexora text-nexora-foreground font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
                    >
                      {isSearching ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Search className="size-4" />
                          </motion.div>
                          Recherche en cours...
                        </>
                      ) : (
                        <>
                          <Search className="size-4" />
                          Rechercher des appareils proches
                        </>
                      )}
                    </motion.button>

                    {/* File type icons */}
                    <div className="flex justify-center gap-4">
                      {fileTypes.map((ft) => {
                        const Icon = ft.icon
                        return (
                          <motion.div
                            key={ft.label}
                            whileHover={{ scale: 1.15, y: -2 }}
                            className="flex flex-col items-center gap-1 cursor-default"
                          >
                            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                              <Icon className={`size-5 ${ft.color}`} />
                            </div>
                            <span className="text-[9px] text-muted-foreground">{ft.label}</span>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Device list */}
                {step === 'devices' && (
                  <motion.div
                    key="devices"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Appareils détectés</h4>
                      <button
                        onClick={handleReset}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {nearbyDevices.map((device, i) => (
                        <motion.button
                          key={device.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectDevice(device.name)}
                          className="w-full glass rounded-xl p-3 flex items-center gap-3 text-left hover:glow-nexora transition-shadow"
                        >
                          <div
                            className={`w-10 h-10 rounded-full ${device.color} flex items-center justify-center shrink-0`}
                          >
                            <span className="text-xs font-bold text-nexora-foreground">
                              {device.avatar}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{device.name}</p>
                            <p className="text-[10px] text-muted-foreground">{device.device}</p>
                          </div>
                          <SignalStrength level={device.signal} />
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </motion.button>
                      ))}
                    </div>

                    {/* Drag & drop zone */}
                    <motion.div
                      onHoverStart={() => setIsDragging(true)}
                      onHoverEnd={() => setIsDragging(false)}
                      className={`glass rounded-xl p-6 border-2 border-dashed transition-colors text-center ${
                        isDragging
                          ? 'border-nexora/50 bg-nexora/5'
                          : 'border-border hover:border-nexora/30'
                      }`}
                    >
                      <Upload
                        className={`size-8 mx-auto mb-2 transition-colors ${
                          isDragging ? 'text-nexora' : 'text-muted-foreground'
                        }`}
                      />
                      <p className="text-xs text-muted-foreground">
                        Glissez-déposez vos fichiers ici
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        PDF, Vidéo, Image, Document
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 3: Transfer */}
                {step === 'transfer' && (
                  <motion.div
                    key="transfer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 text-center"
                  >
                    <div>
                      <Smartphone className="size-6 mx-auto text-nexora mb-2" />
                      <p className="text-sm font-medium">Envoi vers {selectedDevice}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Cours_SVT_BAC.pdf • 2.4 MB
                      </p>
                    </div>

                    <TransferProgress progress={transferProgress} complete={transferProgress >= 100} />

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Vitesse: ~4.2 MB/s</span>
                        <span>Wi-Fi Direct</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Success */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
                    className="space-y-6 text-center relative"
                  >
                    <ConfettiBurst />

                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                      className="w-16 h-16 rounded-full gradient-nexora flex items-center justify-center mx-auto glow-nexora"
                    >
                      <Check className="size-8 text-nexora-foreground" />
                    </motion.div>

                    <div>
                      <p className="font-semibold text-lg">Fichier envoyé !</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedDevice} a reçu le fichier avec succès
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleReset}
                        className="flex-1 gradient-nexora text-nexora-foreground font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <Wifi className="size-4" />
                        Partager via Wi-Fi Direct
                      </motion.button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleReset}
                      className="w-full glass font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:glow-nexora transition-shadow border border-nexora/20"
                    >
                      <Bluetooth className="size-4 text-nexora" />
                      Partager via Bluetooth
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Connection options (always visible) */}
              {step === 'search' && (
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 glass font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:glow-nexora transition-shadow border border-nexora/10"
                  >
                    <Wifi className="size-4 text-nexora" />
                    Wi-Fi Direct
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 glass font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:glow-gold transition-shadow border border-gold/10"
                  >
                    <Bluetooth className="size-4 text-gold" />
                    Bluetooth
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
