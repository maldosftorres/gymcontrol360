import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../auth/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { CreditCard, Lock, Eye, EyeOff, LogIn, Zap, AlertCircle } from 'lucide-react';
import { Spinner, LoadingScreen } from '../components/ui/Spinner';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const loginSchema = z.object({
    documentoNumero: z.string().min(1, 'El número de documento es requerido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
    const { login, isAuthenticated, isLoggingIn } = useAuth();
    const navigate = useNavigate();
    const notifications = useNotifications();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            await login(data);
            notifications.showSuccess('¡Bienvenido!', 'Has iniciado sesión correctamente');
            navigate('/');
        } catch (err: any) {
            notifications.showError('Error de autenticación', err.message || 'Credenciales incorrectas');
        } finally {
            setIsLoading(false);
        }
    };

    // Mostrar spinner de pantalla completa si está procesando login
    if (isLoggingIn) {
        return <LoadingScreen message="Iniciando sesión..." size="lg" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Toggle de tema */}
            <div className="absolute top-4 right-4 z-20">
                <ThemeToggle variant="icon-only" />
            </div>

            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-300 dark:bg-blue-700 rounded-full opacity-15 blur-3xl"></div>
            </div>

            <div className="max-w-sm w-full relative z-10">
                {/* Contenedor principal con glassmorphism */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 p-6 relative">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                            <Zap className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                            GymControl 360
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Inicia sesión en tu cuenta
                        </p>
                    </div>

                    {/* Formulario */}
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        {/* Campo Email */}
                        <div>
                            <label htmlFor="documentoNumero" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Número de Documento
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CreditCard className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    {...register('documentoNumero')}
                                    type="text"
                                    autoComplete="off"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="12345678"
                                />
                            </div>
                            {errors.documentoNumero && (
                                <div className="mt-2 flex items-center text-red-600 dark:text-red-400">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    <span className="text-sm">{errors.documentoNumero.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Campo Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Contraseña
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="admin123"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="mt-2 flex items-center text-red-600 dark:text-red-400">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    <span className="text-sm">{errors.password.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Botón de submit */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <Spinner size="sm" variant="white" className="mr-2" />
                                        <span>Iniciando sesión...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <LogIn className="h-4 w-4 mr-2" />
                                        <span>Iniciar Sesión</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Credenciales de prueba */}
                    {/* <div className="mt-6 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-gray-700 text-center font-medium mb-2">
                            🔐 Credenciales de prueba:
                        </p>
                        <div className="text-center space-y-1">
                            <p className="text-xs text-gray-600">
                                <span className="font-mono bg-white px-2 py-1 rounded text-blue-700 font-medium">admin@gymdemo.com</span>
                            </p>
                            <p className="text-xs text-gray-600">
                                <span className="font-mono bg-white px-2 py-1 rounded text-blue-700 font-medium">admin123</span>
                            </p>
                        </div>
                    </div> */}

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            © 2025 GymControl 360
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;