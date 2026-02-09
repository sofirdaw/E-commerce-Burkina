"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, Heart, LogOut, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSession, signOut } from 'next-auth/react';
import { CartButton } from '@/components/cart/cart-button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

interface StoreSettings {
  freeShippingThreshold: number;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const router = useRouter();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>({ freeShippingThreshold: 50000 });

  useEffect(() => {
    // Fetch store settings
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings({ freeShippingThreshold: data.freeShippingThreshold || 50000 });
        }
      } catch (error) {
        console.log('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  function handleProtectedClick(e: React.MouseEvent) {
    if (!isAuthenticated) {
      e.preventDefault();
      setAuthDialogOpen(true);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="border-b bg-orange-500 py-2 text-white">
        <div className="container mx-auto flex items-center justify-between px-4 text-sm">
          <div className="flex items-center gap-4">
            <span>🇧🇫 Burkina Faso</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">
              Livraison gratuite dès {settings.freeShippingThreshold.toLocaleString('fr-BF')} FCFA
            </span>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <span className="hidden md:inline">
                Bonjour, {session.user?.name}
              </span>
            ) : (
              <>
                <Link href="/auth/login" className="hover:underline">
                  Connexion
                </Link>
                <span className="hidden md:inline">|</span>
                <Link href="/auth/register" className="hidden hover:underline md:inline">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div className="hidden flex-col md:flex">
              <span className="text-xl font-bold text-orange-500">
                Ecomm
              </span>
              <span className="text-xs text-muted-foreground">
                Burkina
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden flex-1 md:block md:max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher des produits..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              asChild
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Liste de souhaits</span>
              </Link>
            </Button>

            {/* Cart */}
            <CartButton />

            {/* User Menu */}
            {session ? (
              <div className="relative group">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-lg border bg-background p-2 shadow-lg group-hover:block">
                  <Link
                    href="/account"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent"
                  >
                    <User className="h-4 w-4" />
                    Espace client
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent"
                  >
                    <Package className="h-4 w-4" />
                    Mes commandes
                  </Link>
                  {(session.user as any)?.hasVendorAccess && (
                    <Link
                      href="/vendor-panel"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent"
                    >
                      <Package className="h-4 w-4" />
                      Panel Vendeur
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/auth/login">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Connexion</span>
                </Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-6 overflow-x-auto py-3 text-sm scrollbar-hide">
            <li>
              <Link
                href="/products"
                className="whitespace-nowrap font-medium hover:text-orange-500"
                onClick={(e) => handleProtectedClick(e)}
              >
                Tous les produits
              </Link>
            </li>
            <li>
              <Link
                href="/categories/electronics"
                className="whitespace-nowrap hover:text-orange-500"
              >
                Électronique
              </Link>
            </li>
            <li>
              <Link
                href="/categories/fashion"
                className="whitespace-nowrap hover:text-orange-500"
              >
                Mode
              </Link>
            </li>
            <li>
              <Link
                href="/categories/home"
                className="whitespace-nowrap hover:text-orange-500"
              >
                Maison
              </Link>
            </li>
            <li>
              <Link
                href="/categories/beauty"
                className="whitespace-nowrap hover:text-orange-500"
              >
                Beauté
              </Link>
            </li>
            <li>
              <Link
                href="/categories/sports"
                className="whitespace-nowrap hover:text-orange-500"
              >
                Sport
              </Link>
            </li>
            <li>
              <Link
                href="/deals"
                className="whitespace-nowrap font-medium text-orange-500 hover:text-orange-600"
                onClick={(e) => handleProtectedClick(e)}
              >
                Promotions
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="whitespace-nowrap hover:text-orange-500"
              >
                À propos
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="container mx-auto space-y-2 px-4 py-4">
            {session ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-2 rounded-lg p-2 hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Espace client</span>
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-2 rounded-lg p-2 hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Package className="h-5 w-5" />
                  <span>Mes commandes</span>
                </Link>
                {(session.user as any)?.hasVendorAccess && (
                  <Link
                    href="/vendor-panel"
                    className="flex items-center gap-2 rounded-lg p-2 hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="h-5 w-5" />
                    <span>Panel Vendeur</span>
                  </Link>
                )}
              </>
            ) : null}
            <Link
              href="/wishlist"
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="h-5 w-5" />
              <span>Liste de souhaits</span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Panier</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>À propos</span>
            </Link>
          </div>
        </div>
      )}

      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accès client</DialogTitle>
            <DialogDescription>
              Connectez-vous pour accéder à votre compte client.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setAuthDialogOpen(false);
                router.push('/auth/login');
              }}
            >
              Se connecter
            </Button>
            <Button variant="ghost" onClick={() => setAuthDialogOpen(false)}>
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
