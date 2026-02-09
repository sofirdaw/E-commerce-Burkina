"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export function Footer() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const router = useRouter();
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false);

  function handleProtectedClick(e: React.MouseEvent) {
    if (!isAuthenticated) {
      e.preventDefault();
      setAuthDialogOpen(true);
    }
  }
  return (
    <footer className="border-t bg-muted/50">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">À propos</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Ecomm-Burkina est votre marketplace premium pour acheter et
        {/* Bottom Bar */}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://facebook.com" target="_blank">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://instagram.com" target="_blank">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://twitter.com" target="_blank">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={(e) => handleProtectedClick(e)}
                >
                  Produits
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={(e) => handleProtectedClick(e)}
                >
                  Catégories
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={(e) => handleProtectedClick(e)}
                >
                  Promotions
                </Link>
              </li>
              <li>
                <Link
                  href="/become-vendor"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Devenir vendeur
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground"
                >
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Service client</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Suivre ma commande
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Retours & Remboursements
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Livraison
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>Ouagadougou, Burkina Faso</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+226 XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>contact@ecomm-burkina.com</span>
              </li>
            </ul>

            <div>
              <p className="mb-2 text-sm font-medium">Newsletter</p>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  S'abonner
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t bg-muted">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              Méthodes de paiement acceptées
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="rounded border bg-white px-3 py-1.5 text-sm font-semibold text-orange-500">
                Orange Money
              </div>
              <div className="rounded border bg-white px-3 py-1.5 text-sm font-semibold">
                Wave
              </div>
              <div className="rounded border bg-white px-3 py-1.5 text-sm font-semibold">
                Moov Money
              </div>
              <div className="rounded border bg-white px-3 py-1.5 text-sm">
                Espèces
              </div>
            </div>
          </div>
        </div>
      </div>
        <FooterLoginDialog open={authDialogOpen} setOpen={setAuthDialogOpen} router={router} />

        <div className="border-t">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>
              © 2026 Ecomm-Burkina. Tous droits réservés. Développé par{' '}
              <span className="font-semibold text-orange-500">August</span>
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-foreground">
                Confidentialité
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Login modal for footer-protected links
function FooterLoginDialog({ open, setOpen, router }: { open: boolean; setOpen: (v: boolean) => void; router: any }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connexion requise</DialogTitle>
          <DialogDescription>Vous devez vous connecter pour accéder à cette page.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              setOpen(false);
              router.push('/auth/login');
            }}
          >
            Se connecter
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
