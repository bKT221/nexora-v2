'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  Wallet,
  ArrowRight,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

// Payment method configuration with brand colors
const paymentMethods = [
  {
    id: 'wave',
    name: 'Wave',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/15',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    iconBg: 'bg-blue-500',
    prefix: '+221',
  },
  {
    id: 'orange',
    name: 'Orange Money',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500/15',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400',
    iconBg: 'bg-orange-500',
    prefix: '+221',
  },
  {
    id: 'mtn',
    name: 'MTN Money',
    color: 'from-yellow-400 to-yellow-500',
    bgColor: 'bg-yellow-500/15',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500',
    prefix: '+225',
  },
  {
    id: 'moov',
    name: 'Moov Money',
    color: 'from-cyan-400 to-cyan-500',
    bgColor: 'bg-cyan-500/15',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500',
    prefix: '+225',
  },
]

type PaymentStep = 'method' | 'phone' | 'pin' | 'processing' | 'success' | 'failure'

interface MobileMoneyModalProps {
  isOpen: boolean
  onClose: () => void
  productTitle: string
  productPrice: number
  productId: string
  onSuccess?: (transactionId: string) => void
}

export default function MobileMoneyModal({
  isOpen,
  onClose,
  productTitle,
  productPrice,
  productId,
  onSuccess,
}: MobileMoneyModalProps) {
  const [step, setStep] = useState<PaymentStep>('method')
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pin, setPin] = useState('')
  const [transactionId, setTransactionId] = useState('')

  const currentMethod = paymentMethods.find((m) => m.id === selectedMethod)

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId)
    setStep('phone')
  }

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 8) {
      setStep('pin')
    }
  }

  const handlePinSubmit = async () => {
    if (pin.length < 4) return
    setStep('processing')

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user',
          productId,
          method: selectedMethod,
          phone: `${currentMethod?.prefix}${phoneNumber}`,
          amount: productPrice,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setTransactionId(data.transactionId)
        setStep('success')
        onSuccess?.(data.transactionId)
      } else {
        setStep('failure')
      }
    } catch {
      setStep('failure')
    }
  }

  const handleRetry = () => {
    setPin('')
    setStep('pin')
  }

  const handleReset = () => {
    setStep('method')
    setSelectedMethod(null)
    setPhoneNumber('')
    setPin('')
    setTransactionId('')
  }

  const handleClose = () => {
    // Reset state on close
    setTimeout(() => {
      handleReset()
    }, 300)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="glass-strong border-border/50 max-w-md p-0 overflow-hidden"
        showCloseButton={step !== 'processing'}
      >
        <AnimatePresence mode="wait">
          {/* Step 1: Select Payment Method */}
          {step === 'method' && (
            <motion.div
              key="method"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-nexora" />
                  Paiement Mobile Money
                </DialogTitle>
                <DialogDescription>
                  Choisissez votre méthode de paiement
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 pb-4">
                <div className="glass rounded-xl p-3 mb-4 flex items-center justify-between">
                  <span className="text-sm truncate mr-2">{productTitle}</span>
                  <Badge className="gradient-nexora text-white border-0 shrink-0">
                    {productPrice.toLocaleString()} F
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectMethod(method.id)}
                      className={`${method.bgColor} ${method.borderColor} border rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:shadow-lg`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center`}
                      >
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <span
                        className={`text-xs font-semibold ${method.textColor}`}
                      >
                        {method.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Phone Number */}
          {step === 'phone' && currentMethod && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-nexora" />
                  Payer avec {currentMethod.name}
                </DialogTitle>
                <DialogDescription>
                  Entrez votre numéro de téléphone
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 pb-6 space-y-4">
                <div className="glass rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm truncate mr-2">{productTitle}</span>
                  <Badge className="gradient-nexora text-white border-0 shrink-0">
                    {productPrice.toLocaleString()} F
                  </Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Numéro de téléphone
                  </label>
                  <div className="flex gap-2">
                    <div
                      className={`${currentMethod.bgColor} ${currentMethod.borderColor} border rounded-lg px-3 py-2 text-sm font-mono ${currentMethod.textColor} flex items-center`}
                    >
                      {currentMethod.prefix}
                    </div>
                    <Input
                      type="tel"
                      placeholder="7X XXX XX XX"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(
                          e.target.value.replace(/\D/g, '').slice(0, 9)
                        )
                      }
                      className="glass font-mono text-lg tracking-wider"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep('method')}
                  >
                    Retour
                  </Button>
                  <Button
                    className={`flex-1 bg-gradient-to-r ${currentMethod.color} text-white border-0 hover:opacity-90 transition-opacity`}
                    onClick={handlePhoneSubmit}
                    disabled={phoneNumber.length < 8}
                  >
                    Continuer
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: PIN Confirmation */}
          {step === 'pin' && currentMethod && (
            <motion.div
              key="pin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-nexora" />
                  Confirmer le paiement
                </DialogTitle>
                <DialogDescription>
                  Entrez votre code PIN {currentMethod.name}
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 pb-6 space-y-4">
                <div className="glass rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Montant</span>
                    <span className="text-lg font-bold text-gradient-nexora">
                      {productPrice.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Méthode</span>
                    <Badge
                      className={`${currentMethod.bgColor} ${currentMethod.borderColor} ${currentMethod.textColor} border`}
                    >
                      {currentMethod.name}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Téléphone</span>
                    <span className="text-sm font-mono">
                      {currentMethod.prefix} {phoneNumber}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Code PIN
                  </label>
                  <div className="flex justify-center gap-3 py-2">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: pin.length > i ? 1.1 : 1,
                          borderColor:
                            pin.length > i
                              ? 'var(--color-nexora, #2d8a6e)'
                              : 'transparent',
                        }}
                        className="w-12 h-14 rounded-xl glass border-2 flex items-center justify-center text-xl font-bold"
                      >
                        {pin.length > i ? '•' : ''}
                      </motion.div>
                    ))}
                  </div>
                  <Input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                    }
                    className="sr-only"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && pin.length >= 4) {
                        handlePinSubmit()
                      }
                    }}
                  />
                  {/* Numeric keypad */}
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map(
                      (key, i) => (
                        <button
                          key={i}
                          disabled={key === ''}
                          onClick={() => {
                            if (key === '⌫') {
                              setPin((p) => p.slice(0, -1))
                            } else if (typeof key === 'number' && pin.length < 4) {
                              setPin((p) => p + key)
                            }
                          }}
                          className={`${
                            key === ''
                              ? 'invisible'
                              : 'glass hover:glass-strong'
                          } rounded-xl py-3 text-lg font-semibold transition-all active:scale-95`}
                        >
                          {key}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep('phone')}
                  >
                    Retour
                  </Button>
                  <Button
                    className={`flex-1 bg-gradient-to-r ${currentMethod.color} text-white border-0 hover:opacity-90 transition-opacity`}
                    onClick={handlePinSubmit}
                    disabled={pin.length < 4}
                  >
                    Confirmer
                    <Shield className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Processing */}
          {step === 'processing' && currentMethod && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="py-12 px-6 flex flex-col items-center text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentMethod.color} flex items-center justify-center mb-6`}
              >
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </motion.div>

              <h3 className="text-lg font-bold mb-2">Traitement en cours...</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Veuillez patienter pendant le traitement de votre paiement
              </p>

              <div className="glass rounded-xl p-3 w-full flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Montant</span>
                <span className="text-lg font-bold text-gradient-nexora">
                  {productPrice.toLocaleString()} FCFA
                </span>
              </div>

              {/* Animated dots */}
              <div className="flex gap-1.5 mt-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-nexora"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5: Success */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
              className="py-10 px-6 flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  delay: 0.1,
                }}
                className="w-20 h-20 rounded-full bg-emerald/20 border-2 border-emerald/50 flex items-center justify-center mb-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  <CheckCircle className="w-10 h-10 text-emerald" />
                </motion.div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold text-emerald mb-2"
              >
                Paiement réussi !
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-muted-foreground mb-6"
              >
                Votre paiement a été traité avec succès
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-xl p-4 w-full space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Produit</span>
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {productTitle}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Montant</span>
                  <span className="text-sm font-bold text-gradient-nexora">
                    {productPrice.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    ID Transaction
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {transactionId}
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 w-full"
              >
                <Button
                  className="w-full gradient-nexora text-white border-0 hover:opacity-90 font-semibold"
                  onClick={handleClose}
                >
                  Fermer
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 6: Failure */}
          {step === 'failure' && (
            <motion.div
              key="failure"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
              className="py-10 px-6 flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  delay: 0.1,
                }}
                className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center mb-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  <XCircle className="w-10 h-10 text-red-400" />
                </motion.div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold text-red-400 mb-2"
              >
                Paiement échoué
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-muted-foreground mb-6"
              >
                Une erreur est survenue lors du paiement. Veuillez réessayer.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-2 w-full"
              >
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 gradient-nexora text-white border-0 hover:opacity-90"
                  onClick={handleRetry}
                >
                  Réessayer
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
