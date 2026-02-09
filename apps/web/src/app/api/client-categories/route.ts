import { NextResponse } from 'next/server';
import { prisma } from '@ecomm-burkina/database';

// GET /api/client-categories - Get categories for client display
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Transform data to include product count
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      icon: category.icon,
      isActive: category.isActive,
      featured: category.featured,
      productCount: category._count.products,
    }));

    // Add "All" category
    const allCategories = [
      {
        id: 'all',
        name: 'Toutes les catégories',
        slug: 'all',
        description: 'Tous nos produits',
        image: null,
        icon: null,
        isActive: true,
        featured: false,
        productCount: 0,
      },
      ...transformedCategories,
    ];

    return NextResponse.json(allCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}
