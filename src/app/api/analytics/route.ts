import { NextResponse } from 'next/server';

interface TopRegion {
  name: string;
  users: number;
  growth: number;
}

interface RevenueByMonth {
  month: string;
  amount: number;
}

interface CoursePerformance {
  subject: string;
  enrollments: number;
  successRate: number;
}

interface SubscriptionDistribution {
  free: number;
  gold: number;
  exam_pack: number;
}

interface AIUsageByFeature {
  feature: string;
  count: number;
}

interface ModerationAlert {
  type: string;
  count: number;
  severity: string;
}

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  aiQueries: number;
  quizCompletionRate: number;
  topRegions: TopRegion[];
  revenueByMonth: RevenueByMonth[];
  coursePerformance: CoursePerformance[];
  subscriptionDistribution: SubscriptionDistribution;
  aiUsageByFeature: AIUsageByFeature[];
  moderationAlerts: ModerationAlert[];
}

const analyticsData: AnalyticsData = {
  totalUsers: 152847,
  activeUsers: 43250,
  totalRevenue: 28500000,
  monthlyGrowth: 12.5,
  aiQueries: 89420,
  quizCompletionRate: 87.3,
  topRegions: [
    { name: 'Sénégal', users: 45000, growth: 15 },
    { name: "Côte d'Ivoire", users: 32000, growth: 22 },
    { name: 'Mali', users: 28000, growth: 18 },
    { name: 'Cameroun', users: 22000, growth: 25 },
    { name: 'Guinée', users: 15000, growth: 30 },
  ],
  revenueByMonth: [
    { month: 'Jan', amount: 2100000 },
    { month: 'Fév', amount: 2400000 },
    { month: 'Mar', amount: 2800000 },
    { month: 'Avr', amount: 3200000 },
    { month: 'Mai', amount: 3600000 },
    { month: 'Jun', amount: 3900000 },
    { month: 'Jul', amount: 3500000 },
    { month: 'Aoû', amount: 3100000 },
    { month: 'Sep', amount: 4200000 },
    { month: 'Oct', amount: 4800000 },
    { month: 'Nov', amount: 5200000 },
    { month: 'Déc', amount: 5800000 },
  ],
  coursePerformance: [
    { subject: 'Mathématiques', enrollments: 28450, successRate: 89 },
    { subject: 'Physique-Chimie', enrollments: 22300, successRate: 85 },
    { subject: 'SVT', enrollments: 18700, successRate: 91 },
    { subject: 'Français', enrollments: 15200, successRate: 93 },
    { subject: 'Anglais', enrollments: 12800, successRate: 87 },
  ],
  subscriptionDistribution: {
    free: 120000,
    gold: 25000,
    exam_pack: 7847,
  },
  aiUsageByFeature: [
    { feature: 'Résumé PDF', count: 23400 },
    { feature: 'Correction exercice', count: 18900 },
    { feature: 'Traduction', count: 15200 },
    { feature: 'CV/Lettre', count: 12800 },
    { feature: 'Business Plan', count: 9500 },
    { feature: 'Chat général', count: 9620 },
  ],
  moderationAlerts: [
    { type: 'spam', count: 12, severity: 'medium' },
    { type: 'inappropriate', count: 3, severity: 'high' },
    { type: 'fraud', count: 1, severity: 'critical' },
    { type: 'copyright', count: 5, severity: 'medium' },
  ],
};

export async function GET() {
  return NextResponse.json(analyticsData);
}
