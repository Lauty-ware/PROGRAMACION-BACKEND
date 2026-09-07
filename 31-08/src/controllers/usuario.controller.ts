import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/usuario.service';
import { CrearUsuarioDTO, ActualizarUsuarioDTO } from '../entities/usuario';

const usuarioService = new UsuarioService();

export const obtenerTodosLosUsuarios = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const usuarios = await usuarioService.obtenerTodos();
    res.status(200).json({
      success: true,
      data: usuarios,
      count: usuarios.length
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerUsuarioPorId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const usuario = await usuarioService.obtenerPorId(id);
    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    next(error);
  }
};

export const crearUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const usuarioData: CrearUsuarioDTO = req.body;
    const nuevoUsuario = await usuarioService.crear(usuarioData);
    res.status(201).json({
      success: true,
      data: nuevoUsuario,
      message: 'Usuario creado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const usuarioData: ActualizarUsuarioDTO = req.body;
    const usuarioActualizado = await usuarioService.actualizar(id, usuarioData);
    res.status(200).json({
      success: true,
      data: usuarioActualizado,
      message: 'Usuario actualizado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await usuarioService.eliminar(id);
    res.status(200).json({
      success: true,
      message: 'Usuario desactivado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarUsuarioPermanente = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await usuarioService.eliminarPermanente(id);
    res.status(200).json({
      success: true,
      message: 'Usuario eliminado permanentemente'
    });
  } catch (error) {
    next(error);
  }
};