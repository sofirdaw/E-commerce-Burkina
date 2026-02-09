import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@ecomm-burkina/database';
import { authOptions } from '@/lib/auth';

// GET /api/products/[id]
export async function GET(req: Request, ctx: any) {
  const { params } = ctx;
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
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

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du produit' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Modifier un produit (Admin only)
export async function PUT(req: Request, ctx: any) {
  const { params } = ctx;
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const data = await req.json();

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price ? parseFloat(data.price) : undefined,
        compareAtPrice: data.compareAtPrice
          ? parseFloat(data.compareAtPrice)
          : null,
        mainImage: data.mainImage,
        images: data.images,
        stock: data.stock ? parseInt(data.stock) : undefined,
        categoryId: data.categoryId,
        sku: data.sku,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        isNew: data.isNew,
        onSale: data.onSale,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Supprimer un produit (Admin only)
export async function DELETE(req: Request, ctx: any) {
  const { params } = ctx;
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Soft delete (set isActive to false)
    await prisma.product.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    );
  }
}
