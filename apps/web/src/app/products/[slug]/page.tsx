 'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ProductCard } from '@/components/product/product-card';
import { AddToCart } from '@/components/product/add-to-cart';
import { useCart } from '@/contexts/cart-context';
import { useRouter } from 'next/navigation';
import { LikeButton } from '@/components/product/like-button';
import { RatingStars } from '@/components/product/rating-stars';
import { useRealtimeRatings } from '@/hooks/use-realtime-ratings';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  mainImage: string;
  images: string[];
  averageRating?: number;
  totalReviews: number;
  isNew?: boolean;
  onSale?: boolean;
  stock: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  sku: string;
  brand: string;
  specifications: Record<string, string>;
}

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [productRating, setProductRating] = useState<{ averageRating?: number; totalReviews: number }>({
    averageRating: undefined,
    totalReviews: 0,
  });

  const fetchProduct = async () => {
    const response = await fetch(`/api/client-products/${slug}`);
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Failed to fetch product');
    }
    return response.json();
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['product', slug],
    queryFn: fetchProduct,
    enabled: !!slug,
    // Disabled polling to avoid interrupting user navigation.
    // Real-time updates handled via SSE in useRealtimeRatings hook
    refetchInterval: false,
    refetchOnWindowFocus: true,
  });

  const product: Product | null = data?.product ?? null;
  const relatedProducts: any[] = data?.relatedProducts ?? [];
  const loading = isLoading || isFetching;

  // Handle real-time rating updates from SSE
  const handleRealtimeRatingUpdate = useCallback((newRating: any) => {
    setProductRating({
      averageRating: newRating.averageRating,
      totalReviews: newRating.totalReviews,
    });
  }, []);

  useRealtimeRatings(product?.id || '', handleRealtimeRatingUpdate);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.mainImage,
      quantity: quantity,
      stock: product.stock,
      vendorId: "vendor-1", // TODO: Get from product data
      vendorName: "Vendeur", // TODO: Get from product data
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // Ajouter au panier puis rediriger vers le checkout
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.mainImage,
      quantity: quantity,
      stock: product.stock,
      vendorId: "vendor-1", // TODO: Get from product data
      vendorName: "Vendeur", // TODO: Get from product data
    });
    
    // Rediriger vers le checkout
    router.push('/checkout');
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <p className="text-muted-foreground">Le produit que vous recherchez n'existe pas.</p>
        </div>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) /
          product.compareAtPrice) *
          100
      )
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>Accueil</li>
          <li>/</li>
          <li>Produits</li>
          <li>/</li>
          <li>{product.category?.name}</li>
          <li>/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={(product.images && product.images[selectedImage]) || product.mainImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <Badge
                variant="destructive"
                className="absolute left-4 top-4 text-lg"
              >
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index
                      ? 'border-orange-500'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Badge className="mb-2">{product.category.name}</Badge>
            )}
            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>

            {/* Rating */}
            <RatingStars
              productId={product.id}
              averageRating={productRating.averageRating ?? product.averageRating}
              totalReviews={productRating.totalReviews || product.totalReviews}
              interactive={true}
              size="md"
              showCount={true}
              onRatingSubmitted={() => refetch()}
            />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-orange-500">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-muted-foreground line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="border-t pt-4">
            <p className="whitespace-pre-line text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantité:</span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock} en stock
              </span>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                size="lg"
                onClick={handleAddToCart}
                disabled={!product || product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
              </Button>
              <LikeButton 
                productId={product.id}
                className="rounded-lg"
              />
            </div>

            <Button 
              className="w-full" 
              size="lg" 
              variant="secondary"
              onClick={handleBuyNow}
              disabled={!product || product.stock === 0}
            >
              Acheter maintenant
            </Button>
          </div>

          {/* Features */}
          <div className="grid gap-4 border-t pt-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <Truck className="mt-1 h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">Livraison gratuite</p>
                <p className="text-sm text-muted-foreground">
                  Dès 50,000 FCFA
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="mt-1 h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">Garantie 1 an</p>
                <p className="text-sm text-muted-foreground">
                  Produit authentique
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="mt-1 h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">Retour 14 jours</p>
                <p className="text-sm text-muted-foreground">
                  Remboursement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {Object.keys(product.specifications).length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Spécifications techniques</CardTitle>
            <CardDescription>
              Caractéristiques détaillées du produit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between border-b pb-2 last:border-0"
                >
                  <span className="font-medium">{key}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Produits recommandés</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
