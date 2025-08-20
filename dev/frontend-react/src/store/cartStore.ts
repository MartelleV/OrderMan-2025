import type { CartItem, Cart } from "../types";

// Ensure all cart items are always in the unified CartItem format
function normalizeCartItems(items: CartItem[]): CartItem[] {
  return (items || []).map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: typeof item.quantity === "number" ? item.quantity : 1,
    image: item.image,
  }));
}

// Load cart from localStorage if available
function loadCart(): Cart {
  const saved = localStorage.getItem("cart");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        items: normalizeCartItems(parsed.items),
        totalPrice: parsed.totalPrice || 0,
      };
    } catch {
      // fallback to empty cart
    }
  }
  return {
    items: [],
    totalPrice: 0,
  };
}

// Save cart to localStorage
function saveCart(cart: Cart) {
  const normalizedCart = {
    items: normalizeCartItems(cart.items),
    totalPrice: cart.items.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    ),
  };
  localStorage.setItem("cart", JSON.stringify(normalizedCart));
  return normalizedCart;
}

class CartStore {
  private cart: Cart;
  private listeners: Set<(cart: Cart) => void> = new Set();

  constructor() {
    this.cart = loadCart();
  }

  getCart(): Cart {
    return { ...this.cart };
  }

  addItem(product: {
    id: number;
    name: string;
    price: number;
    image?: string;
  }) {
    const existingItemIndex = this.cart.items.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex >= 0) {
      this.cart.items[existingItemIndex].quantity += 1;
    } else {
      this.cart.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
    }

    this.cart = saveCart(this.cart);
    this.notifyListeners();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const itemIndex = this.cart.items.findIndex(
      (item) => item.id === productId
    );
    if (itemIndex >= 0) {
      this.cart.items[itemIndex].quantity = quantity;
      this.cart = saveCart(this.cart);
      this.notifyListeners();
    }
  }

  removeItem(productId: number) {
    this.cart.items = this.cart.items.filter((item) => item.id !== productId);
    this.cart = saveCart(this.cart);
    this.notifyListeners();
  }

  clearCart() {
    this.cart = { items: [], totalPrice: 0 };
    this.cart = saveCart(this.cart);
    this.notifyListeners();
  }

  subscribe(listener: (cart: Cart) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.getCart()));
  }
}

export const cartStore = new CartStore();
