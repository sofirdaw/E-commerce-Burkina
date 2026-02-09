import { NextResponse } from 'next/server';
import { prisma } from '@ecomm-burkina/database';

// GET /api/client-products/[slug] - Get single product details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findFirst({
      where: {
        slug: slug,
        isActive: true,
        stock: { gt: 0 },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Get related products from same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
        stock: { gt: 0 },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        mainImage: true,
        totalReviews: true,
        stock: true,
      },
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform product to match client interface
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      mainImage: product.mainImage || '/placeholder.jpg',
      images: product.images || [],
      averageRating: product.averageRating || 0,
      totalReviews: product.totalReviews || 0,
      isNew: product.isNew,
      onSale: product.onSale || !!product.compareAtPrice,
      stock: product.stock,
      category: product.category,
      sku: product.sku,
      brand: '',
      specifications: {}, // TODO: Add specifications field to schema
    };

    // Transform related products
    const transformedRelatedProducts = relatedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      mainImage: product.mainImage || '/placeholder.jpg',
      averageRating: product.averageRating || 0,
      totalReviews: product.totalReviews || 0,
      isNew: false,
      onSale: !!product.compareAtPrice,
      stock: product.stock,
    }));

    return NextResponse.json({
      product: transformedProduct,
      relatedProducts: transformedRelatedProducts,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du produit' },
      { status: 500 }
    );
  }
}
