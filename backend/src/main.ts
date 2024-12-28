// backend/src/main.ts

// Importamos el módulo principal de la aplicación y otras utilidades necesarias
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Creamos una instancia de la aplicación a partir del módulo principal
  const app = await NestFactory.create(AppModule);

  // Configuración global de validación para las rutas
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no deseadas del objeto recibido
    forbidNonWhitelisted: true, // Lanza error si hay propiedades adicionales
    transform: true, // Convierte los valores al tipo esperado
  }));

  // Definimos el puerto en el que correrá la aplicación
  const port = process.env.PORT || 3000;

  // Arrancamos la aplicación
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
