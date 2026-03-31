"use server";

import { z } from "zod";
import { OrderService } from "@/services/order.service";
import { AuthService } from "@/services/auth.service";
import { DomainError, AuthError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { cookies } from "next/headers";
import { Order } from "@/types";

const CheckoutItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive("La cantidad debe ser mayor a 0"),
});

const CheckoutSchema = z.object({
  items: z.array(CheckoutItemSchema).min(1, "El carrito no puede estar vacío"),
});

export type ActionResponse<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
};

export async function checkoutAction(payload: { items: unknown[] }): Promise<ActionResponse<Order>> {
  try {
    // 1. Authentication Check
    const cookieStore = await cookies();
    const token = cookieStore.get("session-token")?.value;
    
    if (!token) {
      throw new AuthError("Debes iniciar sesión para realizar un pedido.");
    }

    const session = await AuthService.verifyToken(token);
    const customerId = session.sub;

    // 2. Input Validation
    const parsed = CheckoutSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError("Datos de carrito inválidos", parsed.error.issues);
    }

    // 3. Business Logic execution
    const newOrder = await OrderService.processCheckout(customerId, parsed.data.items);

    return { success: true, data: newOrder };
    
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Error desconocido";
    logger.error("Error en checkoutAction", { error: errorMsg });

    if (error instanceof ValidationError || error instanceof AuthError || error instanceof DomainError) {
      return { success: false, error: error.message, code: error.constructor.name };
    }

    return { success: false, error: "Error procesando el pedido. Por favor intenta de nuevo.", code: "InfraError" };
  }
}
