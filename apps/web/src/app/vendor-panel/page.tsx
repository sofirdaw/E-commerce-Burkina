'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Users, BarChart3, Settings, TrendingUp, DollarSign, Star } from 'lucide-react';

export default function VendorPanelPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-32 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/auth/login?callbackUrl=/vendor-panel&message=Accès vendeur requis');
  }

  // Vérifier si l'utilisateur est un revendeur approuvé
  const isVendor = (session.user as any)?.role === 'VENDOR';
  const hasVendorAccess = isVendor || (session.user as any)?.hasVendorAccess || false;

  if (!hasVendorAccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <Package className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Accès Vendeur Restreint
          </h1>
          <p className="mb-6 text-muted-foreground">
            Vous n'avez pas accès au panel vendeur. Veuillez contacter l'administrateur pour obtenir les permissions nécessaires.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Pour devenir vendeur, veuillez nous contacter à:
            </p>
            <p className="text-sm font-medium text-orange-600">
              vendeur@ecomm-burkina.bf
            </p>
          </div>
          <div className="mt-8 space-y-2">
            <Link href="/">
              <Button className="w-full">
                Retour à l'accueil
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="outline" className="w-full">
                Mon compte client
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Panel Vendeur</h1>
        <p className="text-muted-foreground">
          Bienvenue, {session.user?.name} - Gérez votre activité commerciale
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Revenus</p>
                <p className="text-2xl font-bold">2,847,500 FCFA</p>
                <p className="text-xs text-green-600">+12% ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Commandes</p>
                <p className="text-2xl font-bold">347</p>
                <p className="text-xs text-green-600">+23% ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Produits</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-blue-600">Actifs: 76</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Note moyenne</p>
                <p className="text-2xl font-bold">4.8★</p>
                <p className="text-xs text-muted-foreground">1,247 avis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Link href="/vendor/products">
          <Card className="transition-shadow hover:shadow-lg cursor-pointer">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Mes produits</CardTitle>
              <CardDescription>
                Gérez votre catalogue de produits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Gérer les produits
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/vendor/orders">
          <Card className="transition-shadow hover:shadow-lg cursor-pointer">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Commandes</CardTitle>
              <CardDescription>
                Suivez et traitez les commandes clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Voir les commandes
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/vendor/analytics">
          <Card className="transition-shadow hover:shadow-lg cursor-pointer">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Analytiques</CardTitle>
              <CardDescription>
                Statistiques détaillées de vos ventes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Voir les stats
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/vendor/customers">
          <Card className="transition-shadow hover:shadow-lg cursor-pointer">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Clients</CardTitle>
              <CardDescription>
                Gérez votre base de clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Voir les clients
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/vendor/settings">
          <Card className="transition-shadow hover:shadow-lg cursor-pointer">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <CardTitle>Paramètres</CardTitle>
              <CardDescription>
                Configurez votre compte vendeur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Paramètres
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/vendor/support">
          <Card className="transition-shadow hover:shadow-lg cursor-pointer">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Support</CardTitle>
              <CardDescription>
                Obtenez de l'aide et du support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Contacter support
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>
            Vos dernières actions et mises à jour
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Nouveau produit ajouté</p>
                <p className="text-sm text-muted-foreground">Téléphone Samsung Galaxy A54</p>
              </div>
              <span className="text-xs text-muted-foreground">Il y a 2h</span>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded">
                <ShoppingCart className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Nouvelle commande</p>
                <p className="text-sm text-muted-foreground">Commande #CMD-2026-0247</p>
              </div>
              <span className="text-xs text-muted-foreground">Il y a 4h</span>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded">
                <Star className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Nouvel avis client</p>
                <p className="text-sm text-muted-foreground">5 étoiles - Casque Bluetooth</p>
              </div>
              <span className="text-xs text-muted-foreground">Il y a 6h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
