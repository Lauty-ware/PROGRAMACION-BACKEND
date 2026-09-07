import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from 'path';
import fs from 'fs';

let db: Database | null = null;

export const getDatabase = async (): Promise<Database> => {
  if (db) {
    return db;
  }

  const dbPath = path.resolve(__dirname, '../../database.sqlite');
  
  // Asegurar que el directorio existe
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Habilitar claves foráneas
  await db.exec('PRAGMA foreign_keys = ON');
  
  // Crear tablas si no existen
  await initializeDatabase(db);

  return db;
};

const initializeDatabase = async (db: Database): Promise<void> => {
  // Tabla de usuarios
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      rol TEXT DEFAULT 'usuario',
      activo INTEGER DEFAULT 1,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de proyectos
  await db.exec(`
    CREATE TABLE IF NOT EXISTS proyectos (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      estado TEXT DEFAULT 'activo',
      fecha_inicio DATETIME,
      fecha_fin DATETIME,
      usuario_id TEXT,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
    )
  `);

  // Tabla de tareas (actualizada)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tareas (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      completada INTEGER DEFAULT 0,
      prioridad TEXT DEFAULT 'media',
      categoria TEXT,
      fecha_vencimiento DATETIME,
      proyecto_id TEXT,
      usuario_id TEXT,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE SET NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
    )
  `);

  // Índices para mejorar rendimiento
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_tareas_proyecto ON tareas(proyecto_id);
    CREATE INDEX IF NOT EXISTS idx_tareas_usuario ON tareas(usuario_id);
    CREATE INDEX IF NOT EXISTS idx_proyectos_usuario ON proyectos(usuario_id);
    CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
  `);
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.close();
    db = null;
  }
};