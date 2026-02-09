import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { join } from 'path';

// Charger les variables d'environnement depuis le répertoire racine
config({ path: join(__dirname, '../../.env.local') });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export * from '@prisma/client';
