import React from 'react';
import Card from '../components/Card';
import { Users, DollarSign, Activity, Dumbbell } from 'lucide-react';

const Home: React.FC = () => {
  const metricsData = [
    {
      title: 'Miembros Activos',
      value: '1,234',
      icon: Users,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Ingresos del Mes',
      value: '$45,678',
      icon: DollarSign,
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Visitas Hoy',
      value: '89',
      icon: Activity,
      trend: { value: 3, isPositive: false }
    },
    {
      title: 'Equipos en Uso',
      value: '67%',
      icon: Dumbbell,
      trend: { value: 15, isPositive: true }
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Resumen general de tu gimnasio
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metricsData.map((metric, index) => (
          <Card
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
          />
        ))}
      </div>

      {/* Actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {[
              { action: 'Nuevo miembro registrado', user: 'Juan Pérez', time: 'Hace 5 min' },
              { action: 'Pago de membresía', user: 'María García', time: 'Hace 15 min' },
              { action: 'Check-in', user: 'Carlos López', time: 'Hace 30 min' },
              { action: 'Renovación de plan', user: 'Ana Rodríguez', time: 'Hace 1 hora' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.user}</p>
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Horarios Populares</h3>
          <div className="space-y-3">
            {[
              { time: '06:00 - 08:00', usage: '85%', color: 'bg-red-500' },
              { time: '18:00 - 20:00', usage: '92%', color: 'bg-red-600' },
              { time: '20:00 - 22:00', usage: '78%', color: 'bg-yellow-500' },
              { time: '10:00 - 12:00', usage: '45%', color: 'bg-green-500' },
            ].map((slot, index) => (
              <div key={index} className="flex items-center">
                <div className="w-20 text-sm text-gray-600 dark:text-gray-400">{slot.time}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${slot.color}`}
                      style={{ width: slot.usage }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-sm font-medium text-gray-900 dark:text-white">{slot.usage}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;