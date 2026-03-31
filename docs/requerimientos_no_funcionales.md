# Requerimientos No Funcionales

Basados en los atributos de calidad, estabilidad y los "problemas a evitar" planteados en el documento de contexto para Distribuidora Andina SpA, a continuación se desglosan las características del sistema que guiarán la arquitectura y reglas técnicas.

## 1. Rendimiento, Desempeño y Escalabilidad
- **RNF1.1 - Tolerancia a Picos de Tráfico:** (Previene *caídas del sistema en horario peak*) El sistema debe estar desplegado en una arquitectura o cuenta de alojamiento que permita el escalamiento y pueda manejar una alta concurrencia transaccional sin pérdida de servicio.
- **RNF1.2 - Velocidad de Respuesta:** (Previene *lentitud en la plataforma*) Las interfaces web y móviles deben ser responsivas y veloces. Los tiempos de respuesta del servidor web y bases de datos deben mantenerse bajos en todas las resoluciones o transacciones clave como listar catálogos o despachos en ruta.

## 2. Seguridad y Resiliencia
- **RNF2.1 - Control de Accesos:** (Previene *accesos no autorizados*) Todo origen de peticiones en la plataforma deberá validar la correcta identidad del usuario según su rol (Cliente, Bodega, Despacho, Administrador) y asegurar que nadie tenga acceso a los endpoints u operaciones de los recursos que no le pertenezcan.
- **RNF2.2 - Continuidad y Backup:** (Previene *pérdida de información*) El sistema debe garantizar que la información sensible, catálogos, y pedidos, esté respaldada permanentemente y protegida frente a interrupciones o fallos de infraestructura.

## 3. Integridad de Datos y Restricciones a Nivel de Sistema
- **RNF3.1 - Concurrencia de Inventario:** (Previene *productos vendidos sin stock*) La base de datos y la arquitectura del backend deben emplear mecanismos (transaccionales / concurrencia) para que bajo ninguna circunstancia se confirme un cobro o producto si no existía el saldo en bodega en ese milisegundo.
- **RNF3.2 - Idempotencia y Prevención de Duplicados:** (Previene *pedidos duplicados*) El diseño del sistema de carrito de compras y cierre de peticiones debe prevenir, aún frente a doble-clicks o problemas de red en los móviles, el procesamiento duplicado de una misma compra de un cliente en un mismo minuto.
- **RNF3.3 - Integridad de Pasos Operativos:** (Previene que un *pedido no llegue a bodega*) El flujo de guardado de los pedidos no debe admitir "guardados a medias". Un pedido completado debe estar unívocamente sincronizado tanto para facturación como para despacho de bodega (Atomicity en la base de datos).
- **RNF3.4 - Precisión Financiera:** (Previene *errores de facturación*) Cualquier cálculo de montos brutos o gravados, así como las conciliaciones tributarias, deben estar validadas o modeladas estrictamente para prevenir desviaciones (ej, uso de tipos decimales correctos al multiplicar montos o validar ZOD las cantidades del cliente previas procesar).

## 4. Requerimientos de Plataforma Frontend
- **RNF4.1 - Experiencia Multi-Dispositivo (Móvil First Transaccional):** Mientras que los reportes pueden requerir el amplio espacio web, la *Aplicación para Repartidores* debe asegurar diseño enfocado hacia el uso en ruta, con botones legibles y estados visuales rápidos, incluso tolerante a caídas de señal ocasionales para su posterior sincronización si es necesario.
