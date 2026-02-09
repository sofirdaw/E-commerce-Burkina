'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
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
import { Filter, Loader2, ArrowLeft, Lock, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

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

export default function PublicCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sort: 'featured',
    priceRange: [0, 100000],
    inStock: true,
    onSale: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: session } = useSession();
  const isAuthenticated = !!session;

  useEffect(() => {
    if (slug) {
      fetchProducts();
    }
  }, [slug, filters.sort, filters.priceRange, filters.inStock, filters.onSale]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '12',
        sort: filters.sort,
        category: slug,
        minPrice: filters.priceRange[0].toString(),
        maxPrice: filters.priceRange[1].toString(),
        inStock: filters.inStock.toString(),
        onSale: filters.onSale.toString(),
      });

      const response = await fetch(`/api/client-products?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (slug: string) => {
    const names: Record<string, string> = {
      'electronics': 'Électronique',
      'electronique': 'Électronique',
      'mode': 'Mode',
      'maison': 'Maison',
      'beaute': 'Beauté',
      'beauty': 'Beauté',
      'sports': 'Sports',
      'promotions': '🔥 Promotions',
      'deals': '🔥 Promotions',
    };
    return names[slug] || slug;
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
          href="/" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>
        <h1 className="text-3xl font-bold">{getCategoryName(slug)}</h1>
        <p className="text-muted-foreground">
          Découvrez notre sélection de {products.length} produits
        </p>
      </div>

      {/* Authentication Notice */}
      {!isAuthenticated && (
        <div className="mb-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <Lock className="h-8 w-8 text-orange-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">
                Connectez-vous pour accéder aux produits
              </h3>
              <p className="text-orange-700 mb-4">
                Pour voir les détails des produits et faire des achats, veuillez vous connecter à votre compte.
              </p>
              <div className="flex gap-3">
                <Link href="/auth/login?callbackUrl=/client/categories/electronique">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Se connecter pour acheter
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline">
                    Créer un compte
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtres
            {showFilters && (
              <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                Actifs
              </span>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Trier par:</span>
          <Select value={filters.sort} onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">En vedette</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="rating">Meilleures notes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Fourchette de prix (FCFA)</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
                  }))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{filters.priceRange[0].toLocaleString('fr-FR')}</span>
                  <span>{filters.priceRange[1].toLocaleString('fr-FR')}</span>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Disponibilité</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">En stock uniquement</span>
                </label>
              </div>
            </div>

            {/* Sale Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Promotions</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={(e) => setFilters(prev => ({ ...prev, onSale: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Produits en promotion</span>
                </label>
              </div>
            </div>

            {/* Reset Filters */}
            <div>
              <label className="block text-sm font-medium mb-2">Actions</label>
              <Button
                variant="outline"
                onClick={() => setFilters({
                  sort: 'featured',
                  priceRange: [0, 100000],
                  inStock: true,
                  onSale: false,
                })}
                className="w-full"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun produit trouvé dans cette catégorie</p>
        </div>
      )}
    </div>
  );
}
