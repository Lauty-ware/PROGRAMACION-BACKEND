export interface Tarea {
  id: string;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: 'baja' | 'media' | 'alta';
  categoria?: string;
  fechaVencimiento?: Date;
  proyectoId?: string;
  usuarioId?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface CrearTareaDTO {
  titulo: string;
  descripcion?: string;
  prioridad?: 'baja' | 'media' | 'alta';
  categoria?: string;
  fechaVencimiento?: Date;
  proyectoId?: string;
  usuarioId?: string;
}

export interface ActualizarTareaDTO {
  titulo?: string;
  descripcion?: string;
  completada?: boolean;
  prioridad?: 'baja' | 'media' | 'alta';
  categoria?: string;
  fechaVencimiento?: Date;
  proyectoId?: string;
  usuarioId?: string;
}

export class TareaValidator {
  static validarCrearTarea(data: CrearTareaDTO): void {
    if (!data.titulo || data.titulo.trim().length === 0) {
      throw new Error('El título es requerido');
    }
    if (data.titulo.length > 100) {
      throw new Error('El título no puede tener más de 100 caracteres');
    }
    if (data.descripcion && data.descripcion.length > 500) {
      throw new Error('La descripción no puede tener más de 500 caracteres');
    }
    if (data.prioridad && !['baja', 'media', 'alta'].includes(data.prioridad)) {
      throw new Error('Prioridad inválida. Debe ser: baja, media o alta');
    }
    if (data.fechaVencimiento && new Date(data.fechaVencimiento) < new Date()) {
      throw new Error('La fecha de vencimiento no puede ser en el pasado');
    }
  }
}