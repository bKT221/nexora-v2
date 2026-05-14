// Safe database module — works with or without Prisma
// When Prisma is not configured, all db operations return empty results

let _db: any = null;

try {
  // Only import Prisma if it's properly configured
  const { PrismaClient } = require('@prisma/client');
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  }
  _db = globalForPrisma.prisma ?? new PrismaClient({ log: [] })
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = _db
} catch {
  // Prisma not available — use null (API routes handle this gracefully)
  _db = null;
}

// Proxy that returns empty results when db is not available
function createSafeDbProxy(): any {
  return new Proxy({} as any, {
    get(_target, prop: string) {
      if (_db) return (_db as any)[prop];
      // Return a mock that returns empty results
      return new Proxy({} as any, {
        get(_t2, method: string) {
          return async (..._args: any[]) => {
            if (method === 'findMany') return [];
            if (method === 'findFirst') return null;
            if (method === 'findUnique') return null;
            if (method === 'count') return 0;
            if (method === 'aggregate') return { _count: 0 };
            return null;
          };
        }
      });
    }
  });
}

export const db = _db || createSafeDbProxy();
