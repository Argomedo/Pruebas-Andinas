"use server";

import { z } from "zod";
import { OrderRepository } from "@/db/repositories/order.repository";
import { AuthService } from "@/services/auth.service";
import { AuthError, DomainError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { cookies } from "next/headers";

const DownloadSchema = z.object({
  orderId: z.string().uuid(),
});

export async function generateInvoiceAction(orderId: string) {
  try {
    // 1. Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("session-token")?.value;
    if (!token) throw new AuthError();

    const session = await AuthService.verifyToken(token);

    // 2. Data Validation
    const parsed = DownloadSchema.safeParse({ orderId });
    if (!parsed.success) throw new ValidationError("ID de pedido inválido");

    // 3. Fetch Order
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new DomainError("Pedido no encontrado", "NOT_FOUND");

    // Security: Only the customer or admin can download
    if (order.customerId !== session.sub && session.role !== "ADMIN") {
      throw new AuthError("No tienes permiso para descargar este documento");
    }

    // 4. Generate "Invoice" content (Simulated)
    const invoiceContent = `
========================================
      FACTURA PROFORMA - ANDINA SPA
========================================
ID PEDIDO: ${order.id}
FECHA: ${order.createdAt.toLocaleDateString()}
CLIENTE ID: ${order.customerId}
ESTADO: ${order.status}

DETALLE:
${order.items.map(item => `- Producto: ${item.productId.split('-')[0]} x ${item.quantity} | $${item.unitPrice}`).join('\n')}

----------------------------------------
TOTAL: $${order.total.toLocaleString('es-CL')}
----------------------------------------
Este documento es un simulacro generado por 
la plataforma logística B2B.
========================================
    `;

    logger.info(`Generada factura para pedido ${orderId}`, { userId: session.sub });

    return { 
      success: true, 
      data: {
        filename: `factura-${orderId.split('-')[0]}.txt`,
        content: Buffer.from(invoiceContent).toString('base64'),
        contentType: 'text/plain'
      }
    };

  } catch (error: any) {
    logger.error("Error generating invoice", { error: error.message });
    return { success: false, error: error.message || "Error al generar factura" };
  }
}
