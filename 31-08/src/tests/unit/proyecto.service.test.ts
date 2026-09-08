import { ProyectoService } from '../../services/proyecto.service';
import { ProyectoRepository } from '../../repositories/proyecto.repository';
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { NotFoundError, ValidationError } from '../../errors/app-error';

jest.mock('../../repositories/proyecto.repository');
jest.mock('../../repositories/usuario.repository');

describe('ProyectoService', () => {
  let proyectoService: ProyectoService;
  let mockRepository: jest.Mocked<ProyectoRepository>;
  let mockUsuarioRepository: jest.Mocked<UsuarioRepository>;

  const mockProyecto = {
    id: '1',
    nombre: 'Proyecto Test',
    descripcion: 'Descripción del proyecto',
    estado: 'activo' as const,
    fechaInicio: new Date(),
    fechaFin: new Date(),
    usuarioId: '1',
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  };

  const mockUsuario = {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'juan@test.com',
    password: 'hashedpassword',
    rol: 'usuario' as const,
    activo: true,
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  };

  beforeEach(() => {
    mockRepository = new ProyectoRepository() as jest.Mocked<ProyectoRepository>;
    mockUsuarioRepository = new UsuarioRepository() as jest.Mocked<UsuarioRepository>;
    proyectoService = new ProyectoService();
    (proyectoService as any).repository = mockRepository;
    (proyectoService as any).usuarioRepository = mockUsuarioRepository;
  });

  describe('obtenerPorId', () => {
    it('debe retornar un proyecto cuando existe', async () => {
      mockRepository.findById.mockResolvedValue(mockProyecto);

      const result = await proyectoService.obtenerPorId('1');

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(result.nombre).toBe('Proyecto Test');
    });

    it('debe lanzar NotFoundError cuando el proyecto no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(proyectoService.obtenerPorId('999')).rejects.toThrow(NotFoundError);
    });
  });

  describe('crear', () => {
    const crearProyectoData = {
      nombre: 'Nuevo Proyecto',
      descripcion: 'Descripción del nuevo proyecto',
      usuarioId: '1'
    };

    it('debe crear un proyecto exitosamente', async () => {
      mockUsuarioRepository.findById.mockResolvedValue(mockUsuario);
      mockRepository.create.mockResolvedValue({
        ...mockProyecto,
        id: '2',
        nombre: 'Nuevo Proyecto'
      });

      const result = await proyectoService.crear(crearProyectoData);

      expect(result).toBeDefined();
      expect(result.nombre).toBe('Nuevo Proyecto');
    });

    it('debe lanzar ValidationError cuando el usuario no existe', async () => {
      mockUsuarioRepository.findById.mockResolvedValue(null);

      await expect(proyectoService.crear(crearProyectoData)).rejects.toThrow(ValidationError);
    });

    it('debe lanzar ValidationError cuando los datos son inválidos', async () => {
      const invalidData = {
        nombre: ''
      };

      await expect(proyectoService.crear(invalidData)).rejects.toThrow(ValidationError);
    });
  });

  describe('actualizar', () => {
    it('debe actualizar un proyecto exitosamente', async () => {
      const updateData = {
        nombre: 'Proyecto Actualizado'
      };

      mockRepository.findById.mockResolvedValue(mockProyecto);
      mockRepository.update.mockResolvedValue({
        ...mockProyecto,
        nombre: 'Proyecto Actualizado'
      });

      const result = await proyectoService.actualizar('1', updateData);

      expect(result.nombre).toBe('Proyecto Actualizado');
    });

    it('debe lanzar NotFoundError cuando el proyecto no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(proyectoService.actualizar('999', { nombre: 'Test' })).rejects.toThrow(NotFoundError);
    });

    it('debe lanzar ValidationError cuando las fechas son inválidas', async () => {
      mockRepository.findById.mockResolvedValue(mockProyecto);

      const invalidData = {
        fechaInicio: new Date('2024-01-01'),
        fechaFin: new Date('2023-01-01')
      };

      await expect(proyectoService.actualizar('1', invalidData)).rejects.toThrow(ValidationError);
    });
  });

  describe('eliminar', () => {
    it('debe eliminar un proyecto exitosamente', async () => {
      mockRepository.findById.mockResolvedValue(mockProyecto);
      mockRepository.delete.mockResolvedValue(true);

      await expect(proyectoService.eliminar('1')).resolves.not.toThrow();
    });

    it('debe lanzar NotFoundError cuando el proyecto no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(proyectoService.eliminar('999')).rejects.toThrow(NotFoundError);
    });
  });
});