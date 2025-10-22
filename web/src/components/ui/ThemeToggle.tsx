import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
    variant?: 'default' | 'compact' | 'icon-only';
    className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    variant = 'default',
    className = ''
}) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    if (variant === 'icon-only') {
        return (
            <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
                aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
                title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
            >
                {isDark ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                )}
            </button>
        );
    }

    if (variant === 'compact') {
        return (
            <button
                onClick={toggleTheme}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            >
                {isDark ? (
                    <>
                        <Sun className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Claro</span>
                    </>
                ) : (
                    <>
                        <Moon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Oscuro</span>
                    </>
                )}
            </button>
        );
    }

    // Variant default - Toggle switch estilizado
    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <Sun className={`w-4 h-4 transition-colors ${isDark ? 'text-gray-400' : 'text-yellow-500'}`} />
            <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                role="switch"
                aria-checked={isDark}
                aria-label="Alternar modo oscuro"
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'
                        } shadow-lg`}
                />
            </button>
            <Moon className={`w-4 h-4 transition-colors ${isDark ? 'text-blue-400' : 'text-gray-400'}`} />
        </div>
    );
};

export default ThemeToggle;