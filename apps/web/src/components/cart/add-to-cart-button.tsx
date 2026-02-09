'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Check, Loader2 } from 'lucide-react';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  stock: number;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function AddToCartButton({
  productId,
  productName,
  productPrice,
  stock,
  className,
  variant = 'default',
  size = 'default',
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    if (stock <= 0) {
      alert('Produit en rupture de stock');
      return;
    }

    setIsLoading(true);
    setIsAdded(false);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'ajout au panier');
      }

      // Success feedback
      setIsAdded(true);
      alert(`${productName} ajouté au panier! (${productPrice.toLocaleString('fr-BF', { style: 'currency', currency: 'XOF' })})`);

      // Reset success state after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);

    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'ajout au panier');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading || stock <= 0}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Ajout...
        </>
      ) : isAdded ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Ajouté!
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {stock <= 0 ? 'Rupture' : 'Ajouter au panier'}
        </>
      )}
    </Button>
  );
}
