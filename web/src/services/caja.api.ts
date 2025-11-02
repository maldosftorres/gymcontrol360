import axios from '../lib/axios';
import type { 
  Caja, 
  MovimientoCaja, 
  AbrirCajaDto, 
  CerrarCajaDto, 
  CreateMovimientoCajaDto 
} from '../types';

export const cajaApi = {
  // Abrir caja
  abrir: async (data: AbrirCajaDto): Promise<Caja> => {
    const response = await axios.post('/caja/abrir', data);
    return response.data;
  },

  // Cerrar caja
  cerrar: async (id: number, data: CerrarCajaDto): Promise<void> => {
    await axios.patch(`/caja/${id}/cerrar`, data);
  },

  // Obtener caja activa
  getCajaActiva: async (sedeId: number): Promise<Caja | null> => {
    try {
      const response = await axios.get(`/caja/activa/${sedeId}`);
      return response.data;
    } catch (error) {
      // Si no hay caja activa, retornar null
      return null;
    }
  },

  // Obtener todas las cajas
  getAll: async (
    empresaId?: number, 
    sedeId?: number, 
    fechaInicio?: string, 
    fechaFin?: string
  ): Promise<Caja[]> => {
    const response = await axios.get('/caja', {
      params: { empresaId, sedeId, fechaInicio, fechaFin }
    });
    return response.data;
  },

  // Obtener caja por ID
  getById: async (id: number): Promise<Caja> => {
    const response = await axios.get(`/caja/${id}`);
    return response.data;
  },

  // Obtener resumen de caja
  getResumen: async (id: number): Promise<any> => {
    const response = await axios.get(`/caja/${id}/resumen`);
    return response.data;
  },

  // Crear movimiento de caja
  createMovimiento: async (data: CreateMovimientoCajaDto): Promise<MovimientoCaja> => {
    const response = await axios.post('/caja/movimiento', data);
    return response.data;
  },

  // Obtener movimientos de una caja
  getMovimientos: async (cajaId: number): Promise<MovimientoCaja[]> => {
    const response = await axios.get(`/caja/${cajaId}/movimientos`);
    return response.data;
  }
};