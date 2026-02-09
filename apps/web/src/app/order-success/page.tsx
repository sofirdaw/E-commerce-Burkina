'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Smartphone } from 'lucide-react';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="mx-auto max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl">Commande confirmée !</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Merci pour votre commande. Nous avons bien reçu votre demande.
          </p>

          {orderId && (
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-2 text-sm font-medium">Numéro de commande</p>
              <p className="text-2xl font-bold text-orange-500">{orderId}</p>
            </div>
          )}

          <div className="grid gap-4 text-left sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Package className="mt-1 h-6 w-6 text-orange-500" />
              <div>
                <p className="font-semibold">Suivi de commande</p>
                <p className="text-sm text-muted-foreground">
                  Vous recevrez un email de confirmation avec le suivi
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Smartphone className="mt-1 h-6 w-6 text-orange-500" />
              <div>
                <p className="font-semibold">Notification SMS</p>
                <p className="text-sm text-muted-foreground">
                  Nous vous tiendrons informé par SMS
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button className="w-full" size="lg" asChild>
              <Link href="/account/orders">Voir mes commandes</Link>
            </Button>
            <Button variant="outline" className="w-full" size="lg" asChild>
              <Link href="/products">Continuer mes achats</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Un email de confirmation a été envoyé à votre adresse
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
