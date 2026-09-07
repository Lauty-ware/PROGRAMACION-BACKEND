import { Router } from 'express';
import * as ProyectoController from '../controllers/proyecto.controller';

const router = Router();

router.get('/', ProyectoController.obtenerTodosLosProyectos);
router.get('/:id', ProyectoController.obtenerProyectoPorId);
router.get('/usuario/:usuarioId', ProyectoController.obtenerProyectosPorUsuario);
router.get('/usuario/:usuarioId/count', ProyectoController.contarProyectosDeUsuario);
router.post('/', ProyectoController.crearProyecto);
router.put('/:id', ProyectoController.actualizarProyecto);
router.delete('/:id', ProyectoController.eliminarProyecto);

export default router;