"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarUsuarioPermanente = exports.eliminarUsuario = exports.actualizarUsuario = exports.crearUsuario = exports.obtenerUsuarioPorId = exports.obtenerTodosLosUsuarios = void 0;
const usuario_service_1 = require("../services/usuario.service");
const usuarioService = new usuario_service_1.UsuarioService();
const obtenerTodosLosUsuarios = async (req, res, next) => {
    try {
        const usuarios = await usuarioService.obtenerTodos();
        res.status(200).json({
            success: true,
            data: usuarios,
            count: usuarios.length
        });
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerTodosLosUsuarios = obtenerTodosLosUsuarios;
const obtenerUsuarioPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.obtenerPorId(id);
        res.status(200).json({
            success: true,
            data: usuario
        });
    }
    catch (error) {
        next(error);
    }
};
exports.obtenerUsuarioPorId = obtenerUsuarioPorId;
const crearUsuario = async (req, res, next) => {
    try {
        const usuarioData = req.body;
        const nuevoUsuario = await usuarioService.crear(usuarioData);
        res.status(201).json({
            success: true,
            data: nuevoUsuario,
            message: 'Usuario creado exitosamente'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.crearUsuario = crearUsuario;
const actualizarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuarioData = req.body;
        const usuarioActualizado = await usuarioService.actualizar(id, usuarioData);
        res.status(200).json({
            success: true,
            data: usuarioActualizado,
            message: 'Usuario actualizado exitosamente'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.actualizarUsuario = actualizarUsuario;
const eliminarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        await usuarioService.eliminar(id);
        res.status(200).json({
            success: true,
            message: 'Usuario desactivado exitosamente'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.eliminarUsuario = eliminarUsuario;
const eliminarUsuarioPermanente = async (req, res, next) => {
    try {
        const { id } = req.params;
        await usuarioService.eliminarPermanente(id);
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado permanentemente'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.eliminarUsuarioPermanente = eliminarUsuarioPermanente;
