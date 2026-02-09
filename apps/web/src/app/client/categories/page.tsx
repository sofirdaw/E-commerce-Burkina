'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Sparkles, 
  Trophy, 
  Tag,
  ArrowRight,
  Package
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  featured: boolean;
  productCount?: number;
}

export default function ClientCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/client-categories');
      const data = await response.json();
      setCategories(data.filter((cat: Category) => cat.isActive));
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (iconName: string | undefined) => {
    const icons: Record<string, any> = {
      smartphone: Smartphone,
      shirt: Shirt,
      home: Home,
      sparkles: Sparkles,
      trophy: Trophy,
      tag: Tag,
    };
    return icons[iconName || 'package'] || Package;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Catégories</h1>
        <p className="text-muted-foreground">
          Explorez nos catégories de produits
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const IconComponent = getCategoryIcon(category.icon);
          return (
            <Link key={category.id} href={`/client/categories/${category.slug}`}>
              <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <IconComponent className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        {category.featured && (
                          <Badge variant="warning" className="text-xs">
                            En vedette
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {category.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {category.productCount || 0} produits
                    </span>
                    <Button variant="outline" size="sm">
                      Explorer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Accès rapide</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/client/categories/electronique">
            <Button variant="outline" className="w-full justify-start">
              <Smartphone className="mr-2 h-4 w-4" />
              Électronique
            </Button>
          </Link>
          <Link href="/client/categories/mode">
            <Button variant="outline" className="w-full justify-start">
              <Shirt className="mr-2 h-4 w-4" />
              Mode
            </Button>
          </Link>
          <Link href="/client/categories/maison">
            <Button variant="outline" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Maison
            </Button>
          </Link>
          <Link href="/client/categories/beaute">
            <Button variant="outline" className="w-full justify-start">
              <Sparkles className="mr-2 h-4 w-4" />
              Beauté
            </Button>
          </Link>
          <Link href="/client/categories/sports">
            <Button variant="outline" className="w-full justify-start">
              <Trophy className="mr-2 h-4 w-4" />
              Sports
            </Button>
          </Link>
          <Link href="/client/categories/promotions">
            <Button variant="outline" className="w-full justify-start">
              <Tag className="mr-2 h-4 w-4" />
              🔥 Promotions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
