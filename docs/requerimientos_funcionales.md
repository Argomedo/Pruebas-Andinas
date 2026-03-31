# Requerimientos Funcionales

En base al contexto del proyecto de la plataforma de gestión de pedidos para Distribuidora Andina SpA, a continuación se detallan los requerimientos funcionales extraídos por cada componente principal.

## 1. Portal de Clientes (Web)
El sistema debe permitir a los clientes interactuar de manera autónoma con el negocio.

### Gestión de Usuarios y Accesos
- **RF1.1 - Registro de Clientes:** El sistema debe permitir a nuevos clientes crear una cuenta en la plataforma.
- **RF1.2 - Autenticación:** El sistema debe permitir el inicio de sesión seguro a clientes previamente registrados.

### Catálogo y Pedidos
- **RF1.3 - Visualización de Catálogo:** El sistema debe mostrar un catálogo actualizado de productos disponibles (bebidas, snacks, alimentos) con su respectiva información y precios.
- **RF1.4 - Creación de Pedidos:** El sistema debe permitir a los clientes seleccionar productos, agregarlos a un carrito y procesar la solicitud del pedido de forma digital.

### Seguimiento y Gestión Post-Venta
- **RF1.5 - Historial de Compras:** El sistema debe proporcionar una vista con todos los pedidos realizados previamente por el cliente.
- **RF1.6 - Seguimiento de Pedidos:** El sistema debe permitir al cliente consultar el estado actualizado de su pedido (ej: en preparación, despachado, entregado).
- **RF1.7 - Descarga de Documentos:** El sistema debe permitir a los clientes visualizar y descargar los documentos tributarios (facturas o boletas) asociados a cada pedido.

---

## 2. Panel Administrativo (Web)
El sistema debe proveer herramientas internas para la administración completa de operaciones de la distribuidora.

### Gestión del Negocio
- **RF2.1 - Gestión de Clientes:** El sistema debe permitir crear, editar, visualizar y desactivar perfiles de clientes, incluyendo historial u otros datos comerciales.
- **RF2.2 - Gestión de Productos:** El sistema debe permitir ingresar y mantener la información actualizada de los productos y sus características en el catálogo general.
- **RF2.3 - Control de Inventario:** El sistema debe reflejar las existencias actuales de bodega, actualizando este número basado en los pedidos concretados y en reposiciones internas.

### Operación Logística y Ventas
- **RF2.4 - Gestión de Pedidos:** El sistema debe permitir la revisión, modificación y avance en el flujo (estado) de los pedidos ingresados al sistema antes y después de pasar a bodega.
- **RF2.5 - Gestión de Despachos:** El sistema debe permitir coordinar y asignar los pedidos preparados a distintas rutas o repartidores para su distribución final.
- **RF2.6 - Facturación:** El sistema debe permitir registrar o emitir la correspondiente facturación para los pedidos aprobados y despachados.

### Análisis de Datos
- **RF2.7 - Reportes de Ventas:** El sistema debe disponer de una sección para la generación de informes o métricas de ventas.

---

## 3. Aplicación para Repartidores (Móvil)
El sistema debe contar con un componente adaptado para operarios de flota en terreno.

### Operativas de Reparto
- **RF3.1 - Visualización de Asignaciones:** El sistema debe mostrar al conductor el listado de todos los pedidos y despachos asignados para el día de trabajo.
- **RF3.2 - Visualización de Rutas:** El sistema debe permitir revisar la secuencia de direcciones u optimización de las diferentes entregas programadas.
- **RF3.3 - Confirmación de Entrega:** El sistema debe contar con la funcionalidad para que el repartidor notifique en tiempo real cuando un pedido fue exitosamente entregado, actualizando el estado central.
- **RF3.4 - Registro de Incidencias:** El sistema debe permitir reportar un problema si una entrega no se pudo completar (rechazo de cliente, local cerrado, mercancía dañada, etc.).
- **RF3.5 - Captura de Conformidad:** El sistema debe permitir registrar digitalmente la firma u otro método de confirmación del cliente al momento de recepcionar los productos.
