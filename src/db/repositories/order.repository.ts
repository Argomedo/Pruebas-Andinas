import { mockDb, simulateQueryLatency } from "../mockStore";
import type { Order } from "@/types";

export const OrderRepository = {
  async create(order: Order): Promise<void> {
    await simulateQueryLatency();
    mockDb.orders.set(order.id, order);
  },

  async findById(id: string): Promise<Order | null> {
    await simulateQueryLatency();
    return mockDb.orders.get(id) || null;
  },

  async findByCustomer(customerId: string): Promise<Order[]> {
    await simulateQueryLatency();
    return Array.from(mockDb.orders.values()).filter(o => o.customerId === customerId);
  },

  async findByDispatcher(dispatcherId: string): Promise<Order[]> {
    await simulateQueryLatency();
    return Array.from(mockDb.orders.values()).filter(o => o.dispatcherId === dispatcherId);
  },

  async findAll(): Promise<Order[]> {
    await simulateQueryLatency();
    return Array.from(mockDb.orders.values());
  },

  async update(order: Order): Promise<void> {
    await simulateQueryLatency();
    mockDb.orders.set(order.id, order);
  }
};
