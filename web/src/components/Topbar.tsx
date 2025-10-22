import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { ChevronDown } from 'lucide-react';
import { LoadingScreen } from './ui/Spinner';
import { ThemeToggle } from './ui/ThemeToggle';

const Topbar: React.FC = () => {
    const { user, logout, isLoggingOut } = useAuth();
    const notifications = useNotifications();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        const result = await notifications.showConfirmation(
            '¿Cerrar sesión?',
            '¿Estás seguro de que quieres cerrar tu sesión?',
            'Sí, cerrar sesión',
            'Cancelar'
        );

        if (result.isConfirmed) {
            logout();
            notifications.showToast('success', 'Sesión cerrada correctamente');
        }
    };

    // Cerrar menú cuando se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Mostrar spinner de pantalla completa si está cerrando sesión
    if (isLoggingOut) {
        return <LoadingScreen message="Cerrando sesión..." size="lg" />;
    }

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Bienvenido al Dashboard
                    </h1>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Toggle de tema */}
                    <ThemeToggle variant="icon-only" />
                    
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <span className="hidden md:block text-gray-700 dark:text-gray-300 font-medium">
                                {user?.name || 'Usuario'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
                                    <div className="font-medium">{user?.name}</div>
                                    <div className="text-gray-500 dark:text-gray-400">{user?.username}</div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;