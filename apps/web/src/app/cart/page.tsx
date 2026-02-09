'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/contexts/cart-context';
import { TAX_RATE, SHIPPING_COST } from '@/types/cart';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, isLoading } = useCart();
  const [couponCode, setCouponCode] = useState('');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement du panier...</span>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-md text-center">
          <CardContent className="py-12">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold">Votre panier est vide</h2>
            <p className="mb-6 text-muted-foreground">
              Commencez vos achats dès maintenant !
            </p>
            <Button asChild>
              <Link href="/categories">Découvrir les produits</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const discount = 0; // TODO: Calculate based on coupon

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panier ({cart.itemCount})</h1>
        {cart.items.length > 0 && (
          <Button variant="outline" onClick={clearCart}>
            Vider le panier
          </Button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {cart.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex gap-4 p-4 ${
                    index !== cart.items.length - 1 ? 'border-b' : ''
                  }`}
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.productId}`}
                    className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted"
                  >
                    <Image
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.productId}`}
                        className="font-semibold hover:text-orange-500"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500">{item.vendorName}</p>
                      <p className="text-lg font-bold text-orange-500">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.productId, Math.max(1, (item.quantity || 0) - 1))
                          }
                          disabled={(item.quantity || 0) <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity || 0}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.productId, (item.quantity || 0) + 1)
                          }
                          disabled={(item.quantity || 0) >= (item.maxQuantity || 99)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="hidden text-right sm:block">
                    <p className="text-lg font-bold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity > 1 && `${item.quantity} × ${formatCurrency(item.price)}`}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Coupon */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Code promo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Entrez votre code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button>Appliquer</Button>
              </div>
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-semibold">
                  {formatCurrency(cart.subtotal || 0)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">TVA (0%)</span>
                <span className="font-semibold">
                  {formatCurrency(cart.tax || 0)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span className="font-semibold">
                  {cart.shipping === 0 ? (
                    <span className="text-green-600">Gratuite</span>
                  ) : (
                    formatCurrency(cart.shipping)
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction</span>
                  <span className="font-semibold">
                    -{formatCurrency(discount)}
                  </span>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-orange-500">
                    {formatCurrency(cart.total || 0)}
                  </span>
                </div>
              </div>

              {cart.shipping > 0 && (
                <p className="text-sm text-muted-foreground">
                  Ajoutez {formatCurrency(50000 - (cart.subtotal || 0))} pour la livraison
                  gratuite
                </p>
              )}

              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Passer la commande</Link>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                size="lg"
                asChild
              >
                <Link href="/categories">Continuer les achats</Link>
              </Button>

              {/* Payment Methods */}
              <div className="border-t pt-4">
                <p className="mb-2 text-sm font-medium">Paiement sécurisé</p>
                <div className="flex flex-wrap gap-2">
                  <div className="rounded border bg-white px-2 py-1 text-xs font-semibold text-orange-500">
                    Orange Money
                  </div>
                  <div className="rounded border bg-white px-2 py-1 text-xs">
                    Wave
                  </div>
                  <div className="rounded border bg-white px-2 py-1 text-xs">
                    Espèces
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
