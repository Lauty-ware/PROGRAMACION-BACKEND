"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioValidator = void 0;
class UsuarioValidator {
    static validarEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static validarPassword(password) {
        return password.length >= 6;
    }
    static validarCrear(data) {
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
exports.UsuarioValidator = UsuarioValidator;
