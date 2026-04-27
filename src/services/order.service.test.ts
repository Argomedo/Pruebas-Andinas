import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from './order.service';
import { ProductRepository } from '@/db/repositories/product.repository';
import { OrderRepository } from '@/db/repositories/order.repository';
import { DomainError } from '@/lib/errors';

// Hacemos mock de los repositorios y del logger
vi.mock('@/db/repositories/product.repository');
vi.mock('@/db/repositories/order.repository');
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  }
}));

describe('OrderService', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test para evitar contaminación
    vi.clearAllMocks();
  });

  describe('processCheckout', () => {
    it('debería lanzar un error (EMPTY_CART) si no se envían productos', async () => {
      await expect(OrderService.processCheckout('customer-1', []))
        .rejects.toThrowError(DomainError);

      await expect(OrderService.processCheckout('customer-1', []))
        .rejects.toThrowError('El pedido debe contener al menos un producto.');
    });

    it('debería lanzar un error (PRODUCT_NOT_FOUND) si un producto no existe', async () => {
      // Configuramos el mock para que devuelva un valor nulo simulando que no está el producto en DB
      vi.mocked(ProductRepository.findById).mockResolvedValue(null);

      await expect(
        OrderService.processCheckout('customer-1', [{ productId: 'prod-invalido', quantity: 1 }])
      ).rejects.toThrowError(/El producto no existe/);
    });

    it('debería lanzar un error (INSUFFICIENT_STOCK) si no hay stock suficiente', async () => {
      // Configuramos el mock simulando que solo hay 5 unidades en stock
      vi.mocked(ProductRepository.findById).mockResolvedValue({
        id: 'prod-1',
        name: 'Producto de Prueba',
        stock: 5,
        price: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any);

      await expect(
        OrderService.processCheckout('customer-1', [{ productId: 'prod-1', quantity: 10 }])
      ).rejects.toThrowError(/Stock insuficiente/);
    });

    it('debería crear el pedido y descontar el stock si todo es válido', async () => {
      // Simulamos que el producto existe y tiene stock de sobra
      vi.mocked(ProductRepository.findById).mockResolvedValue({
        id: 'prod-1',
        name: 'Producto de Prueba',
        stock: 10,
        price: 100,
      } as any);
      vi.mocked(ProductRepository.updateStock).mockResolvedValue();
      vi.mocked(OrderRepository.create).mockResolvedValue({} as any);

      // Usamos globales como crypto que están disponibles en Node moderno
      const result = await OrderService.processCheckout('customer-1', [{ productId: 'prod-1', quantity: 2 }]);

      // Verificamos que se haya calculado bien el total (100 * 2 = 200)
      expect(result).toBeDefined();
      expect(result.total).toBe(200);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(2);
      expect(result.items[0].unitPrice).toBe(100);

      // Verificamos que se haya invocado a la base de datos (OrderRepository)
      expect(OrderRepository.create).toHaveBeenCalled();

      // Verificamos que el stock se haya actualizado disminuyendo lo que se compró (10 - 2 = 8)
      expect(ProductRepository.updateStock).toHaveBeenCalledWith('prod-1', 8);
    });
  });
});
