'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Heart, 
  Package, 
  TrendingUp,
  User,
  Settings,
  CreditCard,
  MapPin,
  Star,
  Clock,
  Truck
} from 'lucide-react';

export default function ClientDashboard() {
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    reviewsCount: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // TODO: Fetch real user data
    setUserStats({
      totalOrders: 12,
      totalSpent: 245000,
      wishlistItems: 8,
      reviewsCount: 5,
    });

    setRecentOrders([
      {
        id: 'ORD-001',
        date: '2024-01-20',
        status: 'Livré',
        total: 45000,
        items: 3,
      },
      {
        id: 'ORD-002', 
        date: '2024-01-18',
        status: 'En livraison',
        total: 78000,
        items: 2,
      },
    ]);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mon Compte</h1>
        <p className="text-muted-foreground">
          Bienvenue dans votre espace personnel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total des commandes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalSpent.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">
              Total dépensé
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favoris</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.wishlistItems}</div>
            <p className="text-xs text-muted-foreground">
              Articles favoris
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avis</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.reviewsCount}</div>
            <p className="text-xs text-muted-foreground">
              Avis publiés
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Commandes récentes
              </CardTitle>
              <CardDescription>
                Vos dernières commandes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                      <p className="text-sm">{order.items} articles</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.total.toLocaleString()} FCFA</p>
                      <Badge 
                        variant={order.status === 'Livré' ? 'success' : 'warning'}
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Voir toutes les commandes
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Accédez rapidement à vos fonctionnalités préférées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <Button variant="outline" className="justify-start">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Nouvelle commande
                </Button>
                <Link href="/client/wishlist">
                  <Button variant="outline" className="justify-start">
                    <Heart className="mr-2 h-4 w-4" />
                    Mes favoris
                  </Button>
                </Link>
                <Button variant="outline" className="justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  Adresses
                </Button>
                <Button variant="outline" className="justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Moyens de paiement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Mon profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Jean Dupont</p>
                  <p className="text-sm text-muted-foreground">jean.dupont@email.com</p>
                  <Badge variant="secondary">Client</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Modifier mon profil
              </Button>
            </CardContent>
          </Card>

          {/* Become Seller */}
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader>
              <CardTitle className="text-white">Devenez vendeur</CardTitle>
              <CardDescription className="text-orange-100">
                Vendez vos produits sur notre plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full bg-white text-orange-600 hover:bg-gray-100">
                Commencer à vendre
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
