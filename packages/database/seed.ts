import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer un admin
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecomm-burkina.com' },
    update: {},
    create: {
      email: 'admin@ecomm-burkina.com',
      name: 'Admin Ecomm-Burkina',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+226 70 00 00 00',
    },
  });

  console.log('✅ Admin créé:', admin.email, '/ Mot de passe: Admin123!');

  // Créer des catégories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronique' },
      update: {},
      create: {
        name: 'Électronique',
        slug: 'electronique',
        description: 'Smartphones, ordinateurs, accessoires',
        isActive: true,
        featured: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'mode' },
      update: {},
      create: {
        name: 'Mode',
        slug: 'mode',
        description: 'Vêtements, chaussures, accessoires',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'maison' },
      update: {},
      create: {
        name: 'Maison & Jardin',
        slug: 'maison',
        description: 'Meubles, décoration, électroménager',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Catégories créées:', categories.length);

  // Créer des produits
  const products = [
    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description:
        'Le iPhone 15 Pro Max avec écran Super Retina XDR de 6.7 pouces, puce A17 Pro, système photo avancé et batterie longue durée.',
      price: 850000,
      compareAtPrice: 950000,
      mainImage:
        'https://images.unsplash.com/photo-1678652197950-91e39e4114ad?w=800',
      images: [
        'https://images.unsplash.com/photo-1678652197950-91e39e4114ad?w=800',
      ],
      stock: 15,
      categoryId: categories[0].id,
      sku: 'IPH15PM-256-BLK',
      isActive: true,
      isFeatured: true,
      isNew: true,
      onSale: true,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description:
        'Le Samsung Galaxy S24 Ultra avec écran AMOLED 6.8 pouces, Snapdragon 8 Gen 3, appareil photo 200MP et S Pen intégré.',
      price: 780000,
      mainImage:
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
      ],
      stock: 20,
      categoryId: categories[0].id,
      sku: 'SAM-S24U-512',
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'MacBook Pro 14" M3',
      slug: 'macbook-pro-14-m3',
      description:
        'MacBook Pro 14 pouces avec puce M3, écran Liquid Retina XDR, jusqu\'à 22 heures d\'autonomie.',
      price: 1500000,
      mainImage:
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      ],
      stock: 8,
      categoryId: categories[0].id,
      sku: 'MBP14-M3-512',
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'AirPods Pro 2ème génération',
      slug: 'airpods-pro-2',
      description:
        'AirPods Pro avec réduction de bruit active, audio spatial personnalisé et jusqu\'à 6 heures d\'écoute.',
      price: 140000,
      compareAtPrice: 160000,
      mainImage:
        'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
      images: [
        'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
      ],
      stock: 30,
      categoryId: categories[0].id,
      sku: 'AIRPODS-PRO-2',
      isActive: true,
      onSale: true,
    },
  ];

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
    console.log('✅ Produit créé:', created.name);
  }

  console.log('🎉 Seeding terminé!');
  console.log('');
  console.log('📌 Identifiants Admin:');
  console.log('Email: admin@ecomm-burkina.com');
  console.log('Mot de passe: Admin123!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
