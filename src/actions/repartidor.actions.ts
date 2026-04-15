"use server";

import { z } from "zod";
import { RepartidorService } from "@/services/repartidor.service";
import { AuthService } from "@/services/auth.service";
import { AuthError, DomainError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const UpdateStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["DELIVERED", "DISPATCHED", "CANCELLED"]),
});

export async function updateDeliveryAction(orderId: string, status: "DELIVERED" | "DISPATCHED" | "CANCELLED") {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session-token")?.value;
    if (!token) throw new AuthError();

    const session = await AuthService.verifyToken(token);
    if (session.role !== "DISPATCHER" && session.role !== "ADMIN") {
      throw new AuthError("Solo personal de despacho puede realizar esta acción");
    }

    const parsed = UpdateStatusSchema.safeParse({ orderId, status });
    if (!parsed.success) throw new ValidationError("Datos inválidos");

    await RepartidorService.updateDeliveryStatus(orderId, session.sub, status);
    
    revalidatePath("/repartidor");
    revalidatePath("/admin");
    
    return { success: true };

  } catch (error: any) {
    logger.error("Error in updateDeliveryAction", { error: error.message });
    return { success: false, error: error.message || "Error al actualizar estado" };
  }
}
