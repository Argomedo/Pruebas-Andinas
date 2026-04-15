"use client";

import { useTransition } from "react";
import { CheckCircle, XCircle, MapPin, Package, Phone } from "lucide-react";
import { updateDeliveryAction } from "@/actions/repartidor.actions";
import { useToast } from "@/lib/store/ToastContext";
import type { Order } from "@/types";

interface Props {
  order: Order;
}

export function DeliveryCard({ order }: Props) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleUpdate = (status: "DELIVERED" | "CANCELLED") => {
    const confirmMsg = status === "DELIVERED" 
      ? "¿Confirmas la entrega de este pedido?" 
      : "¿Registrar incidencia y cancelar entrega?";
      
    if (!confirm(confirmMsg)) return;

    startTransition(async () => {
      const result = await updateDeliveryAction(order.id, status);
      if (result.success) {
        showToast(status === "DELIVERED" ? "Entrega confirmada" : "Incidencia registrada", "success");
      } else {
        showToast(result.error || "Ocurrió un error", "error");
      }
    });
  };

  const isCompleted = order.status === "DELIVERED" || order.status === "CANCELLED";

  return (
    <div className={`delivery-card ${isCompleted ? 'completed' : ''}`}>
      <div className="card-header">
        <span className="order-id">#{order.id.split('-')[0]}</span>
        <span className={`status-badge-small ${order.status.toLowerCase()}`}>{order.status}</span>
      </div>

      <div className="card-info">
        <div className="info-row">
          <MapPin size={16} className="text-primary" />
          <span>Local: Minimarket Sol del Mar</span>
        </div>
        <div className="info-row">
          <Package size={16} className="text-secondary" />
          <span>{order.items.length} productos | ${order.total.toLocaleString("es-CL")}</span>
        </div>
        <div className="info-row">
          <Phone size={16} className="text-emerald-500" />
          <a href="tel:+56912345678" className="text-sm">+56 9 1234 5678</a>
        </div>
      </div>

      {!isCompleted && (
        <div className="card-actions">
          <button 
            className="action-btn cancel" 
            onClick={() => handleUpdate("CANCELLED")}
            disabled={isPending}
          >
            <XCircle size={18} /> Fallida
          </button>
          <button 
            className="action-btn complete" 
            onClick={() => handleUpdate("DELIVERED")}
            disabled={isPending}
          >
            <CheckCircle size={18} /> Entregar
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .delivery-card {
          background: #141416;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          transition: all 0.2s ease;
        }
        .delivery-card.completed {
          opacity: 0.6;
          border-color: transparent;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .order-id {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--primary);
        }
        .status-badge-small {
          font-size: 0.7rem;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          text-transform: uppercase;
          font-weight: 800;
        }
        .status-badge-small.ready_for_dispatch { background: #6366f1; }
        .status-badge-small.delivered { background: #10b981; }
        .status-badge-small.cancelled { background: #ef4444; }
        
        .card-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .info-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.8);
        }
        .card-actions {
          display: flex;
          gap: 0.75rem;
        }
        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.8rem;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .action-btn.complete {
          background: #10b981;
          color: white;
        }
        .action-btn.cancel {
          background: rgba(255,255,255,0.05);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .action-btn:disabled {
          opacity: 0.5;
        }
      `}} />
    </div>
  );
}
