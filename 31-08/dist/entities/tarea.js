"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TareaValidator = void 0;
class TareaValidator {
    static validarCrearTarea(data) {
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
exports.TareaValidator = TareaValidator;
