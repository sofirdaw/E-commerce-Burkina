import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@ecomm-burkina/database';
import type { NextRequest } from 'next/server';

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    const { id } = await params;
    
    if (!token?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { quantity } = await req.json();

    if (!quantity || quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: 'La quantité doit être entre 1 et 99' },
        { status: 400 }
      );
    }

    // Check if cart item exists and belongs to user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: id,
        userId: token.id as string,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            stock: true,
            isActive: true,
          },
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Article non trouvé dans le panier' },
        { status: 404 }
      );
    }

    if (!existingItem.product.isActive) {
      return NextResponse.json(
        { error: 'Produit non disponible' },
        { status: 400 }
      );
    }

    if (existingItem.product.stock < quantity) {
      return NextResponse.json(
        { error: `Stock insuffisant. Seulement ${existingItem.product.stock} disponible(s)` },
        { status: 400 }
      );
    }

    // Update cart item
    const updatedItem = await prisma.cartItem.update({
      where: { id: id },
      data: {
        quantity: quantity,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            mainImage: true,
            price: true,
            compareAtPrice: true,
            stock: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Quantité mise à jour',
      item: updatedItem,
    });

  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du panier' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[id] - Remove item from cart
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    const { id } = await params;
    
    if (!token?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Check if cart item exists and belongs to user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: id,
        userId: token.id as string,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Article non trouvé dans le panier' },
        { status: 404 }
      );
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: id },
    });

    return NextResponse.json({
      message: 'Article retiré du panier',
    });

  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Erreur lors du retrait de l\'article' },
      { status: 500 }
    );
  }
}
