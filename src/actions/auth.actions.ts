"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { AuthService } from "@/services/auth.service";
import { AuthError, ValidationError, DomainError } from "@/lib/errors";
import { logger } from "@/lib/logger";

const LoginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
});

export type ActionResponse<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
};

export async function loginAction(prevState: ActionResponse | undefined, formData: FormData): Promise<ActionResponse> {
  try {
    const email = formData.get("email")?.toString() || "";
    
    // Zod Validation
    const parsed = LoginSchema.safeParse({ email });
    if (!parsed.success) {
      throw new ValidationError("Datos inválidos", parsed.error.issues);
    }

    // Business Logic
    const token = await AuthService.login(parsed.data.email);

    // Side Effects (Set Cookie)
    const cookieStore = await cookies();
    cookieStore.set("session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 // 1 day
    });

    return { success: true };
    
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Error desconocido";
    logger.error("Error en loginAction", { error: errorMsg });

    if (error instanceof ValidationError || error instanceof AuthError || error instanceof DomainError) {
      return { success: false, error: error.message, code: error.constructor.name };
    }

    return { success: false, error: "Ha ocurrido un error inesperado.", code: "InfraError" };
  }
}

export async function logoutAction(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session-token");
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Error desconocido";
    logger.error("Error en logoutAction", { error: errorMsg });
  }
}
