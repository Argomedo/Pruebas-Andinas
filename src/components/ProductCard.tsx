"use client";

import { useCart } from "@/lib/store/CartContext";
import { Product } from "@/types";
import { Plus, ShoppingCart } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, items } = useCart();
  
  const isOutOfStock = product.stock === 0;
  
  // Calcular cuánto lleva ya en el carrito
  const cartItem = items.find(i => i.id === product.id);
  const qtyInCart = cartItem?.cartQuantity || 0;
  
  // Limitar si alcanzó el stock localmente
  const maxReached = qtyInCart >= product.stock;
  
  const isDisabled = isOutOfStock || maxReached;

  return (
    <div className={`product-card ${isOutOfStock ? "out-of-stock" : ""}`}>
      <div className="product-image-placeholder">
        <PackagePlaceholder />
      </div>
      
      <div className="product-content">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.name}</h3>
        
        <div className="product-info">
          <span className="product-price">${product.price.toLocaleString("es-CL")}</span>
          <span className="product-stock">
            {isOutOfStock ? "Agotado" : `Stock: ${product.stock - qtyInCart}`}
          </span>
        </div>

        <button 
          className="product-add-btn" 
          onClick={() => addToCart(product)}
          disabled={isDisabled}
        >
          {isOutOfStock ? "Sin Stock" : maxReached ? "Max Stock" : (
            <>
              Agregar <Plus size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Helper para iconos placeholder según categoría
function PackagePlaceholder() {
  return (
    <div className="placeholder-icon">
      <ShoppingCart size={40} opacity={0.3} />
    </div>
  );
}
