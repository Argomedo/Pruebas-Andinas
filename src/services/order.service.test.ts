import test from "node:test";
import assert from "node:assert";
import { OrderService } from "./order.service";
import { ProductRepository } from "@/db/repositories/product.repository";

test("OrderService.processCheckout", async (t) => {
  // Test case 1: Should throw on empty cart
  await t.test("Debe fallar si el carrito esta vacio", async () => {
    try {
      await OrderService.processCheckout("some-id", []);
      assert.fail("Should have thrown error");
    } catch (e: unknown) {
      assert.strictEqual((e as { code?: string }).code, "EMPTY_CART");
    }
  });

  // Test case 2: Should throw on insufficient stock
  await t.test("Debe fallar si el producto no tiene stock suficiente", async () => {
    try {
      // Intentamos comprar ID 4444... (El cual fue intencionalmente puesto en 0 en la semilla)
      await OrderService.processCheckout("00000000-0000-0000-0000-000000000003", [
        { productId: "44444444-4444-4444-4444-444444444444", quantity: 1 }
      ]);
      assert.fail("Should have thrown error due to stock");
    } catch (e: unknown) {
      assert.strictEqual((e as { code?: string }).code, "INSUFFICIENT_STOCK");
    }
  });

  // Test case 3: Successful order creation
  await t.test("Debe procesar la orden exitosamente y descontar stock", async () => {
    // Usamos el producto 1 (50 stock originariamente)
    const productId = "11111111-1111-1111-1111-111111111111";
    
    const order = await OrderService.processCheckout("00000000-0000-0000-0000-000000000003", [
      { productId, quantity: 2 }
    ]);

    assert.ok(order);
    assert.strictEqual(order.status, "PENDING");
    assert.strictEqual(order.total, 3600); // 1800 * 2 = 3600

    // Verificamos el stock actualizado
    const product = await ProductRepository.findById(productId);
    assert.strictEqual(product?.stock, 48); // 50 - 2
  });
});
