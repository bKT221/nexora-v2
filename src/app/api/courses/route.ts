import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ── Types ───────────────────────────────────────────────────────────
interface CourseCategory {
  id: string;
  name: string;
  icon: string;
  courseCount: number;
}

interface CourseItem {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  level: string;
  coverUrl: string | null;
  price: number;
  rating: number;
  enrollCount: number;
  isFree: boolean;
  progress?: number;
}

interface CoursesResponse {
  categories: CourseCategory[];
  courses: CourseItem[];
  stats: {
    totalCourses: number;
    freeCourses: number;
    avgRating: number;
    totalEnrollments: number;
  };
}

// ── Mock data ───────────────────────────────────────────────────────
const mockCategories: CourseCategory[] = [
  { id: 'cat_math', name: 'Mathématiques', icon: '📐', courseCount: 45 },
  { id: 'cat_pc', name: 'Physique-Chimie', icon: '⚗️', courseCount: 38 },
  { id: 'cat_svt', name: 'SVT', icon: '🧬', courseCount: 30 },
  { id: 'cat_fr', name: 'Français', icon: '📖', courseCount: 25 },
  { id: 'cat_en', name: 'Anglais', icon: '🌍', courseCount: 22 },
  { id: 'cat_hist', name: 'Histoire-Géo', icon: '🗺️', courseCount: 18 },
  { id: 'cat_phi', name: 'Philosophie', icon: '💡', courseCount: 15 },
  { id: 'cat_eco', name: 'Économie', icon: '📊', courseCount: 12 },
];

const mockCourses: CourseItem[] = [
  {
    id: 'crs_01',
    title: 'Algèbre — BAC S 2025',
    description: 'Cours complet d\'algèbre pour le BAC scientifique. Suites, fonctions, probabilités.',
    subject: 'Mathématiques',
    level: 'BAC',
    coverUrl: null,
    price: 0,
    rating: 4.8,
    enrollCount: 12450,
    isFree: true,
    progress: 72,
  },
  {
    id: 'crs_02',
    title: 'Mécanique Newtonienne — BFEM',
    description: 'Préparation BFEM : forces, énergie, mouvement.',
    subject: 'Physique-Chimie',
    level: 'BFEM',
    coverUrl: null,
    price: 0,
    rating: 4.6,
    enrollCount: 8920,
    isFree: true,
    progress: 45,
  },
  {
    id: 'crs_03',
    title: 'Biologie Cellulaire — BTS',
    description: 'De la cellule aux tissus : préparation complète BTS Bio.',
    subject: 'SVT',
    level: 'BTS',
    coverUrl: null,
    price: 2500,
    rating: 4.9,
    enrollCount: 5340,
    isFree: false,
    progress: 0,
  },
  {
    id: 'crs_04',
    title: 'Dissertation Française — BAC L',
    description: 'Méthodologie et entraînement pour la dissertation au BAC Littéraire.',
    subject: 'Français',
    level: 'BAC',
    coverUrl: null,
    price: 0,
    rating: 4.7,
    enrollCount: 7850,
    isFree: true,
    progress: 88,
  },
  {
    id: 'crs_05',
    title: 'English for Business — Licence',
    description: 'Business English : writing, speaking, negotiation vocabulary.',
    subject: 'Anglais',
    level: 'Licence',
    coverUrl: null,
    price: 5000,
    rating: 4.5,
    enrollCount: 3200,
    isFree: false,
    progress: 0,
  },
  {
    id: 'crs_06',
    title: 'Géopolitique de l\'Afrique — BAC',
    description: 'Comprendre les enjeux géopolitiques contemporains du continent.',
    subject: 'Histoire-Géo',
    level: 'BAC',
    coverUrl: null,
    price: 0,
    rating: 4.4,
    enrollCount: 6100,
    isFree: true,
    progress: 30,
  },
  {
    id: 'crs_07',
    title: 'Chimie Organique — BAC S',
    description: 'Réactions, mécanismes et synthèse organique pour le BAC.',
    subject: 'Physique-Chimie',
    level: 'BAC',
    coverUrl: null,
    price: 1500,
    rating: 4.3,
    enrollCount: 4700,
    isFree: false,
    progress: 0,
  },
  {
    id: 'crs_08',
    title: 'Philosophie — Méthodologie Dissertation',
    description: 'Apprendre à philosopher : de l\'analyse du sujet à la conclusion.',
    subject: 'Philosophie',
    level: 'BAC',
    coverUrl: null,
    price: 0,
    rating: 4.6,
    enrollCount: 5500,
    isFree: true,
    progress: 15,
  },
];

const mockStats = {
  totalCourses: 205,
  freeCourses: 142,
  avgRating: 4.6,
  totalEnrollments: 54070,
};

// ── GET /api/courses ────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const level = searchParams.get('level');
  const freeOnly = searchParams.get('free') === 'true';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);

  // Try fetching from database first
  try {
    const dbCourses = await db.course.findMany({
      where: {
        ...(subject && { subject }),
        ...(level && { level }),
        ...(freeOnly && { isFree: true }),
        isPublished: true,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { enrollCount: 'desc' },
    });

    if (dbCourses.length > 0) {
      return NextResponse.json({
        categories: mockCategories,
        courses: dbCourses,
        stats: mockStats,
        source: 'database',
        page,
        limit,
      });
    }
  } catch {
    // DB might be empty — fall through to mock data
  }

  // Filter mock courses
  let filtered = [...mockCourses];
  if (subject) {
    filtered = filtered.filter((c) => c.subject.toLowerCase() === subject.toLowerCase());
  }
  if (level) {
    filtered = filtered.filter((c) => c.level === level);
  }
  if (freeOnly) {
    filtered = filtered.filter((c) => c.isFree);
  }

  // Paginate
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const response: CoursesResponse = {
    categories: mockCategories,
    courses: paginated,
    stats: mockStats,
  };

  return NextResponse.json({ ...response, source: 'mock', page, limit });
}
