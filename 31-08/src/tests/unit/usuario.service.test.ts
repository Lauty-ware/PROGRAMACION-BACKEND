import { UsuarioService } from '../../services/usuario.service';
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { NotFoundError, ValidationError, ConflictError } from '../../errors/app-error';

// Mock del repository
jest.mock('../../repositories/usuario.repository');

describe('UsuarioService', () => {
  let usuarioService: UsuarioService;
  let mockRepository: jest.Mocked<UsuarioRepository>;

  const mockUsuario = {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'juan@test.com',
    password: 'hashedpassword123',
    rol: 'usuario' as const,
    activo: true,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  };

  beforeEach(() => {
    mockRepository = new UsuarioRepository() as jest.Mocked<UsuarioRepository>;
    usuarioService = new UsuarioService();
    // Reemplazar el repository con el mock
    (usuarioService as any).repository = mockRepository;
  });

  describe('obtenerPorId', () => {
    it('debe retornar un usuario cuando existe', async () => {
      mockRepository.findById.mockResolvedValue(mockUsuario);

      const result = await usuarioService.obtenerPorId('1');

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(result.nombre).toBe('Juan Pérez');
      // Verificar que la contraseña no está en la respuesta
      expect((result as any).password).toBeUndefined();
    });

    it('debe lanzar NotFoundError cuando el usuario no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(usuarioService.obtenerPorId('999')).rejects.toThrow(NotFoundError);
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
      expect((result as any).password).toBeUndefined();
    });

    it('debe lanzar ConflictError cuando el email ya existe', async () => {
      mockRepository.existsByEmail.mockResolvedValue(true);

      await expect(usuarioService.crear(crearUsuarioData)).rejects.toThrow(ConflictError);
    });

    it('debe lanzar ValidationError cuando los datos son inválidos', async () => {
      const invalidData = {
        nombre: '',
        email: 'email-invalido',
        password: '123'
      };

      await expect(usuarioService.crear(invalidData)).rejects.toThrow(ValidationError);
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

      await expect(usuarioService.actualizar('999', { nombre: 'Test' })).rejects.toThrow(NotFoundError);
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

      await expect(usuarioService.eliminar('999')).rejects.toThrow(NotFoundError);
    });
  });
});