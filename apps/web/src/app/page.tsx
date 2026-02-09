'use client';

import { Button } from '@/components/ui/button';
import { ShoppingBag, Zap, Shield, Truck } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const hasVendorAccess = (session?.user as any)?.hasVendorAccess || false;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
              Bienvenue sur{' '}
              <span className="text-orange-200">Ecomm-Burkina</span>
            </h1>
            <p className="mb-8 text-xl text-orange-100 md:text-2xl">
              Votre marketplace premium au Burkina Faso 🇧🇫
            </p>
            <p className="mb-10 text-lg text-orange-50">
              Découvrez des milliers de produits, payez avec Orange Money,
              et profitez d'une livraison rapide partout au pays.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <Link href="/categories">
                  <Button
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-orange-50"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Explorer les produits
                  </Button>
                </Link>
              ) : (
                <Link href="/categories">
                  <Button
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-orange-50"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Commencer à acheter
                  </Button>
                </Link>
              )}
              
              {isAuthenticated ? (
                hasVendorAccess ? (
                  <Link href="/vendor-panel">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white bg-transparent text-white hover:bg-white/10"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Panel vendeur
                    </Button>
                  </Link>
                ) : (
                  <Link href="/become-vendor">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white bg-transparent text-white hover:bg-white/10"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Devenir vendeur
                    </Button>
                  </Link>
                )
              ) : (
                <Link href="/become-vendor">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white bg-transparent text-white hover:bg-white/10"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Devenir vendeur
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Pourquoi choisir Ecomm-Burkina ?
            </h2>
            <p className="text-muted-foreground">
              Une expérience d'achat moderne et sécurisée
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-orange-500" />}
              title="Paiement facile"
              description="Payez en toute sécurité avec Orange Money, Wave, ou à la livraison"
            />
            <FeatureCard
              icon={<Truck className="h-10 w-10 text-orange-500" />}
              title="Livraison rapide"
              description="Recevez vos commandes rapidement partout au Burkina Faso"
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-orange-500" />}
              title="100% sécurisé"
              description="Vos données et paiements sont protégés par cryptage SSL"
            />
            <FeatureCard
              icon={<ShoppingBag className="h-10 w-10 text-orange-500" />}
              title="Large choix"
              description="Des milliers de produits de qualité pour tous vos besoins"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-50 py-16 dark:bg-orange-950/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Prêt à commencer vos achats ?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Rejoignez des milliers de clients satisfaits au Burkina Faso
          </p>
          <Link href="/auth/login?callbackUrl=/client/products">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              Découvrir les produits
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <StatCard number="10,000+" label="Produits disponibles" />
            <StatCard number="5,000+" label="Clients satisfaits" />
            <StatCard number="50+" label="Vendeurs de confiance" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="mb-2 text-4xl font-bold text-orange-500">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}
