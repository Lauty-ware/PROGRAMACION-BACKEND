"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProyectoService = void 0;
const proyecto_repository_1 = require("../repositories/proyecto.repository");
const usuario_repository_1 = require("../repositories/usuario.repository");
const proyecto_1 = require("../entities/proyecto");
const app_error_1 = require("../errors/app-error");
class ProyectoService {
    constructor() {
        this.repository = new proyecto_repository_1.ProyectoRepository();
        this.usuarioRepository = new usuario_repository_1.UsuarioRepository();
    }
    async obtenerTodos() {
        return this.repository.findAll();
    }
    async obtenerPorId(id) {
        const proyecto = await this.repository.findById(id);
        if (!proyecto) {
            throw new app_error_1.NotFoundError(`Proyecto con ID ${id} no encontrado`);
        }
        return proyecto;
    }
    async obtenerPorUsuario(usuarioId) {
        const usuario = await this.usuarioRepository.findById(usuarioId);
        if (!usuario) {
            throw new app_error_1.NotFoundError(`Usuario con ID ${usuarioId} no encontrado`);
        }
        return this.repository.findByUsuario(usuarioId);
    }
    async crear(data) {
        try {
            proyecto_1.ProyectoValidator.validarCrear(data);
            // Verificar que el usuario existe si se especifica
            if (data.usuarioId) {
                const usuario = await this.usuarioRepository.findById(data.usuarioId);
                if (!usuario) {
                    throw new app_error_1.ValidationError(`Usuario con ID ${data.usuarioId} no encontrado`);
                }
            }
            return this.repository.create(data);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new app_error_1.ValidationError(error.message);
            }
            throw error;
        }
    }
    async actualizar(id, data) {
        const proyectoExistente = await this.repository.findById(id);
        if (!proyectoExistente) {
            throw new app_error_1.NotFoundError(`Proyecto con ID ${id} no encontrado`);
        }
        // Verificar que el usuario existe si se está actualizando
        if (data.usuarioId) {
            const usuario = await this.usuarioRepository.findById(data.usuarioId);
            if (!usuario) {
                throw new app_error_1.ValidationError(`Usuario con ID ${data.usuarioId} no encontrado`);
            }
        }
        // Validar fechas si se proporcionan
        if (data.fechaInicio && data.fechaFin && new Date(data.fechaInicio) > new Date(data.fechaFin)) {
            throw new app_error_1.ValidationError('La fecha de inicio no puede ser posterior a la fecha de fin');
        }
        const proyectoActualizado = await this.repository.update(id, data);
        if (!proyectoActualizado) {
            throw new app_error_1.NotFoundError(`Proyecto con ID ${id} no encontrado`);
        }
        return proyectoActualizado;
    }
    async eliminar(id) {
        const proyecto = await this.repository.findById(id);
        if (!proyecto) {
            throw new app_error_1.NotFoundError(`Proyecto con ID ${id} no encontrado`);
        }
        const eliminado = await this.repository.delete(id);
        if (!eliminado) {
            throw new app_error_1.NotFoundError(`Proyecto con ID ${id} no encontrado`);
        }
    }
    async contarProyectosDeUsuario(usuarioId) {
        const usuario = await this.usuarioRepository.findById(usuarioId);
        if (!usuario) {
            throw new app_error_1.NotFoundError(`Usuario con ID ${usuarioId} no encontrado`);
        }
        return this.repository.countByUsuario(usuarioId);
    }
}
exports.ProyectoService = ProyectoService;
