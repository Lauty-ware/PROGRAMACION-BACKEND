"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const usuario_repository_1 = require("../repositories/usuario.repository");
const usuario_1 = require("../entities/usuario");
const app_error_1 = require("../errors/app-error");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UsuarioService {
    constructor() {
        this.repository = new usuario_repository_1.UsuarioRepository();
    }
    async obtenerTodos() {
        return this.repository.findAll();
    }
    async obtenerPorId(id) {
        const usuario = await this.repository.findById(id);
        if (!usuario) {
            throw new app_error_1.NotFoundError(`Usuario con ID ${id} no encontrado`);
        }
        // No enviar contraseña en la respuesta
        const { password, ...usuarioSinPassword } = usuario;
        return usuarioSinPassword;
    }
    async obtenerPorEmail(email) {
        return this.repository.findByEmail(email);
    }
    async crear(data) {
        usuario_1.UsuarioValidator.validarCrear(data);
        // Verificar si el email ya existe
        const existe = await this.repository.existsByEmail(data.email);
        if (existe) {
            throw new app_error_1.ConflictError('El email ya está registrado');
        }
        // Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(data.password, saltRounds);
        const usuarioData = {
            ...data,
            password: hashedPassword
        };
        const usuario = await this.repository.create(usuarioData);
        const { password, ...usuarioSinPassword } = usuario;
        return usuarioSinPassword;
    }
    async actualizar(id, data) {
        const usuarioExistente = await this.repository.findById(id);
        if (!usuarioExistente) {
            throw new app_error_1.NotFoundError(`Usuario con ID ${id} no encontrado`);
        }
        // Verificar email único si se está actualizando
        if (data.email) {
            if (!usuario_1.UsuarioValidator.validarEmail(data.email)) {
                throw new app_error_1.ValidationError('Email inválido');
            }
            const existe = await this.repository.existsByEmail(data.email, id);
            if (existe) {
                throw new app_error_1.ConflictError('El email ya está registrado por otro usuario');
            }
        }
        // Hash de la contraseña si se está actualizando
        if (data.password) {
            if (!usuario_1.UsuarioValidator.validarPassword(data.password)) {
                throw new app_error_1.ValidationError('La contraseña debe tener al menos 6 caracteres');
            }
            const saltRounds = 10;
            data.password = await bcrypt_1.default.hash(data.password, saltRounds);
        }
        const usuarioActualizado = await this.repository.update(id, data);
        if (!usuarioActualizado) {
            throw new app_error_1.NotFoundError(`Usuario con ID ${id} no encontrado`);
        }
        const { password, ...usuarioSinPassword } = usuarioActualizado;
        return usuarioSinPassword;
    }
    async eliminar(id) {
        const usuario = await this.repository.findById(id);
        if (!usuario) {
            throw new app_error_1.NotFoundError(`Usuario con ID ${id} no encontrado`);
        }
        // Desactivar usuario en lugar de eliminar
        await this.repository.update(id, { activo: false });
    }
    async eliminarPermanente(id) {
        const usuario = await this.repository.findById(id);
        if (!usuario) {
            throw new app_error_1.NotFoundError(`Usuario con ID ${id} no encontrado`);
        }
        const eliminado = await this.repository.delete(id);
        if (!eliminado) {
            throw new app_error_1.NotFoundError(`Usuario con ID ${id} no encontrado`);
        }
    }
}
exports.UsuarioService = UsuarioService;
