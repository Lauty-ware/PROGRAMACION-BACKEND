import { ProyectoRepository } from '../repositories/proyecto.repository';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { Proyecto, CrearProyectoDTO, ActualizarProyectoDTO, ProyectoValidator } from '../entities/proyecto';
import { NotFoundError, ValidationError } from '../errors/app-error';

export class ProyectoService {
  private repository: ProyectoRepository;
  private usuarioRepository: UsuarioRepository;

  constructor() {
    this.repository = new ProyectoRepository();
    this.usuarioRepository = new UsuarioRepository();
  }

  async obtenerTodos(): Promise<Proyecto[]> {
    return this.repository.findAll();
  }

  async obtenerPorId(id: string): Promise<Proyecto> {
    const proyecto = await this.repository.findById(id);
    if (!proyecto) {
      throw new NotFoundError(`Proyecto con ID ${id} no encontrado`);
    }
    return proyecto;
  }

  async obtenerPorUsuario(usuarioId: string): Promise<Proyecto[]> {
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundError(`Usuario con ID ${usuarioId} no encontrado`);
    }
    return this.repository.findByUsuario(usuarioId);
  }

  async crear(data: CrearProyectoDTO): Promise<Proyecto> {
    try {
      ProyectoValidator.validarCrear(data);

      // Verificar que el usuario existe si se especifica
      if (data.usuarioId) {
        const usuario = await this.usuarioRepository.findById(data.usuarioId);
        if (!usuario) {
          throw new ValidationError(`Usuario con ID ${data.usuarioId} no encontrado`);
        }
      }

      return this.repository.create(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  }

  async actualizar(id: string, data: ActualizarProyectoDTO): Promise<Proyecto> {
    const proyectoExistente = await this.repository.findById(id);
    if (!proyectoExistente) {
      throw new NotFoundError(`Proyecto con ID ${id} no encontrado`);
    }

    // Verificar que el usuario existe si se está actualizando
    if (data.usuarioId) {
      const usuario = await this.usuarioRepository.findById(data.usuarioId);
      if (!usuario) {
        throw new ValidationError(`Usuario con ID ${data.usuarioId} no encontrado`);
      }
    }

    // Validar fechas si se proporcionan
    if (data.fechaInicio && data.fechaFin && new Date(data.fechaInicio) > new Date(data.fechaFin)) {
      throw new ValidationError('La fecha de inicio no puede ser posterior a la fecha de fin');
    }

    const proyectoActualizado = await this.repository.update(id, data);
    if (!proyectoActualizado) {
      throw new NotFoundError(`Proyecto con ID ${id} no encontrado`);
    }

    return proyectoActualizado;
  }

  async eliminar(id: string): Promise<void> {
    const proyecto = await this.repository.findById(id);
    if (!proyecto) {
      throw new NotFoundError(`Proyecto con ID ${id} no encontrado`);
    }

    const eliminado = await this.repository.delete(id);
    if (!eliminado) {
      throw new NotFoundError(`Proyecto con ID ${id} no encontrado`);
    }
  }

  async contarProyectosDeUsuario(usuarioId: string): Promise<number> {
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundError(`Usuario con ID ${usuarioId} no encontrado`);
    }
    return this.repository.countByUsuario(usuarioId);
  }
}