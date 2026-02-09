// Shared SSE connections store for broadcasting across routes
export const activeConnections = new Map<string, Set<ReadableStreamDefaultController>>();

export function getActiveConnections(productId: string): Set<ReadableStreamDefaultController> {
  if (!activeConnections.has(productId)) {
    activeConnections.set(productId, new Set());
  }
  return activeConnections.get(productId)!;
}

export function addConnection(productId: string, controller: ReadableStreamDefaultController) {
  getActiveConnections(productId).add(controller);
}

export function removeConnection(productId: string, controller: ReadableStreamDefaultController) {
  getActiveConnections(productId).delete(controller);
}

export function broadcastToProduct(productId: string, message: string) {
  const connections = activeConnections.get(productId);
  if (!connections || connections.size === 0) {
    console.log(`[Broadcast] No active connections for product ${productId}`);
    return;
  }

  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);

  connections.forEach((controller) => {
    try {
      controller.enqueue(encodedMessage);
    } catch (error) {
      console.error('[Broadcast] Error sending to connection:', error);
      connections.delete(controller);
    }
  });
}
