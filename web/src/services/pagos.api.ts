import axios from '../lib/axios';
import type { Pago, CreatePagoDto, UpdatePagoDto } from '../types';

export const pagosApi = {
  // Obtener todos los pagos
  getAll: async (empresaId: number, sedeId?: number): Promise<Pago[]> => {
    const response = await axios.get('/pagos', {
      params: { empresaId, sedeId }
    });
    return response.data;
  },

  // Obtener pago por ID
  getById: async (id: number): Promise<Pago> => {
    const response = await axios.get(`/pagos/${id}`);
    return response.data;
  },

  // Crear nuevo pago
  create: async (data: CreatePagoDto): Promise<Pago> => {
    const response = await axios.post('/pagos', data);
    return response.data;
  },

  // Actualizar pago
  update: async (id: number, data: UpdatePagoDto): Promise<Pago> => {
    const response = await axios.patch(`/pagos/${id}`, data);
    return response.data;
  },

  // Eliminar pago
  delete: async (id: number): Promise<void> => {
    await axios.delete(`/pagos/${id}`);
  },

  // Obtener total de pagos de hoy
  getTotalPagosHoy: async (empresaId: number): Promise<{ total: number }> => {
    const response = await axios.get('/pagos/hoy', {
      params: { empresaId }
    });
    return response.data;
  }
};