import React from 'react';
import BasicDataTable from '../components/BasicDataTable';
import { useNotifications } from '../hooks/useNotifications';
import { Users, DollarSign } from 'lucide-react';

const Reports: React.FC = () => {
  const notifications = useNotifications();

  const membersHeaders = ['Nombre', 'Email', 'Plan', 'Estado', 'Último Pago'];
  const membersData = [
    ['Juan Pérez', 'juan@email.com', 'Premium', 'Activo', '15/10/2025'],
    ['María García', 'maria@email.com', 'Básico', 'Activo', '10/10/2025'],
    ['Carlos López', 'carlos@email.com', 'Premium', 'Pendiente', '28/09/2025'],
    ['Ana Rodríguez', 'ana@email.com', 'Básico', 'Activo', '18/10/2025'],
    ['Luis Martín', 'luis@email.com', 'Premium', 'Suspendido', '25/09/2025'],
  ];

  const paymentsHeaders = ['Fecha', 'Miembro', 'Concepto', 'Monto', 'Método'];
  const paymentsData = [
    ['20/10/2025', 'Juan Pérez', 'Mensualidad Premium', '$75.00', 'Tarjeta'],
    ['19/10/2025', 'Ana Rodríguez', 'Mensualidad Básica', '$45.00', 'Efectivo'],
    ['18/10/2025', 'María García', 'Mensualidad Básica', '$45.00', 'Transferencia'],
    ['17/10/2025', 'Pedro Sánchez', 'Mensualidad Premium', '$75.00', 'Tarjeta'],
    ['16/10/2025', 'Laura González', 'Mensualidad Básica', '$45.00', 'Efectivo'],
  ];

  const handleExportCSV = async () => {
    try {
      notifications.showLoading('Generando archivo CSV...', 'Preparando datos para exportación');
      await new Promise(resolve => setTimeout(resolve, 2000));
      notifications.close();
      notifications.showSuccess('¡Exportación exitosa!', 'El archivo CSV se ha descargado correctamente');
    } catch (error) {
      notifications.close();
      notifications.showError('Error de exportación', 'No se pudo generar el archivo CSV');
    }
  };

  const handleExportPDF = async () => {
    try {
      notifications.showLoading('Generando PDF...', 'Creando documento con los datos');
      await new Promise(resolve => setTimeout(resolve, 2500));
      notifications.close();
      notifications.showSuccess('¡PDF generado!', 'El reporte se ha creado exitosamente');
    } catch (error) {
      notifications.close();
      notifications.showError('Error al generar PDF', 'No se pudo crear el documento');
    }
  };

  const handleApplyFilters = () => {
    notifications.showToast('info', 'Filtros aplicados correctamente');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reportes</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Informes detallados de miembros y pagos
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filtros</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Desde</label>
            <input
              type="date"
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue="2025-10-01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Hasta</label>
            <input
              type="date"
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue="2025-10-20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Plan</label>
            <select className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Todos</option>
              <option value="basico">Básico</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleApplyFilters}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Miembros</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">1,234</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Ingresos del Mes</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">$45,678</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">⚠️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Pagos Pendientes</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">23</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de miembros */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Lista de Miembros</h2>
          <button 
            onClick={handleExportCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Exportar CSV
          </button>
        </div>
        <BasicDataTable headers={membersHeaders} data={membersData} />
      </div>

      {/* Tabla de pagos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Historial de Pagos</h2>
          <button 
            onClick={handleExportPDF}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Exportar PDF
          </button>
        </div>
        <BasicDataTable headers={paymentsHeaders} data={paymentsData} />
      </div>
    </div>
  );
};

export default Reports;