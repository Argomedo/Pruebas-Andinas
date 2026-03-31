import { OrderRepository } from "@/db/repositories/order.repository";
import { AuthService } from "@/services/auth.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PackageOpen, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import "./pedidos.css";

export default async function PedidosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session-token")?.value;
  if (!token) redirect("/login");

  const session = await AuthService.verifyToken(token);
  
  // Buscar las órdenes del usuario
  const misPedidos = await OrderRepository.findByCustomer(session.sub);
  
  // Sort by date desc
  misPedidos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="orders-view">
      <div className="orders-header">
        <h1>Historial de Pedidos</h1>
        <p>Lleva el seguimiento de tus pedidos activos e históricos.</p>
      </div>

      <div className="orders-list">
        {misPedidos.length === 0 ? (
          <div className="empty-orders">
            <PackageOpen size={48} opacity={0.3} />
            <p>Aún no tienes pedidos registrados.</p>
          </div>
        ) : (
          misPedidos.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Pedido #{order.id.split("-")[0]}</span>
                  <span className="order-date">
                    {order.createdAt.toLocaleDateString("es-CL", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="order-body">
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <span className="qty">{item.quantity}x</span>
                      <span>Producto Ref: {item.productId.split("-")[0]}</span>
                    </div>
                  ))}
                  <div className="order-total">
                    <span>Total Pagado:</span>
                    <strong>${order.total.toLocaleString("es-CL")}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  let config = { icon: <Clock size={16} />, className: "status-pending", label: "Pendiente" };
  
  switch(status) {
    case "PENDING": config = { icon: <Clock size={16} />, className: "status-pending", label: "Pendiente" }; break;
    case "IN_PREPARATION": config = { icon: <PackageOpen size={16} />, className: "status-prep", label: "En Preparación" }; break;
    case "READY_FOR_DISPATCH": config = { icon: <Truck size={16} />, className: "status-ready", label: "Procesado" }; break;
    case "DISPATCHED": config = { icon: <Truck size={16} />, className: "status-dispatch", label: "En Reparto" }; break;
    case "DELIVERED": config = { icon: <CheckCircle size={16} />, className: "status-delivered", label: "Entregado" }; break;
    case "CANCELLED": config = { icon: <XCircle size={16} />, className: "status-cancelled", label: "Cancelado" }; break;
  }

  return (
    <span className={`status-badge ${config.className}`}>
      {config.icon} {config.label}
    </span>
  );
}
