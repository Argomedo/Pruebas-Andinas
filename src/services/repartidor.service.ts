import { OrderRepository } from "@/db/repositories/order.repository";
import { DomainError } from "@/lib/errors";
import { OrderStatus } from "@/types";
import { logger } from "@/lib/logger";

export const RepartidorService = {
  async getAssignedOrders(dispatcherId: string) {
    const orders = await OrderRepository.findByDispatcher(dispatcherId);
    // Solo mostrar órdenes que están listas para despacho, despachadas o entregadas (historial reciente)
    return orders.filter(o => 
      ["READY_FOR_DISPATCH", "DISPATCHED", "DELIVERED", "CANCELLED"].includes(o.status)
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async updateDeliveryStatus(orderId: string, dispatcherId: string, status: "DELIVERED" | "DISPATCHED" | "CANCELLED") {
    const order = await OrderRepository.findById(orderId);
    
    if (!order) {
      throw new DomainError("Pedido no encontrado", "NOT_FOUND");
    }

    if (order.dispatcherId !== dispatcherId) {
      throw new DomainError("No tienes permiso para gestionar este pedido", "UNAUTHORIZED");
    }

    order.status = status;
    order.updatedAt = new Date();

    await OrderRepository.update(order);
    logger.info(`Repartidor ${dispatcherId} actualizó pedido ${orderId} a ${status}`);
    
    return order;
  }
};
