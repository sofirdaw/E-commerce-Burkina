'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, MapPin, User, Heart, Settings } from 'lucide-react';

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  // Vérifier si l'utilisateur est un revendeur
  const isVendor = (session.user as any)?.role === 'VENDOR';

  if (!isVendor) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Accès Restreint
          </h1>
          <p className="mb-6 text-muted-foreground">
            Cette section est réservée aux revendeurs uniquement.
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            Pour devenir revendeur, veuillez contacter notre équipe commerciale.
          </p>
          <Link href="/">
            <Button>
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Espace Revendeur</h1>
        <p className="text-muted-foreground">
          Bienvenue, {session.user?.name} - Gérez votre activité commerciale
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Vendor Dashboard */}
        <Link href="/vendor/dashboard">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Package className="h-6 w-6 text-orange-500" />
              </div>
              <CardTitle>Tableau de bord</CardTitle>
              <CardDescription>
                Vue d'ensemble de vos ventes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Voir le dashboard
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Vendor Products */}
        <Link href="/vendor/products">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle>Mes produits</CardTitle>
              <CardDescription>
                Gérez votre catalogue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Gérer les produits
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Vendor Orders */}
        <Link href="/vendor/orders">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Package className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle>Commandes clients</CardTitle>
              <CardDescription>
                Suivez les commandes à traiter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Voir les commandes
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Vendor Analytics */}
        <Link href="/vendor/analytics">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Settings className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle>Analytiques</CardTitle>
              <CardDescription>
                Statistiques de ventes et performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Voir les statistiques
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Vendor Profile */}
        <Link href="/vendor/profile">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <User className="h-6 w-6 text-yellow-500" />
              </div>
              <CardTitle>Profil revendeur</CardTitle>
              <CardDescription>
                Informations professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Modifier le profil
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Settings */}
        <Link href="/vendor/settings">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Settings className="h-6 w-6 text-gray-500" />
              </div>
              <CardTitle>Paramètres</CardTitle>
              <CardDescription>
                Configuration de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Paramètres avancés
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Performance récente</CardTitle>
          <CardDescription>
            Vos indicateurs clés ce mois-ci
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+12%</div>
              <div className="text-sm text-muted-foreground">Croissance ventes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">247</div>
              <div className="text-sm text-muted-foreground">Produits vendus</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4.8★</div>
              <div className="text-sm text-muted-foreground">Note moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">89%</div>
              <div className="text-sm text-muted-foreground">Satisfaction client</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
