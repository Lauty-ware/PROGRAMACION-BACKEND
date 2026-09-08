"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProyectoRepository = void 0;
const database_1 = require("../config/database");
const uuid_1 = require("uuid");
class ProyectoRepository {
    constructor() {
        this.db = null;
    }
    async getDb() {
        if (!this.db) {
            this.db = await (0, database_1.getDatabase)();
        }
        return this.db;
    }
    mapToProyecto(row) {
        return {
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            estado: row.estado,
            fechaInicio: row.fecha_inicio ? new Date(row.fecha_inicio) : undefined,
            fechaFin: row.fecha_fin ? new Date(row.fecha_fin) : undefined,
            usuarioId: row.usuario_id,
            fechaCreacion: new Date(row.fecha_creacion),
            fechaActualizacion: new Date(row.fecha_actualizacion)
        };
    }
    async findAll() {
        const db = await this.getDb();
        const rows = await db.all('SELECT * FROM proyectos ORDER BY fecha_creacion DESC');
        return rows.map(row => this.mapToProyecto(row));
    }
    async findById(id) {
        const db = await this.getDb();
        const row = await db.get('SELECT * FROM proyectos WHERE id = ?', id);
        return row ? this.mapToProyecto(row) : null;
    }
    async findByUsuario(usuarioId) {
        const db = await this.getDb();
        const rows = await db.all('SELECT * FROM proyectos WHERE usuario_id = ? ORDER BY fecha_creacion DESC', usuarioId);
        return rows.map(row => this.mapToProyecto(row));
    }
    async create(data) {
        const db = await this.getDb();
        const id = (0, uuid_1.v4)();
        const ahora = new Date().toISOString();
        await db.run(`INSERT INTO proyectos (id, nombre, descripcion, estado, fecha_inicio, fecha_fin, usuario_id, fecha_creacion, fecha_actualizacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, id, data.nombre.trim(), data.descripcion?.trim() || null, data.estado || 'activo', data.fechaInicio ? data.fechaInicio.toISOString() : null, data.fechaFin ? data.fechaFin.toISOString() : null, data.usuarioId || null, ahora, ahora);
        const proyecto = await this.findById(id);
        return proyecto;
    }
    async update(id, data) {
        const db = await this.getDb();
        const updates = [];
        const values = [];
        if (data.nombre !== undefined) {
            updates.push('nombre = ?');
            values.push(data.nombre.trim());
        }
        if (data.descripcion !== undefined) {
            updates.push('descripcion = ?');
            values.push(data.descripcion?.trim() || null);
        }
        if (data.estado !== undefined) {
            updates.push('estado = ?');
            values.push(data.estado);
        }
        if (data.fechaInicio !== undefined) {
            updates.push('fecha_inicio = ?');
            values.push(data.fechaInicio ? data.fechaInicio.toISOString() : null);
        }
        if (data.fechaFin !== undefined) {
            updates.push('fecha_fin = ?');
            values.push(data.fechaFin ? data.fechaFin.toISOString() : null);
        }
        if (data.usuarioId !== undefined) {
            updates.push('usuario_id = ?');
            values.push(data.usuarioId || null);
        }
        if (updates.length === 0) {
            return this.findById(id);
        }
        updates.push('fecha_actualizacion = ?');
        values.push(new Date().toISOString());
        values.push(id);
        await db.run(`UPDATE proyectos SET ${updates.join(', ')} WHERE id = ?`, ...values);
        return this.findById(id);
    }
    async delete(id) {
        const db = await this.getDb();
        const result = await db.run('DELETE FROM proyectos WHERE id = ?', id);
        return result.changes ? result.changes > 0 : false;
    }
    async countByUsuario(usuarioId) {
        const db = await this.getDb();
        const result = await db.get('SELECT COUNT(*) as count FROM proyectos WHERE usuario_id = ?', usuarioId);
        return result.count;
    }
}
exports.ProyectoRepository = ProyectoRepository;
