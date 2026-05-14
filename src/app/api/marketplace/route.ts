import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ── Types ───────────────────────────────────────────────────────────
interface ProductItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  rating: number;
  salesCount: number;
  sellerName: string;
  isPublished: boolean;
}

interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'withdrawal' | 'commission';
  amount: number;
  currency: string;
  status: string;
  description: string;
  date: string;
}

interface EarningSummary {
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  withdrawnTotal: number;
  currency: string;
}

interface MarketplaceResponse {
  products: ProductItem[];
  transactions: Transaction[];
  earnings: EarningSummary;
  categories: string[];
}

// ── Mock data ───────────────────────────────────────────────────────
const mockProducts: ProductItem[] = [
  {
    id: 'prod_01',
    title: 'Cours Complet — Mathématiques BAC S',
    description: 'PDF de 120 pages couvrant tout le programme de Maths BAC S.',
    price: 3000,
    category: 'course_pdf',
    rating: 4.8,
    salesCount: 342,
    sellerName: 'Aminata Diallo',
    isPublished: true,
  },
  {
    id: 'prod_02',
    title: 'Vidéo — Physique-Chimie BFEM',
    description: 'Série de 15 vidéos HD avec exercices corrigés.',
    price: 5000,
    category: 'video',
    rating: 4.6,
    salesCount: 189,
    sellerName: 'Moussa Sow',
    isPublished: true,
  },
  {
    id: 'prod_03',
    title: 'Design Logo — Pack Startup',
    description: '5 concepts de logo + déclinaisons pour votre startup africaine.',
    price: 15000,
    category: 'freelance_design',
    rating: 4.9,
    salesCount: 67,
    sellerName: 'Fatou Koné',
    isPublished: true,
  },
  {
    id: 'prod_04',
    title: 'Développement Web — Site Vitrine',
    description: 'Site web responsive pour PME, livré en 7 jours.',
    price: 75000,
    category: 'freelance_dev',
    rating: 4.7,
    salesCount: 23,
    sellerName: 'Ibrahim Touré',
    isPublished: true,
  },
  {
    id: 'prod_05',
    title: 'Rédaction — Business Plan Complet',
    description: 'Business plan professionnel de 30 pages avec étude de marché.',
    price: 25000,
    category: 'freelance_writing',
    rating: 4.5,
    salesCount: 45,
    sellerName: 'Awa Ndiaye',
    isPublished: true,
  },
  {
    id: 'prod_06',
    title: 'Correction — Annales BAC 2024',
    description: 'Corrections détaillées des annales du BAC 2024 (toutes matières).',
    price: 2000,
    category: 'correction',
    rating: 4.4,
    salesCount: 512,
    sellerName: 'Omar Ba',
    isPublished: true,
  },
  {
    id: 'prod_07',
    title: 'Pack CV + Lettre de Motivation',
    description: 'Templates professionnels adaptés au marché africain.',
    price: 1500,
    category: 'freelance_design',
    rating: 4.3,
    salesCount: 278,
    sellerName: 'Mariam Cissé',
    isPublished: true,
  },
  {
    id: 'prod_08',
    title: 'Cours SVT — BTS Bio',
    description: 'Support complet avec schémas et QCM corrigés.',
    price: 2500,
    category: 'course_pdf',
    rating: 4.6,
    salesCount: 134,
    sellerName: 'Fatou Koné',
    isPublished: true,
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 'txn_01',
    type: 'sale',
    amount: 3000,
    currency: 'FCFA',
    status: 'completed',
    description: 'Vente — Cours Complet Mathématiques BAC S',
    date: '2025-03-03T14:30:00Z',
  },
  {
    id: 'txn_02',
    type: 'commission',
    amount: -300,
    currency: 'FCFA',
    status: 'completed',
    description: 'Commission Nexora (10%)',
    date: '2025-03-03T14:30:00Z',
  },
  {
    id: 'txn_03',
    type: 'sale',
    amount: 15000,
    currency: 'FCFA',
    status: 'completed',
    description: 'Vente — Design Logo Pack Startup',
    date: '2025-03-02T10:00:00Z',
  },
  {
    id: 'txn_04',
    type: 'withdrawal',
    amount: -10000,
    currency: 'FCFA',
    status: 'completed',
    description: 'Retrait via Wave',
    date: '2025-03-01T16:45:00Z',
  },
  {
    id: 'txn_05',
    type: 'purchase',
    amount: -2000,
    currency: 'FCFA',
    status: 'completed',
    description: 'Achat — Annales BAC 2024',
    date: '2025-02-28T09:15:00Z',
  },
  {
    id: 'txn_06',
    type: 'sale',
    amount: 5000,
    currency: 'FCFA',
    status: 'pending',
    description: 'Vente — Vidéo Physique-Chimie BFEM',
    date: '2025-02-27T11:20:00Z',
  },
];

const mockEarnings: EarningSummary = {
  totalEarnings: 285000,
  availableBalance: 147000,
  pendingBalance: 35000,
  withdrawnTotal: 103000,
  currency: 'FCFA',
};

const mockCategories = [
  'course_pdf',
  'video',
  'freelance_design',
  'freelance_dev',
  'freelance_writing',
  'correction',
];

// ── GET /api/marketplace ────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const sellerId = searchParams.get('sellerId');

  // Try fetching products from database
  try {
    const dbProducts = await db.product.findMany({
      where: {
        ...(category && { category }),
        ...(sellerId && { sellerId }),
        isPublished: true,
      },
      take: 20,
      orderBy: { salesCount: 'desc' },
    });

    if (dbProducts.length > 0) {
      // Also fetch earnings if sellerId is given
      let earnings = mockEarnings;
      if (sellerId) {
        const dbEarnings = await db.earning.findMany({
          where: { userId: sellerId },
        });
        if (dbEarnings.length > 0) {
          const total = dbEarnings.reduce((sum, e) => sum + e.amount, 0);
          const available = dbEarnings
            .filter((e) => e.status === 'available')
            .reduce((sum, e) => sum + e.amount, 0);
          const pending = dbEarnings
            .filter((e) => e.status === 'pending')
            .reduce((sum, e) => sum + e.amount, 0);
          const withdrawn = dbEarnings
            .filter((e) => e.status === 'withdrawn')
            .reduce((sum, e) => sum + e.amount, 0);
          earnings = {
            totalEarnings: total,
            availableBalance: available,
            pendingBalance: pending,
            withdrawnTotal: withdrawn,
            currency: 'FCFA',
          };
        }
      }

      return NextResponse.json({
        products: dbProducts,
        transactions: mockTransactions,
        earnings,
        categories: mockCategories,
        source: 'database',
      });
    }
  } catch {
    // DB might be empty — fall through to mock data
  }

  // Filter mock products
  let filtered = [...mockProducts];
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  const response: MarketplaceResponse = {
    products: filtered,
    transactions: mockTransactions,
    earnings: mockEarnings,
    categories: mockCategories,
  };

  return NextResponse.json({ ...response, source: 'mock' });
}
