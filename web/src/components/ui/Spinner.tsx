import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
    /** Tamaño del spinner */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /** Color del spinner */
    variant?: 'primary' | 'white' | 'gray' | 'success' | 'warning' | 'danger';
    /** Mostrar texto de carga */
    text?: string;
    /** Centrar el spinner */
    center?: boolean;
    /** Mostrar como overlay de pantalla completa */
    fullScreen?: boolean;
    /** Clases CSS adicionales */
    className?: string;
}

const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
};

const colorClasses = {
    primary: 'text-blue-600 dark:text-blue-400',
    white: 'text-white',
    gray: 'text-gray-600 dark:text-gray-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
};

const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
};

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    variant = 'primary',
    text,
    center = false,
    fullScreen = false,
    className = '',
}) => {
    const spinnerContent = (
        <div className={`flex items-center ${text ? 'space-x-3' : ''} ${className}`}>
            <Loader2
                className={`${sizeClasses[size]} ${colorClasses[variant]} animate-spin`}
            />
            {text && (
                <span className={`${textSizeClasses[size]} ${colorClasses[variant]} font-medium`}>
                    {text}
                </span>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            {/* Outer ring */}
                            <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900 rounded-full"></div>
                            {/* Spinning ring */}
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                            {/* Inner dot */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                        {text && (
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">
                                {text}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (center) {
        return (
            <div className="flex items-center justify-center p-8">
                {spinnerContent}
            </div>
        );
    }

    return spinnerContent;
};

// Componente especializado para botones
export const ButtonSpinner: React.FC<{ size?: 'xs' | 'sm' | 'md' }> = ({ size = 'sm' }) => (
    <Loader2 className={`${sizeClasses[size]} animate-spin`} />
);

// Componente para cards de carga
export const LoadingCard: React.FC<{
    title?: string;
    description?: string;
    className?: string;
}> = ({
    title = 'Cargando...',
    description = 'Por favor espere un momento',
    className = ''
}) => (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300 ${className}`}>
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    {/* Animated circles */}
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                </div>
            </div>
        </div>
    );

// Componente para skeleton loading
export const SkeletonLoader: React.FC<{
    lines?: number;
    className?: string;
}> = ({ lines = 3, className = '' }) => (
    <div className={`animate-pulse ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
            <div key={index} className="flex space-x-4 mb-4 last:mb-0">
                <div className="rounded-full bg-gray-200 dark:bg-gray-600 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
);

// Componente para loading de tabla
export const TableLoader: React.FC<{
    rows?: number;
    columns?: number;
}> = ({ rows = 5, columns = 4 }) => (
    <div className="animate-pulse">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-t-lg p-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex space-x-4">
                {Array.from({ length: columns }).map((_, index) => (
                    <div key={index} className="h-4 bg-gray-200 dark:bg-gray-600 rounded flex-1"></div>
                ))}
            </div>
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="flex space-x-4">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div key={colIndex} className="h-4 bg-gray-200 dark:bg-gray-600 rounded flex-1"></div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

// Mantener compatibilidad con LoadingScreen
interface LoadingScreenProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    overlay?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
    message = 'Cargando...', 
    size = 'lg',
    // overlay = false 
}) => {
    return <Spinner fullScreen={true} text={message} size={size} />;
};

export default Spinner;