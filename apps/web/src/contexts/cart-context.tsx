'use client';

import { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { Cart, CartItem, CartContextType, TAX_RATE, SHIPPING_COST } from '@/types/cart';

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: Cart };

const initialState: Cart = {
  items: [],
  total: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  itemCount: 0,
};

function calculateTotals(items: CartItem[]): Omit<Cart, 'items'> {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + tax + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal,
    tax,
    shipping,
    total,
    itemCount,
  };
}

function cartReducer(state: Cart, action: CartAction): Cart {
  console.log('🛒 Reducer - Action:', action.type, 'Payload:', 'payload' in action ? action.payload : 'N/A');
  
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      );

      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = Math.min(
              item.quantity + action.payload.quantity,
              action.payload.maxQuantity
            );
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      } else {
        // Add new item
        const newItem: CartItem = {
          ...action.payload,
          id: `${action.payload.productId}-${Date.now()}`,
        };
        newItems = [...state.items, newItem];
      }

      const newState = {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
      
      console.log('🛒 Reducer - Nouvel état:', newState);
      return newState;
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.productId !== action.payload);
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item => {
        if (item.productId === action.payload.productId) {
          const quantity = Math.max(1, Math.min(action.payload.quantity, item.maxQuantity));
          return { ...item, quantity };
        }
        return item;
      });
      
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('ecomm-burkina-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('ecomm-burkina-cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, isLoading]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    console.log('🛒 Contexte - Ajout au panier:', item);
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
