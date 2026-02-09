import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCategories() {
  const categories = [
    {
      name: 'Électronique',
      slug: 'electronique',
      description: 'Appareils électroniques et gadgets',
    },
    {
      name: 'Vêtements',
      slug: 'vetements',
      description: 'Mode et textiles',
    },
    {
      name: 'Alimentation',
      slug: 'alimentation',
      description: 'Produits alimentaires et boissons',
    },
    {
      name: 'Maison & Bureau',
      slug: 'maison-bureau',
      description: 'Articles pour la maison et le bureau',
    },
    {
      name: 'Beauté & Santé',
      slug: 'beaute-sante',
      description: 'Produits de beauté et de santé',
    },
  ];

  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug },
    });

    if (!existing) {
      await prisma.category.create({
        data: category,
      });
      console.log(`Catégorie créée: ${category.name}`);
    } else {
      console.log(`Catégorie existe déjà: ${category.name}`);
    }
  }

  console.log('Catégories créées avec succès!');
}

createCategories()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
