import { RepartidorService } from "@/services/repartidor.service";
import { AuthService } from "@/services/auth.service";
import { cookies } from "next/headers";
import { DeliveryCard } from "./DeliveryCard";
import { ClipboardList } from "lucide-react";

export default async function RepartidorPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session-token")?.value;
  
  if (!token) return null; // Resguardado por layout/middleware

  const session = await AuthService.verifyToken(token);
  const assignments = await RepartidorService.getAssignedOrders(session.sub);

  const pending = assignments.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED");
  const completed = assignments.filter(o => o.status === "DELIVERED" || o.status === "CANCELLED");

  return (
    <div className="dispatcher-dashboard">
      <div className="section-title">
        <ClipboardList size={20} className="text-secondary" />
        <h2>Hoja de Ruta</h2>
        <span className="count-badge">{pending.length} por entregar</span>
      </div>

      <div className="delivery-sections">
        {assignments.length === 0 ? (
          <div className="empty-state">
            <p>No tienes entregas asignadas para hoy.</p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <div className="pending-list">
                {pending.map(order => (
                  <DeliveryCard key={order.id} order={order} />
                ))}
              </div>
            )}

            {completed.length > 0 && (
              <div className="completed-section">
                <h3 className="text-sm opacity-50 mb-3 px-1">Completados recientemente</h3>
                <div className="completed-list">
                  {completed.map(order => (
                    <DeliveryCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .section-title h2 {
          font-size: 1.25rem;
          font-weight: 700;
        }
        .count-badge {
          background: rgba(255,165,0,0.1);
          color: #ffa500;
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          opacity: 0.4;
        }
        .completed-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px dashed rgba(255,255,255,0.1);
        }
      `}} />
    </div>
  );
}
