"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerTareasPorUsuario = exports.obtenerTareasPorProyecto = exports.obtenerTareasPorEstado = exports.obtenerTareasPorPrioridad = exports.obtenerTareasPorCategoria = exports.marcarComoCompletada = exports.eliminarTarea = exports.actualizarTarea = exports.crearTarea = exports.obtenerTareaPorId = exports.obtenerTodasLasTareas = void 0;
const obtenerTodasLasTareas = async (_req, res, next) => {
    try {
        res.status(200).json({ success: true, data: [], count: 0 });
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerTodasLasTareas = obtenerTodasLasTareas;
const obtenerTareaPorId = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, data: { id: req.params.id } });
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerTareaPorId = obtenerTareaPorId;
const crearTarea = async (req, res, next) => {
    try {
        res.status(201).json({ success: true, data: req.body, message: 'Tarea creada exitosamente' });
    }
    catch (error) {
        next(error);
    }
};
exports.crearTarea = crearTarea;
const actualizarTarea = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, data: { id: req.params.id, ...req.body } });
    }
    catch (error) {
        next(error);
    }
};
exports.actualizarTarea = actualizarTarea;
const eliminarTarea = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, message: 'Tarea eliminada', id: req.params.id });
    }
    catch (error) {
        next(error);
    }
};
exports.eliminarTarea = eliminarTarea;
const marcarComoCompletada = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, data: { id: req.params.id, completada: true } });
    }
    catch (error) {
        next(error);
    }
};
exports.marcarComoCompletada = marcarComoCompletada;
const obtenerTareasPorCategoria = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, data: [], categoria: req.params.categoria });
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerTareasPorCategoria = obtenerTareasPorCategoria;
const obtenerTareasPorPrioridad = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, data: [], prioridad: req.params.prioridad });
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerTareasPorPrioridad = obtenerTareasPorPrioridad;
const obtenerTareasPorEstado = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, data: [], estado: req.params.estado });
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerTareasPorEstado = obtenerTareasPorEstado;
const obtenerTareasPorProyecto = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, data: [], proyectoId: req.params.proyectoId });
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerTareasPorProyecto = obtenerTareasPorProyecto;
const obtenerTareasPorUsuario = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, data: [], usuarioId: req.params.usuarioId });
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerTareasPorUsuario = obtenerTareasPorUsuario;
