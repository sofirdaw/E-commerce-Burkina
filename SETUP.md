# Configuration de la base de données

## Option 1: Docker (Recommandé)

1. Installez Docker Desktop depuis https://www.docker.com/products/docker-desktop/
2. Lancez la base de données:
   ```bash
   docker compose up -d
   ```

## Option 2: PostgreSQL Local

1. Installez PostgreSQL sur votre machine
2. Créez une base de données:
   ```sql
   CREATE DATABASE ecomm_burkina;
   ```

## Option 3: Service Cloud (Rapide)

Utilisez un service PostgreSQL gratuit:
- Supabase: https://supabase.com/
- Neon: https://neon.tech/
- Railway: https://railway.app/

Une fois que vous avez l'URL de votre base de données, mettez à jour `.env.local`:
```
DATABASE_URL="postgresql://user:password@host:5432/ecomm_burkina?schema=public"
```

## Après configuration

Générez le client Prisma:
```bash
pnpm db:generate
```

Poussez le schéma:
```bash
pnpm db:push
```

Démarrez le projet:
```bash
pnpm run dev
```
