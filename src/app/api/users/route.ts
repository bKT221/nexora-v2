import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

// ── Mock user profile data ──────────────────────────────────────────
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  profile: string;
  country: string | null;
  phone: string | null;
  xp: number;
  level: number;
  streak: number;
  nexoraCoins: number;
  subscription: string;
  kycVerified: boolean;
  lowDataMode: boolean;
  lastActiveAt: string;
  createdAt: string;
}

const mockProfiles: UserProfile[] = [
  {
    id: 'usr_01',
    name: 'Aminata Diallo',
    email: 'aminata.diallo@example.com',
    avatar: null,
    role: 'user',
    profile: 'etudiant',
    country: 'Sénégal',
    phone: '+221 77 123 4567',
    xp: 3280,
    level: 12,
    streak: 7,
    nexoraCoins: 2450,
    subscription: 'gold',
    kycVerified: true,
    lowDataMode: false,
    lastActiveAt: '2025-03-04T14:30:00Z',
    createdAt: '2024-09-15T08:00:00Z',
  },
  {
    id: 'usr_02',
    name: 'Ibrahim Touré',
    email: 'ibrahim.toure@example.com',
    avatar: null,
    role: 'user',
    profile: 'entrepreneur',
    country: 'Mali',
    phone: '+223 70 987 6543',
    xp: 1540,
    level: 6,
    streak: 3,
    nexoraCoins: 1200,
    subscription: 'free',
    kycVerified: false,
    lowDataMode: true,
    lastActiveAt: '2025-03-04T10:15:00Z',
    createdAt: '2025-01-20T12:00:00Z',
  },
  {
    id: 'usr_03',
    name: 'Fatou Koné',
    email: 'fatou.kone@example.com',
    avatar: null,
    role: 'mentor',
    profile: 'etudiant',
    country: "Côte d'Ivoire",
    phone: '+225 05 456 7890',
    xp: 8920,
    level: 28,
    streak: 45,
    nexoraCoins: 12400,
    subscription: 'exam_pack',
    kycVerified: true,
    lowDataMode: false,
    lastActiveAt: '2025-03-04T16:00:00Z',
    createdAt: '2024-03-10T09:30:00Z',
  },
];

// ── GET /api/users ──────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  // Return a specific user by id
  if (userId) {
    const user = mockProfiles.find((u) => u.id === userId);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé.' }, { status: 404 });
    }
    return NextResponse.json({ user });
  }

  // Try to fetch real users from DB as well
  try {
    const dbUsers = await db.user.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    if (dbUsers.length > 0) {
      return NextResponse.json({ users: dbUsers, source: 'database' });
    }
  } catch {
    // DB might be empty or unavailable — fall through to mock data
  }

  return NextResponse.json({ users: mockProfiles, source: 'mock' });
}

// ── POST /api/users ─────────────────────────────────────────────────
interface CreateOrUpdateUserBody {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  role?: string;
  profile?: string;
  country?: string;
  phone?: string;
  subscription?: string;
  lowDataMode?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrUpdateUserBody = await request.json();
    const { id, name, email, password, avatar, role, profile, country, phone, subscription, lowDataMode } =
      body;

    // Update existing user
    if (id) {
      const existing = await db.user.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: 'Utilisateur non trouvé.' }, { status: 404 });
      }

      const updated = await db.user.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(email !== undefined && { email }),
          ...(avatar !== undefined && { avatar }),
          ...(role !== undefined && { role }),
          ...(profile !== undefined && { profile }),
          ...(country !== undefined && { country }),
          ...(phone !== undefined && { phone }),
          ...(subscription !== undefined && { subscription }),
          ...(lowDataMode !== undefined && { lowDataMode }),
        },
      });

      return NextResponse.json({ user: updated, action: 'updated' });
    }

    // Create new user — email is required
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Le nom et l\'email sont requis pour créer un utilisateur.' },
        { status: 400 }
      );
    }

    // Hash the password if provided
    const hashedPassword = password
      ? await bcrypt.hash(password, 12)
      : undefined;

    const newUser = await db.user.create({
      data: {
        name,
        email,
        ...(hashedPassword && { password: hashedPassword }),
        ...(avatar && { avatar }),
        ...(role && { role }),
        ...(profile && { profile }),
        ...(country && { country }),
        ...(phone && { phone }),
        ...(subscription && { subscription }),
        ...(lowDataMode !== undefined && { lowDataMode }),
      },
    });

    return NextResponse.json({ user: newUser, action: 'created' }, { status: 201 });
  } catch (error: unknown) {
    console.error('Users POST error:', error);

    // Handle unique constraint violation (duplicate email)
    if (
      error instanceof Error &&
      error.message.includes('Unique constraint')
    ) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création/mise à jour de l\'utilisateur.' },
      { status: 500 }
    );
  }
}
