"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { Product } from "@/types";
import { useToast } from "./ToastContext";

interface CartItem extends Product {
  cartQuantity: number;
}

interface CartContextState {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextState | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const { showToast } = useToast();

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("b2b_cart");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("b2b_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      
      // Prevent exceeding stock locally
      const currentQty = existing ? existing.cartQuantity : 0;
      if (currentQty + qty > product.stock) {
        showToast(`Stock insuficiente. Máximo disponible: ${product.stock}`, "error");
        return prev;
      }

      showToast(`Agregaste ${product.name} al carrito`, "success");
      
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, cartQuantity: i.cartQuantity + qty } : i);
      }
      return [...prev, { ...product, cartQuantity: qty }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    
    setItems((prev) => prev.map((i) => {
      if (i.id === id) {
        if (qty > i.stock) {
          showToast(`Stock máximo alcanzado (${i.stock})`, "error");
          return i;
        }
        return { ...i, cartQuantity: qty };
      }
      return i;
    }));
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((acc, curr) => acc + curr.cartQuantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((acc, curr) => acc + (curr.price * curr.cartQuantity), 0), [items]);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
