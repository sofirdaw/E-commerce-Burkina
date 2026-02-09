'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Heart } from 'lucide-react';

export default function WishlistRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the client-protected wishlist page
    router.replace('/client/wishlist');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Heart className="h-8 w-8 text-red-500 animate-pulse" />
          <Loader2 className="h-6 w-6 animate-spin ml-2" />
        </div>
        <p className="text-muted-foreground">Redirection vers vos favoris...</p>
      </div>
    </div>
  );
}
