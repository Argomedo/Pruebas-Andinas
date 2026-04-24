import { OrderRepository } from "@/db/repositories/order.repository";
import { ProductRepository } from "@/db/repositories/product.repository";
import { DomainError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { OrderItem, Order } from "@/types";

export const OrderService = {
  /**
   * Procesa un checkout comprobando inventario y creando la orden.
   * En Supabase, esto DEBE ir envuelto en una transacción SQL (BEGIN / COMMIT)
   * para prevenir race conditions.
   */
  async processCheckout(customerId: string, items: { productId: string; quantity: number }[]): Promise<Order> {
    if (!items || items.length === 0) {
      throw new DomainError("El pedido debe contener al menos un producto.", "EMPTY_CART");
    }

    let total = 0;
    const finalItems: OrderItem[] = [];

    // Validar el stock y precios de forma secuencial (Simulación de Transacción)
    for (const item of items) {
      const product = await ProductRepository.findById(item.productId);

      if (!product) {
        throw new DomainError(`El producto no existe (Ref: ${item.productId})`, "PRODUCT_NOT_FOUND");
      }

      if (product.stock < item.quantity) {
        throw new DomainError(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`, "INSUFFICIENT_STOCK");
      }

      // Validar costo final y acumular total
      const unitPrice = product.price;
      const subtotal = unitPrice * item.quantity;
      total += subtotal;

      finalItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
      });

      // Update stock optimistically (en un escenario real esto se hace al vuelo en la base de datos)
      await ProductRepository.updateStock(product.id, product.stock - item.quantity);
    }

    const orderId = crypto.randomUUID();
    const newOrder: Order = {
      id: orderId,
      customerId,
      status: "PENDING",
      items: finalItems,
      total,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await OrderRepository.create(newOrder);

    logger.info("Order created successfully", { orderId, customerId, total });

    return newOrder;
  }
};
