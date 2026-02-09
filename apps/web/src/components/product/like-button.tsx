'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/toast-provider';

interface LikeButtonProps {
  productId: string;
  initialLikes?: number;
  isInitiallyLiked?: boolean;
  className?: string;
}

export function LikeButton({ 
  productId, 
  initialLikes = 0, 
  isInitiallyLiked = false,
  className 
}: LikeButtonProps) {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if product is liked when component mounts
    if (session?.user) {
      checkLikeStatus();
    }
  }, [session, productId]);

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`/api/likes/check?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () => {
    if (!session?.user) {
      addToast('Veuillez vous connecter pour ajouter des produits à vos favoris', 'info');
      return;
    }

    if (isLoading || isAnimating) return;

    setIsLoading(true);
    setIsAnimating(true);
    
    // Optimistic update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    try {
      const response = await fetch('/api/likes', {
        method: newIsLiked ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setIsLiked(!newIsLiked);
        addToast('Erreur lors de la mise à jour des favoris', 'error');
        throw new Error('Failed to update like');
      }

      // Show success toast
      if (newIsLiked) {
        addToast('Produit ajouté aux favoris ❤️', 'success');
      } else {
        addToast('Produit retiré des favoris', 'success');
      }
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert optimistic update on error
      setIsLiked(!newIsLiked);
    } finally {
      setIsLoading(false);
      // Animation duration
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        'relative overflow-hidden transition-colors duration-200',
        'bg-white/90 backdrop-blur-sm hover:bg-white',
        'rounded-full shadow-md hover:shadow-lg',
        isLiked && 'bg-red-50 hover:bg-red-100',
        className
      )}
      aria-label={isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-all duration-200',
          isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700',
          isAnimating && 'animate-bounce-heart'
        )}
      />

      <style jsx>{`
        @keyframes bounce-heart {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-bounce-heart {
          animation: bounce-heart 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </Button>
  );
}
