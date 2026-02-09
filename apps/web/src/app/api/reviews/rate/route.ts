import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@ecomm-burkina/database';
import { broadcastToProduct } from '../sse-connections';

// POST /api/reviews/rate - Save or update a rating
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, rating, title, comment } = await req.json();

    if (!productId || !rating) {
      return NextResponse.json({ error: 'Product ID and rating are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if user already has a review for this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    let review;

    if (existingReview) {
      // Update existing review
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          title: title || existingReview.title,
          comment: comment || existingReview.comment,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new review
      review = await prisma.review.create({
        data: {
          userId: user.id,
          productId: productId,
          rating,
          title,
          comment,
          isVerifiedPurchase: false, // TODO: Check if user purchased the product
        },
      });
    }

    // Update product average rating
    const reviews = await prisma.review.findMany({
      where: { productId: productId },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating,
      },
    });

    // Broadcast the update to all connected clients
    broadcastToProduct(productId, `data: ${JSON.stringify({ 
      productId, 
      averageRating,
      totalReviews: reviews.length 
    })}\n\n`);

    return NextResponse.json({
      success: true,
      review,
      averageRating,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
