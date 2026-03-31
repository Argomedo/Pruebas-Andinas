"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { AuthService } from "@/services/auth.service";
import { AdminService } from "@/services/admin.service";
import { AuthError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { OrderStatusSchema } from "@/types";
import { revalidatePath } from "next/cache";

export type ActionResponse<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
};

// --- Authorization Helper ---
async function verifyAdminRole() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session-token")?.value;
  if (!token) throw new AuthError("No autorizado");
  
  const session = await AuthService.verifyToken(token);
  if (session.role !== "ADMIN") throw new AuthError("Solo administradores pueden realizar esta acción");
}

// --- Status Update Schema ---
const UpdateStatusSchema = z.object({
  orderId: z.string().uuid(),
  newStatus: OrderStatusSchema,
  dispatcherId: z.string().uuid().optional().nullable(),
});

export async function updateOrderStatusAction(payload: unknown): Promise<ActionResponse> {
  try {
    await verifyAdminRole();
    
    const parsed = UpdateStatusSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError("Parámetros inválidos", parsed.error.issues);
    }

    const { orderId, newStatus, dispatcherId } = parsed.data;

    await AdminService.updateOrderStatus(orderId, newStatus, dispatcherId ?? undefined);

    revalidatePath("/admin");
    return { success: true };
    
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Error interno.";
    const code = error instanceof Error ? error.constructor.name : "UnknownError";
    logger.error("Error en updateOrderStatusAction", { error: errorMsg });
    return { 
      success: false, 
      error: errorMsg,
      code
    };
  }
}

// --- Update Stock Schema ---
const UpdateStockSchema = z.object({
  productId: z.string().uuid(),
  newStock: z.number().int().min(0, "El stock no puede ser negativo"),
});

export async function updateStockAction(payload: unknown): Promise<ActionResponse> {
  try {
    await verifyAdminRole();
    
    const parsed = UpdateStockSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError("Valor de stock inválido", parsed.error.issues);
    }

    const { productId, newStock } = parsed.data;
    await AdminService.adjustProductStock(productId, newStock);

    revalidatePath("/admin/inventario");
    revalidatePath("/admin");
    return { success: true };

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Error al actualizar stock";
    const code = error instanceof Error ? error.constructor.name : "UnknownError";
    logger.error("Error en updateStockAction", { error: errorMsg });
    return { 
      success: false, 
      error: errorMsg,
      code
    };
  }
}
