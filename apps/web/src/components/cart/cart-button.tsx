'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/cart-context';
import { cn } from '@/lib/utils';

interface CartButtonProps {
  className?: string;
  showCount?: boolean;
}

export function CartButton({ className, showCount = true }: CartButtonProps) {
  const { cart, isLoading } = useCart();

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" className={cn('relative', className)}>
        <ShoppingCart className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Link href="/cart">
      <Button variant="ghost" size="sm" className={cn('relative', className)}>
        <ShoppingCart className="h-5 w-5" />
        
        {showCount && cart.itemCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-orange-500 hover:bg-orange-600"
          >
            {cart.itemCount > 99 ? '99+' : cart.itemCount}
          </Badge>
        )}
        
        <span className="sr-only">Panier ({cart.itemCount} articles)</span>
      </Button>
    </Link>
  );
}
