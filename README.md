# fullstack-payment-app
Este proyecto integra una pasarela de pagos para que los usuarios puedan realizar compras de productos mediante un flujo de pago completo.
## Tecnologías Utilizadas
- **Frontend**: ReactJS con Redux para la gestión del estado. Diseño responsivo utilizando Flexbox y Material-UI.
- **Backend**: Nest.js con arquitectura Hexagonal (Ports & Adapters), base de datos PostgreSQL.
- **Pruebas**: Jest para cobertura de más del 80% en frontend y backend.
- **Despliegue**: AWS (S3, Lambda, RDS, CloudFront) para frontend y backend.

## Funcionalidades Clave
1. **Visualización de Productos**:
   - Muestra el inventario disponible con nombre, descripción, precio y unidades en stock.
2. **Checkout de Pagos**:
   - Modal para ingreso de datos de tarjeta de crédito y dirección de envío.
   - Validación de datos de tarjeta (fake) con detección de logos (Visa/MasterCard).
3. **Procesamiento de Pagos**:
   - Transacciones creadas en estado "PENDING" y actualizadas con el resultado del pago.
4. **Actualización de Stock**:
   - Reducción del inventario tras la compra exitosa.
5. **Diseño Responsivo**:
   - Optimizado para dispositivos móviles (resolución mínima: iPhone SE 2020).

## Propósito
El objetivo de este proyecto es demostrar habilidades en:
- Desarrollo de APIs RESTful con buenas prácticas.
- Implementación de interfaces de usuario dinámicas y adaptables.
- Manejo de estado global con Redux.
- Pruebas unitarias y cobertura alta del código.
- Uso de servicios en la nube para el despliegue de aplicaciones.

## Instrucciones de Configuración y Ejecución
Para detalles sobre cómo ejecutar este proyecto, consulta la sección [README.md](./README.md) en las carpetas `/frontend` y `/backend`.
