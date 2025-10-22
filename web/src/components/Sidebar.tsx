import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart3, Settings, Users, ChevronRight, ChevronLeft, Zap, CreditCard, DollarSign, Vault } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const menuItems = [
    {
      path: '/',
      icon: Home,
      label: 'Dashboard',
      exact: true,
    },
    {
      path: '/usuarios',
      icon: Users,
      label: 'Usuarios',
      exact: false,
    },
    {
      path: '/membresias',
      icon: CreditCard,
      label: 'Membresías',
      exact: false,
    },
    {
      path: '/pagos',
      icon: DollarSign,
      label: 'Pagos',
      exact: false,
    },
    {
      path: '/caja',
      icon: Vault,
      label: 'Caja',
      exact: false,
    },
    {
      path: '/reports',
      icon: BarChart3,
      label: 'Reportes',
      exact: false,
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Configuración',
      exact: false,
    },
  ];

  return (
    <div className={`bg-gray-900 dark:bg-gray-950 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Gym Control 360</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="mt-4">
        <div className="px-2 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;