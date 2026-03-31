import { AdminService } from "@/services/admin.service";
import { OrderRow } from "./OrderRow"; // Client component extracting mutation logic

export default async function AdminDashboardPage() {
  const [orders, dispatchers] = await Promise.all([
    AdminService.getAllOrders(),
    AdminService.getAllDispatchers()
  ]);

  return (
    <div className="admin-view">
      <div className="admin-page-header">
        <div>
          <h1>Pedidos Entrantes (Tiempo Real Simulado)</h1>
          <p>Evalúa las solicitudes B2B recientes, dales curso o asígnalas al reparto.</p>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado Actual</th>
              <th>Asignar Repartidor</th>
              <th>Actualizar</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={7} style={{textAlign: "center", padding: "3rem"}}>Sin órdenes recientes</td></tr>
            ) : (
              orders.map(order => (
                <OrderRow key={order.id} order={order} dispatchers={dispatchers} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
