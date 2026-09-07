"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    res.status(500).json({
        ok: false,
        message: 'Error interno del servidor',
        error: err.message,
    });
};
exports.errorHandler = errorHandler;
