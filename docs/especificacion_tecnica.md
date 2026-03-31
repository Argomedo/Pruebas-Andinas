# Especificación Técnica y Arquitectura

## 1. Stack Tecnológico Principal
- **Framework:** Next.js 16 (App Router).
- **Lógica de Servidor:** Server Actions exclusivos (sin uso de `pages/api` ni Route Handlers para lógica de mutaciones).
- **Estilos:** Vanilla CSS (evitando frameworks como TailwindCSS, priorizando control total, mantenibilidad y diseño de alta calidad con animaciones fluidas).
- **Validación:** Zod para todas las entradas y salidas de Server Actions.
- **Persistencia Temporal:** Archivos JSON y/o Mock Data en memoria transaccional (preparando la interfaz para su migración futura a PostgreSQL vía Supabase).
- **Lenguaje:** TypeScript estricto (`noImplicitAny: true`).

## 2. Definición de Arquitectura (Capas Hexagonales)
Se implementa una arquitectura estructurada y altamente modular bajo estricta separación de responsabilidades:

- **`src/app`**: Rutas y Layouts de Next.js. Exclusivamente para enrutamiento y definición de *Server/Client Components*.
- **`src/actions`**: Server Actions. Única capa encargada de interactuar con el cliente para mutaciones. Su rol es validar inputs con Zod, invocar a la capa de Servicios y manejar el retorno o errores al cliente.
- **`src/services`**: Lógica de negocio. Los componentes de React y los Actions no toman decisiones de dominio, delegan la lógica (como calcular precios, descontar stock o crear el flujo de pedidos) a esta capa.
- **`src/db`**: Repositorios de acceso a datos e infraestructura. Actualmente implementarán la lectura/escritura simulada (Mock/JSON), proveyendo una abstracción (Ej. `OrderRepository`) que en un futuro se refactorizará para consumir Supabase, sin que los Servicios se enteren.
- **`src/components`**: Componentes visuales y de UI. Sin lógica de negocio ni side-effects crudos.
- **`src/lib`**: Utilidades puras, calculadoras financieras globales, loggers estructurados.
- **`src/types`**: DTOs, interfaces de dominio, esquemas Zod y tipos compartidos generales.
- **`src/docs`**: Documentación funcional y arquitectura, que actúa como fuente de la verdad para el ciclo de vida del código.

## 3. Estrategia de Errores Tipados
Todo error durante los procesos de lógica y base de datos usará clases especializadas, nunca instanciando genéricamente `Error("mensaje")`:
- `DomainError`: Validaciones propias del negocio (Ej. "Stock insuficiente para Producto X").
- `ValidationError`: Problemas detectados con Zod en inputs.
- `AuthError`: Problemas de autenticación y autorización segura.
- `InfraError`: Fallos en servicios externos o lectura de base de datos/archivos.

## 4. Implementación de Base de Datos Mock
Dado que momentáneamente la persistencia no será en Supabase (tal como se solicitó):
1. Todo acceso a datos debe ser **asíncrono** (`Promise`) para simular la realidad y evitar bloqueos.
2. Se implementará un `MockDatabase` Singleton en servidor que se inicialice y escriba en el disco duro o maneje almacenamiento en memoria local temporal (en el servidor de Next.js).
3. Todo CRUD estará restringido estrictamente a `src/db`.
