import React from 'react';
import { useForm } from 'react-hook-form';
import { useNotifications } from '../hooks/useNotifications';

interface SettingsFormData {
    gymName: string;
    email: string;
    phone: string;
    address: string;
    currency: string;
    timezone: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    autoReminders: boolean;
}

const Settings: React.FC = () => {
    const notifications = useNotifications();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SettingsFormData>({
        defaultValues: {
            gymName: 'Gym Control 360',
            email: 'admin@gymcontrol360.com',
            phone: '+1234567890',
            address: '123 Fitness Street, City',
            currency: 'USD',
            timezone: 'America/New_York',
            emailNotifications: true,
            smsNotifications: false,
            autoReminders: true,
        },
    });

    const onSubmit = async (data: SettingsFormData) => {
        try {
            notifications.showLoading('Guardando configuración...', 'Por favor espera un momento');

            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Configuración guardada:', data);

            notifications.close();
            notifications.showSuccess(
                '¡Configuración guardada!',
                'Los cambios se han aplicado correctamente'
            );
        } catch (error) {
            notifications.close();
            notifications.showError(
                'Error al guardar',
                'No se pudo guardar la configuración. Inténtalo de nuevo.'
            );
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Gestiona la configuración de tu gimnasio
                </p>
            </div>

            <div className="max-w-4xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Información General */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Información General</h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="gymName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nombre del Gimnasio
                                    </label>
                                    <input
                                        {...register('gymName', { required: 'El nombre es requerido' })}
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    {errors.gymName && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gymName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email de Contacto
                                    </label>
                                    <input
                                        {...register('email', {
                                            required: 'El email es requerido',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Email inválido'
                                            }
                                        })}
                                        type="email"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Teléfono
                                    </label>
                                    <input
                                        {...register('phone')}
                                        type="tel"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Dirección
                                    </label>
                                    <input
                                        {...register('address')}
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Configuración Regional */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configuración Regional</h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Moneda
                                    </label>
                                    <select
                                        {...register('currency')}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="USD">USD - Dólar Estadounidense</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="MXN">MXN - Peso Mexicano</option>
                                        <option value="COP">COP - Peso Colombiano</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Zona Horaria
                                    </label>
                                    <select
                                        {...register('timezone')}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="America/New_York">Este (Nueva York)</option>
                                        <option value="America/Chicago">Central (Chicago)</option>
                                        <option value="America/Denver">Montaña (Denver)</option>
                                        <option value="America/Los_Angeles">Pacífico (Los Ángeles)</option>
                                        <option value="America/Mexico_City">México (Ciudad de México)</option>
                                        <option value="America/Bogota">Colombia (Bogotá)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notificaciones */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notificaciones</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        {...register('emailNotifications')}
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                        Notificaciones por Email
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        {...register('smsNotifications')}
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                        Notificaciones por SMS
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        {...register('autoReminders')}
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                        Recordatorios Automáticos de Pago
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;