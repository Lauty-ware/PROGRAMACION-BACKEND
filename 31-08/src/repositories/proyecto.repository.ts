import { Database } from 'sqlite';
import { getDatabase } from '../config/database';
import { Proyecto, CrearProyectoDTO, ActualizarProyectoDTO } from '../entities/proyecto';
import { v4 as uuidv4 } from 'uuid';

export class ProyectoRepository {
  private db: Database | null = null;

  private async getDb(): Promise<Database> {
    if (!this.db) {
      this.db = await getDatabase();
    }
    return this.db;
  }

  private mapToProyecto(row: any): Proyecto {
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

  async findAll(): Promise<Proyecto[]> {
    const db = await this.getDb();
    const rows = await db.all('SELECT * FROM proyectos ORDER BY fecha_creacion DESC');
    return rows.map(row => this.mapToProyecto(row));
  }

  async findById(id: string): Promise<Proyecto | null> {
    const db = await this.getDb();
    const row = await db.get('SELECT * FROM proyectos WHERE id = ?', id);
    return row ? this.mapToProyecto(row) : null;
  }

  async findByUsuario(usuarioId: string): Promise<Proyecto[]> {
    const db = await this.getDb();
    const rows = await db.all('SELECT * FROM proyectos WHERE usuario_id = ? ORDER BY fecha_creacion DESC', usuarioId);
    return rows.map(row => this.mapToProyecto(row));
  }

  async create(data: CrearProyectoDTO): Promise<Proyecto> {
    const db = await this.getDb();
    const id = uuidv4();
    const ahora = new Date().toISOString();

    await db.run(
      `INSERT INTO proyectos (id, nombre, descripcion, estado, fecha_inicio, fecha_fin, usuario_id, fecha_creacion, fecha_actualizacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      data.nombre.trim(),
      data.descripcion?.trim() || null,
      data.estado || 'activo',
      data.fechaInicio ? data.fechaInicio.toISOString() : null,
      data.fechaFin ? data.fechaFin.toISOString() : null,
      data.usuarioId || null,
      ahora,
      ahora
    );

    const proyecto = await this.findById(id);
    return proyecto!;
  }

  async update(id: string, data: ActualizarProyectoDTO): Promise<Proyecto | null> {
    const db = await this.getDb();
    const updates: string[] = [];
    const values: any[] = [];

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

    await db.run(
      `UPDATE proyectos SET ${updates.join(', ')} WHERE id = ?`,
      ...values
    );

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.getDb();
    const result = await db.run('DELETE FROM proyectos WHERE id = ?', id);
    return result.changes ? result.changes > 0 : false;
  }

  async countByUsuario(usuarioId: string): Promise<number> {
    const db = await this.getDb();
    const result = await db.get(
      'SELECT COUNT(*) as count FROM proyectos WHERE usuario_id = ?',
      usuarioId
    );
    return result.count;
  }
}