import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateProducts() {
  console.log('🔄 Mise à jour des produits...');

  // Mettre à jour tous les produits pour qu'ils soient actifs
  const result = await prisma.product.updateMany({
    where: {
      isActive: false, // ou où isActive est null/undefined
    },
    data: {
      isActive: true,
    },
  });

  console.log(`✅ ${result.count} produits mis à jour comme actifs`);

  // Vérifier les produits avec leurs catégories
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    take: 5,
  });

  console.log('\n📦 Exemples de produits:');
  products.forEach((product) => {
    console.log(`- ${product.name} (${product.category?.name}) - ${product.price} FCFA`);
  });

  console.log('\n✅ Mise à jour terminée!');
}

async function main() {
  try {
    await updateProducts();
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
