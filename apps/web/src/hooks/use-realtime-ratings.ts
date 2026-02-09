'use client';

import { useEffect, useCallback } from 'react';

interface RatingUpdate {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export function useRealtimeRatings(productId: string, onUpdate: (data: RatingUpdate) => void) {
  useEffect(() => {
    if (!productId) {
      console.log('[useRealtimeRatings] No productId, skipping SSE connection');
      return;
    }

    console.log('[useRealtimeRatings] Establishing SSE connection for product:', productId);

    // Create SSE connection
    const eventSource = new EventSource(
      `/api/reviews/subscribe?productId=${productId}`
    );

    const handleMessage = (event: MessageEvent) => {
      try {
        // Skip the initial connection message
        if (event.data === 'connected') {
          console.log('[SSE] Connected for product:', productId);
          return;
        }

        console.log('[SSE] Received message:', event.data);
        const data = JSON.parse(event.data);
        
        // Filter updates for this product only
        if (data.productId === productId) {
          console.log('[SSE] Rating update for product', productId, ':', data);
          onUpdate({
            productId: data.productId,
            averageRating: data.averageRating,
            totalReviews: data.totalReviews,
          });
        }
      } catch (error) {
        console.error('[SSE] Error parsing message:', error, 'Raw data:', event.data);
      }
    };

    const handleError = () => {
      console.error('[SSE] Connection error for product:', productId);
      eventSource.close();
    };

    eventSource.addEventListener('message', handleMessage);
    eventSource.addEventListener('error', handleError);

    console.log('[SSE] Event listeners attached for product:', productId);

    return () => {
      console.log('[SSE] Cleaning up connection for product:', productId);
      eventSource.removeEventListener('message', handleMessage);
      eventSource.removeEventListener('error', handleError);
      eventSource.close();
    };
  }, [productId, onUpdate]);
}
