import { Request, Response, NextFunction } from 'express';
import { ProyectoService } from '../services/proyecto.service';
import { CrearProyectoDTO, ActualizarProyectoDTO } from '../entities/proyecto';

const proyectoService = new ProyectoService();

export const obtenerTodosLosProyectos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const proyectos = await proyectoService.obtenerTodos();
    res.status(200).json({
      success: true,
      data: proyectos,
      count: proyectos.length
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerProyectoPorId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const proyecto = await proyectoService.obtenerPorId(id);
    res.status(200).json({
      success: true,
      data: proyecto
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerProyectosPorUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { usuarioId } = req.params;
    const proyectos = await proyectoService.obtenerPorUsuario(usuarioId);
    res.status(200).json({
      success: true,
      data: proyectos,
      count: proyectos.length
    });
  } catch (error) {
    next(error);
  }
};

export const crearProyecto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const proyectoData: CrearProyectoDTO = req.body;
    const nuevoProyecto = await proyectoService.crear(proyectoData);
    res.status(201).json({
      success: true,
      data: nuevoProyecto,
      message: 'Proyecto creado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarProyecto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const proyectoData: ActualizarProyectoDTO = req.body;
    const proyectoActualizado = await proyectoService.actualizar(id, proyectoData);
    res.status(200).json({
      success: true,
      data: proyectoActualizado,
      message: 'Proyecto actualizado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarProyecto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await proyectoService.eliminar(id);
    res.status(200).json({
      success: true,
      message: 'Proyecto eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export const contarProyectosDeUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { usuarioId } = req.params;
    const count = await proyectoService.contarProyectosDeUsuario(usuarioId);
    res.status(200).json({
      success: true,
      data: { usuarioId, count }
    });
  } catch (error) {
    next(error);
  }
};