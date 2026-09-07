import { App } from './app';

const PORT = process.env.PORT || 3000;

const app = new App();
app.start(Number(PORT));

// Manejo de señales para cerrar el servidor correctamente
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...');
  process.exit(0);
});