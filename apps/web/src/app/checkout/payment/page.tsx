'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Smartphone, CheckCircle, Clock, ArrowLeft } from 'lucide-react';

interface OrderData {
  id: string;
  orderNumber: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    region: string;
  };
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [paymentCode, setPaymentCode] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      router.push('/cart');
      return;
    }

    // Récupérer les données de la commande
    fetchOrderData(orderId);
  }, [orderId, router]);

  const fetchOrderData = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (response.ok) {
        const order = await response.json();
        setOrderData(order);
      } else {
        console.error('Order not found, redirecting to cart');
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      router.push('/cart');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentCode.trim() || !orderData) return;

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Envoyer le code de transaction pour générer l'OTP
      const response = await fetch(`/api/orders/${orderData.id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentCode,
          paymentMethod: 'ORANGE_MONEY',
        }),
      });

      const result = await response.json();

      if (response.ok && result.otp) {
        // OTP généré avec succès
        setShowOtpInput(true);
        setPaymentStatus('pending');
        
        // Afficher l'OTP dans la console pour la démo
        console.log(`📱 Code OTP généré: ${result.otp}`);
        
        // En production, l'utilisateur recevra l'OTP par SMS
        // Pour la démo, on l'affiche dans une alerte
        alert(`Code OTP reçu par SMS: ${result.otp}`);
      } else {
        setPaymentStatus('error');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || !orderData) return;

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Vérifier l'OTP
      const response = await fetch(`/api/orders/${orderData.id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentCode,
          otpCode,
          paymentMethod: 'ORANGE_MONEY',
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPaymentStatus('success');
        // Rediriger vers la page de succès après 2 secondes
        setTimeout(() => {
          router.push(`/checkout/success?orderId=${orderData.id}`);
        }, 2000);
      } else {
        setPaymentStatus('error');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Finaliser le paiement</h1>
        <p className="text-muted-foreground">
          Commande #{orderData.orderNumber} - Montant: {formatCurrency(orderData.totalAmount)}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Instructions de paiement */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-orange-500" />
                Instructions de paiement Orange Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">Étapes à suivre:</h3>
                <ol className="space-y-2 text-sm text-orange-700">
                  <li>1. Allez dans votre application Orange Money</li>
                  <li>2. Choisissez "Transférer d'argent"</li>
                  <li>3. Entrez le numéro: <strong>+226 66 19 34 26</strong></li>
                  <li>4. Entrez le montant: <strong>{formatCurrency(orderData.totalAmount)}</strong></li>
                  <li>5. Dans le champ "Référence", entrez: <strong>*144*4*6*66193426*{orderData.totalAmount}#</strong></li>
                  <li>6. Confirmez la transaction</li>
                  <li>7. Cliquez sur "J'ai effectué le paiement" ci-dessous</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Sécurité:</h3>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Un code OTP vous sera envoyé après vérification</li>
                  <li>• Le paiement doit être validé pour continuer</li>
                  <li>• Système anti-arnaque activé</li>
                  <li>• Conservez votre reçu de paiement</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulaire de paiement */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Valider le paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={showOtpInput ? handleOTPSubmit : handlePaymentSubmit} className="space-y-4">
                {!showOtpInput ? (
                  <div>
                    <Label htmlFor="paymentCode">Code de transaction Orange Money</Label>
                    <Input
                      id="paymentCode"
                      type="text"
                      placeholder="Ex: OM202402061234567890"
                      value={paymentCode}
                      onChange={(e) => setPaymentCode(e.target.value)}
                      required
                      className="uppercase"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Entrez le code de transaction reçu par SMS après avoir effectué le paiement
                    </p>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="otpCode">Code de vérification OTP</Label>
                    <Input
                      id="otpCode"
                      type="text"
                      placeholder="Entrez le code OTP reçu par SMS"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                      className="text-center text-lg font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Code à 6 chiffres envoyé automatiquement
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isProcessing || (!paymentCode.trim() && !showOtpInput) || (showOtpInput && !otpCode.trim())}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {showOtpInput ? 'Vérification OTP...' : 'Vérification du paiement...'}
                    </>
                  ) : (
                    showOtpInput ? 'Valider le code OTP' : "J'ai effectué le paiement"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Statut du paiement */}
          {paymentStatus !== 'pending' && (
            <Card>
              <CardContent className="pt-6">
                {paymentStatus === 'processing' && (
                  <div className="text-center space-y-3">
                    <Clock className="h-12 w-12 text-orange-500 mx-auto animate-pulse" />
                    <h3 className="font-semibold">Vérification du paiement...</h3>
                    <p className="text-sm text-muted-foreground">
                      Veuillez patienter pendant que nous vérifions votre transaction
                    </p>
                  </div>
                )}

                {paymentStatus === 'success' && (
                  <div className="text-center space-y-3">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <h3 className="font-semibold text-green-700">Paiement validé avec succès!</h3>
                    <p className="text-sm text-green-600">
                      Un livreur vous contactera, merci pour votre confiance!
                    </p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Redirection en cours...
                    </Badge>
                  </div>
                )}

                {paymentStatus === 'error' && (
                  <div className="text-center space-y-3">
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-red-600 text-xl">✕</span>
                    </div>
                    <h3 className="font-semibold text-red-700">Erreur de paiement</h3>
                    <p className="text-sm text-red-600">
                      Le code de transaction est invalide. Veuillez vérifier et réessayer.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setPaymentStatus('pending');
                        setPaymentCode('');
                      }}
                    >
                      Réessayer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Récapitulatif de la commande */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif de la commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Articles */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Articles:</h4>
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Adresse de livraison */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Adresse de livraison:</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>{orderData.shippingAddress.fullName}</p>
                    <p>{orderData.shippingAddress.phone}</p>
                    <p>{orderData.shippingAddress.addressLine1}</p>
                    <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.region}</p>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total payé:</span>
                    <span className="text-orange-500">{formatCurrency(orderData.totalAmount)}</span>
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
