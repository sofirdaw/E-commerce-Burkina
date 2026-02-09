import { NextResponse } from 'next/server';
import { prisma } from '@ecomm-burkina/database';

// GET /api/client-products - Get products for client display
export async function GET(req: Request) {
  try {
    // Add timeout to prevent infinite loading
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 seconds timeout
    });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50); // Max 50 items
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'featured';
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause - simplified for performance
    const where: any = {
      isActive: true,
      stock: { gt: 0 },
    };

    // Only add category filter if it's a valid category
    if (category && category !== 'all') {
      where.category = {
        slug: category,
      };
    }

    // Only add search if it's not empty
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    // Simplified order clause
    let orderBy: any = { createdAt: 'desc' }; // Default sort
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'rating':
        orderBy = { totalReviews: 'desc' };
        break;
      case 'featured':
      default:
        orderBy = { isFeatured: 'desc' };
        break;
    }

    // Execute queries with timeout
    const [products, total] = await Promise.race([
      Promise.all([
        prisma.product.findMany({
          where,
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            compareAtPrice: true,
            mainImage: true,
            totalReviews: true,
            isNew: true,
            onSale: true,
            stock: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.product.count({ where }),
      ]),
      timeoutPromise
    ]) as [any[], number];

    // Simplified product transformation
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      mainImage: product.mainImage || (product.images && product.images.length > 0 ? product.images[0] : `https://picsum.photos/seed/${product.slug}/400/400.jpg`),
      averageRating: 0,
      totalReviews: product.totalReviews || 0,
      isNew: product.isNew,
      onSale: product.onSale || !!product.compareAtPrice,
      stock: product.stock,
      category: product.category,
    }));

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error in client-products API:', error);
    
    if (error instanceof Error && error.message === 'Request timeout') {
      return NextResponse.json(
        { error: 'La requête a pris trop de temps. Veuillez réessayer.' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
