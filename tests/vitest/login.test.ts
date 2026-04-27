/**
 * Prueba unitaria con Vitest — Caso: loginAction (Server Action)
 * Proyecto: Andina SpA - Plataforma Pedidos Logística
 *
 * Primero instala esto:
 *   npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
 *
 * Para ejecutar despus, teni que correr esto:
 *   npx vitest run tests/vitest/login.test.ts
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
const mockLoginAction = vi.fn(async (_prevState: unknown, formData: FormData) => {
  const email = formData.get("email") as string;

  // Emails válidos según el mock del proyecto
  const emailsValidos = [
    "cliente@elsol.cl",
    "admin@andina.cl",
    "repartidor@andina.cl",
  ];

  if (!email || !email.includes("@")) {
    return { success: false, error: "Email inválido" };
  }

  if (!emailsValidos.includes(email)) {
    return { success: false, error: "Usuario no encontrado." };
  }

  return { success: true };
});


// CAJA DE PRUEBAS
describe("loginAction — lógica de autenticación mock", () => {

  beforeEach(() => {
    mockLoginAction.mockClear();
  });

  it("CASO 1: Retorna success=true con email válido", async () => {
    const formData = new FormData();
    formData.append("email", "cliente@elsol.cl");
    formData.append("password", "cualquier_valor");

    const result = await mockLoginAction(undefined, formData);

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("CASO 2: Retorna error con email no registrado", async () => {
    const formData = new FormData();
    formData.append("email", "noexiste@fake.cl");
    formData.append("password", "cualquier_valor");

    const result = await mockLoginAction(undefined, formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Usuario no encontrado.");
  });

  it("CASO 3: Retorna error con email con formato inválido", async () => {
    const formData = new FormData();
    formData.append("email", "esto_no_es_un_email");
    formData.append("password", "valor");

    const result = await mockLoginAction(undefined, formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Email inválido");
  });

  it("CASO 4: La acción es llamada exactamente una vez por intento", async () => {
    const formData = new FormData();
    formData.append("email", "admin@andina.cl");
    formData.append("password", "admin123");

    await mockLoginAction(undefined, formData);

    expect(mockLoginAction).toHaveBeenCalledTimes(1);
  });
});
