import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@ecomm-burkina/database';
import type { NextRequest } from 'next/server';

// GET /api/cart - Get user's cart
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: token.id as string,
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
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const totalItems = cartItems.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    return NextResponse.json({
      items: cartItems,
      summary: {
        subtotal,
        totalItems,
        itemCount: cartItems.length,
      },
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du panier' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'ID du produit requis' },
        { status: 400 }
      );
    }

    if (quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: 'La quantité doit être entre 1 et 99' },
        { status: 400 }
      );
    }

    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        isActive: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    if (!product.isActive) {
      return NextResponse.json(
        { error: 'Produit non disponible' },
        { status: 400 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: `Stock insuffisant. Seulement ${product.stock} disponible(s)` },
        { status: 400 }
      );
    }

    // Add or update cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: token.id as string,
          productId: productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
        price: product.price, // Update price to current price
      },
      create: {
        userId: token.id as string,
        productId: productId,
        quantity: quantity,
        price: product.price,
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
      message: 'Produit ajouté au panier',
      item: cartItem,
    });

  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout au panier' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: token.id as string,
      },
    });

    return NextResponse.json({
      message: 'Panier vidé avec succès',
    });

  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Erreur lors du vidage du panier' },
      { status: 500 }
    );
  }
}
