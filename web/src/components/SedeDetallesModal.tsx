import React from 'react';
import { X, MapPin, Phone, Mail, Users, Clock, Building, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Sede {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  activa: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

interface SedeStats {
  totalUsuarios: number;
  totalSocios: number;
  totalMembresias: number;
  usuariosActivos: number;
  sociosActivos: number;
}

interface SedeDetallesModalProps {
  sede: Sede | null;
  stats: SedeStats | null;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

const SedeDetallesModal: React.FC<SedeDetallesModalProps> = ({
  sede,
  stats,
  isOpen,
  onClose,
  loading = false
}) => {
  const { theme } = useTheme();

  if (!isOpen || !sede) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`
        relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl transform transition-all
        ${theme === 'dark' 
          ? 'bg-gray-800 text-white' 
          : 'bg-white text-gray-900'
        }
      `}>
        {/* Header */}
        <div className={`
          sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between
          ${theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
          }
        `}>
          <div className="flex items-center space-x-3">
            <Building className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h2 className="text-xl font-semibold">{sede.nombre}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${sede.activa 
                    ? (theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                    : (theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')
                  }
                `}>
                  {sede.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className={`
              p-2 rounded-full transition-colors
              ${theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
              theme === 'dark' ? 'border-blue-400' : 'border-blue-600'
            }`}></div>
            <span className={`ml-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Cargando estadísticas...
            </span>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Información Básica */}
            <div className={`
              p-4 rounded-lg border
              ${theme === 'dark' 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
              }
            `}>
              <h3 className={`text-lg font-medium mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Información de Contacto
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sede.direccion && (
                  <div className="flex items-start space-x-3">
                    <MapPin className={`w-5 h-5 mt-0.5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Dirección
                      </p>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        {sede.direccion}
                      </p>
                    </div>
                  </div>
                )}

                {sede.telefono && (
                  <div className="flex items-start space-x-3">
                    <Phone className={`w-5 h-5 mt-0.5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Teléfono
                      </p>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        {sede.telefono}
                      </p>
                    </div>
                  </div>
                )}

                {sede.email && (
                  <div className="flex items-start space-x-3">
                    <Mail className={`w-5 h-5 mt-0.5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Email
                      </p>
                      <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                        {sede.email}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <Clock className={`w-5 h-5 mt-0.5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Fecha de Creación
                    </p>
                    <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      {formatDate(sede.creadoEn)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            {stats && (
              <div className={`
                p-4 rounded-lg border
                ${theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
                }
              `}>
                <h3 className={`text-lg font-medium mb-4 flex items-center ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <TrendingUp className={`w-5 h-5 mr-2 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  Estadísticas
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className={`text-center p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-white'
                  }`}>
                    <Users className={`w-6 h-6 mx-auto mb-2 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stats.totalUsuarios}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Usuarios
                    </p>
                  </div>

                  <div className={`text-center p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-white'
                  }`}>
                    <Users className={`w-6 h-6 mx-auto mb-2 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stats.usuariosActivos}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Activos
                    </p>
                  </div>

                  <div className={`text-center p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-white'
                  }`}>
                    <Users className={`w-6 h-6 mx-auto mb-2 ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stats.totalSocios}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Socios
                    </p>
                  </div>

                  <div className={`text-center p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-white'
                  }`}>
                    <Users className={`w-6 h-6 mx-auto mb-2 ${
                      theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                    }`} />
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stats.sociosActivos}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Socios Activos
                    </p>
                  </div>

                  <div className={`text-center p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-white'
                  }`}>
                    <Building className={`w-6 h-6 mx-auto mb-2 ${
                      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                    <p className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stats.totalMembresias}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Membresías
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Información de Sistema */}
            <div className={`
              p-4 rounded-lg border
              ${theme === 'dark' 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
              }
            `}>
              <h3 className={`text-lg font-medium mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Información del Sistema
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    ID de Sede
                  </p>
                  <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    #{sede.id}
                  </p>
                </div>

                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Última Actualización
                  </p>
                  <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    {formatDate(sede.actualizadoEn)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`
          sticky bottom-0 px-6 py-4 border-t flex justify-end
          ${theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
          }
        `}>
          <button
            onClick={onClose}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${theme === 'dark' 
                ? 'bg-gray-600 text-white hover:bg-gray-500' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SedeDetallesModal;