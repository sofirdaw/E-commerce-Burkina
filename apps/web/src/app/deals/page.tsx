'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Filter, 
  Loader2, 
  Tag, 
  Clock, 
  TrendingDown,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

interface Product {
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
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sort: 'discount-desc',
    category: 'all',
  });

  useEffect(() => {
    fetchDeals();
  }, [filters]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '50',
        sort: filters.sort,
        onSale: 'true', // Only get products on sale
        ...(filters.category !== 'all' && { category: filters.category }),
      });

      const response = await fetch(`/api/client-products?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (price: number, compareAtPrice?: number) => {
    if (!compareAtPrice || compareAtPrice <= price) return 0;
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Tag className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">🔥 Promotions</h1>
            <p className="text-muted-foreground">
              Les meilleures offres et réductions du moment
            </p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-8 mb-8 text-white">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Soldes Flash - Jusqu'à -50%</h2>
          <p className="mb-6 text-red-100">
            Profitez de nos offres exceptionnelles sur des milliers de produits. 
            Stock limité, premières arrivées premiers servis!
          </p>
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-red-600 hover:bg-red-50">
              <Clock className="w-4 h-4 mr-1" />
              Offres limitées
            </Badge>
            <Badge className="bg-white text-red-600 hover:bg-red-50">
              <TrendingDown className="w-4 h-4 mr-1" />
              Meilleures réductions
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          
          <Select value={filters.sort} onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discount-desc">Plus grandes réductions</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
              <SelectItem value="newest">Plus récents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          {products.length} produits en promotion
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const discount = calculateDiscount(product.price, product.compareAtPrice);
          return (
            <div key={product.id} className="relative group">
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-red-500 text-white hover:bg-red-600">
                    -{discount}%
                  </Badge>
                </div>
              )}
              
              <ProductCard product={product} />
              
              {/* Quick Actions */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/client/products/${product.slug}`}>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune promotion pour le moment</h3>
          <p className="text-muted-foreground mb-4">
            Revenez bientôt pour découvrir nos nouvelles offres!
          </p>
          <Link href="/client/products">
            <Button>
              <ArrowRight className="mr-2 h-4 w-4" />
              Voir tous les produits
            </Button>
          </Link>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Ne manquez aucune offre!</h3>
        <p className="text-muted-foreground mb-6">
          Inscrivez-vous à notre newsletter pour recevoir les meilleures promotions en avant-première.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button>
              S'inscrire maintenant
            </Button>
          </Link>
          <Link href="/client/categories/promotions">
            <Button variant="outline">
              Voir plus de promotions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
