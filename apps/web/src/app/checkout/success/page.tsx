'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Phone } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    // Pour la démo, nous allons simplement afficher le succès
    // En réalité, vous récupéreriez les données de la commande
    setTimeout(() => {
      setOrderData({
        id: orderId,
        orderNumber: `EB${Date.now()}`,
        totalAmount: 25000,
        message: 'Paiement validé avec succès! Un livreur vous contactera, merci pour votre confiance!'
      });
      setIsLoading(false);
    }, 1000);
  }, [orderId, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-md text-center">
          <CardContent className="py-12">
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-xl">✕</span>
            </div>
            <h2 className="mb-2 text-2xl font-bold">Commande non trouvée</h2>
            <p className="mb-6 text-muted-foreground">
              Cette commande n'existe pas ou a expiré.
            </p>
            <Button onClick={() => router.push('/')}>
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Message de succès */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              Paiement validé avec succès!
            </h1>
            <p className="text-lg text-green-700 mb-4">
              Un livreur vous contactera, merci pour votre confiance!
            </p>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600">
                Numéro de commande: <strong>{orderData.orderNumber}</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Détails de la commande */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Détails de la commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Numéro de commande</label>
                <p className="font-semibold">{orderData.orderNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Montant total</label>
                <p className="font-semibold text-orange-500">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF'
                  }).format(orderData.totalAmount)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Statut</label>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">Payée et confirmée</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Délai de livraison</label>
                <p className="font-semibold">24-48h</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Contact livreur</label>
                <p className="text-sm text-gray-600">
                  Vous serez contacté par téléphone dès que votre commande sera prête.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Besoin d'aide?</p>
                    <p className="text-xs text-blue-600">
                      Contactez notre service client au +226 XX XX XX XX
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => router.push('/orders')}
            className="w-full sm:w-auto"
          >
            Voir mes commandes
          </Button>
          <Button 
            onClick={() => router.push('/')}
            className="w-full sm:w-auto"
          >
            Continuer mes achats
          </Button>
        </div>

        {/* Instructions supplémentaires */}
        <Card className="mt-8">
          <CardContent className="py-6">
            <h3 className="font-semibold mb-3">Prochaines étapes:</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li>1. <strong>Confirmation:</strong> Vous recevrez un SMS de confirmation</li>
              <li>2. <strong>Préparation:</strong> Votre commande sera préparée (1-2h)</li>
              <li>3. <strong>Contact:</strong> Un livreur vous appellera avant de partir</li>
              <li>4. <strong>Livraison:</strong> Réception de votre commande</li>
              <li>5. <strong>Évaluation:</strong> Notez votre expérience</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
