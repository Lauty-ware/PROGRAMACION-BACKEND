import { Router } from 'express';
import * as UsuarioController from '../controllers/usuario.controller';

const router = Router();

router.get('/', UsuarioController.obtenerTodosLosUsuarios);
router.get('/:id', UsuarioController.obtenerUsuarioPorId);
router.post('/', UsuarioController.crearUsuario);
router.put('/:id', UsuarioController.actualizarUsuario);
router.delete('/:id', UsuarioController.eliminarUsuario);
router.delete('/:id/permanente', UsuarioController.eliminarUsuarioPermanente);

export default router;