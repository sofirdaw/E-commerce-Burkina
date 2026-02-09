'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/cart-context';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, CreditCard, Smartphone, Banknote, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'ORANGE_MONEY' | 'WAVE' | 'CASH_ON_DELIVERY'>('ORANGE_MONEY');
  
  const [shippingData, setShippingData] = useState({
    fullName: session?.user?.name || '',
    phone: '',
    addressLine1: '',
    city: 'Ouagadougou',
    region: 'Centre',
  });

  const [orangeMoneyPhone, setOrangeMoneyPhone] = useState('');

  const subtotal = cart.subtotal;
  const tax = 0; // TVA supprimée (0%)
  const shipping = cart.shipping;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: shippingData,
          paymentMethod,
          orangeMoneyPhone: paymentMethod === 'ORANGE_MONEY' ? orangeMoneyPhone : undefined,
          subtotal,
          tax,
          shippingCost: shipping,
          totalAmount: total,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        // Rediriger vers la page de paiement au lieu du succès
        router.push(`/checkout/payment?orderId=${data.order.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la commande');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erreur lors de la commande');
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-md text-center">
          <CardContent className="py-12">
            <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold">Votre panier est vide</h2>
            <p className="mb-6 text-muted-foreground">
              Ajoutez des produits avant de finaliser votre commande.
            </p>
            <Button asChild>
              <Link href="/categories">Découvrir les produits</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Finaliser la commande</h1>
        <p className="text-muted-foreground">
          Vérifiez vos informations et finalisez votre commande
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      value={shippingData.fullName}
                      onChange={(e) => setShippingData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="addressLine1">Adresse</Label>
                  <Input
                    id="addressLine1"
                    value={shippingData.addressLine1}
                    onChange={(e) => setShippingData(prev => ({ ...prev, addressLine1: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={shippingData.city}
                      onChange={(e) => setShippingData(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Région</Label>
                    <Input
                      id="region"
                      value={shippingData.region}
                      onChange={(e) => setShippingData(prev => ({ ...prev, region: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Méthode de paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer rounded-lg border p-4 hover:bg-accent">
                  <input
                    type="radio"
                    name="payment"
                    value="ORANGE_MONEY"
                    checked={paymentMethod === 'ORANGE_MONEY'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="text-orange-500"
                  />
                  <Smartphone className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="font-medium">Orange Money</div>
                    <div className="text-sm text-muted-foreground">Paiement mobile rapide</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer rounded-lg border p-4 hover:bg-accent">
                  <input
                    type="radio"
                    name="payment"
                    value="WAVE"
                    checked={paymentMethod === 'WAVE'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  />
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Wave</div>
                    <div className="text-sm text-muted-foreground">Paiement par carte</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer rounded-lg border p-4 hover:bg-accent">
                  <input
                    type="radio"
                    name="payment"
                    value="CASH_ON_DELIVERY"
                    checked={paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  />
                  <Banknote className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Paiement à la livraison</div>
                    <div className="text-sm text-muted-foreground">Espèces à la réception</div>
                  </div>
                </label>
              </div>

              {paymentMethod === 'ORANGE_MONEY' && (
                <div>
                  <Label htmlFor="orangeMoneyPhone">Numéro Orange Money</Label>
                  <Input
                    id="orangeMoneyPhone"
                    type="tel"
                    placeholder="+226 XX XX XX XX"
                    value={orangeMoneyPhone}
                    onChange={(e) => setOrangeMoneyPhone(e.target.value)}
                    required
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items Summary */}
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVA (0%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Gratuite</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-500">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  `Payer ${formatCurrency(total)}`
                )}
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                En confirmant votre commande, vous acceptez nos conditions générales de vente.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
