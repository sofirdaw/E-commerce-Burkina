import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@ecomm-burkina/database';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier si l'utilisateur est un revendeur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { vendorProfile: true },
    });

    if (!user || user.role !== 'VENDOR' || !user.vendorProfile?.isActive) {
      return NextResponse.json({ error: 'Accès revendeur requis' }, { status: 403 });
    }

    // Récupérer les produits du revendeur
    const products = await prisma.product.findMany({
      where: { vendorId: user.id },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculer les statistiques
    const productsWithStats = products.map(product => {
      const sales = product._count.orderItems;
      const revenue = product.price * sales;
      
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        status: product.stock > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
        category: product.category?.name || 'Non catégorisé',
        images: [product.mainImage],
        createdAt: product.createdAt.toISOString(),
        views: Math.floor(Math.random() * 1000), // TODO: Implement view tracking
        sales,
        revenue,
      };
    });

    return NextResponse.json(productsWithStats);

  } catch (error) {
    console.error('Error fetching vendor products:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier si l'utilisateur est un revendeur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { vendorProfile: true },
    });

    if (!user || user.role !== 'VENDOR' || !user.vendorProfile?.isActive) {
      return NextResponse.json({ error: 'Accès revendeur requis' }, { status: 403 });
    }

    const productData = await req.json();

    // Validation
    const requiredFields = ['name', 'price', 'stock', 'description', 'category'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Créer le produit
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        mainImage: productData.mainImage || '/placeholder.jpg',
        images: productData.images || [],
        sku: `VENDOR-${Date.now()}`,
        brand: user.vendorProfile?.businessName || 'Vendeur',
        vendorId: user.id,
        categoryId: productData.categoryId,
        specifications: productData.specifications || {},
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Produit créé avec succès',
    });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}
