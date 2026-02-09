'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/cart-context';
import { showToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

interface AddToCartProps {
  productId: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  stock: number;
  vendorId: string;
  vendorName: string;
  className?: string;
}

export function AddToCart({
  productId,
  name,
  price,
  image,
  inStock,
  stock,
  vendorId,
  vendorName,
  className
}: AddToCartProps) {
  const { addToCart, cart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if item is already in cart
  const cartItem = cart.items.find(item => item.productId === productId);
  const currentQuantity = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    if (!inStock || isLoading) return;

    console.log('🛒 Ajout au panier:', { productId, name, quantity, price });
    
    setIsLoading(true);
    
    try {
      addToCart({
        productId,
        name,
        price,
        image,
        quantity,
        vendorId,
        vendorName,
        inStock,
        maxQuantity: stock,
      });

      console.log('✅ Produit ajouté avec succès');
      showToast(`${name} ajouté au panier!`, 'success');
      setIsAdded(true);
      setQuantity(1);
      
      // Reset success state after 2 seconds
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout au panier:', error);
      showToast('Erreur lors de l\'ajout au panier', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!inStock) {
    return (
      <Button disabled className={cn('w-full', className)}>
        <ShoppingCart className="h-4 w-4 mr-2" />
        Rupture de stock
      </Button>
    );
  }

  if (currentQuantity > 0) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addToCart({ productId, name, price, image, quantity: 1, vendorId, vendorName, inStock, maxQuantity: stock })}
            disabled={currentQuantity >= stock}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
          
          <div className="px-3 py-1">
            <span className="text-sm font-medium">{currentQuantity}</span>
            <span className="text-xs text-gray-500 ml-1">/ {stock}</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* TODO: Implement decrement cart */}}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
        </div>
        
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Dans le panier
        </Badge>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Quantity Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Quantité:</span>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <Input
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(stock, parseInt(e.target.value) || 1)))}
            className="w-16 text-center border-0"
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={incrementQuantity}
            disabled={quantity >= stock}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <span className="text-xs text-gray-500">
          ({stock} disponibles)
        </span>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isLoading}
        className={cn(
          'w-full transition-all duration-300',
          isAdded 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-orange-500 hover:bg-orange-600'
        )}
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
            Ajout...
          </>
        ) : isAdded ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Ajouté au panier!
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Ajouter au panier
          </>
        )}
      </Button>
      
      {/* Price Display */}
      <div className="text-center">
        <span className="text-lg font-bold text-orange-600">
          {(price * quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
        </span>
        <span className="text-sm text-gray-500 ml-2">
          {quantity > 1 && `(${quantity} × ${price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })})`}
        </span>
      </div>
    </div>
  );
}
