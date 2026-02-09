'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Heart, 
  ArrowLeft, 
  ShoppingBag, 
  Loader2,
  Trash2
} from 'lucide-react';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    mainImage: string;
    averageRating?: number;
    totalReviews: number;
    isNew?: boolean;
    onSale?: boolean;
    stock: number;
  };
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/likes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        // Remove from local state
        setWishlistItems(prev => prev.filter(item => item.product.id !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/client/dashboard"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Mes Favoris</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} produit{wishlistItems.length > 1 ? 's' : ''} en favori
            </p>
          </div>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun favori</h3>
            <p className="text-muted-foreground mb-6">
              Commencez à ajouter des produits à vos favoris pour les retrouver facilement.
            </p>
            <Link href="/client/products">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Découvrir les produits
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Actions */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {wishlistItems.length} produit{wishlistItems.length > 1 ? 's' : ''} sauvegardé{wishlistItems.length > 1 ? 's' : ''}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Clear all wishlist items
                Promise.all(
                  wishlistItems.map(item => removeFromWishlist(item.product.id))
                );
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Vider tout
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((item) => (
              <div key={item.id} className="relative group">
                <ProductCard product={item.product} />
                
                {/* Quick Remove Button */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => removeFromWishlist(item.product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Vous avez vu tout vos favoris?</h3>
            <p className="text-muted-foreground mb-6">
              Découvrez nos nouveaux arrivages et nos meilleures offres.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/client/products">
                <Button>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continuer mes achats
                </Button>
              </Link>
              <Link href="/deals">
                <Button variant="outline">
                  Voir les promotions
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
