import { Router } from 'express';
import * as TareasController from '../controllers/tareas.controller';

const router = Router();

// Rutas CRUD para tareas
router.get('/', TareasController.obtenerTodasLasTareas);
router.get('/:id', TareasController.obtenerTareaPorId);
router.post('/', TareasController.crearTarea);
router.put('/:id', TareasController.actualizarTarea);
router.delete('/:id', TareasController.eliminarTarea);
router.patch('/:id/completar', TareasController.marcarComoCompletada);

// Rutas adicionales
router.get('/categoria/:categoria', TareasController.obtenerTareasPorCategoria);
router.get('/prioridad/:prioridad', TareasController.obtenerTareasPorPrioridad);
router.get('/estado/:estado', TareasController.obtenerTareasPorEstado);
router.get('/proyecto/:proyectoId', TareasController.obtenerTareasPorProyecto);
router.get('/usuario/:usuarioId', TareasController.obtenerTareasPorUsuario);

export default router;