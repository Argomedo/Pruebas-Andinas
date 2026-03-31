"use client";

import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "@/actions/admin.actions";
import { Order, OrderStatus, User } from "@/types";
import { useToast } from "@/lib/store/ToastContext";
import { Save, Loader2 } from "lucide-react";

export function OrderRow({ order, dispatchers }: { order: Order; dispatchers: User[] }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [dispatcherId, setDispatcherId] = useState<string>(order.dispatcherId || "");
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleUpdate = () => {
    startTransition(async () => {
      const payload = {
        orderId: order.id,
        newStatus: status,
        dispatcherId: dispatcherId || null
      };
      
      const res = await updateOrderStatusAction(payload);
      if (res.success) {
        showToast("Pedido actualizado con éxito", "success");
      } else {
        showToast(res.error || "No se pudo actualizar", "error");
      }
    });
  };

  return (
    <tr>
      <td style={{ fontWeight: 600 }}>{order.id.split("-")[0]}</td>
      <td>{new Date(order.createdAt).toLocaleDateString("es-CL", { day: '2-digit', month: 'short' })}</td>
      <td>{order.customerId.split("-")[0]}...</td>
      <td>${order.total.toLocaleString("es-CL")}</td>
      
      {/* Selector de Estado */}
      <td>
        <select 
          className="status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          disabled={isPending}
        >
          <option value="PENDING">Pendiente</option>
          <option value="IN_PREPARATION">Preparando</option>
          <option value="READY_FOR_DISPATCH">Listo para Envío</option>
          <option value="DISPATCHED">En Reparto</option>
          <option value="DELIVERED">Entregado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
      </td>

      {/* Selector de Repartidor (Solo cobra sentido si está listo para despacho/en reparto) */}
      <td>
        <select
          className="status-select"
          value={dispatcherId}
          onChange={(e) => setDispatcherId(e.target.value)}
          disabled={status !== "READY_FOR_DISPATCH" && status !== "DISPATCHED" || isPending}
        >
          <option value="">-- Sin Asignar --</option>
          {dispatchers.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </td>

      {/* Botón Acción */}
      <td>
        <button 
          className="action-btn"
          onClick={handleUpdate}
          disabled={isPending || (status === order.status && dispatcherId === (order.dispatcherId || ""))}
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Guardar
        </button>
      </td>
    </tr>
  );
}
