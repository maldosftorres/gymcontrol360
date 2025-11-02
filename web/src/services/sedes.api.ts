import api from '../lib/axios';

export interface Sede {
  id: number;
  empresaId: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  activa: boolean;
  creadoEn: string;
  actualizadoEn: string;
  empresa?: {
    id: number;
    nombre: string;
  };
}

export interface CreateSedeDto {
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  observaciones?: string;
  activa?: boolean;
}

export interface UpdateSedeDto {
  nombre?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  observaciones?: string;
  activa?: boolean;
}

export interface SedeStats {
  totalUsuarios: number;
  totalSocios: number;
  totalMembresias: number;
  usuariosActivos: number;
  sociosActivos: number;
}

export const sedesApi = {
  // Crear nueva sede
  create: async (empresaId: number, data: CreateSedeDto): Promise<Sede> => {
    const response = await api.post(`/sedes?empresaId=${empresaId}`, data);
    return response.data;
  },

  // Obtener todas las sedes
  getAll: async (empresaId: number): Promise<Sede[]> => {
    const response = await api.get(`/sedes?empresaId=${empresaId}`);
    return response.data;
  },

  // Obtener solo sedes activas
  getActivas: async (empresaId: number): Promise<Sede[]> => {
    const response = await api.get(`/sedes/activas?empresaId=${empresaId}`);
    return response.data;
  },

  // Obtener sede por ID
  getById: async (empresaId: number, id: number): Promise<Sede> => {
    const response = await api.get(`/sedes/${id}?empresaId=${empresaId}`);
    return response.data;
  },

  // Obtener estadísticas de la sede
  getStats: async (empresaId: number, id: number): Promise<SedeStats> => {
    const response = await api.get(`/sedes/${id}/stats?empresaId=${empresaId}`);
    return response.data;
  },

  // Actualizar sede
  update: async (empresaId: number, id: number, data: UpdateSedeDto): Promise<Sede> => {
    const response = await api.patch(`/sedes/${id}?empresaId=${empresaId}`, data);
    return response.data;
  },

  // Activar/desactivar sede
  toggleActiva: async (empresaId: number, id: number): Promise<Sede> => {
    const response = await api.patch(`/sedes/${id}/toggle-activa?empresaId=${empresaId}`);
    return response.data;
  },

  // Eliminar sede
  delete: async (empresaId: number, id: number): Promise<void> => {
    await api.delete(`/sedes/${id}?empresaId=${empresaId}`);
  },
};