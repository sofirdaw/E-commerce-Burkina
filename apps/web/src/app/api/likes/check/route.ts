import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@ecomm-burkina/database';

// GET /api/likes/check?productId=xxx - Check if user likes a product
export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ isLiked: false, likesCount: 0 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ isLiked: false, likesCount: 0 });
    }

    // Check if user likes the product
    const like = await prisma.wishlistItem.findFirst({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    // Get total likes count
    const likesCount = await prisma.wishlistItem.count({
      where: { productId },
    });

    return NextResponse.json({ 
      isLiked: !!like,
      likesCount 
    });

  } catch (error) {
    console.error('Error checking like status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
