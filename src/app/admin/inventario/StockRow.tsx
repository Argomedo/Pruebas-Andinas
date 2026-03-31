"use client";

import { useState, useTransition } from "react";
import { updateStockAction } from "@/actions/admin.actions";
import { Product } from "@/types";
import { useToast } from "@/lib/store/ToastContext";
import { CopyPlus, Loader2 } from "lucide-react";

export function StockRow({ product }: { product: Product }) {
  const [stock, setStock] = useState<number>(product.stock);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleUpdate = () => {
    startTransition(async () => {
      const res = await updateStockAction({ productId: product.id, newStock: stock });
      if (res.success) {
        showToast("Inventario Actualizado", "success");
      } else {
        showToast(res.error || "No se pudo actualizar el stock", "error");
      }
    });
  };

  const isLowStock = product.stock <= 10;

  return (
    <tr>
      <td style={{ opacity: 0.5, fontSize: "0.75rem" }}>{product.id.split("-")[0]}</td>
      <td style={{ fontWeight: 600 }}>{product.name}</td>
      <td>${product.price.toLocaleString("es-CL")}</td>
      <td><span className="brand-badge">{product.category}</span></td>
      
      <td>
        <input 
          type="number" 
          min="0"
          value={stock} 
          onChange={(e) => setStock(parseInt(e.target.value) || 0)} 
          className="stock-input"
          style={{ borderColor: isLowStock ? "#ef4444" : "var(--border)" }}
          disabled={isPending}
        />
        {isLowStock && <span style={{ color: "#ef4444", fontSize: "0.75rem", marginLeft: "0.5rem" }}>¡Bajo Stock!</span>}
      </td>
      
      <td>
        <button 
          className="action-btn"
          onClick={handleUpdate}
          disabled={isPending || stock === product.stock}
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <CopyPlus size={14} />}
          Ajustar Existencia
        </button>
      </td>
    </tr>
  );
}
