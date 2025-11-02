import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import type { Membresia, CreateMembresiaDto } from '../types';
import { sedesApi } from '../services/sedes.api';

interface MembresiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: CreateMembresiaDto;
  setFormData: React.Dispatch<React.SetStateAction<CreateMembresiaDto>>;
  editingMembresia: Membresia | null;
  loading: boolean;
  empresaId: number; // Necesario para cargar las sedes
}

const MembresiaModal: React.FC<MembresiaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingMembresia,
  loading,
  empresaId
}) => {
  const [sedes, setSedes] = useState<any[]>([]);
  const [loadingSedes, setLoadingSedes] = useState(false);

  // Cargar sedes cuando el modal se abra
  useEffect(() => {
    if (isOpen) {
      loadSedes();
    }
  }, [isOpen, empresaId]);

  const loadSedes = async () => {
    try {
      setLoadingSedes(true);
      const sedesData = await sedesApi.getActivas(empresaId);
      setSedes(sedesData);
    } catch (error) {
      console.error('Error al cargar sedes:', error);
    } finally {
      setLoadingSedes(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {editingMembresia ? 'Editar Membresía' : 'Nueva Membresía'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              disabled={loading}
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Membresía Mensual"
                  disabled={loading}
                />
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Precio *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>

              {/* Duración en días */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duración (días) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.duracionDias}
                  onChange={(e) => setFormData({ ...formData, duracionDias: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="30"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Duración de la membresía en días
                </p>
              </div>

              {/* Sede */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Building className="inline w-4 h-4 mr-1" />
                  Sede
                </label>
                <select
                  value={formData.sedeId || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    sedeId: e.target.value ? Number(e.target.value) : undefined 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading || loadingSedes}
                >
                  <option value="">Todas las sedes</option>
                  {sedes.map((sede) => (
                    <option key={sede.id} value={sede.id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
                {loadingSedes && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Cargando sedes...
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Si no selecciona una sede, la membresía estará disponible en todas las sedes
                </p>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  value={formData.activa ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, activa: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                >
                  <option value="true">Activa</option>
                  <option value="false">Inactiva</option>
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion || ''}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Descripción detallada de la membresía..."
                disabled={loading}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Guardando...' : editingMembresia ? 'Actualizar Membresía' : 'Crear Membresía'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MembresiaModal;