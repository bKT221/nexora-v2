// Safe database wrapper - Mock DB for Vercel deployment
// No Prisma required - all data is in-memory

interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: string;
  avatar?: string;
  createdAt: Date;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  rating: number;
  students: number;
  thumbnail: string;
  category: string;
  level: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  seller: string;
  category: string;
  rating: number;
  stock: number;
}

const users: User[] = [
  { id: "1", email: "admin@nexora.app", name: "Admin Nexora", password: "admin123", role: "admin", createdAt: new Date() },
  { id: "2", email: "user@nexora.app", name: "Utilisateur Test", password: "user123", role: "user", createdAt: new Date() },
  { id: "3", email: "fadilou@nexora.app", name: "Fadilou", password: "test123", role: "user", createdAt: new Date() },
];

const courses: Course[] = [
  { id: "1", title: "Développement Web Moderne", description: "Apprenez HTML, CSS, JavaScript et les frameworks modernes", instructor: "Moussa Diallo", price: 15000, rating: 4.8, students: 1250, thumbnail: "/logo.svg", category: "tech", level: "débutant" },
  { id: "2", title: "Marketing Digital Africain", description: "Stratégies de marketing adaptées au marché africain", instructor: "Aminata Traoré", price: 10000, rating: 4.6, students: 890, thumbnail: "/logo.svg", category: "business", level: "intermédiaire" },
  { id: "3", title: "Intelligence Artificielle", description: "Introduction à l'IA et au machine learning", instructor: "Ibrahim Keita", price: 25000, rating: 4.9, students: 2100, thumbnail: "/logo.svg", category: "tech", level: "avancé" },
  { id: "4", title: "Entrepreneuriat en Afrique", description: "Lancez votre business sur le continent", instructor: "Fatou Sow", price: 8000, rating: 4.5, students: 3200, thumbnail: "/logo.svg", category: "business", level: "débutant" },
  { id: "5", title: "Design UX/UI", description: "Créez des interfaces utilisateur modernes", instructor: "Kofi Asante", price: 18000, rating: 4.7, students: 670, thumbnail: "/logo.svg", category: "design", level: "intermédiaire" },
  { id: "6", title: "Mobile Money & Fintech", description: "Comprendre les systèmes de paiement mobile en Afrique", instructor: "Chidi Okafor", price: 12000, rating: 4.4, students: 1800, thumbnail: "/logo.svg", category: "finance", level: "débutant" },
];

const products: Product[] = [
  { id: "1", name: "Tissu Wax Premium", description: "Tissu wax de haute qualité motif africain", price: 5000, image: "/logo.svg", seller: "Marché Express", category: "mode", rating: 4.7, stock: 50 },
  { id: "2", name: "Sac Artisanal", description: "Sac fait main en cuir véritable", price: 15000, image: "/logo.svg", seller: "Artisan Shop", category: "accessoires", rating: 4.8, stock: 20 },
  { id: "3", name: "Jus de Bissap Bio", description: "Jus naturel de bissap certifié bio", price: 2000, image: "/logo.svg", seller: "Saveurs d'Afrique", category: "alimentation", rating: 4.5, stock: 100 },
  { id: "4", name: "Tablette Éducative", description: "Tablette avec contenu éducatif pour enfants", price: 45000, image: "/logo.svg", seller: "EduTech Africa", category: "tech", rating: 4.6, stock: 15 },
];

export const db = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      if (where.email) return users.find(u => u.email === where.email) || null;
      if (where.id) return users.find(u => u.id === where.id) || null;
      return null;
    },
    findMany: async () => users,
    create: async ({ data }: { data: Omit<User, "id" | "createdAt"> }) => {
      const user: User = { ...data, id: String(users.length + 1), createdAt: new Date() };
      users.push(user);
      return user;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<User> }) => {
      const idx = users.findIndex(u => u.id === where.id);
      if (idx === -1) return null;
      users[idx] = { ...users[idx], ...data };
      return users[idx];
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const idx = users.findIndex(u => u.id === where.id);
      if (idx === -1) return null;
      return users.splice(idx, 1)[0];
    },
    count: async () => users.length,
  },
  course: {
    findMany: async () => courses,
    findUnique: async ({ where }: { where: { id: string } }) => courses.find(c => c.id === where.id) || null,
    count: async () => courses.length,
  },
  product: {
    findMany: async () => products,
    findUnique: async ({ where }: { where: { id: string } }) => products.find(p => p.id === where.id) || null,
    count: async () => products.length,
  },
  notification: {
    findMany: async () => [
      { id: "1", title: "Bienvenue sur Nexora!", message: "Découvrez toutes les fonctionnalités", read: false, createdAt: new Date() },
      { id: "2", title: "Nouveau cours disponible", message: "Intelligence Artificielle est maintenant disponible", read: false, createdAt: new Date() },
      { id: "3", title: "Offre spéciale", message: "20% de réduction sur tous les cours cette semaine", read: false, createdAt: new Date() },
    ],
    count: async () => 3,
  },
  payment: {
    findMany: async () => [
      { id: "1", amount: 15000, method: "orange_money", status: "completed", createdAt: new Date() },
      { id: "2", amount: 10000, method: "mtn_momo", status: "pending", createdAt: new Date() },
    ],
    count: async () => 2,
    aggregate: async () => ({ _sum: { amount: 35000 } }),
  },
  analytics: {
    findMany: async () => [],
  },
};
