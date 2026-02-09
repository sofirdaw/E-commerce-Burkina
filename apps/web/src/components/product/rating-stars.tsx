'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/toast-provider';

interface RatingStarsProps {
  productId: string;
  totalReviews?: number;
  averageRating?: number;
  onRatingSubmitted?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function RatingStars({
  productId,
  totalReviews = 0,
  averageRating = 0,
  onRatingSubmitted,
  interactive = true,
  size = 'md',
  showCount = true,
}: RatingStarsProps) {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const starSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  useEffect(() => {
    if (session?.user) {
      checkUserRating();
    }
  }, [session, productId]);

  const checkUserRating = async () => {
    try {
      const response = await fetch(`/api/reviews/user-rating?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setUserRating(data.rating || 0);
        setHasRated(data.rating > 0);
      }
    } catch (error) {
      console.error('Error checking user rating:', error);
    }
  };

  const handleRatingClick = async (rating: number) => {
    if (!interactive || !session?.user) {
      if (!session?.user) {
        addToast('Veuillez vous connecter pour noter ce produit', 'info');
      }
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/reviews/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
        }),
      });

      if (!response.ok) {
        addToast('Erreur lors de la sauvegarde de la note', 'error');
        throw new Error('Failed to save rating');
      }

      setUserRating(rating);
      setHasRated(true);
      addToast(`Note de ${rating} étoile${rating > 1 ? 's' : ''} enregistrée ⭐`, 'success');
      
      if (onRatingSubmitted) {
        onRatingSubmitted(rating);
      }
    } catch (error) {
      console.error('Error saving rating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayRating = hoveredRating || userRating || Math.round(averageRating);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Stars */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => interactive && setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => handleRatingClick(star)}
              disabled={!interactive || isLoading || !session?.user}
              className={cn(
                'transition-all duration-200',
                interactive && session?.user && 'cursor-pointer hover:scale-110',
                !interactive && 'cursor-default'
              )}
              aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
            >
              <Star
                className={cn(
                  starSizes[size],
                  'transition-all duration-200',
                  star <= displayRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300',
                  hasRated && star <= userRating && 'scale-110',
                  isLoading && 'opacity-50'
                )}
              />
            </button>
          ))}
        </div>

        {/* Rating Info */}
        {showCount && (
          <div className="text-sm text-muted-foreground">
            {/** If there's an average rating from server show it. If not, but user just rated, show user's rating and one review. Otherwise show 'Aucune note'. */}
            {averageRating > 0 ? (
              <>
                <span className="font-semibold text-gray-700">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-gray-500"> ({totalReviews})</span>
              </>
            ) : hasRated ? (
              <>
                <span className="font-semibold text-gray-700">{userRating}.0</span>
                <span className="text-gray-500"> (1)</span>
              </>
            ) : (
              <span className="text-gray-500">Aucune note</span>
            )}
          </div>
        )}
      </div>

      {/* User Rating Feedback */}
      {hasRated && !hoveredRating && (
        <div className="text-xs text-green-600 font-medium animate-fade-in">
          ✓ Votre note: {userRating} étoile{userRating > 1 ? 's' : ''}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-xs text-gray-500">
          Enregistrement en cours...
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
