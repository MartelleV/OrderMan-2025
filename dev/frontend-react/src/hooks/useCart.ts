import { useState, useEffect } from "react";
import { cartStore } from "../store/cartStore";
import type { Cart } from "../types";

export function useCart() {
  const [cart, setCart] = useState<Cart>(cartStore.getCart());

  useEffect(() => {
    const unsubscribe = cartStore.subscribe(setCart);
    return unsubscribe;
  }, []);

  return {
    cart,
    addItem: cartStore.addItem.bind(cartStore),
    updateQuantity: cartStore.updateQuantity.bind(cartStore),
    removeItem: cartStore.removeItem.bind(cartStore),
    clearCart: cartStore.clearCart.bind(cartStore),
  };
}
