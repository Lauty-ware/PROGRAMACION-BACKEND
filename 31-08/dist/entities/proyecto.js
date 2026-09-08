"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProyectoValidator = void 0;
class ProyectoValidator {
    static validarCrear(data) {
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
exports.ProyectoValidator = ProyectoValidator;
