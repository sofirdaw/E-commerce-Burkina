'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Package,
  Eye,
  EyeOff
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  featured: boolean;
  productCount: number;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - TODO: Replace with real API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCategories([
        {
          id: '1',
          name: 'Électronique',
          slug: 'electronique',
          description: 'Appareils électroniques et gadgets',
          isActive: true,
          featured: true,
          productCount: 15,
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          name: 'Vêtements',
          slug: 'vetements',
          description: 'Mode et vêtements pour tous',
          isActive: true,
          featured: false,
          productCount: 23,
          createdAt: '2024-01-16',
        },
        {
          id: '3',
          name: 'Alimentation',
          slug: 'alimentation',
          description: 'Produits alimentaires locaux',
          isActive: true,
          featured: false,
          productCount: 8,
          createdAt: '2024-01-17',
        },
        {
          id: '4',
          name: 'Maison & Bureau',
          slug: 'maison-bureau',
          description: 'Articles pour la maison et le bureau',
          isActive: false,
          featured: false,
          productCount: 12,
          createdAt: '2024-01-18',
        },
        {
          id: '5',
          name: 'Beauté & Santé',
          slug: 'beaute-sante',
          description: 'Produits de beauté et de santé',
          isActive: true,
          featured: true,
          productCount: 19,
          createdAt: '2024-01-19',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  const toggleFeatured = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, featured: !cat.featured } : cat
      )
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Catégories</h1>
          <p className="text-muted-foreground">
            Gérez les catégories de produits
          </p>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catégories</h1>
          <p className="text-muted-foreground">
            Gérez les catégories de produits
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total catégories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actives</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(c => c.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En vedette</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(c => c.featured).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Slug:</span>
                <Badge variant="outline">{category.slug}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Produits:</span>
                <Badge variant="secondary">{category.productCount}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Statut:</span>
                <Badge variant={category.isActive ? 'success' : 'secondary'}>
                  {category.isActive ? 'Actif' : 'Inactif'}
                </Badge>
                {category.featured && (
                  <Badge variant="warning">En vedette</Badge>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCategoryStatus(category.id)}
                  className="flex-1"
                >
                  {category.isActive ? (
                    <EyeOff className="h-4 w-4 mr-1" />
                  ) : (
                    <Eye className="h-4 w-4 mr-1" />
                  )}
                  {category.isActive ? 'Désactiver' : 'Activer'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFeatured(category.id)}
                  className={category.featured ? 'bg-orange-50 border-orange-200' : ''}
                >
                  {category.featured ? '⭐' : '☆'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune catégorie trouvée</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Essayez une autre recherche' : 'Commencez par ajouter une catégorie'}
          </p>
        </div>
      )}
    </div>
  );
}
