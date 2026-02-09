import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@ecomm-burkina/database';
import { authOptions } from '@/lib/auth';

// GET /api/products - Liste des produits
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: order,
        },
        include: {
          category: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

// POST /api/products - Créer un produit (Admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const data = await req.json();

    // Validation
    if (!data.name || !data.price || !data.categoryId) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = data.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    // Generate unique SKU if not provided
    let uniqueSku = data.sku;
    if (!uniqueSku) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 6);
      uniqueSku = `PRD-${timestamp}-${random}`.toUpperCase();
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description || '',
        price: parseFloat(data.price),
        compareAtPrice: data.compareAtPrice
          ? parseFloat(data.compareAtPrice)
          : null,
        mainImage: data.mainImage || null,
        images: data.images || [],
        stock: parseInt(data.stock) || 0,
        categoryId: data.categoryId,
        sku: uniqueSku,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        isNew: data.isNew ?? false,
        onSale: data.onSale ?? false,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}
