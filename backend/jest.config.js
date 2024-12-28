
module.exports = {
    preset: 'ts-jest', // Usa ts-jest para soportar TypeScript
    testEnvironment: 'node', // Define el entorno de ejecución como Node.js
    moduleFileExtensions: ['ts', 'js', 'json'], // Extensiones de archivo soportadas
    rootDir: '.', // Carpeta raíz del proyecto
    testRegex: '.*\\.spec\\.ts$', // Coincide con archivos que terminan en .spec.ts
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest', // Usa ts-jest para transformar archivos TypeScript y JavaScript
    },
  };
  