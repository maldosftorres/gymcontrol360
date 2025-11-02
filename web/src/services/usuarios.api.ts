import api from '../lib/axios';
import type { Usuario, CreateUsuarioDto, ChangeStatusUsuarioDto } from '../types';

export const usuariosApi = {
  // Obtener todos los usuarios
  getAll: (params?: { empresaId?: number; sedeId?: number }) => 
    api.get<Usuario[]>('/usuarios', { params }),

  // Obtener un usuario por ID
  getById: (id: number) => 
    api.get<Usuario>(`/usuarios/${id}`),

  // Crear un nuevo usuario (y socio si corresponde)
  create: (data: CreateUsuarioDto) => 
    api.post<Usuario>('/usuarios', data),

  // Actualizar un usuario
  update: (id: number, data: Partial<CreateUsuarioDto>) => 
    api.patch<Usuario>(`/usuarios/${id}`, data),

  // Cambiar estado de un usuario
  changeStatus: (id: number, data: ChangeStatusUsuarioDto) => 
    api.patch<Usuario>(`/usuarios/${id}/status`, data),

  // Eliminar un usuario (soft delete)
  delete: (id: number) => 
    api.delete(`/usuarios/${id}`),
};