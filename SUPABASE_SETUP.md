# Configuration Supabase

## Étapes

1. **Créer un projet Supabase**:
   - Allez sur https://supabase.com/
   - Connectez-vous ou créez un compte
   - Cliquez sur "New Project"

2. **Configurer le projet**:
   - Donnez un nom à votre projet (ex: "ecomm-burkina")
   - Choisissez une région proche (ex: "EU West")
   - Créez un mot de passe fort
   - Attendez que le projet soit prêt

3. **Obtenir la connection string**:
   - Allez dans **Settings** → **Database**
   - Trouvez "Connection string"
   - Copiez l'URL qui ressemble à:
     ```
     postgresql://postgres:[VOTRE-MOT-DE-PASSE]@[HOST]:5432/postgres
     ```

4. **Configurer .env.local**:
   Remplacez `VOTRE_CONNECTION_STRING` par votre vraie URL:
   ```
   DATABASE_URL="VOTRE_CONNECTION_STRING"
   ```

5. **Générer et pousser le schéma**:
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

6. **Démarrer le projet**:
   ```bash
   pnpm run dev
   ```

## Variables requises dans .env.local

```env
# Base de données
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="jwVSQckftdZCDx6823dmQBUoO+CNz2lChDtHbTd/mIc="

# Cloudinary (optionnel pour commencer)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

Le reste des variables peut rester vide pour commencer.
