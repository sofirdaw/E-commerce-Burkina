import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@ecomm-burkina/database';

// POST /api/likes - Add a like to a product
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if already liked
    const existingLike = await prisma.wishlistItem.findFirst({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    if (existingLike) {
      return NextResponse.json({ error: 'Already liked' }, { status: 409 });
    }

    // Add like (using wishlist as likes table)
    await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId: productId,
      },
    });

    // Get updated likes count
    const likesCount = await prisma.wishlistItem.count({
      where: { productId },
    });

    return NextResponse.json({ 
      success: true, 
      likesCount,
      message: 'Product liked successfully' 
    });

  } catch (error) {
    console.error('Error adding like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/likes - Remove a like from a product
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove like
    const deletedLike = await prisma.wishlistItem.deleteMany({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    if (deletedLike.count === 0) {
      return NextResponse.json({ error: 'Like not found' }, { status: 404 });
    }

    // Get updated likes count
    const likesCount = await prisma.wishlistItem.count({
      where: { productId },
    });

    return NextResponse.json({ 
      success: true, 
      likesCount,
      message: 'Like removed successfully' 
    });

  } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
