"""
Prueba E2E con Selenium WebDriver — Caso: Login de usuario
Proyecto: Andina SpA - Plataforma Pedidos Logística

Usuarios mock disponibles (definidos en src/db/mockStore.ts):
  admin@andina.cl      → rol ADMIN
  despacho@andina.cl   → rol DISPATCHER
  cliente@elsol.cl     → rol CLIENT
  (la contraseña puede ser cualquier valor — es un mock)

Requisitos:
  pip install selenium webdriver-manager

Ejecución (con el servidor Next.js corriendo en otro terminal):
  python tests/selenium/test_login.py
"""

import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = "http://localhost:3000"


class TestLoginAndina(unittest.TestCase):

    def setUp(self):
        options = webdriver.ChromeOptions()
        # Descomenta para correr sin abrir ventana visual:
        # options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")

        # ChromeDriverManager descarga automáticamente el driver correcto
        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=options
        )
        self.driver.implicitly_wait(5)

    def tearDown(self):
        self.driver.quit()

    # ---------------------------------------------------------------
    # CASO 1: Login exitoso con email válido del mock
    # ---------------------------------------------------------------
    def test_login_exitoso_cliente(self):
        driver = self.driver
        driver.get(f"{BASE_URL}/login")

        self.assertIn("Plataforma Logística B2B", driver.page_source)

        driver.find_element(By.ID, "email").send_keys("cliente@elsol.cl")
        driver.find_element(By.ID, "password").send_keys("cualquier_valor")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        # El mock redirige al dashboard tras login exitoso
        WebDriverWait(driver, 10).until(EC.url_contains("/dashboard"))
        self.assertIn("/dashboard", driver.current_url)
        print("✅ CASO 1: Login exitoso → redirige a /dashboard")

    # ---------------------------------------------------------------
    # CASO 2: Login fallido con email no registrado
    # ---------------------------------------------------------------
    def test_login_email_no_registrado(self):
        driver = self.driver
        driver.get(f"{BASE_URL}/login")

        driver.find_element(By.ID, "email").send_keys("noexiste@fake.cl")
        driver.find_element(By.ID, "password").send_keys("cualquier_valor")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        # Debe aparecer el banner .error-banner con el mensaje de AuthError
        error = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".error-banner"))
        )
        self.assertTrue(error.is_displayed())
        self.assertIn("no encontrado", error.text.lower())
        print("✅ CASO 2: Email no registrado → muestra error")

    # ---------------------------------------------------------------
    # CASO 3: Navegación desde landing → /login
    # ---------------------------------------------------------------
    def test_navegacion_landing_a_login(self):
        driver = self.driver
        driver.get(BASE_URL)

        btn = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Ingresar"))
        )
        btn.click()

        WebDriverWait(driver, 5).until(EC.url_contains("/login"))
        self.assertIn("/login", driver.current_url)
        print("✅ CASO 3: Botón 'Ingresar' navega a /login")


if __name__ == "__main__":
    unittest.main(verbosity=2)
