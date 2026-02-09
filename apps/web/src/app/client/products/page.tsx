'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product/product-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, Loader2 } from 'lucide-react';

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ClientProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    category: 'all',
    sort: 'featured',
    search: '',
  });

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filters]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/client-categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: filters.sort,
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/client-products?${params}`);
      const data = await response.json();
      
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (sort: string) => {
    setFilters(prev => ({ ...prev, sort }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Tous les produits</h1>
        <p className="text-muted-foreground">
          Découvrez notre sélection de {pagination.total} produits
        </p>
      </div>

      {/* Quick Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Catégories populaires</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.slice(0, 6).map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className="justify-start"
              onClick={() => handleCategoryChange(category.slug)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          
          {/* Category Filter */}
          <Select value={filters.category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Trier par:</span>
          <Select value={filters.sort} onValueChange={handleSortChange}>
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

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          className="w-full px-4 py-2 border rounded-lg"
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun produit trouvé</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Précédent
              </Button>
              
              {[...Array(pagination.pages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={pagination.page === i + 1 ? "default" : "outline"}
                  className={pagination.page === i + 1 ? "bg-orange-500 text-white" : ""}
                  onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                >
                  {i + 1}
                </Button>
              ))}
              
              <Button
                variant="outline"
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
