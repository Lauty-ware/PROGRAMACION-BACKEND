import { Request, Response, NextFunction } from 'express';

export const obtenerTodasLasTareas = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: [], count: 0 });
  } catch (error) {
    next(error);
  }
};

export const obtenerTareaPorId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    next(error);
  }
};

export const crearTarea = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(201).json({ success: true, data: req.body, message: 'Tarea creada exitosamente' });
  } catch (error) {
    next(error);
  }
};

export const actualizarTarea = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id, ...req.body } });
  } catch (error) {
    next(error);
  }
};

export const eliminarTarea = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, message: 'Tarea eliminada', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

export const marcarComoCompletada = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: { id: req.params.id, completada: true } });
  } catch (error) {
    next(error);
  }
};

export const obtenerTareasPorCategoria = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: [], categoria: req.params.categoria });
  } catch (error) {
    next(error);
  }
};

export const obtenerTareasPorPrioridad = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: [], prioridad: req.params.prioridad });
  } catch (error) {
    next(error);
  }
};

export const obtenerTareasPorEstado = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: [], estado: req.params.estado });
  } catch (error) {
    next(error);
  }
};

export const obtenerTareasPorProyecto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: [], proyectoId: req.params.proyectoId });
  } catch (error) {
    next(error);
  }
};

export const obtenerTareasPorUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: [], usuarioId: req.params.usuarioId });
  } catch (error) {
    next(error);
  }
};
