export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  vendorId: string;
  vendorName: string;
  inStock: boolean;
  maxQuantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  itemCount: number;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

export const TAX_RATE = 0; // TVA supprimée (0%) au Burkina Faso
export const SHIPPING_COST = 1500; // 1500 FCFA
