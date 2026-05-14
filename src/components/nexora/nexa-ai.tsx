'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  FileText,
  Camera,
  Languages,
  FileBadge,
  Briefcase,
  Mail,
  Mic,
  Send,
  Paperclip,
  Globe,
  Bot,
  User,
  Loader2,
} from 'lucide-react'
import { useNexoraStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

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

interface Message {
  id: string
  role: 'ai' | 'user'
  content: string
  isStreaming?: boolean
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'ai',
    content:
      'Bonjour ! Je suis Nexa, votre assistant intelligent. Comment puis-je vous aider aujourd\'hui ? 😊',
  },
  {
    id: '2',
    role: 'user',
    content: 'Aide-moi à résumer mon cours de mathématiques',
  },
  {
    id: '3',
    role: 'ai',
    content:
      'Bien sûr ! Partagez votre document PDF ou collez le texte ici, et je générerai un résumé concis avec les points clés. Je peux aussi créer des fiches de révision !',
  },
  {
    id: '4',
    role: 'user',
    content: 'Comment rédiger une lettre de motivation ?',
  },
  {
    id: '5',
    role: 'ai',
    content:
      'Je peux vous aider à créer une lettre professionnelle. Dites-moi : quel poste visez-vous et quelles sont vos qualifications ? Je générerai un modèle adapté au contexte africain.',
  },
]

const quickActions = [
  { icon: FileText, label: 'Résumer un PDF', color: 'bg-nexora/20 text-nexora', prompt: 'Aide-moi à résumer un document PDF. Je vais coller le texte ou télécharger le fichier.' },
  { icon: Camera, label: 'Corriger un exercice', color: 'bg-emerald/20 text-emerald', prompt: 'J\'ai besoin de corriger un exercice. Je vais vous partager l\'énoncé.' },
  { icon: Languages, label: 'Traduire en Wolof', color: 'bg-amber/20 text-amber', prompt: 'Traduis le texte suivant en Wolof :' },
  { icon: FileBadge, label: 'Générer un CV', color: 'bg-gold/20 text-gold', prompt: 'Aide-moi à générer un CV professionnel. Je vais vous donner mes informations.' },
  { icon: Briefcase, label: 'Business Plan', color: 'bg-nexora/20 text-nexora', prompt: 'Aide-moi à créer un business plan pour mon projet entrepreneurial.' },
  { icon: Mail, label: 'Lettre de motivation', color: 'bg-emerald/20 text-emerald', prompt: 'Aide-moi à rédiger une lettre de motivation professionnelle.' },
]

export default function NexaAI() {
  const { lowDataMode } = useNexoraStore()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Streaming-like effect: reveal AI response word by word
  const streamResponse = useCallback((msgId: string, fullContent: string) => {
    const words = fullContent.split(' ')
    let currentIdx = 0

    const interval = setInterval(() => {
      currentIdx++
      if (currentIdx >= words.length) {
        clearInterval(interval)
        // Mark streaming as complete
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, content: fullContent, isStreaming: false } : m
          )
        )
        return
      }

      const partialContent = words.slice(0, currentIdx + 1).join(' ')
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, content: partialContent } : m
        )
      )
    }, 30) // ~30ms per word for a natural typing feel
  }, [])

  const handleSend = useCallback(async (customMessage?: string) => {
    const messageText = customMessage || input.trim()
    if (!messageText || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    // Build conversation history for the API (last 10 messages for context window)
    const history = messages.slice(-10).map((m) => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content,
    }))

    // Add the current user message to history
    history.push({ role: 'user', content: messageText })

    // Create a placeholder AI message for streaming
    const aiMsgId = (Date.now() + 1).toString()
    const aiMsg: Message = {
      id: aiMsgId,
      role: 'ai',
      content: '',
      isStreaming: true,
    }
    setMessages((prev) => [...prev, aiMsg])

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          message: messageText,
          history: history.slice(0, -1), // Send previous history (excluding the current message which is also sent as `message`)
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantContent = data.content || 'Je suis désolé, je n\'ai pas pu générer une réponse. Veuillez réessayer.'

      // Stream the response word by word
      streamResponse(aiMsgId, assistantContent)
    } catch (error: unknown) {
      // Remove the empty AI message placeholder
      setMessages((prev) => prev.filter((m) => m.id !== aiMsgId))

      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, don't show error
        return
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Une erreur inconnue est survenue.'

      toast({
        title: 'Erreur Nexa IA',
        description: errorMessage || 'Impossible de contacter Nexa. Vérifiez votre connexion et réessayez.',
        variant: 'destructive',
      })

      // Add a fallback AI message
      const fallbackMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'ai',
        content: 'Désolé, je n\'ai pas pu traiter votre demande. Vérifiez votre connexion internet et réessayez. 🔌',
      }
      setMessages((prev) => [...prev, fallbackMsg])
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [input, isLoading, messages, streamResponse, toast])

  const handleQuickAction = (action: typeof quickActions[number]) => {
    handleSend(action.prompt)
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col h-full"
    >
      {/* AI Status Bar */}
      <motion.div
        variants={slideUp}
        className="flex items-center justify-between px-4 py-2"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="w-5 h-5 text-nexora" />
            <span
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${
                isLoading ? 'bg-amber animate-pulse' : lowDataMode ? 'bg-amber' : 'bg-emerald'
              }`}
            />
          </div>
          <div>
            <p className="text-sm font-semibold">Nexa IA</p>
            <p className="text-[10px] text-muted-foreground">
              {isLoading ? 'En train de réfléchir...' : lowDataMode ? 'Mode hors-ligne (SLM local)' : 'En ligne'}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium ${
            isLoading
              ? 'bg-amber/10 text-amber border border-amber/20'
              : lowDataMode
              ? 'bg-amber/10 text-amber border border-amber/20'
              : 'bg-emerald/10 text-emerald border border-emerald/20'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isLoading ? 'bg-amber' : lowDataMode ? 'bg-amber' : 'bg-emerald'
            } animate-pulse`}
          />
          {isLoading ? 'Traitement...' : lowDataMode ? 'Hors-ligne' : 'Connecté'}
        </div>
      </motion.div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-4 py-2 space-y-3"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full gradient-nexora flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'gradient-nexora text-white rounded-br-md'
                    : 'glass rounded-bl-md'
                }`}
              >
                {msg.isStreaming && !msg.content ? (
                  // Typing indicator
                  <div className="flex items-center gap-1.5 py-1">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-nexora"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-nexora"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-nexora"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                ) : (
                  <>
                    {msg.content}
                    {msg.isStreaming && msg.content && (
                      <motion.span
                        className="inline-block w-1.5 h-4 bg-nexora rounded-sm ml-0.5 align-middle"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    )}
                  </>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator at the bottom */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-2"
          >
            <Loader2 className="w-3 h-3 text-nexora animate-spin" />
            <span className="text-xs text-muted-foreground">Nexa réfléchit...</span>
          </motion.div>
        )}
      </div>

      {/* One-Tap Actions */}
      <div className="px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 -mx-1 px-1">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action)}
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${action.color} border border-current/10 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100`}
            >
              <action.icon className="w-3.5 h-3.5" />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Button */}
      <div className="flex justify-center py-2">
        <button
          onClick={() => setIsListening(!isListening)}
          className="relative group"
        >
          {isListening && (
            <span className="absolute inset-0 rounded-full gradient-nexora animate-ping opacity-30" />
          )}
          <div
            className={`w-16 h-16 rounded-full gradient-nexora flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
              isListening ? 'animate-glow' : ''
            }`}
          >
            <Mic className="w-7 h-7 text-white" />
          </div>
        </button>
      </div>
      <p className="text-center text-[10px] text-muted-foreground -mt-1">
        Appuyez pour parler
      </p>

      {/* Input Area */}
      <div className="glass-strong rounded-t-2xl px-4 py-3 mt-2">
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full glass flex items-center justify-center shrink-0 hover:glass-strong transition-all">
            <Paperclip className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex-1 flex items-center gap-2 glass rounded-full px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Écrivez votre message..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="w-9 h-9 rounded-full gradient-nexora flex items-center justify-center shrink-0 hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Language Support */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <Globe className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            Wolof • Swahili • Bambara • Français
          </span>
        </div>
      </div>
    </motion.div>
  )
}
