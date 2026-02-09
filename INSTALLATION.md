# 🚀 GUIDE D'INSTALLATION - ECOMM-BURKINA

**Auteur:** August (sofirdaw@gmail.com)  
**Date:** 29 Janvier 2026  
**Version:** 1.0.0

---

## 📋 PRÉREQUIS

Avant de commencer, assurez-vous d'avoir installé :

### Obligatoire
- ✅ **Node.js** >= 20.0.0 → [Télécharger](https://nodejs.org/)
- ✅ **pnpm** >= 9.0.0 → `npm install -g pnpm`
- ✅ **Git** → [Télécharger](https://git-scm.com/)
- ✅ **PostgreSQL** → [Télécharger](https://www.postgresql.org/download/)

### Optionnel (mais recommandé)
- 🔧 **VS Code** → [Télécharger](https://code.visualstudio.com/)
- 🔧 **Postman** ou **Insomnia** (pour tester les APIs)

---

## 📦 ÉTAPE 1 : EXTRACTION DU PROJET

### Option A : Depuis l'archive

```bash
# 1. Extraire l'archive
tar -xzf ecomm-burkina-etape3-complete.tar.gz

# 2. Aller dans le dossier
cd ecomm-burkina
```

### Option B : Depuis GitHub (si vous avez pushé)

```bash
# Cloner le repository
git clone https://github.com/votre-username/ecomm-burkina.git
cd ecomm-burkina
```

---

## 🗄️ ÉTAPE 2 : CONFIGURATION DE LA BASE DE DONNÉES

### 2.1 Créer la base de données PostgreSQL

#### Sur Windows avec pgAdmin
1. Ouvrir **pgAdmin**
2. Clic droit sur **Databases** → **Create** → **Database**
3. Nom : `ecomm_burkina`
4. Owner : `postgres` (ou votre utilisateur)
5. Cliquer **Save**

#### Via la ligne de commande

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE ecomm_burkina;

# Quitter
\q
```

### 2.2 Obtenir l'URL de connexion

Format de l'URL :
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

Exemple :
```
postgresql://postgres:monmotdepasse@localhost:5432/ecomm_burkina
```

---

## ⚙️ ÉTAPE 3 : CONFIGURATION DES VARIABLES D'ENVIRONNEMENT

### 3.1 Copier le fichier d'exemple

```bash
cp .env.example .env
```

### 3.2 Éditer le fichier .env

Ouvrir le fichier `.env` et remplir les variables :

```env
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://postgres:votre_password@localhost:5432/ecomm_burkina"

# ============================================
# NEXT AUTH
# ============================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-super-securise-changez-moi"

# Pour générer un secret sécurisé :
# openssl rand -base64 32

# ============================================
# ORANGE MONEY (Optionnel pour l'instant)
# ============================================
ORANGE_MONEY_API_KEY="your-orange-money-api-key"
ORANGE_MONEY_MERCHANT_ID="your-merchant-id"
ORANGE_MONEY_SECRET="your-orange-money-secret"
ORANGE_MONEY_BASE_URL="https://api.orange.com/orange-money-webpay/bf/v1"

# ============================================
# CLOUDINARY (Optionnel)
# ============================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# ============================================
# EMAIL (Optionnel)
# ============================================
RESEND_API_KEY=""
RESEND_FROM_EMAIL="noreply@ecomm-burkina.com"

# ============================================
# APP CONFIGURATION
# ============================================
NEXT_PUBLIC_APP_NAME="Ecomm-Burkina"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_CURRENCY="XOF"
```

**⚠️ IMPORTANT** : Changez `NEXTAUTH_SECRET` !

Pour générer un secret sécurisé :
```bash
# Sur Linux/Mac
openssl rand -base64 32

# Ou utilisez un générateur en ligne
https://generate-secret.vercel.app/32
```

---

## 📥 ÉTAPE 4 : INSTALLATION DES DÉPENDANCES

```bash
# Installer toutes les dépendances du monorepo
pnpm install
```

Cette commande va installer :
- Les dépendances racine
- Les dépendances de `apps/web`
- Les dépendances de `packages/database`
- Toutes les autres dépendances

**⏱️ Durée estimée** : 2-5 minutes

---

## 🗃️ ÉTAPE 5 : INITIALISATION DE LA BASE DE DONNÉES

### 5.1 Générer le client Prisma

```bash
pnpm db:generate
```

### 5.2 Pousser le schéma vers la base de données

```bash
pnpm db:push
```

Cette commande va :
- ✅ Créer toutes les tables (User, Product, Order, etc.)
- ✅ Créer les relations
- ✅ Créer les index

### 5.3 Vérifier avec Prisma Studio (optionnel)

```bash
pnpm db:studio
```

Cela ouvrira une interface web sur `http://localhost:5555` pour visualiser votre base de données.

---

## 🚀 ÉTAPE 6 : LANCER LE PROJET

### 6.1 Démarrer le serveur de développement

```bash
# Lancer toutes les apps
pnpm dev

# OU lancer uniquement l'app web
pnpm --filter web dev
```

### 6.2 Accéder à l'application

Ouvrir votre navigateur : **http://localhost:3000**

Vous devriez voir la page d'accueil d'Ecomm-Burkina ! 🎉

---

## 🧪 ÉTAPE 7 : TESTER L'APPLICATION

### 7.1 Créer un compte utilisateur

1. Aller sur **http://localhost:3000/register**
2. Remplir le formulaire :
   - Nom : `August Test`
   - Email : `august@test.com`
   - Téléphone : `+226 70 00 00 00`
   - Mot de passe : `Password123`
3. Cliquer sur **Créer mon compte**

### 7.2 Se connecter

1. Aller sur **http://localhost:3000/login**
2. Email : `august@test.com`
3. Mot de passe : `Password123`
4. Cliquer sur **Se connecter**

### 7.3 Tester le panier

1. Aller sur **http://localhost:3000/products**
2. Cliquer sur **Ajouter au panier** sur un produit
3. Cliquer sur l'icône panier en haut
4. Vérifier que le produit est dans le panier

### 7.4 Tester le checkout

1. Dans le panier, cliquer sur **Passer la commande**
2. Remplir l'adresse de livraison
3. Sélectionner **Orange Money**
4. Entrer un numéro : `+226 70 00 00 00`
5. Cliquer sur **Confirmer la commande**

### 7.5 Vérifier dans la base de données

```bash
pnpm db:studio
```

Vous devriez voir :
- ✅ Votre utilisateur dans la table `users`
- ✅ Votre commande dans la table `orders`
- ✅ Les items dans la table `order_items`
- ✅ Le paiement dans la table `payments`

---

## 🛠️ ÉTAPE 8 : OUTILS DE DÉVELOPPEMENT

### Commandes disponibles

```bash
# Development
pnpm dev              # Lance tous les apps en mode dev
pnpm build            # Build tous les apps
pnpm lint             # Lint tous les packages
pnpm format           # Formate le code avec Prettier
pnpm type-check       # Vérifie les types TypeScript
pnpm clean            # Nettoie tous les builds

# Database
pnpm db:generate      # Génère le client Prisma
pnpm db:push          # Push le schéma vers la DB
pnpm db:studio        # Ouvre Prisma Studio
pnpm db:migrate       # Crée une migration
pnpm db:seed          # Seed la database (à créer)

# App web uniquement
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web lint
```

### Extensions VS Code recommandées

Créer un fichier `.vscode/extensions.json` :

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## 📊 ÉTAPE 9 : SEED LA BASE DE DONNÉES (Optionnel)

Pour avoir des produits de test, créez un fichier seed :

### 9.1 Créer le fichier seed

Créer `packages/database/seed.ts` :

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Créer un admin
  const hashedPassword = await bcrypt.hash('Admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecomm-burkina.com' },
    update: {},
    create: {
      email: 'admin@ecomm-burkina.com',
      name: 'Admin Ecomm-Burkina',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin créé:', admin.email);

  // Créer des catégories
  const electronicsCategory = await prisma.category.create({
    data: {
      name: 'Électronique',
      slug: 'electronique',
      description: 'Tous les appareils électroniques',
      isActive: true,
    },
  });

  console.log('✅ Catégorie créée:', electronicsCategory.name);

  // Créer des produits
  const products = [
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Le dernier iPhone d\'Apple',
      price: 750000,
      compareAtPrice: 850000,
      mainImage: 'https://images.unsplash.com/photo-1678652197950-91e39e4114ad?w=800',
      images: ['https://images.unsplash.com/photo-1678652197950-91e39e4114ad?w=800'],
      stock: 10,
      categoryId: electronicsCategory.id,
      isActive: true,
      isFeatured: true,
      isNew: true,
    },
    {
      name: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description: 'Smartphone Samsung haut de gamme',
      price: 650000,
      mainImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
      images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
      stock: 15,
      categoryId: electronicsCategory.id,
      isActive: true,
    },
  ];

  for (const product of products) {
    const created = await prisma.product.create({ data: product });
    console.log('✅ Produit créé:', created.name);
  }

  console.log('🎉 Seeding terminé!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 9.2 Lancer le seed

```bash
pnpm db:seed
```

---

## 🔧 ÉTAPE 10 : RÉSOLUTION DES PROBLÈMES

### Problème : "Error: P1001: Can't reach database server"

**Solution** :
- Vérifier que PostgreSQL est démarré
- Vérifier l'URL dans `.env`
- Tester la connexion : `psql -U postgres`

### Problème : "Module not found: Can't resolve '@ecomm-burkina/database'"

**Solution** :
```bash
pnpm db:generate
pnpm install
```

### Problème : "Invalid `prisma.user.create()` invocation"

**Solution** :
- Vérifier que le schéma est poussé : `pnpm db:push`
- Régénérer le client : `pnpm db:generate`

### Problème : Port 3000 déjà utilisé

**Solution** :
```bash
# Changer le port dans package.json
"dev": "next dev -p 3001"
```

### Problème : NEXTAUTH_SECRET manquant

**Solution** :
- Générer un secret : `openssl rand -base64 32`
- L'ajouter dans `.env`

---

## 📱 ÉTAPE 11 : DÉVELOPPEMENT (Suite)

### Structure du projet

```
ecomm-burkina/
├── apps/
│   └── web/               # Application Next.js
│       ├── src/
│       │   ├── app/       # Pages (App Router)
│       │   ├── components/# Composants React
│       │   ├── lib/       # Utilitaires
│       │   └── store/     # State management (Zustand)
│       ├── public/        # Assets statiques
│       └── package.json
├── packages/
│   └── database/          # Prisma ORM
│       ├── schema.prisma  # Schéma de la DB
│       └── index.ts       # Client Prisma
├── .env                   # Variables d'environnement
├── package.json           # Config monorepo
└── pnpm-workspace.yaml    # Config pnpm
```

### Ajouter un nouveau composant

```bash
# Créer un nouveau composant
cd apps/web/src/components/ui
touch toast.tsx
```

### Ajouter une nouvelle page

```bash
# Créer une nouvelle page
cd apps/web/src/app
mkdir ma-page
touch ma-page/page.tsx
```

### Ajouter une nouvelle API route

```bash
# Créer une nouvelle API
cd apps/web/src/app/api
mkdir mon-endpoint
touch mon-endpoint/route.ts
```

---

## 🎨 ÉTAPE 12 : PERSONNALISATION

### Changer les couleurs

Éditer `apps/web/tailwind.config.ts` :

```typescript
primary: {
  DEFAULT: 'hsl(24 100% 50%)', // Orange Money
  foreground: 'hsl(0 0% 100%)',
},
```

### Changer le logo

Remplacer les fichiers dans `apps/web/public/` :
- `favicon.ico`
- `logo.png`
- `apple-touch-icon.png`

### Changer les métadonnées

Éditer `apps/web/src/app/layout.tsx` :

```typescript
export const metadata: Metadata = {
  title: 'Votre Titre',
  description: 'Votre Description',
  // ...
};
```

---

## 🚀 ÉTAPE 13 : DÉPLOIEMENT (Production)

### Option A : Vercel (Recommandé)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
vercel

# 4. Configurer les variables d'environnement sur Vercel
# → Dashboard → Settings → Environment Variables
```

### Option B : Railway

```bash
# 1. Installer Railway CLI
npm i -g @railway/cli

# 2. Se connecter
railway login

# 3. Initialiser
railway init

# 4. Déployer
railway up
```

### Variables d'environnement en production

⚠️ **Ne jamais commit le fichier .env** !

Configurer les variables sur la plateforme de déploiement :
- `DATABASE_URL` → URL de production (Supabase, Railway, etc.)
- `NEXTAUTH_URL` → URL de production (https://votre-domaine.com)
- `NEXTAUTH_SECRET` → Nouveau secret pour la production

---

## ✅ CHECKLIST FINALE

Avant de commencer à développer, vérifiez que :

- [ ] Node.js >= 20 installé
- [ ] pnpm installé
- [ ] PostgreSQL installé et démarré
- [ ] Projet extrait/cloné
- [ ] `.env` créé et rempli
- [ ] `pnpm install` exécuté avec succès
- [ ] `pnpm db:push` exécuté avec succès
- [ ] `pnpm dev` démarre sans erreur
- [ ] Page d'accueil accessible sur localhost:3000
- [ ] Inscription/connexion fonctionne
- [ ] Panier fonctionne
- [ ] Checkout fonctionne

---

## 📚 RESSOURCES UTILES

### Documentation

- **Next.js** : https://nextjs.org/docs
- **Prisma** : https://www.prisma.io/docs
- **NextAuth.js** : https://next-auth.js.org
- **Tailwind CSS** : https://tailwindcss.com/docs
- **Shadcn/UI** : https://ui.shadcn.com
- **Zustand** : https://zustand-demo.pmnd.rs

### Communauté

- **Discord Ecomm-Burkina** : (à créer)
- **GitHub Issues** : (votre repo)

---

## 🆘 SUPPORT

En cas de problème :

1. Vérifier la **checklist** ci-dessus
2. Consulter la section **Résolution des problèmes**
3. Vérifier les **logs** de la console
4. Contacter August : **sofirdaw@gmail.com**

---

**Bon développement ! 🚀**

**Projet créé par :** August  
**Email :** sofirdaw@gmail.com  
**Version :** 1.0.0  
**Date :** 29 Janvier 2026
