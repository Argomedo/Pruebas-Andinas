/**
 * Prueba E2E con Playwright — Caso: Login de usuario
 * Proyecto: Andina SpA - Plataforma Pedidos Logística
 *
 * Intenta instalar estos cosas antes:
 *   npm install -D @playwright/test
 *   npx playwright install chromium
 *
 * Luego ejecuta si o si desde la terminal los comandos de aca abajo:
 *   npx playwright test tests/playwright/test_login.spec.ts
 *   npx playwright test --headed   ← para ver el navegador abrirse
 */

import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";


// CASO 1: Login exitoso con credenciales válidas (mock)
test("Login exitoso redirige al dashboard", async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);

  // Verifica que la página de login cargo
  await expect(page.locator("h1")).toContainText("Plataforma Logística B2B");

  // Ingresa email 
  await page.fill("#email", "cliente@elsol.cl");
  await page.fill("#password", "cualquier_valor");

  // Envía el formulario
  await page.click("button[type='submit']");

  // Espera la redirección 
  await page.waitForURL("**/dashboard**");
  expect(page.url()).toContain("/dashboard");
});

// CASO 2: Login fallido con email inválido
test("Email inválido muestra banner de error", async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);

  await page.fill("#email", "noexiste@fake.cl");
  await page.fill("#password", "cualquier_valor");
  await page.click("button[type='submit']");

  // El banner de error debe aparecer
  const errorBanner = page.locator(".error-banner");
  await expect(errorBanner).toBeVisible();
});

// CASO 3: Navegación desde la landing a /login
test("El botón 'Ingresar' navega a /login", async ({ page }) => {
  await page.goto(BASE_URL);

  // Hace click en el link "Ingresar" del navbar
  await page.click("text=Ingresar");

  await page.waitForURL("**/login**");
  expect(page.url()).toContain("/login");
});

// CASO 4: El formulario tiene los campos requeridos
test("El formulario de login tiene campos email y password", async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);

  await expect(page.locator("#email")).toBeVisible();
  await expect(page.locator("#password")).toBeVisible();
  await expect(page.locator("button[type='submit']")).toBeVisible();
});
