"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_service_1 = require("../../services/usuario.service");
const usuario_repository_1 = require("../../repositories/usuario.repository");
const app_error_1 = require("../../errors/app-error");
// Mock del repository
jest.mock('../../repositories/usuario.repository');
describe('UsuarioService', () => {
    let usuarioService;
    let mockRepository;
    const mockUsuario = {
        id: '1',
        nombre: 'Juan Pérez',
        email: 'juan@test.com',
        password: 'hashedpassword123',
        rol: 'usuario',
        activo: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
    };
    beforeEach(() => {
        mockRepository = new usuario_repository_1.UsuarioRepository();
        usuarioService = new usuario_service_1.UsuarioService();
        // Reemplazar el repository con el mock
        usuarioService.repository = mockRepository;
    });
    describe('obtenerPorId', () => {
        it('debe retornar un usuario cuando existe', async () => {
            mockRepository.findById.mockResolvedValue(mockUsuario);
            const result = await usuarioService.obtenerPorId('1');
            expect(result).toBeDefined();
            expect(result.id).toBe('1');
            expect(result.nombre).toBe('Juan Pérez');
            // Verificar que la contraseña no está en la respuesta
            expect(result.password).toBeUndefined();
        });
        it('debe lanzar NotFoundError cuando el usuario no existe', async () => {
            mockRepository.findById.mockResolvedValue(null);
            await expect(usuarioService.obtenerPorId('999')).rejects.toThrow(app_error_1.NotFoundError);
        });
    });
    describe('crear', () => {
        const crearUsuarioData = {
            nombre: 'María García',
            email: 'maria@test.com',
            password: 'password123'
        };
        it('debe crear un usuario exitosamente', async () => {
            mockRepository.existsByEmail.mockResolvedValue(false);
            mockRepository.create.mockResolvedValue({
                ...mockUsuario,
                id: '2',
                nombre: 'María García',
                email: 'maria@test.com'
            });
            const result = await usuarioService.crear(crearUsuarioData);
            expect(result).toBeDefined();
            expect(result.nombre).toBe('María García');
            expect(result.email).toBe('maria@test.com');
            expect(result.password).toBeUndefined();
        });
        it('debe lanzar ConflictError cuando el email ya existe', async () => {
            mockRepository.existsByEmail.mockResolvedValue(true);
            await expect(usuarioService.crear(crearUsuarioData)).rejects.toThrow(app_error_1.ConflictError);
        });
        it('debe lanzar ValidationError cuando los datos son inválidos', async () => {
            const invalidData = {
                nombre: '',
                email: 'email-invalido',
                password: '123'
            };
            await expect(usuarioService.crear(invalidData)).rejects.toThrow(app_error_1.ValidationError);
        });
    });
    describe('actualizar', () => {
        it('debe actualizar un usuario exitosamente', async () => {
            const updateData = {
                nombre: 'Juan Pérez Actualizado'
            };
            mockRepository.findById.mockResolvedValue(mockUsuario);
            mockRepository.update.mockResolvedValue({
                ...mockUsuario,
                nombre: 'Juan Pérez Actualizado'
            });
            const result = await usuarioService.actualizar('1', updateData);
            expect(result.nombre).toBe('Juan Pérez Actualizado');
        });
        it('debe lanzar NotFoundError cuando el usuario no existe', async () => {
            mockRepository.findById.mockResolvedValue(null);
            await expect(usuarioService.actualizar('999', { nombre: 'Test' })).rejects.toThrow(app_error_1.NotFoundError);
        });
    });
    describe('eliminar', () => {
        it('debe desactivar un usuario exitosamente', async () => {
            mockRepository.findById.mockResolvedValue(mockUsuario);
            mockRepository.update.mockResolvedValue({
                ...mockUsuario,
                activo: false
            });
            await expect(usuarioService.eliminar('1')).resolves.not.toThrow();
            expect(mockRepository.update).toHaveBeenCalledWith('1', { activo: false });
        });
        it('debe lanzar NotFoundError cuando el usuario no existe', async () => {
            mockRepository.findById.mockResolvedValue(null);
            await expect(usuarioService.eliminar('999')).rejects.toThrow(app_error_1.NotFoundError);
        });
    });
});
