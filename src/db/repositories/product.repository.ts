import { mockDb, simulateQueryLatency } from "../mockStore";
import type { Product } from "@/types";
import { InfraError } from "@/lib/errors";

export const ProductRepository = {
  async findAll(): Promise<Product[]> {
    await simulateQueryLatency();
    return Array.from(mockDb.products.values());
  },

  async findById(id: string): Promise<Product | null> {
    await simulateQueryLatency();
    return mockDb.products.get(id) || null;
  },

  async updateStock(id: string, newStock: number): Promise<void> {
    await simulateQueryLatency();
    const product = mockDb.products.get(id);
    if (!product) {
      throw new InfraError(`Failed to update stock: Product ${id} not found.`);
    }
    product.stock = newStock;
    mockDb.products.set(id, product);
  }
};
