import { UsuarioRepository } from '../repositories/usuario.repository';
import { Usuario, CrearUsuarioDTO, ActualizarUsuarioDTO, UsuarioValidator } from '../entities/usuario';
import { NotFoundError, ValidationError, ConflictError } from '../errors/app-error';
import bcrypt from 'bcrypt';

export class UsuarioService {
  private repository: UsuarioRepository;

  constructor() {
    this.repository = new UsuarioRepository();
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return this.repository.findAll();
  }

  async obtenerPorId(id: string): Promise<Usuario> {
    const usuario = await this.repository.findById(id);
    if (!usuario) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }
    // No enviar contraseña en la respuesta
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword as Usuario;
  }

  async obtenerPorEmail(email: string): Promise<Usuario | null> {
    return this.repository.findByEmail(email);
  }

  async crear(data: CrearUsuarioDTO): Promise<Usuario> {
    try {
      UsuarioValidator.validarCrear(data);

      // Verificar si el email ya existe
      const existe = await this.repository.existsByEmail(data.email);
      if (existe) {
        throw new ConflictError('El email ya está registrado');
      }

      // Hash de la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      const usuarioData = {
        ...data,
        password: hashedPassword
      };

      const usuario = await this.repository.create(usuarioData);
      const { password, ...usuarioSinPassword } = usuario;
      return usuarioSinPassword as Usuario;
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  }

  async actualizar(id: string, data: ActualizarUsuarioDTO): Promise<Usuario> {
    const usuarioExistente = await this.repository.findById(id);
    if (!usuarioExistente) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }

    // Verificar email único si se está actualizando
    if (data.email) {
      if (!UsuarioValidator.validarEmail(data.email)) {
        throw new ValidationError('Email inválido');
      }
      const existe = await this.repository.existsByEmail(data.email, id);
      if (existe) {
        throw new ConflictError('El email ya está registrado por otro usuario');
      }
    }

    // Hash de la contraseña si se está actualizando
    if (data.password) {
      if (!UsuarioValidator.validarPassword(data.password)) {
        throw new ValidationError('La contraseña debe tener al menos 6 caracteres');
      }
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
    }

    const usuarioActualizado = await this.repository.update(id, data);
    if (!usuarioActualizado) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }

    const { password, ...usuarioSinPassword } = usuarioActualizado;
    return usuarioSinPassword as Usuario;
  }

  async eliminar(id: string): Promise<void> {
    const usuario = await this.repository.findById(id);
    if (!usuario) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }

    // Desactivar usuario en lugar de eliminar
    await this.repository.update(id, { activo: false });
  }

  async eliminarPermanente(id: string): Promise<void> {
    const usuario = await this.repository.findById(id);
    if (!usuario) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }

    const eliminado = await this.repository.delete(id);
    if (!eliminado) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }
  }
}