import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ── Types ───────────────────────────────────────────────────────────
interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string; // xp, course, social, payment, system
  read: boolean;
  createdAt: string;
}

// ── Mock data ───────────────────────────────────────────────────────
const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_01',
    userId: 'usr_01',
    title: '🎉 Bravo ! +50 XP',
    message: 'Vous avez complété le quiz "Algèbre — Suites numériques" avec 90% de bonnes réponses !',
    type: 'xp',
    read: false,
    createdAt: '2025-03-04T15:30:00Z',
  },
  {
    id: 'notif_02',
    userId: 'usr_01',
    title: '📚 Nouveau cours disponible',
    message: 'Le cours "Chimie Organique — BAC S" vient d\'être publié par Moussa Sow.',
    type: 'course',
    read: false,
    createdAt: '2025-03-04T14:00:00Z',
  },
  {
    id: 'notif_03',
    userId: 'usr_01',
    title: '💬 Nouveau commentaire',
    message: 'Fatou Koné a commenté votre publication : "Super méthode de résolution !"',
    type: 'social',
    read: true,
    createdAt: '2025-03-04T12:15:00Z',
  },
  {
    id: 'notif_04',
    userId: 'usr_01',
    title: '💰 Paiement reçu',
    message: 'Vous avez reçu 3 000 FCFA pour la vente de "Cours Complet Mathématiques BAC S".',
    type: 'payment',
    read: true,
    createdAt: '2025-03-03T16:00:00Z',
  },
  {
    id: 'notif_05',
    userId: 'usr_01',
    title: '🔥 Série de 7 jours !',
    message: 'Vous êtes en feu ! Continuez à apprendre chaque jour pour maintenir votre série.',
    type: 'xp',
    read: false,
    createdAt: '2025-03-03T08:00:00Z',
  },
  {
    id: 'notif_06',
    userId: 'usr_01',
    title: '🤝 Demande de mentorat',
    message: 'Ibrahim Touré souhaite devenir votre mentoré. Acceptez ou déclinez dans votre profil.',
    type: 'social',
    read: false,
    createdAt: '2025-03-02T19:30:00Z',
  },
  {
    id: 'notif_07',
    userId: 'usr_01',
    title: '🔔 Mise à jour système',
    message: 'Nexora v2.5 est disponible ! Découvrez les nouvelles fonctionnalités IA et Mobile Money.',
    type: 'system',
    read: true,
    createdAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'notif_08',
    userId: 'usr_01',
    title: '🏆 Classement hebdomadaire',
    message: 'Vous êtes #12 au classement de cette semaine en Mathématiques ! Continuez comme ça.',
    type: 'xp',
    read: true,
    createdAt: '2025-02-28T07:00:00Z',
  },
  {
    id: 'notif_09',
    userId: 'usr_01',
    title: '💳 Abonnement Gold activé',
    message: 'Votre abonnement Gold est actif. Profitez de toutes les fonctionnalités premium !',
    type: 'payment',
    read: true,
    createdAt: '2025-02-25T14:00:00Z',
  },
  {
    id: 'notif_10',
    userId: 'usr_01',
    title: '📚 Rappel de révision',
    message: 'Il est temps de réviser "Mécanique Newtonienne — BFEM". Votre dernière session remonte à 3 jours.',
    type: 'course',
    read: false,
    createdAt: '2025-03-04T09:00:00Z',
  },
];

// ── GET /api/notifications ──────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const type = searchParams.get('type');
  const unreadOnly = searchParams.get('unread') === 'true';
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);

  // Try fetching from database first
  if (userId) {
    try {
      const dbNotifications = await db.notification.findMany({
        where: {
          userId,
          ...(type && { type }),
          ...(unreadOnly && { read: false }),
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      if (dbNotifications.length > 0) {
        return NextResponse.json({
          notifications: dbNotifications,
          unreadCount: dbNotifications.filter((n) => !n.read).length,
          source: 'database',
        });
      }
    } catch {
      // DB might be empty — fall through to mock data
    }
  }

  // Filter mock notifications
  let filtered = [...mockNotifications];
  if (userId) {
    filtered = filtered.filter((n) => n.userId === userId);
  }
  if (type) {
    filtered = filtered.filter((n) => n.type === type);
  }
  if (unreadOnly) {
    filtered = filtered.filter((n) => !n.read);
  }

  filtered = filtered.slice(0, limit);

  const unreadCount = filtered.filter((n) => !n.read).length;

  return NextResponse.json({
    notifications: filtered,
    unreadCount,
    source: 'mock',
  });
}

// ── PATCH /api/notifications — Mark as read ──────────────────────────
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, markAll, userId } = body as {
      notificationId?: string;
      markAll?: boolean;
      userId?: string;
    };

    if (markAll && userId) {
      // Mark all notifications as read for a user
      try {
        await db.notification.updateMany({
          where: { userId, read: false },
          data: { read: true },
        });
      } catch {
        // DB might be empty
      }

      return NextResponse.json({ success: true, message: 'Toutes les notifications marquées comme lues.' });
    }

    if (notificationId) {
      // Mark a single notification as read
      try {
        await db.notification.update({
          where: { id: notificationId },
          data: { read: true },
        });
      } catch {
        // DB might not have this notification
      }

      return NextResponse.json({ success: true, message: 'Notification marquée comme lue.' });
    }

    return NextResponse.json(
      { error: 'notificationId ou (markAll + userId) requis.' },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error('Notifications PATCH error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des notifications.' },
      { status: 500 }
    );
  }
}
