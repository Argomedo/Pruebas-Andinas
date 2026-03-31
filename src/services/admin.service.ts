import { OrderRepository } from "@/db/repositories/order.repository";
import { ProductRepository } from "@/db/repositories/product.repository";
import { UserRepository } from "@/db/repositories/user.repository";
import { DomainError } from "@/lib/errors";
import { OrderStatus, User } from "@/types";
import { logger } from "@/lib/logger";

export const AdminService = {
  async getAllOrders() {
    const orders = await OrderRepository.findAll();
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async getCatalog() {
    return ProductRepository.findAll();
  },

  async getAllDispatchers(): Promise<User[]> {
    const users = await UserRepository.findAll();
    return users.filter(u => u.role === "DISPATCHER");
  },

  async updateOrderStatus(orderId: string, newStatus: OrderStatus, dispatcherId?: string) {
    const order = await OrderRepository.findById(orderId);
    if (!order) {
      throw new DomainError("Order not found", "NOT_FOUND");
    }

    order.status = newStatus;
    if (dispatcherId && newStatus === "READY_FOR_DISPATCH") {
      const dispatcher = await UserRepository.findById(dispatcherId);
      if (!dispatcher || dispatcher.role !== "DISPATCHER") {
        throw new DomainError("El usuario asignado no es un Repartidor válido.", "INVALID_ROLE");
      }
      order.dispatcherId = dispatcherId;
    }

    await OrderRepository.update(order);
    logger.info(`Admin updated order ${orderId} to ${newStatus}`, { dispatcherId });
    return order;
  },

  async adjustProductStock(productId: string, newStock: number) {
    if (newStock < 0) {
      throw new DomainError("El stock no puede ser negativo", "INVALID_STOCK");
    }
    await ProductRepository.updateStock(productId, newStock);
    logger.info(`Admin adjusted stock for product ${productId}`, { newStock });
  }
};
