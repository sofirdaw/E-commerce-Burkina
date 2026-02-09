'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'pageView',
            path: pathname,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.log('Analytics tracking failed:', error);
      }
    };

    // Track immediately when component mounts
    trackPageView();

    // Track page changes (for SPA navigation)
    const handleRouteChange = () => {
      setTimeout(trackPageView, 100); // Small delay to ensure pathname is updated
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    
    // Custom event for Next.js route changes
    window.addEventListener('routeChangeComplete', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('routeChangeComplete', handleRouteChange);
    };
  }, [pathname]);

  return null; // This component doesn't render anything
}
