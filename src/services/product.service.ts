import { ProductRepository } from "@/db/repositories/product.repository";
import { DomainError } from "@/lib/errors";
import type { Product } from "@/types";

export const ProductService = {
  async getCatalog(): Promise<Product[]> {
    // Only return products that could technically be seen (even zero stock ones so they show as "Agotado")
    return ProductRepository.findAll();
  },

  async getProduct(id: string): Promise<Product> {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new DomainError(`El producto no existe o está descontinuado.`, "PRODUCT_NOT_FOUND");
    }
    return product;
  }
};
