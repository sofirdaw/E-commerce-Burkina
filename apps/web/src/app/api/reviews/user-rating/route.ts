import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@ecomm-burkina/database';

// GET /api/reviews/user-rating?productId=xxx - Get user's rating for a product
export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      // Return 0 rating for non-authenticated users
      return NextResponse.json({ rating: 0 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ rating: 0 });
    }

    // Get user's review for this product
    const review = await prisma.review.findFirst({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    return NextResponse.json({
      rating: review?.rating || 0,
      hasReview: !!review,
      review,
    });
  } catch (error) {
    console.error('Error fetching user rating:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
