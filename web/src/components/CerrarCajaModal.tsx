import React from 'react';
import type { CerrarCajaDto } from '../types';

interface CerrarCajaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: CerrarCajaDto;
  setFormData: React.Dispatch<React.SetStateAction<CerrarCajaDto>>;
  loading: boolean;
  montoCalculado: number;
}

const CerrarCajaModal: React.FC<CerrarCajaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  loading,
  montoCalculado
}) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(amount);
  };

  const diferencia = formData.montoFinal - montoCalculado;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Cerrar Caja
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

          {/* Información de Resumen */}
          <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Resumen de Caja
            </h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Monto calculado:</span>
                <span className="font-medium">{formatCurrency(montoCalculado)}</span>
              </div>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
              Ingrese el monto real contado en caja para calcular la diferencia.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Monto Final */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto Final Contado *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.montoFinal}
                onChange={(e) => setFormData({ ...formData, montoFinal: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
                disabled={loading}
              />
              {formData.montoFinal > 0 && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  <div className="flex justify-between items-center">
                    <span>Diferencia:</span>
                    <span className={`font-medium ${diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {diferencia >= 0 ? '+' : ''}{formatCurrency(diferencia)}
                    </span>
                  </div>
                  {diferencia !== 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {diferencia > 0 ? 'Hay un sobrante en caja' : 'Hay un faltante en caja'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="Observaciones de cierre..."
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
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Cerrando...' : 'Cerrar Caja'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CerrarCajaModal;