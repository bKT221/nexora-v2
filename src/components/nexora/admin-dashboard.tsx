'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  BarChart3,
  Bot,
  Shield,
  Wallet,
  Users,
  GraduationCap,
  ShoppingBag,
  Settings,
  ChevronLeft,
  ChevronRight,
  Trophy,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Phone,
  CreditCard,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Globe,
  Server,
  Cloud,
  Monitor,
  RefreshCw,
  MoreHorizontal,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

// Types
type AdminTab =
  | 'overview'
  | 'analytics'
  | 'ia'
  | 'moderation'
  | 'finance'
  | 'users'
  | 'courses'
  | 'marketplace'
  | 'settings'

interface NavItem {
  key: AdminTab
  label: string
  icon: typeof LayoutDashboard
}

// Mock Data
const revenueData = [
  { month: 'Jan', revenue: 3200000, users: 12000 },
  { month: 'Fév', revenue: 3500000, users: 13200 },
  { month: 'Mar', revenue: 4100000, users: 15800 },
  { month: 'Avr', revenue: 3800000, users: 16200 },
  { month: 'Mai', revenue: 4600000, users: 18900 },
  { month: 'Jun', revenue: 5200000, users: 21000 },
  { month: 'Jul', revenue: 4900000, users: 22500 },
  { month: 'Aoû', revenue: 5400000, users: 24800 },
  { month: 'Sep', revenue: 5800000, users: 27200 },
  { month: 'Oct', revenue: 5500000, users: 29100 },
  { month: 'Nov', revenue: 5700000, users: 31200 },
  { month: 'Déc', revenue: 5800000, users: 33500 },
]

const regionalData = [
  { region: 'Sénégal', users: 48200, revenue: 2100000 },
  { region: 'Côte d\'Ivoire', users: 38500, revenue: 1650000 },
  { region: 'Mali', users: 24300, revenue: 980000 },
  { region: 'Cameroun', users: 22100, revenue: 890000 },
  { region: 'Guinée', users: 18700, revenue: 720000 },
]

const aiUsageData = [
  { name: 'Résumé PDF', value: 35, color: 'oklch(0.6 0.2 155)' },
  { name: 'Correction', value: 25, color: 'oklch(0.8 0.16 80)' },
  { name: 'Traduction', value: 20, color: 'oklch(0.55 0.17 155)' },
  { name: 'CV', value: 12, color: 'oklch(0.78 0.16 65)' },
  { name: 'Business Plan', value: 8, color: 'oklch(0.7 0.18 45)' },
]

const userGrowthData = [
  { month: 'Jan', total: 45000, active: 32000 },
  { month: 'Fév', total: 52000, active: 37000 },
  { month: 'Mar', total: 61000, active: 43000 },
  { month: 'Avr', total: 72000, active: 51000 },
  { month: 'Mai', total: 85000, active: 62000 },
  { month: 'Jun', total: 98000, active: 71000 },
  { month: 'Jul', total: 110000, active: 79000 },
  { month: 'Aoû', total: 122000, active: 88000 },
  { month: 'Sep', total: 131000, active: 95000 },
  { month: 'Oct', total: 140000, active: 102000 },
  { month: 'Nov', total: 147000, active: 108000 },
  { month: 'Déc', total: 152847, active: 113000 },
]

const quizCompletionData = [
  { subject: 'Maths', completion: 82 },
  { subject: 'Physique', completion: 75 },
  { subject: 'SVT', completion: 68 },
  { subject: 'Français', completion: 90 },
  { subject: 'Histoire', completion: 72 },
  { subject: 'Anglais', completion: 85 },
]

const subscriptionData = [
  { name: 'Gratuit', value: 68, color: 'oklch(0.5 0.01 120)' },
  { name: 'Gold', value: 22, color: 'oklch(0.8 0.16 80)' },
  { name: 'Exam Pack', value: 10, color: 'oklch(0.6 0.2 155)' },
]

const revenueByRegionData = [
  { region: 'Sénégal', revenue: 2100000 },
  { region: 'Côte d\'Ivoire', revenue: 1650000 },
  { region: 'Mali', revenue: 980000 },
  { region: 'Cameroun', revenue: 890000 },
  { region: 'Guinée', revenue: 720000 },
  { region: 'Burkina', revenue: 540000 },
  { region: 'Niger', revenue: 380000 },
  { region: 'Togo', revenue: 290000 },
]

const recentAIQueries = [
  { id: 1, user: 'Amadou Diallo', query: 'Résume le document de physique quantique chapitre 3', time: '14:23', model: 'cloud' },
  { id: 2, user: 'Fatou Sow', query: 'Corrige ma dissertation sur la colonisation', time: '14:21', model: 'local' },
  { id: 3, user: 'Ibrahim Touré', query: 'Traduis ce texte en wolof', time: '14:18', model: 'cloud' },
  { id: 4, user: 'Aïcha Bamba', query: 'Génère un CV pour un poste de développeur', time: '14:15', model: 'cloud' },
  { id: 5, user: 'Moussa Konaté', query: 'Crée un business plan pour une startup agricole', time: '14:12', model: 'cloud' },
  { id: 6, user: 'Mariam Cissé', query: 'Résume le cours de mathématiques terminale', time: '14:10', model: 'local' },
  { id: 7, user: 'Oumar Sy', query: 'Correction du Bac Blanc SVT 2024', time: '14:08', model: 'cloud' },
  { id: 8, user: 'Kadiatou Bah', query: 'Traduis mon discours en malinké', time: '14:05', model: 'local' },
  { id: 9, user: 'Seydou Traoré', query: 'Business plan restaurant à Dakar', time: '14:02', model: 'cloud' },
  { id: 10, user: 'Aminata Diop', query: 'Génère CV format canadien', time: '14:00', model: 'cloud' },
]

const aiFeatureUsage = [
  { feature: 'Résumé PDF', queries: 31297, avgTime: '2.3s', cost: 125000 },
  { feature: 'Correction', queries: 22355, avgTime: '3.1s', cost: 89000 },
  { feature: 'Traduction', queries: 17884, avgTime: '1.8s', cost: 72000 },
  { feature: 'CV', queries: 10730, avgTime: '4.5s', cost: 43000 },
  { feature: 'Business Plan', queries: 7154, avgTime: '6.2s', cost: 65000 },
]

const flaggedContent = [
  { id: 1, type: 'spam', severity: 'medium', content: 'Achetez des Nexora Coins à moitié prix ! Cliquez ici...', reporter: 'Système Auto', time: '14:30' },
  { id: 2, type: 'inappropriate', severity: 'high', content: 'Contenu offensant dans le groupe de discussion Maths BTS...', reporter: 'Fatou M.', time: '14:25' },
  { id: 3, type: 'fraud', severity: 'critical', content: 'Utilisateur tentant de vendre des examens confidentiels...', reporter: 'Modérateur', time: '14:20' },
  { id: 4, type: 'copyright', severity: 'medium', content: 'Cours complet de physique publié sans autorisation...', reporter: 'Éditeur X', time: '14:15' },
  { id: 5, type: 'spam', severity: 'medium', content: 'Publicité non autorisée dans le forum académique...', reporter: 'Système Auto', time: '14:10' },
  { id: 6, type: 'inappropriate', severity: 'high', content: 'Commentaire inapproprié sous un cours de SVT...', reporter: 'Ibrahim T.', time: '14:05' },
]

const autoFilterData = [
  { name: 'Filtré auto', value: 73, color: 'oklch(0.6 0.2 155)' },
  { name: 'Révision manuelle', value: 27, color: 'oklch(0.78 0.16 65)' },
]

const transactions = [
  { id: 1, type: 'course_sale', desc: 'Cours BTS Mathématiques', amount: 15000, method: 'Wave', status: 'completed' },
  { id: 2, type: 'subscription', desc: 'Abonnement Gold - Mensuel', amount: 5000, method: 'Orange Money', status: 'completed' },
  { id: 3, type: 'freelance', desc: 'Mission Design Logo', amount: 75000, method: 'MTN Money', status: 'pending' },
  { id: 4, type: 'course_sale', desc: 'Pack Exam BAC 2024', amount: 10000, method: 'Wave', status: 'completed' },
  { id: 5, type: 'subscription', desc: 'Abonnement Gold - Annuel', amount: 45000, method: 'Moov Money', status: 'completed' },
  { id: 6, type: 'freelance', desc: 'Mission Développement Web', amount: 150000, method: 'Orange Money', status: 'pending' },
  { id: 7, type: 'course_sale', desc: 'Cours Philosophie Terminale', amount: 3500, method: 'Wave', status: 'completed' },
  { id: 8, type: 'subscription', desc: 'Exam Pack - BAC Série S', amount: 8000, method: 'MTN Money', status: 'failed' },
]

const mobileMoneyData = [
  { name: 'Wave', value: 42, color: '#1DA1F2' },
  { name: 'Orange Money', value: 28, color: '#FF6600' },
  { name: 'MTN Money', value: 18, color: '#FFCC00' },
  { name: 'Moov Money', value: 12, color: '#00A0E3' },
]

const withdrawalRequests = [
  { id: 1, user: 'Mamadou Diop', amount: 250000, method: 'Wave', status: 'pending', date: '2024-12-15' },
  { id: 2, user: 'Aïssatou Ba', amount: 180000, method: 'Orange Money', status: 'pending', date: '2024-12-15' },
  { id: 3, user: 'Cheikh Ndiaye', amount: 95000, method: 'MTN Money', status: 'pending', date: '2024-12-14' },
  { id: 4, user: 'Fatoumata Diallo', amount: 320000, method: 'Wave', status: 'pending', date: '2024-12-14' },
]

const userList = [
  { name: 'Amadou Diallo', email: 'amadou@email.com', xp: 3280, level: 12, subscription: 'gold', country: 'Sénégal' },
  { name: 'Fatou Sow', email: 'fatou.s@email.com', xp: 4150, level: 14, subscription: 'gold', country: 'Sénégal' },
  { name: 'Ibrahim Touré', email: 'ibrahim.t@email.com', xp: 2100, level: 8, subscription: 'free', country: 'Côte d\'Ivoire' },
  { name: 'Aïcha Bamba', email: 'aicha.b@email.com', xp: 5600, level: 19, subscription: 'gold', country: 'Mali' },
  { name: 'Moussa Konaté', email: 'moussa.k@email.com', xp: 890, level: 3, subscription: 'free', country: 'Guinée' },
  { name: 'Mariam Cissé', email: 'mariam.c@email.com', xp: 3400, level: 12, subscription: 'exam_pack', country: 'Cameroun' },
  { name: 'Oumar Sy', email: 'oumar.s@email.com', xp: 1800, level: 6, subscription: 'free', country: 'Sénégal' },
  { name: 'Kadiatou Bah', email: 'kadiatou.b@email.com', xp: 4900, level: 17, subscription: 'gold', country: 'Guinée' },
  { name: 'Seydou Traoré', email: 'seydou.t@email.com', xp: 1200, level: 4, subscription: 'exam_pack', country: 'Mali' },
  { name: 'Aminata Diop', email: 'aminata.d@email.com', xp: 6200, level: 21, subscription: 'gold', country: 'Sénégal' },
]

// Navigation items
const navItems: NavItem[] = [
  { key: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'ia', label: 'IA Monitoring', icon: Bot },
  { key: 'moderation', label: 'Modération', icon: Shield },
  { key: 'finance', label: 'Finance', icon: Wallet },
  { key: 'users', label: 'Utilisateurs', icon: Users },
  { key: 'courses', label: 'Cours', icon: GraduationCap },
  { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  { key: 'settings', label: 'Paramètres', icon: Settings },
]

// Utility: Format FCFA
function formatFCFA(amount: number): string {
  return amount.toLocaleString('fr-FR') + ' FCFA'
}

// Custom Tooltip for charts
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-xl px-4 py-3 shadow-xl border border-white/10">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color || '#fff' }}>
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? formatFCFA(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

// ===================== TAB COMPONENTS =====================

function OverviewTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px oklch(0.55 0.17 155 / 30%)' }}
          className="glass rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl gradient-nexora flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-nexora/15 text-nexora border-nexora/20 text-xs font-semibold">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5%
            </Badge>
          </div>
          <p className="text-2xl font-bold text-gradient-nexora">152 847</p>
          <p className="text-sm text-muted-foreground mt-1">Utilisateurs totaux</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px oklch(0.75 0.16 80 / 30%)' }}
          className="glass rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl gradient-gold flex items-center justify-center">
              <Wallet className="w-5 h-5 text-gold-foreground" />
            </div>
            <Badge className="bg-gold/15 text-gold border-gold/20 text-xs font-semibold">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18%
            </Badge>
          </div>
          <p className="text-2xl font-bold text-gradient-gold">5.8M FCFA</p>
          <p className="text-sm text-muted-foreground mt-1">Revenu mensuel</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px oklch(0.55 0.17 155 / 30%)' }}
          className="glass rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-emerald/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald" />
            </div>
            <Badge className="bg-emerald/15 text-emerald border-emerald/20 text-xs font-semibold">
              <TrendingUp className="w-3 h-3 mr-1" />
              +25%
            </Badge>
          </div>
          <p className="text-2xl font-bold text-emerald">89 420</p>
          <p className="text-sm text-muted-foreground mt-1">Requêtes IA</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px oklch(0.75 0.16 65 / 30%)' }}
          className="glass rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-amber/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber" />
            </div>
            <Badge className="bg-amber/15 text-amber border-amber/20 text-xs font-semibold">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3.2%
            </Badge>
          </div>
          <p className="text-2xl font-bold text-amber">87.3%</p>
          <p className="text-sm text-muted-foreground mt-1">Taux de réussite</p>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">Revenus mensuels</h3>
            <p className="text-sm text-muted-foreground">Évolution sur les 12 derniers mois</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-emerald border-emerald/30 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18% vs mois dernier
            </Badge>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.6 0.2 155)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.6 0.2 155)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
              <XAxis dataKey="month" tick={{ fill: 'oklch(0.65 0.01 120)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'oklch(0.65 0.01 120)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.6 0.2 155)" strokeWidth={3} fill="url(#revenueGradient)" name="Revenu" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Regional + AI Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-1">Performance régionale</h3>
          <p className="text-sm text-muted-foreground mb-4">Top 5 régions par utilisateurs</p>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'oklch(0.65 0.01 120)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="region" tick={{ fill: 'oklch(0.85 0.005 120)', fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="users" name="Utilisateurs" radius={[0, 6, 6, 0]} barSize={20}>
                  {regionalData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'oklch(0.6 0.2 155)' : index === 1 ? 'oklch(0.8 0.16 80)' : 'oklch(0.55 0.17 155 / 60%)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Usage Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-1">Usage IA par fonctionnalité</h3>
          <p className="text-sm text-muted-foreground mb-4">Distribution des requêtes</p>
          <div className="h-[280px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aiUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {aiUsageData.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 min-w-[140px]">
              {aiUsageData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                  <span className="text-xs font-semibold ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function AnalyticsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* User Growth Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold mb-1">Croissance utilisateurs</h3>
        <p className="text-sm text-muted-foreground mb-4">Total vs actifs sur 12 mois</p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.6 0.2 155)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.6 0.2 155)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.8 0.16 80)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.8 0.16 80)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
              <XAxis dataKey="month" tick={{ fill: 'oklch(0.65 0.01 120)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'oklch(0.65 0.01 120)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" stroke="oklch(0.6 0.2 155)" strokeWidth={2} fill="url(#totalGradient)" name="Total" />
              <Area type="monotone" dataKey="active" stroke="oklch(0.8 0.16 80)" strokeWidth={2} fill="url(#activeGradient)" name="Actifs" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-1">Complétion Quiz par matière</h3>
          <p className="text-sm text-muted-foreground mb-4">Taux de réussite moyen</p>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quizCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="subject" tick={{ fill: 'oklch(0.65 0.01 120)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'oklch(0.65 0.01 120)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completion" name="Complétion" radius={[6, 6, 0, 0]} barSize={32}>
                  {quizCompletionData.map((_, index) => (
                    <Cell key={`qc-${index}`} fill={index % 2 === 0 ? 'oklch(0.6 0.2 155)' : 'oklch(0.8 0.16 80)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Subscription Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-1">Distribution abonnements</h3>
          <p className="text-sm text-muted-foreground mb-4">Répartition par type</p>
          <div className="h-[280px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`sub-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 min-w-[130px]">
              {subscriptionData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs font-semibold ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Revenue by Region */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold mb-1">Revenus par région</h3>
        <p className="text-sm text-muted-foreground mb-4">Distribution géographique</p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByRegionData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'oklch(0.65 0.01 120)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} />
              <YAxis type="category" dataKey="region" tick={{ fill: 'oklch(0.85 0.005 120)', fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenu" radius={[0, 6, 6, 0]} barSize={22}>
                {revenueByRegionData.map((_, index) => (
                  <Cell key={`rev-${index}`} fill={index < 2 ? 'oklch(0.8 0.16 80)' : 'oklch(0.55 0.17 155 / 60%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  )
}

function IAMonitoringTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* AI Query Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ scale: 1.02 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald">89 420</p>
              <p className="text-xs text-muted-foreground">Requêtes totales</p>
            </div>
          </div>
          <Progress value={74} className="h-1.5 mt-2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber">2.8s</p>
              <p className="text-xs text-muted-foreground">Temps réponse moyen</p>
            </div>
          </div>
          <Progress value={82} className="h-1.5 mt-2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.02 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-nexora flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gradient-nexora">94.2%</p>
              <p className="text-xs text-muted-foreground">Satisfaction</p>
            </div>
          </div>
          <Progress value={94} className="h-1.5 mt-2" />
        </motion.div>
      </div>

      {/* Usage by Feature */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold mb-1">Usage par fonctionnalité IA</h3>
        <p className="text-sm text-muted-foreground mb-4">Nombre de requêtes par service</p>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aiFeatureUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
              <XAxis dataKey="feature" tick={{ fill: 'oklch(0.65 0.01 120)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'oklch(0.65 0.01 120)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="queries" name="Requêtes" radius={[6, 6, 0, 0]} barSize={36}>
                {aiFeatureUsage.map((_, index) => (
                  <Cell key={`ai-${index}`} fill={index % 2 === 0 ? 'oklch(0.6 0.2 155)' : 'oklch(0.8 0.16 80)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Queries Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-4">Requêtes récentes</h3>
          <div className="space-y-3 max-h-[380px] overflow-y-auto scrollbar-thin pr-1">
            {recentAIQueries.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass rounded-xl px-4 py-3 flex items-start gap-3 group hover:bg-white/5 transition-colors"
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="gradient-nexora text-white text-[10px] font-bold">
                    {q.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium truncate">{q.user}</span>
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${
                      q.model === 'cloud' ? 'text-nexora border-nexora/30' : 'text-amber border-amber/30'
                    }`}>
                      {q.model === 'cloud' ? <Cloud className="w-2.5 h-2.5 mr-0.5" /> : <Monitor className="w-2.5 h-2.5 mr-0.5" />}
                      {q.model === 'cloud' ? 'Cloud' : 'Local'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{q.query}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{q.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cost Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-4">Analyse des coûts IA</h3>
          <div className="space-y-4">
            {aiFeatureUsage.map((f, i) => (
              <motion.div
                key={f.feature}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{f.feature}</span>
                  <span className="text-sm font-bold text-gradient-gold">{formatFCFA(f.cost)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={(f.queries / 32000) * 100} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground min-w-[60px] text-right">{f.avgTime}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{f.queries.toLocaleString()} requêtes</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-sm font-semibold">Coût total estimé</span>
            <span className="text-lg font-bold text-gradient-nexora">{formatFCFA(394000)}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function ModerationTab() {
  const severityStyles: Record<string, string> = {
    medium: 'bg-amber/15 text-amber border-amber/30',
    high: 'bg-red-500/15 text-red-400 border-red-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse',
  }

  const typeStyles: Record<string, string> = {
    spam: 'text-muted-foreground',
    inappropriate: 'text-orange-400',
    fraud: 'text-red-400',
    copyright: 'text-blue-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 flex items-center gap-4 border-l-4 border-red-500"
      >
        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Alertes critiques en attente</p>
          <p className="text-xs text-muted-foreground">1 contenu critique nécessite une action immédiate</p>
        </div>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">1 Critique</Badge>
        <Badge className="bg-amber/15 text-amber border-amber/30">2 Élevé</Badge>
        <Badge className="bg-muted text-muted-foreground border-border">3 Moyen</Badge>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">File de modération</h3>
            <Badge variant="outline" className="text-xs">{flaggedContent.length} en attente</Badge>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
            {flaggedContent.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl px-4 py-3 group hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-0.5">
                    <Badge className={`text-[9px] px-1.5 py-0 ${severityStyles[item.severity]}`}>
                      {item.severity === 'critical' ? '🔴' : item.severity === 'high' ? '🟠' : '🟡'}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${typeStyles[item.type]}`}>
                        {item.type}
                      </Badge>
                      <Badge className={`text-[9px] px-1.5 py-0 ${severityStyles[item.severity]}`}>
                        {item.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/90 mb-1 line-clamp-1">{item.content}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>Rapporté par: {item.reporter}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-emerald hover:text-emerald hover:bg-emerald/10">
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-400 hover:bg-red-500/10">
                      <XCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-amber hover:text-amber hover:bg-amber/10">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Auto-Filter Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-4">Filtrage automatique</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={autoFilterData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {autoFilterData.map((entry, index) => (
                    <Cell key={`af-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: autoFilterData[0].color }} />
              <span className="text-sm text-muted-foreground">Filtré automatiquement</span>
              <span className="text-sm font-semibold ml-auto">{autoFilterData[0].value}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: autoFilterData[1].color }} />
              <span className="text-sm text-muted-foreground">Révision manuelle</span>
              <span className="text-sm font-semibold ml-auto">{autoFilterData[1].value}%</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
            <h4 className="text-sm font-semibold">Statistiques rapides</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contenus filtrés aujourd&apos;hui</span>
                <span className="font-semibold">247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Faux positifs</span>
                <span className="font-semibold text-amber">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Précision du filtre</span>
                <span className="font-semibold text-emerald">95.1%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function FinanceTab() {
  const statusStyles: Record<string, string> = {
    completed: 'text-emerald',
    pending: 'text-amber',
    failed: 'text-red-400',
  }

  const statusLabels: Record<string, string> = {
    completed: 'Complété',
    pending: 'En attente',
    failed: 'Échoué',
  }

  const typeLabels: Record<string, string> = {
    course_sale: 'Vente cours',
    subscription: 'Abonnement',
    freelance: 'Freelance',
  }

  const typeIcons: Record<string, typeof GraduationCap> = {
    course_sale: GraduationCap,
    subscription: Zap,
    freelance: Briefcase,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Revenue Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ scale: 1.02 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-nexora flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenu total</p>
              <p className="text-xl font-bold text-gradient-nexora">58.2M FCFA</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-gold-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Commissions</p>
              <p className="text-xl font-bold text-gradient-gold">5.8M FCFA</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.02 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Retraits en attente</p>
              <p className="text-xl font-bold text-amber">845K FCFA</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Transactions récentes</h3>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              <Download className="w-3 h-3 mr-1" />
              Exporter
            </Button>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
            {transactions.map((tx, i) => {
              const TypeIcon = typeIcons[tx.type] || Wallet
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <TypeIcon className="w-4 h-4 text-nexora" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tx.desc}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{typeLabels[tx.type]}</span>
                      <span>•</span>
                      <span>{tx.method}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{formatFCFA(tx.amount)}</p>
                    <p className={`text-[10px] font-medium ${statusStyles[tx.status]}`}>
                      {statusLabels[tx.status]}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Mobile Money Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-4">Mobile Money</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mobileMoneyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {mobileMoneyData.map((entry, index) => (
                    <Cell key={`mm-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {mobileMoneyData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
                <span className="text-xs font-semibold ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>

          {/* Withdrawal Queue */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <h4 className="text-sm font-semibold mb-3">Retraits en attente</h4>
            <div className="space-y-2">
              {withdrawalRequests.map((w, i) => (
                <div key={w.id} className="flex items-center gap-2 glass rounded-lg px-3 py-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="gradient-nexora text-white text-[8px] font-bold">
                      {w.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{w.user}</p>
                    <p className="text-[10px] text-muted-foreground">{w.method}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold">{formatFCFA(w.amount)}</p>
                    <div className="flex gap-1 mt-0.5">
                      <Button size="sm" variant="ghost" className="h-5 w-5 p-0 text-emerald hover:bg-emerald/10">
                        <CheckCircle2 className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-5 w-5 p-0 text-red-400 hover:bg-red-500/10">
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Briefcase icon for freelance
function Briefcase(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  )
}

function UsersTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [countryFilter, setCountryFilter] = useState('all')

  const countries = ['all', 'Sénégal', 'Côte d\'Ivoire', 'Mali', 'Cameroun', 'Guinée']

  const filteredUsers = userList.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCountry = countryFilter === 'all' || u.country === countryFilter
    return matchSearch && matchCountry
  })

  const subStyles: Record<string, string> = {
    free: 'bg-muted text-muted-foreground',
    gold: 'bg-gold/15 text-gold border-gold/30',
    exam_pack: 'bg-nexora/15 text-nexora border-nexora/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* User Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass rounded-2xl p-4 text-center"
        >
          <p className="text-2xl font-bold text-gradient-nexora">152 847</p>
          <p className="text-xs text-muted-foreground">Totaux</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 text-center"
        >
          <p className="text-2xl font-bold text-emerald">23 456</p>
          <p className="text-xs text-muted-foreground">Actifs aujourd&apos;hui</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-4 text-center"
        >
          <p className="text-2xl font-bold text-gold">4 821</p>
          <p className="text-xs text-muted-foreground">Nouveaux cette semaine</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4 text-center"
        >
          <p className="text-2xl font-bold text-amber">32%</p>
          <p className="text-xs text-muted-foreground">Abonnés payants</p>
        </motion.div>
      </div>

      {/* User Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-bold">Liste des utilisateurs</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 glass border-white/10 text-sm"
              />
            </div>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="h-9 px-3 glass rounded-lg border-white/10 text-sm bg-transparent text-foreground cursor-pointer"
            >
              {countries.map(c => (
                <option key={c} value={c} className="bg-background text-foreground">
                  {c === 'all' ? 'Tous les pays' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] gap-3 px-4 py-2 text-xs text-muted-foreground font-medium border-b border-white/5">
          <span>Utilisateur</span>
          <span>Email</span>
          <span className="text-center">XP / Niveau</span>
          <span className="text-center">Abonnement</span>
          <span className="text-center">Pays</span>
          <span className="text-center">Actions</span>
        </div>

        {/* User Rows */}
        <div className="space-y-1 mt-2 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
          {filteredUsers.map((user, i) => (
            <motion.div
              key={user.email}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-xl px-4 py-3 grid grid-cols-1 sm:grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] gap-2 sm:gap-3 items-center hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="gradient-nexora text-white text-[10px] font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate">{user.name}</span>
              </div>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              <div className="text-center">
                <span className="text-sm font-semibold text-gradient-nexora">{user.xp.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground ml-1">Lv.{user.level}</span>
              </div>
              <div className="text-center">
                <Badge className={`text-[10px] ${subStyles[user.subscription]}`}>
                  {user.subscription === 'exam_pack' ? 'Exam Pack' : user.subscription === 'gold' ? 'Gold' : 'Gratuit'}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground text-center">{user.country}</span>
              <div className="text-center">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function CoursesTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Cours actifs', value: '342', icon: GraduationCap, color: 'gradient-nexora' },
          { label: 'Ventes ce mois', value: '2 847', icon: TrendingUp, color: 'gradient-gold' },
          { label: 'Note moyenne', value: '4.7/5', icon: Trophy, color: 'bg-emerald/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold mb-4">Cours les plus populaires</h3>
        <div className="space-y-3">
          {[
            { name: 'Mathématiques BTS', enrolled: 4820, revenue: '7.2M', rating: 4.8 },
            { name: 'Physique-Chimie Terminale', enrolled: 3640, revenue: '5.4M', rating: 4.7 },
            { name: 'SVT BAC Série D', enrolled: 2980, revenue: '4.1M', rating: 4.6 },
            { name: 'Français BAC Série A', enrolled: 2350, revenue: '3.5M', rating: 4.9 },
            { name: 'Anglais BTS Commerce', enrolled: 1920, revenue: '2.8M', rating: 4.5 },
          ].map((course, i) => (
            <div key={course.name} className="glass rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 rounded-lg gradient-nexora flex items-center justify-center text-white text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{course.name}</p>
                <p className="text-[10px] text-muted-foreground">{course.enrolled.toLocaleString()} inscrits</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gradient-gold">{course.revenue} FCFA</p>
                <p className="text-[10px] text-amber">★ {course.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function MarketplaceTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Produits actifs', value: '1 247', icon: ShoppingBag, color: 'gradient-nexora' },
          { label: 'Ventes du mois', value: '8.4M FCFA', icon: Wallet, color: 'gradient-gold' },
          { label: 'Freelances actifs', value: '892', icon: Users, color: 'bg-emerald/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color === 'bg-emerald/20' ? 'text-emerald' : 'text-white'}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold mb-4">Produits récents</h3>
        <div className="space-y-3">
          {[
            { name: 'Pack CV Professionnel', price: '15 000', category: 'Service', status: 'active' },
            { name: 'E-book Marketing Digital', price: '5 000', category: 'Digital', status: 'active' },
            { name: 'Formation Excel Avancé', price: '25 000', category: 'Formation', status: 'pending' },
            { name: 'Templates Business Plan', price: '8 000', category: 'Digital', status: 'active' },
            { name: 'Coaching Entrepreneuriat', price: '50 000', category: 'Service', status: 'review' },
          ].map((product, i) => (
            <div key={product.name} className="glass rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-[10px] text-muted-foreground">{product.category}</p>
              </div>
              <p className="text-sm font-bold shrink-0">{product.price} FCFA</p>
              <Badge className={`text-[9px] shrink-0 ${
                product.status === 'active' ? 'bg-emerald/15 text-emerald border-emerald/30' :
                product.status === 'pending' ? 'bg-amber/15 text-amber border-amber/30' :
                'bg-nexora/15 text-nexora border-nexora/30'
              }`}>
                {product.status === 'active' ? 'Actif' : product.status === 'pending' ? 'En attente' : 'Révision'}
              </Badge>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function SettingsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold mb-4">Paramètres généraux</h3>
        <div className="space-y-4">
          {[
            { label: 'Maintenance mode', desc: 'Activer le mode maintenance', enabled: false },
            { label: 'Inscriptions', desc: 'Autoriser les nouvelles inscriptions', enabled: true },
            { label: 'AI Features', desc: 'Activer les fonctionnalités IA', enabled: true },
            { label: 'Modération auto', desc: 'Filtrage automatique du contenu', enabled: true },
            { label: 'Notifications push', desc: 'Envoyer des notifications aux utilisateurs', enabled: true },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div>
                <p className="text-sm font-medium">{setting.label}</p>
                <p className="text-xs text-muted-foreground">{setting.desc}</p>
              </div>
              <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${setting.enabled ? 'bg-nexora' : 'bg-muted'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${setting.enabled ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold mb-4">Système</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald" />
              <span className="text-xs text-muted-foreground">Serveur</span>
            </div>
            <p className="text-sm font-semibold text-emerald">Opérationnel</p>
            <Progress value={98} className="h-1.5" />
          </div>
          <div className="glass rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-nexora" />
              <span className="text-xs text-muted-foreground">CDN</span>
            </div>
            <p className="text-sm font-semibold text-nexora">Latence 45ms</p>
            <Progress value={85} className="h-1.5" />
          </div>
          <div className="glass rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber" />
              <span className="text-xs text-muted-foreground">IA API</span>
            </div>
            <p className="text-sm font-semibold text-amber">2.8s avg</p>
            <Progress value={72} className="h-1.5" />
          </div>
          <div className="glass rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-gold" />
              <span className="text-xs text-muted-foreground">Dernière MAJ</span>
            </div>
            <p className="text-sm font-semibold text-gold">v2.4.1</p>
            <p className="text-[10px] text-muted-foreground">15 Déc 2024</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ===================== MAIN COMPONENT =====================

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const tabContent: Record<AdminTab, React.ReactNode> = {
    overview: <OverviewTab />,
    analytics: <AnalyticsTab />,
    ia: <IAMonitoringTab />,
    moderation: <ModerationTab />,
    finance: <FinanceTab />,
    users: <UsersTab />,
    courses: <CoursesTab />,
    marketplace: <MarketplaceTab />,
    settings: <SettingsTab />,
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="glass-strong h-full flex flex-col shrink-0 border-r border-white/5 z-40"
      >
        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-2 border-b border-white/5">
          <motion.div
            className="w-9 h-9 rounded-xl gradient-nexora flex items-center justify-center shrink-0"
            whileHover={{ scale: 1.1 }}
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-base font-extrabold text-gradient-nexora tracking-tight whitespace-nowrap">
                  NEXORA Admin
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = activeTab === item.key
            return (
              <motion.button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  isActive
                    ? 'gradient-nexora text-white shadow-lg glow-nexora'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : ''}`} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !sidebarCollapsed && (
                  <motion.div
                    layoutId="adminActiveIndicator"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl glass hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Réduire</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass-strong px-6 py-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {navItems.find(n => n.key === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="glass">
                <RefreshCw className="w-4 h-4 mr-2" />
                Rafraîchir
              </Button>
              <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                <span className="text-xs text-muted-foreground">Système opérationnel</span>
              </div>
              <Avatar className="w-8 h-8 border-2 border-nexora">
                <AvatarFallback className="gradient-nexora text-white text-xs font-bold">A</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
