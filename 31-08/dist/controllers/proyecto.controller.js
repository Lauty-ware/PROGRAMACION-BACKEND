"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contarProyectosDeUsuario = exports.eliminarProyecto = exports.actualizarProyecto = exports.crearProyecto = exports.obtenerProyectosPorUsuario = exports.obtenerProyectoPorId = exports.obtenerTodosLosProyectos = void 0;
const proyecto_service_1 = require("../services/proyecto.service");
const proyectoService = new proyecto_service_1.ProyectoService();
const obtenerTodosLosProyectos = async (req, res, next) => {
    try {
        const proyectos = await proyectoService.obtenerTodos();
        res.status(200).json({
            success: true,
            data: proyectos,
            count: proyectos.length
        });
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerTodosLosProyectos = obtenerTodosLosProyectos;
const obtenerProyectoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const proyecto = await proyectoService.obtenerPorId(id);
        res.status(200).json({
            success: true,
            data: proyecto
        });
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerProyectoPorId = obtenerProyectoPorId;
const obtenerProyectosPorUsuario = async (req, res, next) => {
    try {
        const { usuarioId } = req.params;
        const proyectos = await proyectoService.obtenerPorUsuario(usuarioId);
        res.status(200).json({
            success: true,
            data: proyectos,
            count: proyectos.length
        });
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerProyectosPorUsuario = obtenerProyectosPorUsuario;
const crearProyecto = async (req, res, next) => {
    try {
        const proyectoData = req.body;
        const nuevoProyecto = await proyectoService.crear(proyectoData);
        res.status(201).json({
            success: true,
            data: nuevoProyecto,
            message: 'Proyecto creado exitosamente'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.crearProyecto = crearProyecto;
const actualizarProyecto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const proyectoData = req.body;
        const proyectoActualizado = await proyectoService.actualizar(id, proyectoData);
        res.status(200).json({
            success: true,
            data: proyectoActualizado,
            message: 'Proyecto actualizado exitosamente'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.actualizarProyecto = actualizarProyecto;
const eliminarProyecto = async (req, res, next) => {
    try {
        const { id } = req.params;
        await proyectoService.eliminar(id);
        res.status(200).json({
            success: true,
            message: 'Proyecto eliminado exitosamente'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.eliminarProyecto = eliminarProyecto;
const contarProyectosDeUsuario = async (req, res, next) => {
    try {
        const { usuarioId } = req.params;
        const count = await proyectoService.contarProyectosDeUsuario(usuarioId);
        res.status(200).json({
            success: true,
            data: { usuarioId, count }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.contarProyectosDeUsuario = contarProyectosDeUsuario;
