import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import tareasRouter from './routes/tareas.routes';
import usuarioRouter from './routes/usuario.routes';
import proyectoRouter from './routes/proyecto.routes';
import { errorHandler } from './middlewares/error-handler';
import { notFoundHandler } from './middlewares/not-found';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private configureRoutes(): void {
    this.app.use('/api/usuarios', usuarioRouter);
    this.app.use('/api/proyectos', proyectoRouter);
    this.app.use('/api/tareas', tareasRouter);
    
    // Ruta de salud
    this.app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'OK', 
        message: 'Servidor funcionando correctamente',
        version: '2.0.0'
      });
    });
  }

  private configureErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
      console.log(`Base de datos SQLite inicializada`);
    });
  }
}