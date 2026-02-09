'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Heart, Star, Filter } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  _count: {
    products: number;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  mainImage: string;
  averageRating: number;
  totalReviews: number;
  isNew: boolean;
  onSale: boolean;
  stock: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function CategoriesPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sort: 'featured',
    priceRange: [0, 100000],
    inStock: true,
    onSale: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters.sort, filters.priceRange, filters.inStock, filters.onSale]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '50',
        sort: filters.sort,
        minPrice: filters.priceRange[0].toString(),
        maxPrice: filters.priceRange[1].toString(),
        inStock: filters.inStock.toString(),
        onSale: filters.onSale.toString(),
      });

      const response = await fetch(`/api/client-products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Toutes nos catégories</h1>
        <p className="text-muted-foreground">
          Découvrez notre sélection de produits par catégorie
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <Badge variant="secondary">{category._count.products} produits</Badge>
              </div>
              <p className="text-muted-foreground mb-4">{category.description}</p>
              <div className="flex gap-2">
                <Link href={`/categories/${category.slug}`}>
                    <Button variant="outline" size="sm">
                      Voir les produits
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.slug ? null : category.slug
                    )}
                  >
                    {selectedCategory === category.slug ? 'Tout afficher' : 'Filtrer'}
                  </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
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
          {selectedCategory && (
            <Button
              variant="outline"
              onClick={() => setSelectedCategory(null)}
            >
              Annuler le filtre
            </Button>
          )}
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
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">
          {selectedCategory 
            ? `Produits dans ${categories.find(c => c.slug === selectedCategory)?.name}`
            : 'Tous les produits'
          }
          <span className="text-muted-foreground ml-2">
            ({filteredProducts.length} produits)
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              {/* Product Image */}
              <div className="relative mb-4">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://picsum.photos/seed/${product.slug}/400/400.jpg`;
                  }}
                />
                {product.isNew && (
                  <Badge className="absolute top-2 left-2">Nouveau</Badge>
                )}
                {product.onSale && (
                  <Badge variant="destructive" className="absolute top-2 left-2">
                    Promotion
                  </Badge>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.totalReviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">
                    {product.price.toLocaleString('fr-BF', {
                      style: 'currency',
                      currency: 'XOF',
                    })}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.compareAtPrice.toLocaleString('fr-BF', {
                        style: 'currency',
                        currency: 'XOF',
                      })}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex-1"
                  >
                    <Button size="sm" className="w-full">
                      Voir détails
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory
              ? 'Aucun produit trouvé pour votre recherche.'
              : 'Aucun produit disponible.'}
          </p>
        </div>
      )}
    </div>
  );
}
