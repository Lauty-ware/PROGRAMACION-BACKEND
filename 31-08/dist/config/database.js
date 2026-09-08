"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.getDatabase = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let db = null;
const getDatabase = async () => {
    if (db) {
        return db;
    }
    const dbPath = path_1.default.resolve(__dirname, '../../database.sqlite');
    // Asegurar que el directorio existe
    const dbDir = path_1.default.dirname(dbPath);
    if (!fs_1.default.existsSync(dbDir)) {
        fs_1.default.mkdirSync(dbDir, { recursive: true });
    }
    db = await (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database
    });
    // Habilitar claves foráneas
    await db.exec('PRAGMA foreign_keys = ON');
    // Crear tablas si no existen
    await initializeDatabase(db);
    return db;
};
exports.getDatabase = getDatabase;
const initializeDatabase = async (db) => {
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
const closeDatabase = async () => {
    if (db) {
        await db.close();
        db = null;
    }
};
exports.closeDatabase = closeDatabase;
