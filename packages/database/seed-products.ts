import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  console.log('🌱 Création des produits de test...');

  // Créer des catégories si elles n'existent pas
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Électronique',
        slug: 'electronics',
        description: 'Produits électroniques et gadgets',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: {
        name: 'Mode',
        slug: 'fashion',
        description: 'Vêtements et accessoires',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'beauty' },
      update: {},
      create: {
        name: 'Beauté',
        slug: 'beauty',
        description: 'Produits de beauté et soins',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: {
        name: 'Sport',
        slug: 'sports',
        description: 'Équipements et accessoires de sport',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home' },
      update: {},
      create: {
        name: 'Maison',
        slug: 'home',
        description: 'Articles pour la maison',
      },
    }),
  ]);

  // Créer des produits pour chaque catégorie
  const products = [
    // Électronique
    {
      name: 'Smartphone Samsung Galaxy A54',
      slug: 'samsung-galaxy-a54',
      description: 'Smartphone 5G avec écran 6.4 pouces, 128GB',
      price: 250000,
      categoryId: categories[0].id,
      stock: 15,
      images: ['https://picsum.photos/seed/samsung-a54/400/400.jpg'],
    },
    {
      name: 'Ordinateur Portable HP 15"',
      slug: 'hp-laptop-15',
      description: 'Ordinateur portable Intel Core i5, 8GB RAM, 512GB SSD',
      price: 450000,
      categoryId: categories[0].id,
      stock: 8,
      images: ['https://picsum.photos/seed/hp-laptop/400/400.jpg'],
    },
    {
      name: 'Écouteurs Bluetooth Sony',
      slug: 'sony-bluetooth-earphones',
      description: 'Écouteurs sans fil avec réduction de bruit',
      price: 75000,
      categoryId: categories[0].id,
      stock: 25,
      images: ['https://picsum.photos/seed/sony-earphones/400/400.jpg'],
    },

    // Mode
    {
      name: 'Robe d\'été florale',
      slug: 'summer-floral-dress',
      description: 'Robe légère en coton avec motif floral',
      price: 25000,
      categoryId: categories[1].id,
      stock: 20,
      images: ['https://picsum.photos/seed/floral-dress/400/400.jpg'],
    },
    {
      name: 'Jean slim fit',
      slug: 'slim-fit-jeans',
      description: 'Jean denim slim fit pour homme',
      price: 35000,
      categoryId: categories[1].id,
      stock: 30,
      images: ['https://picsum.photos/seed/slim-jeans/400/400.jpg'],
    },
    {
      name: 'Basket Nike Air Max',
      slug: 'nike-air-max',
      description: 'Chaussures de sport confortables',
      price: 65000,
      categoryId: categories[1].id,
      stock: 12,
      images: ['https://picsum.photos/seed/nike-airmax/400/400.jpg'],
    },

    // Beauté
    {
      name: 'Kit de soin visage',
      slug: 'face-care-kit',
      description: 'Ensemble complet pour soin du visage',
      price: 45000,
      categoryId: categories[2].id,
      stock: 18,
      images: ['https://picsum.photos/seed/face-kit/400/400.jpg'],
    },
    {
      name: 'Parfum Chanel N°5',
      slug: 'chanel-parfum-5',
      description: 'Parfum féminin iconique 100ml',
      price: 125000,
      categoryId: categories[2].id,
      stock: 6,
      images: ['https://picsum.photos/seed/chanel5/400/400.jpg'],
    },
    {
      name: 'Maquillage palette',
      slug: 'makeup-palette',
      description: 'Palette de maquillage 32 couleurs',
      price: 28000,
      categoryId: categories[2].id,
      stock: 22,
      images: ['https://picsum.photos/seed/makeup-palette/400/400.jpg'],
    },

    // Sport
    {
      name: 'Tapis de yoga premium',
      slug: 'yoga-mat-premium',
      description: 'Tapis antidérapant épaisseur 6mm',
      price: 22000,
      categoryId: categories[3].id,
      stock: 15,
      images: ['https://picsum.photos/seed/yoga-mat/400/400.jpg'],
    },
    {
      name: 'Haltères réglables 20kg',
      slug: 'adjustable-dumbbells',
      description: 'Set d\'haltères réglables 2-20kg',
      price: 85000,
      categoryId: categories[3].id,
      stock: 8,
      images: ['https://picsum.photos/seed/dumbbells/400/400.jpg'],
    },
    {
      name: 'Bouteille d\'eau sport 1L',
      slug: 'sport-water-bottle',
      description: 'Bouteille isotherme pour sport',
      price: 15000,
      categoryId: categories[3].id,
      stock: 35,
      images: ['https://picsum.photos/seed/water-bottle/400/400.jpg'],
    },

    // Maison
    {
      name: 'Cafetière Nespresso',
      slug: 'nespresso-coffee-maker',
      description: 'Machine à café Nespresso avec capsule',
      price: 95000,
      categoryId: categories[4].id,
      stock: 10,
      images: ['https://picsum.photos/seed/nespresso/400/400.jpg'],
    },
    {
      name: 'Lampe de bureau LED',
      slug: 'led-desk-lamp',
      description: 'Lampe réglable avec USB',
      price: 18000,
      categoryId: categories[4].id,
      stock: 25,
      images: ['https://picsum.photos/seed/desk-lamp/400/400.jpg'],
    },
    {
      name: 'Coussin décoratif',
      slug: 'decorative-cushion',
      description: 'Coussin en coton 40x40cm',
      price: 12000,
      categoryId: categories[4].id,
      stock: 40,
      images: ['https://picsum.photos/seed/cushion/400/400.jpg'],
    },
  ];

  // Insérer les produits
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: {
        ...product,
        isFeatured: Math.random() > 0.7, // 30% de chance d'être featured
      },
    });
  }

  console.log('✅ Produits créés avec succès!');
}

async function main() {
  try {
    await seedProducts();
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
