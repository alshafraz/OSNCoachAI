import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  const dbPath = process.env.DATABASE_URL || ('file:' + path.join(process.cwd(), 'dev.db'));
  console.log('[Prisma Init] Connecting to database:', dbPath);
  const adapter = new PrismaBetterSqlite3({ url: dbPath });

  prismaInstance = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;
