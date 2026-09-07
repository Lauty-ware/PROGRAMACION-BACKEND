import { Database } from 'sqlite';
import { getDatabase } from '../config/database';
import { Usuario, CrearUsuarioDTO, ActualizarUsuarioDTO } from '../entities/usuario';
import { v4 as uuidv4 } from 'uuid';

export class UsuarioRepository {
  private db: Database | null = null;

  private async getDb(): Promise<Database> {
    if (!this.db) {
      this.db = await getDatabase();
    }
    return this.db;
  }

  private mapToUsuario(row: any): Usuario {
    return {
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      password: row.password,
      rol: row.rol,
      activo: row.activo === 1,
      fechaCreacion: new Date(row.fecha_creacion),
      fechaActualizacion: new Date(row.fecha_actualizacion)
    };
  }

  async findAll(): Promise<Usuario[]> {
    const db = await this.getDb();
    const rows = await db.all('SELECT * FROM usuarios ORDER BY fecha_creacion DESC');
    return rows.map(row => this.mapToUsuario(row));
  }

  async findById(id: string): Promise<Usuario | null> {
    const db = await this.getDb();
    const row = await db.get('SELECT * FROM usuarios WHERE id = ?', id);
    return row ? this.mapToUsuario(row) : null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const db = await this.getDb();
    const row = await db.get('SELECT * FROM usuarios WHERE email = ?', email);
    return row ? this.mapToUsuario(row) : null;
  }

  async create(data: CrearUsuarioDTO): Promise<Usuario> {
    const db = await this.getDb();
    const id = uuidv4();
    const ahora = new Date().toISOString();

    await db.run(
      `INSERT INTO usuarios (id, nombre, email, password, rol, fecha_creacion, fecha_actualizacion)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      id,
      data.nombre.trim(),
      data.email.trim().toLowerCase(),
      data.password,
      data.rol || 'usuario',
      ahora,
      ahora
    );

    const usuario = await this.findById(id);
    return usuario!;
  }

  async update(id: string, data: ActualizarUsuarioDTO): Promise<Usuario | null> {
    const db = await this.getDb();
    const updates: string[] = [];
    const values: any[] = [];

    if (data.nombre !== undefined) {
      updates.push('nombre = ?');
      values.push(data.nombre.trim());
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email.trim().toLowerCase());
    }
    if (data.password !== undefined) {
      updates.push('password = ?');
      values.push(data.password);
    }
    if (data.rol !== undefined) {
      updates.push('rol = ?');
      values.push(data.rol);
    }
    if (data.activo !== undefined) {
      updates.push('activo = ?');
      values.push(data.activo ? 1 : 0);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('fecha_actualizacion = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await db.run(
      `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`,
      ...values
    );

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.getDb();
    const result = await db.run('DELETE FROM usuarios WHERE id = ?', id);
    return result.changes ? result.changes > 0 : false;
  }

  async existsByEmail(email: string, excludeId?: string): Promise<boolean> {
    const db = await this.getDb();
    let query = 'SELECT COUNT(*) as count FROM usuarios WHERE email = ?';
    const params: any[] = [email.trim().toLowerCase()];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const result = await db.get(query, ...params);
    return result.count > 0;
  }
}