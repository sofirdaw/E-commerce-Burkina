import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@ecomm-burkina/database';
import { addConnection, removeConnection } from '../sse-connections';

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId');

  if (!productId) {
    return NextResponse.json(
      { error: 'productId query parameter is required' },
      { status: 400 }
    );
  }

  // Generate unique session ID for this connection
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log(`[SSE] New connection - Product: ${productId}, Session: ${sessionId}`);

  try {
    // Register subscriber in database
    await prisma.sseSubscriber.create({
      data: {
        productId,
        sessionId,
      },
    });
    console.log(`[SSE] Subscriber registered in DB - Product: ${productId}, Session: ${sessionId}`);
  } catch (error) {
    console.error('[SSE] Error registering subscriber in DB:', error);
  }

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Register in memory for faster broadcast
      addConnection(productId, controller);

      // Send initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode('data: connected\n\n'));
      console.log(`[SSE] Memory connection registered - Product: ${productId}`);

      // On disconnect, remove from memory and database
      const cleanup = async () => {
        console.log(`[SSE] Disconnecting - Product: ${productId}, Session: ${sessionId}`);
        removeConnection(productId, controller);
        
        try {
          await prisma.sseSubscriber.deleteMany({
            where: {
              productId,
              sessionId,
            },
          });
          console.log(`[SSE] Subscriber removed from DB - Product: ${productId}, Session: ${sessionId}`);
        } catch (error) {
          console.error('[SSE] Error removing subscriber from DB:', error);
        }
      };

      // Detect disconnection
      req.signal.addEventListener('abort', cleanup);
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
