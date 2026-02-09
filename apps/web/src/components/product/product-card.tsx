'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { LikeButton } from './like-button';
import { RatingStars } from './rating-stars';
import { AddToCart } from './add-to-cart';

interface ProductCardProps {
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

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100
      )
    : 0;

  console.log('🛍️ ProductCard - Produit:', product);

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.mainImage || `https://picsum.photos/seed/${product.slug}/400/400.jpg`}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://picsum.photos/seed/${product.slug}/400/400.jpg`;
            }}
          />

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge variant="secondary" className="bg-blue-500 text-white">
                Nouveau
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive">-{discount}%</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary">Rupture de stock</Badge>
            )}
          </div>

          {/* Like Button */}
          <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
            <LikeButton 
              productId={product.id}
              className="bg-white/90 backdrop-blur-sm hover:bg-black"
            />
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 font-semibold hover:text-orange-500">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <RatingStars 
          productId={product.id}
          averageRating={product.averageRating}
          totalReviews={product.totalReviews}
          interactive={false}
          size="sm"
          showCount={true}
        />

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-orange-500">
            {formatCurrency(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <AddToCart
          productId={product.id}
          name={product.name}
          price={product.price}
          image={product.mainImage}
          inStock={product.stock > 0}
          stock={product.stock}
          vendorId="vendor-1" // TODO: Get from product data
          vendorName="Vendeur" // TODO: Get from product data
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}
