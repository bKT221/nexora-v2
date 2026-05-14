'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Star,
  ShoppingBag,
  FileText,
  Video,
  Palette,
  Code,
  PenTool,
  CheckCircle,
  Shield,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNexoraStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import MobileMoneyModal from './mobile-money-modal'

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

const categories = [
  { label: 'Cours PDF', icon: FileText },
  { label: 'Formations Vidéo', icon: Video },
  { label: 'Freelance Design', icon: Palette },
  { label: 'Freelance Dev', icon: Code },
  { label: 'Freelance Rédaction', icon: PenTool },
  { label: 'Corrigés', icon: CheckCircle },
]

const products = [
  {
    id: '1',
    title: 'Cours complet Math Tle S',
    price: 2500,
    rating: 4.8,
    seller: 'Prof. Diallo',
    icon: '📐',
    gradient: 'gradient-nexora',
    type: 'Cours',
  },
  {
    id: '2',
    title: 'Formation WordPress',
    price: 5000,
    rating: 4.6,
    seller: 'Tech Academy',
    icon: '💻',
    gradient: 'bg-emerald/80',
    type: 'Vidéo',
  },
  {
    id: '3',
    title: 'Logo Design',
    price: 10000,
    rating: 4.9,
    seller: 'Aminata Design',
    icon: '🎨',
    gradient: 'gradient-gold',
    type: 'Freelance',
  },
  {
    id: '4',
    title: 'Corrigé BAC SVT 2024',
    price: 1000,
    rating: 4.7,
    seller: 'M. Ndiaye',
    icon: '🧬',
    gradient: 'bg-amber/80',
    type: 'Corrigé',
  },
  {
    id: '5',
    title: 'Site Web Laravel',
    price: 25000,
    rating: 4.5,
    seller: 'DevPro SN',
    icon: '🌐',
    gradient: 'gradient-nexora',
    type: 'Freelance',
  },
  {
    id: '6',
    title: 'Rédaction articles SEO',
    price: 3000,
    rating: 4.8,
    seller: 'WritePro',
    icon: '✍️',
    gradient: 'bg-emerald/80',
    type: 'Freelance',
  },
]

export default function Marketplace() {
  const { profile } = useNexoraStore()
  const { toast } = useToast()

  // Mobile Money modal state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string
    title: string
    price: number
  } | null>(null)
  const [purchasedProducts, setPurchasedProducts] = useState<Set<string>>(new Set())

  const handleBuy = (product: { id: string; title: string; price: number }) => {
    setSelectedProduct(product)
    setIsPaymentOpen(true)
  }

  const handlePaymentSuccess = (transactionId: string) => {
    if (selectedProduct) {
      setPurchasedProducts((prev) => new Set(prev).add(selectedProduct.id))
    }
    toast({
      title: 'Paiement réussi !',
      description: `Achat de "${selectedProduct?.title}" confirmé. Transaction: ${transactionId.slice(0, 8)}...`,
    })
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="px-4 pb-6 pt-2 space-y-5"
    >
      {/* Search Bar */}
      <motion.div variants={slideUp} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher cours, services, freelance..."
          className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-nexora/50 transition-all"
        />
      </motion.div>

      {/* Category Chips */}
      <motion.div variants={slideUp}>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-medium whitespace-nowrap shrink-0 hover:glass-strong transition-all"
            >
              <cat.icon className="w-3.5 h-3.5 text-nexora" />
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Featured Products */}
      <motion.div variants={slideUp}>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Produits en vedette
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              variants={slideUp}
              initial="hidden"
              animate="show"
              transition={{ delay: idx * 0.06 }}
              className="glass rounded-xl overflow-hidden"
            >
              <div
                className={`${product.gradient} p-4 flex items-center justify-center`}
              >
                <span className="text-3xl">{product.icon}</span>
              </div>
              <div className="p-3 space-y-1.5">
                <Badge variant="outline" className="text-[9px] border-nexora/30 text-nexora">
                  {product.type}
                </Badge>
                <p className="text-xs font-semibold leading-tight line-clamp-2">
                  {product.title}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  par {product.seller}
                </p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-gold fill-gold" />
                  <span className="text-[10px] font-medium">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-gradient-nexora">
                    {product.price.toLocaleString()} F
                  </span>
                  {purchasedProducts.has(product.id) ? (
                    <Badge className="bg-emerald/20 text-emerald border-emerald/30 text-[9px]">
                      <CheckCircle className="w-3 h-3 mr-0.5" />
                      Acheté
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      className="gradient-nexora text-white border-0 text-[10px] h-7 px-2 hover:opacity-90"
                      onClick={() =>
                        handleBuy({
                          id: product.id,
                          title: product.title,
                          price: product.price,
                        })
                      }
                    >
                      <ShoppingBag className="w-3 h-3 mr-0.5" />
                      Acheter
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Freelance Section */}
      <motion.div variants={slideUp}>
        <div className="glass-strong rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gold" />
            <h3 className="font-bold">Devenez Freelance sur Nexora</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Proposez vos services en design, développement, rédaction et bien plus.
            Touchez des clients dans toute l&apos;Afrique de l&apos;Ouest.
          </p>
          <Button className="w-full gradient-gold text-gold-foreground border-0 hover:opacity-90 font-semibold">
            Créer mon profil
          </Button>
        </div>
      </motion.div>

      {/* Payment Section */}
      <motion.div variants={slideUp}>
        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-nexora" />
            <h3 className="font-bold">Paiement Mobile Money</h3>
          </div>
          <div className="flex gap-3 justify-center py-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
              Wave
            </Badge>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
              Orange Money
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
              MTN
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
              Moov
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="border-nexora/30 text-nexora hover:bg-nexora/10 text-xs"
            >
              <ArrowDownToLine className="w-4 h-4 mr-1" />
              Déposer
            </Button>
            <Button
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10 text-xs"
            >
              <ArrowUpFromLine className="w-4 h-4 mr-1" />
              Retirer
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KYC Badge */}
      <motion.div variants={slideUp}>
        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald" />
            <div>
              <Badge className="bg-emerald/20 text-emerald border-emerald/30 text-xs">
                Vendeur certifié
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Vérifiez votre identité pour accéder à plus de fonctionnalités et rassurer
            vos acheteurs.
          </p>
          <Button
            variant="outline"
            className="w-full border-emerald/30 text-emerald hover:bg-emerald/10 text-xs"
          >
            <Shield className="w-4 h-4 mr-2" />
            Commencer la vérification
          </Button>
        </div>
      </motion.div>

      {/* My Earnings Card (Entrepreneur only) */}
      {profile === 'entrepreneur' && (
        <motion.div variants={slideUp}>
          <div className="glass-strong rounded-2xl p-5 space-y-3 border border-gold/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Vos gains</p>
                <p className="text-2xl font-bold text-gradient-gold">45 000 FCFA</p>
              </div>
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center">
                <Wallet className="w-6 h-6 text-gold-foreground" />
              </div>
            </div>
            <Button className="w-full gradient-gold text-gold-foreground border-0 hover:opacity-90 font-semibold">
              <ArrowUpFromLine className="w-4 h-4 mr-2" />
              Retirer
            </Button>
          </div>
        </motion.div>
      )}

      {/* Mobile Money Payment Modal */}
      {selectedProduct && (
        <MobileMoneyModal
          isOpen={isPaymentOpen}
          onClose={() => {
            setIsPaymentOpen(false)
            setSelectedProduct(null)
          }}
          productTitle={selectedProduct.title}
          productPrice={selectedProduct.price}
          productId={selectedProduct.id}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </motion.div>
  )
}
