# 🛍️ Ecomm-Burkina

Premium E-commerce platform for Burkina Faso - Modern, Multiplatform & Feature-rich

**Author:** August (sofirdaw@gmail.com)  
**Version:** 1.0.0  
**License:** MIT

---

## 🚀 Features

### Core Features
- 🔐 Advanced authentication system
- 🛒 Smart shopping cart with persistence
- 💳 Orange Money payment integration
- 📱 Progressive Web App (PWA)
- 🌍 Multi-language support (Français, Mooré, Dioula)
- 💰 FCFA currency with automatic conversion
- 📦 Real-time order tracking
- ⭐ Product reviews and ratings
- 🔍 Advanced search with filters
- 📊 Admin dashboard with analytics

### Premium Features
- 🤖 AI-powered product recommendations
- 💬 Live chat with vendors
- 🏪 Multi-vendor marketplace
- 📱 Native mobile apps (iOS & Android)
- 🔔 Push notifications
- 📍 Geolocation for deliveries
- 📈 Real-time inventory management
- 🎨 Dark/Light mode
- 🚀 Offline mode support

---

## 🏗️ Architecture

This is a **monorepo** built with:

```
ecomm-burkina/
├── apps/
│   ├── web/          # Next.js 15 web application
│   ├── mobile/       # React Native (Expo) mobile app
│   └── admin/        # Admin dashboard
├── packages/
│   ├── ui/           # Shared UI components (Shadcn/UI)
│   ├── database/     # Prisma ORM & schemas
│   ├── api/          # tRPC API routes
│   └── config/       # Shared configurations
└── prisma/           # Database migrations & seeds
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 4
- **Components:** Shadcn/UI
- **State:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod

### Mobile
- **Framework:** Expo SDK (latest)
- **Navigation:** Expo Router
- **Styling:** NativeWind (Tailwind for RN)

### Backend
- **Database:** PostgreSQL
- **ORM:** Prisma 6
- **API:** tRPC (type-safe)
- **Auth:** NextAuth.js v5

### DevOps
- **Package Manager:** pnpm
- **Monorepo:** Turborepo
- **CI/CD:** GitHub Actions
- **Hosting:** Vercel (web) + Expo EAS (mobile)
- **Database Hosting:** Supabase / Railway

---

## 📦 Installation

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 9.0.0
- PostgreSQL database

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ecomm-burkina
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Setup database**
```bash
pnpm db:push
pnpm db:generate
```

5. **Run development servers**
```bash
# All apps
pnpm dev

# Individual apps
pnpm --filter web dev
pnpm --filter mobile dev
pnpm --filter admin dev
```

---

## 🗄️ Database Commands

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database (development)
pnpm db:push

# Create migration
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio
```

---

## 🧪 Available Scripts

```bash
pnpm dev          # Start all apps in development
pnpm build        # Build all apps for production
pnpm lint         # Lint all packages
pnpm format       # Format code with Prettier
pnpm type-check   # TypeScript type checking
pnpm clean        # Clean all build artifacts
```

---

## 📱 Applications

### Web App (`apps/web`)
- **URL:** http://localhost:3000
- **Features:** Full e-commerce experience, PWA support
- **Tech:** Next.js 15, React 19, Tailwind CSS

### Mobile App (`apps/mobile`)
- **Platform:** iOS & Android
- **Features:** Native mobile experience
- **Tech:** Expo, React Native, NativeWind

### Admin Dashboard (`apps/admin`)
- **URL:** http://localhost:3001
- **Features:** Product management, analytics, orders
- **Tech:** Next.js 15, Recharts, Shadcn/UI

---

## 🌍 Localization

Supported languages:
- 🇫🇷 Français (default)
- 🇧🇫 Mooré
- 🇧🇫 Dioula
- 🇧🇫 Fulfuldé

Currency: **FCFA (XOF)**

---

## 💳 Payment Integration

- ✅ Orange Money (Burkina Faso)
- 🔜 Wave
- 🔜 Moov Money
- 🔜 Cash on Delivery

---

## 🤝 Contributing

This is a private project. For any suggestions or issues, contact August at sofirdaw@gmail.com

---

## 📄 License

MIT License - Copyright (c) 2026 August

---

## 🙏 Acknowledgments

- Original inspiration: [Salinaka E-commerce](https://github.com/jgudo/ecommerce-react)
- Modernized and enhanced by August for the Burkinabè market

---

**Built with ❤️ in Burkina Faso 🇧🇫**
