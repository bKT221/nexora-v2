'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  X,
  ArrowRight,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

// Countries list
const countries = [
  'Sénégal',
  'Côte d\'Ivoire',
  'Mali',
  'Cameroun',
  'Guinée',
  'Burkina Faso',
  'Niger',
  'Togo',
  'Bénin',
]

type ProfileType = 'etudiant' | 'entrepreneur'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'register'
}

// Backdrop + modal wrapper
function ModalWrapper({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-md z-10"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Login Form — wired to NextAuth
function LoginForm({ onToggleMode, onClose }: { onToggleMode: () => void; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError(result.error)
        toast({
          title: 'Erreur de connexion',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Bienvenue ! 🎉',
          description: 'Vous êtes maintenant connecté.',
        })
        onClose()
      }
    } catch {
      setError('Une erreur inattendue est survenue.')
      toast({
        title: 'Erreur',
        description: 'Impossible de se connecter. Veuillez réessayer.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-14 h-14 rounded-2xl gradient-nexora flex items-center justify-center mx-auto shadow-lg glow-nexora"
        >
          <Lock className="w-7 h-7 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gradient-nexora">Bon retour !</h2>
        <p className="text-sm text-muted-foreground">Connectez-vous à votre espace Nexora</p>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative"
        >
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12 glass border-white/10 bg-white/5 focus:border-nexora/50 transition-colors"
            required
            disabled={isLoading}
          />
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 h-12 glass border-white/10 bg-white/5 focus:border-nexora/50 transition-colors"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </motion.div>

        {/* Forgot Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-right"
        >
          <button type="button" className="text-xs text-nexora hover:underline font-medium">
            Mot de passe oublié ?
          </button>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 gradient-nexora text-white font-semibold text-sm rounded-xl shadow-lg hover:opacity-90 transition-opacity relative overflow-hidden"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Se connecter
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </motion.div>
      </form>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="relative flex items-center gap-3"
      >
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-muted-foreground">ou continuer avec</span>
        <div className="flex-1 h-px bg-white/10" />
      </motion.div>

      {/* Social Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 glass border-white/10 hover:bg-white/10 text-sm font-medium rounded-xl"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuer avec Google
        </Button>

        {/* Phone */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 glass border-white/10 hover:bg-white/10 text-sm font-medium rounded-xl"
        >
          <Phone className="w-4 h-4 mr-2 text-emerald" />
          Continuer avec téléphone
        </Button>
      </motion.div>

      {/* Toggle to Register */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-center pt-2"
      >
        <p className="text-sm text-muted-foreground">
          Pas encore de compte ?{' '}
          <button
            onClick={onToggleMode}
            className="text-nexora font-semibold hover:underline"
          >
            Inscrivez-vous
          </button>
        </p>
      </motion.div>
    </motion.div>
  )
}

// Register Form — creates user via API then signs in
function RegisterForm({ onToggleMode, onClose }: { onToggleMode: () => void; onClose: () => void }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [profileType, setProfileType] = useState<ProfileType>('etudiant')
  const [country, setCountry] = useState('Sénégal')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Create the user via our API
      const createRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          password,
          profile: profileType,
          country,
        }),
      })

      const createData = await createRes.json()

      if (!createRes.ok) {
        const errorMsg = createData.error || 'Erreur lors de la création du compte.'
        setError(errorMsg)
        toast({
          title: 'Erreur d\'inscription',
          description: errorMsg,
          variant: 'destructive',
        })
        return
      }

      // Automatically sign in after successful registration
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        // Account was created but auto-login failed — switch to login form
        toast({
          title: 'Compte créé !',
          description: 'Veuillez vous connecter avec vos identifiants.',
        })
        onToggleMode()
      } else {
        toast({
          title: 'Bienvenue sur Nexora ! 🎉',
          description: 'Votre compte a été créé avec succès.',
        })
        onClose()
      }
    } catch {
      setError('Une erreur inattendue est survenue.')
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le compte. Veuillez réessayer.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-14 h-14 rounded-2xl gradient-nexora flex items-center justify-center mx-auto shadow-lg glow-nexora"
        >
          <User className="w-7 h-7 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gradient-nexora">Rejoignez Nexora</h2>
        <p className="text-sm text-muted-foreground">Créez votre compte en quelques secondes</p>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Full Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="pl-10 h-11 glass border-white/10 bg-white/5 focus:border-nexora/50 transition-colors text-sm"
            required
            disabled={isLoading}
          />
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13 }}
          className="relative"
        >
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-11 glass border-white/10 bg-white/5 focus:border-nexora/50 transition-colors text-sm"
            required
            disabled={isLoading}
          />
        </motion.div>

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="relative"
        >
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="tel"
            placeholder="Numéro de téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-10 h-11 glass border-white/10 bg-white/5 focus:border-nexora/50 transition-colors text-sm"
            disabled={isLoading}
          />
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.19 }}
          className="relative"
        >
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 h-11 glass border-white/10 bg-white/5 focus:border-nexora/50 transition-colors text-sm"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </motion.div>

        {/* Profile Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="space-y-2"
        >
          <label className="text-xs text-muted-foreground font-medium">Profil</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setProfileType('etudiant')}
              className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                profileType === 'etudiant'
                  ? 'gradient-nexora text-white shadow-lg glow-nexora'
                  : 'glass border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              🎓 Étudiant
            </button>
            <button
              type="button"
              onClick={() => setProfileType('entrepreneur')}
              className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                profileType === 'entrepreneur'
                  ? 'gradient-gold text-gold-foreground shadow-lg glow-gold'
                  : 'glass border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              💼 Entrepreneur
            </button>
          </div>
        </motion.div>

        {/* Country Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-2"
        >
          <label className="text-xs text-muted-foreground font-medium">Pays</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={isLoading}
              className="w-full h-11 pl-10 pr-4 glass border border-white/10 rounded-xl text-sm bg-transparent text-foreground cursor-pointer focus:border-nexora/50 transition-colors appearance-none"
            >
              {countries.map((c) => (
                <option key={c} value={c} className="bg-background text-foreground">
                  {c}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="pt-1"
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 gradient-nexora text-white font-semibold text-sm rounded-xl shadow-lg hover:opacity-90 transition-opacity relative overflow-hidden"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Créer mon compte
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </motion.div>
      </form>

      {/* Terms */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.31 }}
        className="text-[10px] text-center text-muted-foreground leading-relaxed"
      >
        En créant un compte, vous acceptez nos{' '}
        <button className="text-nexora hover:underline">Conditions d&apos;utilisation</button>
        {' '}et notre{' '}
        <button className="text-nexora hover:underline">Politique de confidentialité</button>
      </motion.p>

      {/* Toggle to Login */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.34 }}
        className="text-center"
      >
        <p className="text-sm text-muted-foreground">
          J&apos;ai déjà un compte{' '}
          <button
            onClick={onToggleMode}
            className="text-nexora font-semibold hover:underline"
          >
            Se connecter
          </button>
        </p>
      </motion.div>
    </motion.div>
  )
}

// Main Auth Modal Component
export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode)

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'))
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-nexora/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mode Badge */}
        <div className="flex items-center justify-center mb-4">
          <Badge
            variant="outline"
            className={`text-xs px-3 py-1 ${
              mode === 'login'
                ? 'border-nexora/30 text-nexora'
                : 'border-gold/30 text-gold'
            }`}
          >
            {mode === 'login' ? 'Connexion' : 'Inscription'}
          </Badge>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <LoginForm key="login" onToggleMode={toggleMode} onClose={onClose} />
          ) : (
            <RegisterForm key="register" onToggleMode={toggleMode} onClose={onClose} />
          )}
        </AnimatePresence>
      </div>
    </ModalWrapper>
  )
}

// Standalone hook for managing auth modal state
export function useAuthModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const openLogin = () => {
    setMode('login')
    setIsOpen(true)
  }

  const openRegister = () => {
    setMode('register')
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)

  return { isOpen, mode, openLogin, openRegister, close }
}
