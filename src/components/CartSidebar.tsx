"use client";

import { useTransition } from "react";
import { useCart } from "@/lib/store/CartContext";
import { useToast } from "@/lib/store/ToastContext";
import { X, Trash2, Plus, Minus, CheckCircle, Loader2 } from "lucide-react";
import { checkoutAction } from "@/actions/order.actions";
import { useRouter } from "next/navigation";

export function CartSidebar() {
  const { items, isCartOpen, setCartOpen, updateQuantity, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    startTransition(async () => {
      // Mapear al Schema de Zod
      const payload = items.map(item => ({
        productId: item.id,
        quantity: item.cartQuantity
      }));

      const response = await checkoutAction({ items: payload });
      
      if (response.success) {
        showToast("¡Pedido Creado Exitosamente!", "success");
        clearCart();
        setCartOpen(false);
        // Llevar al historial
        router.push("/dashboard/pedidos");
      } else {
        showToast(response.error || "Error procesando el checkout", "error");
      }
    });
  };

  return (
    <div className="cart-backdrop" onClick={() => setCartOpen(false)}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Carrito B2B</h2>
          <button onClick={() => setCartOpen(false)} className="close-cart"><X size={24} /></button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">Tu carrito está vacío.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="cart-price">${item.price.toLocaleString("es-CL")}</p>
                </div>
                
                <div className="cart-controls">
                  <button onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}>
                    {item.cartQuantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                  </button>
                  <span className="cart-qty">{item.cartQuantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total Estimado:</span>
              <strong>${totalPrice.toLocaleString("es-CL")}</strong>
            </div>
            <button 
              className="checkout-button" 
              onClick={handleCheckout}
              disabled={isPending}
            >
              {isPending ? (
                <><Loader2 size={18} className="animate-spin" /> Procesando...</>
              ) : (
                <><CheckCircle size={18} /> Confirmar Pedido</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
