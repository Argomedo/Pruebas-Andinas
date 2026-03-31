# Plan de Trabajo: Desarrollo Plataforma de Pedidos (JSON/Mock Base)

Este plan de trabajo desglosa el proceso de construcción de la plataforma end-to-end, asegurando un diseño estructural correcto desde el día uno y permitiendo una simulación de base de datos tal como fue solicitado.

## Fase 1: Entorno, Arquitectura y UI Base
- [ ] Inicialización Next.js 16 (App Router + TS Estricto) utilizando comandos automatizados (npx create-next-app).
- [ ] Creación de estructura canónica de directorios (`src/app`, `src/actions`, `src/services`, `src/db`, `src/components`...).
- [ ] Implementación de clases de Error Tipados (`DomainError`, `ValidationError`...) y un logger estructurado en `src/lib`.
- [ ] Definición del sistema de Diseño UI usando Vanilla CSS (Paletas HSL, *glassmorphism*, variables globales en `globals.css`).

## Fase 2: Capa de Datos Mock y Tipado (Domain Layer)
- [ ] Modelamiento de entidades con esquemas **Zod** (Usuarios, Productos, Pedidos, DetallePedidos, Categorías) dentro de `src/types`.
- [ ] Desarrollo del Motor de Base de Datos Mock en `src/db/mockStore.ts` con manejo de latencias promesas para simular consultas del mundo real (y escritura de archivos).
- [ ] Implementación de Repositorios específicos (`UserRepository`, `ProductRepository`, `OrderRepository`).

## Fase 3: Servicios Lógicos y Reglas de Negocio
- [ ] **`AuthService`**: Mecanismo simulado de inicio de sesión con JWT ficticio en cookies para permitir autenticación.
- [ ] **`ProductService`**: Listado de catálogo, filtros por categoría y validaciones de disponibilidad de stock.
- [ ] **`OrderService`**: Implementación de las funcionalidades core: cálculo de total, prevención de duplicidad, disminución de inventario y rastreo de estados del pedido (PREPARACION, DESPACHO, ENTREGADO).

## Fase 4: Enrutamiento y Server Actions (Capa de Aplicación)
- [ ] Implementar Next.js Middleware para validación de rutas protegidas basado en la cookie de sesión ficticia.
- [ ] Creación de `Server Actions` seguros y validados para: inicio de sesión, agregar producto al carrito, confirmación y Checkout final del pedido inteligente.

## Fase 5: Aplicación Web - Portal de Clientes
- [ ] UI de inicio de sesión y registro de clientes.
- [ ] Vista del Catálogo de Productos (Renderizado desde el servidor).
- [ ] UI de Carrito de Compras en cliente y proceso de Checkout de alta conversión.
- [ ] Panel de usuario: Ver pedidos activos, estados de tracking y descargar simulacros de factura. 

## Fase 6: Aplicación Web - Panel Administrativo
- [ ] Layout de administrador B2B.
- [ ] *Dashboard* de pedidos entrantes en vivo (Aprobación rápida, asignación a preparadores o flotas).
- [ ] Vista de Configuración de Catálogo e Inventario para actualizar existencias de bodega simuladas.

## Fase 7: Aplicación Móvil Web - App Repartidores
- [ ] Construcción de interface Mobile First para los repartidores en sus camiones/motos.
- [ ] Listado de tareas (entregas) asignadas al repartidor del día.
- [ ] Botonera optimizada para marcar entrega, registrar incidente y capturar firma rápida.

## Fase 8: Control de Calidad y Refinamiento (QA & UI Polish)
- [ ] Pruebas unitarias/simuladas de los flujos críticos de la plataforma.
- [ ] Pulido de estéticas de UI, feedback de carga en Server Actions y mejora de animaciones.
- [ ] Presentación Final de la versión Mock/JSON del proyecto operando de punta a punta.
