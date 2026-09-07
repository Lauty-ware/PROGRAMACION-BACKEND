export interface Proyecto {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: 'activo' | 'pausado' | 'completado' | 'cancelado';
  fechaInicio?: Date;
  fechaFin?: Date;
  usuarioId?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface CrearProyectoDTO {
  nombre: string;
  descripcion?: string;
  estado?: 'activo' | 'pausado' | 'completado' | 'cancelado';
  fechaInicio?: Date;
  fechaFin?: Date;
  usuarioId?: string;
}

export interface ActualizarProyectoDTO {
  nombre?: string;
  descripcion?: string;
  estado?: 'activo' | 'pausado' | 'completado' | 'cancelado';
  fechaInicio?: Date;
  fechaFin?: Date;
  usuarioId?: string;
}

export class ProyectoValidator {
  static validarCrear(data: CrearProyectoDTO): void {
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre del proyecto es requerido');
    }
    if (data.nombre.length > 100) {
      throw new Error('El nombre no puede tener más de 100 caracteres');
    }
    if (data.fechaInicio && data.fechaFin && new Date(data.fechaInicio) > new Date(data.fechaFin)) {
      throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin');
    }
  }
}