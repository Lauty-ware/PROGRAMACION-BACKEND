export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: 'admin' | 'usuario' | 'invitado';
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface CrearUsuarioDTO {
  nombre: string;
  email: string;
  password: string;
  rol?: 'admin' | 'usuario' | 'invitado';
}

export interface ActualizarUsuarioDTO {
  nombre?: string;
  email?: string;
  password?: string;
  rol?: 'admin' | 'usuario' | 'invitado';
  activo?: boolean;
}

export class UsuarioValidator {
  static validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validarPassword(password: string): boolean {
    return password.length >= 6;
  }

  static validarCrear(data: CrearUsuarioDTO): void {
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre es requerido');
    }
    if (!data.email || !this.validarEmail(data.email)) {
      throw new Error('Email inválido');
    }
    if (!data.password || !this.validarPassword(data.password)) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
  }
}