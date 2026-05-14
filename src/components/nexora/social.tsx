'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Trophy,
  Crown,
  Medal,
  Star,
  UserPlus,
  Calendar,
  Shield,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

const posts = [
  {
    id: '1',
    name: 'Aminata D.',
    initials: 'AD',
    content: 'A obtenu 95% au quiz de Physique ! 🎉',
    likes: 24,
    comments: 5,
    color: 'bg-nexora',
  },
  {
    id: '2',
    name: 'Moussa B.',
    initials: 'MB',
    content: 'Conseil business : Comment démarrer avec 10 000 FCFA 💰',
    likes: 56,
    comments: 12,
    color: 'bg-gold',
  },
  {
    id: '3',
    name: 'Fatou S.',
    initials: 'FS',
    content: 'Groupe d\'étude BFEM 2025 — Rejoignez-nous ! 📚',
    likes: 34,
    comments: 8,
    color: 'bg-emerald',
  },
]

const groups = [
  { name: 'BFEM 2025 — Préparation', members: '1.2K', color: 'gradient-nexora' },
  { name: 'Entrepreneurs Dakar', members: '890', color: 'gradient-gold' },
  { name: 'Python pour débutants', members: '650', color: 'bg-emerald/80' },
]

const mentors = [
  {
    name: 'Dr. Ousmane N.',
    initials: 'ON',
    title: 'Ingénieur, 15 ans exp.',
    status: 'Disponible',
    statusColor: 'text-emerald bg-emerald/10 border-emerald/20',
    color: 'gradient-nexora',
  },
  {
    name: 'Mariama F.',
    initials: 'MF',
    title: 'Business Coach',
    status: 'Prochain RDV : Jeudi',
    statusColor: 'text-amber bg-amber/10 border-amber/20',
    color: 'gradient-gold',
  },
]

const leaderboard = [
  { rank: 1, name: 'Ibrahima S.', initials: 'IS', xp: 12450, badge: 'Major de promo', color: 'gradient-nexora' },
  { rank: 2, name: 'Aïssatou D.', initials: 'AD', xp: 11200, badge: 'Champion', color: 'gradient-gold' },
  { rank: 3, name: 'Mamadou L.', initials: 'ML', xp: 10800, badge: 'Étoile', color: 'bg-amber/80' },
  { rank: 4, name: 'Fatoumata B.', initials: 'FB', xp: 9650, badge: 'Assidu', color: 'bg-emerald/80' },
  { rank: 5, name: 'Oumar S.', initials: 'OS', xp: 8900, badge: 'Régulier', color: 'bg-nexora/80' },
]

const userBadges = ['Major de promo', 'Série de 7 jours', 'Quiz Master']

export default function Social() {
  const { xp } = useNexoraStore()
  const [activeTab, setActiveTab] = useState('actualites')

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="px-4 pb-6 pt-2"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full glass rounded-xl h-auto p-1 mb-4">
          <TabsTrigger
            value="actualites"
            className="flex-1 text-xs data-[state=active]:gradient-nexora data-[state=active]:text-white rounded-lg"
          >
            Actualités
          </TabsTrigger>
          <TabsTrigger
            value="groupes"
            className="flex-1 text-xs data-[state=active]:gradient-nexora data-[state=active]:text-white rounded-lg"
          >
            Groupes
          </TabsTrigger>
          <TabsTrigger
            value="mentorat"
            className="flex-1 text-xs data-[state=active]:gradient-nexora data-[state=active]:text-white rounded-lg"
          >
            Mentorat
          </TabsTrigger>
          <TabsTrigger
            value="classement"
            className="flex-1 text-xs data-[state=active]:gradient-nexora data-[state=active]:text-white rounded-lg"
          >
            Classement
          </TabsTrigger>
        </TabsList>

        {/* News Feed */}
        <TabsContent value="actualites" className="space-y-3 mt-0">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              variants={slideUp}
              initial="hidden"
              animate="show"
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className={`${post.color} text-white text-xs font-bold`}>
                    {post.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{post.name}</p>
                  <p className="text-[10px] text-muted-foreground">Il y a {idx + 1}h</p>
                </div>
              </div>
              <p className="text-sm">{post.content}</p>
              <div className="flex items-center gap-4 pt-1">
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-400 transition-colors">
                  <Heart className="w-4 h-4" />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-nexora transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments}
                </button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-emerald transition-colors ml-auto">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        {/* Groups */}
        <TabsContent value="groupes" className="space-y-3 mt-0">
          {groups.map((group, idx) => (
            <motion.div
              key={group.name}
              variants={slideUp}
              initial="hidden"
              animate="show"
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-xl p-4 flex items-center gap-3"
            >
              <div
                className={`w-11 h-11 rounded-xl ${group.color} flex items-center justify-center shrink-0`}
              >
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{group.name}</p>
                <p className="text-xs text-muted-foreground">
                  {group.members} membres
                </p>
              </div>
              <Button
                size="sm"
                className="gradient-nexora text-white border-0 text-xs shrink-0 hover:opacity-90"
              >
                <UserPlus className="w-3 h-3 mr-1" />
                Rejoindre
              </Button>
            </motion.div>
          ))}
        </TabsContent>

        {/* Mentorat */}
        <TabsContent value="mentorat" className="space-y-3 mt-0">
          {mentors.map((mentor, idx) => (
            <motion.div
              key={mentor.name}
              variants={slideUp}
              initial="hidden"
              animate="show"
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-11 h-11">
                  <AvatarFallback
                    className={`${mentor.color} text-white text-sm font-bold`}
                  >
                    {mentor.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{mentor.name}</p>
                  <p className="text-xs text-muted-foreground">{mentor.title}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${mentor.statusColor}`}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {mentor.status}
                </Badge>
              </div>
            </motion.div>
          ))}
          <Button className="w-full gradient-nexora text-white border-0 mt-2 hover:opacity-90">
            <Users className="w-4 h-4 mr-2" />
            Demander un mentor
          </Button>
        </TabsContent>

        {/* Classement */}
        <TabsContent value="classement" className="space-y-3 mt-0">
          {leaderboard.map((entry, idx) => (
            <motion.div
              key={entry.name}
              variants={slideUp}
              initial="hidden"
              animate="show"
              transition={{ delay: idx * 0.08 }}
              className="glass rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  entry.rank === 1
                    ? 'gradient-gold text-gold-foreground'
                    : entry.rank === 2
                    ? 'bg-muted text-foreground'
                    : 'bg-muted/50 text-muted-foreground'
                }`}
              >
                {entry.rank}
              </div>
              <Avatar className="w-9 h-9">
                <AvatarFallback
                  className={`${entry.color} text-white text-xs font-bold`}
                >
                  {entry.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{entry.name}</p>
                <Badge variant="outline" className="text-[10px] border-nexora/30 text-nexora">
                  <Trophy className="w-2.5 h-2.5 mr-0.5" />
                  {entry.badge}
                </Badge>
              </div>
              <span className="text-sm font-bold text-gradient-nexora">
                {entry.xp.toLocaleString()} XP
              </span>
            </motion.div>
          ))}

          {/* Your rank */}
          <div className="glass-strong rounded-xl px-4 py-3 flex items-center gap-3 border border-nexora/20">
            <div className="w-7 h-7 rounded-full gradient-nexora flex items-center justify-center text-xs font-bold text-white shrink-0">
              42
            </div>
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-nexora/20 text-nexora text-xs font-bold">
                VOUS
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold">Votre position : #42</p>
              <p className="text-xs text-muted-foreground">
                {xp.toLocaleString()} XP
              </p>
            </div>
          </div>

          {/* Badges showcase */}
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-3">Vos badges</h3>
            <div className="flex gap-2 flex-wrap">
              {userBadges.map((badge) => (
                <Badge
                  key={badge}
                  className="gradient-nexora text-white border-0 text-xs"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
