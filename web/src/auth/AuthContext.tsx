import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../lib/axios';
import { getToken, setToken, getUser, setUser, clearStorage } from '../lib/storage';
import type { User, LoginCredentials } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    loading: boolean;
    isLoggingIn: boolean;
    isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        // Restaurar sesión al montar la app
        const initializeAuth = () => {
            const token = getToken();
            const storedUser = getUser();

            if (token && storedUser) {
                setUserState(storedUser);
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            setIsLoggingIn(true);
            console.log('🔄 Intentando login con:', credentials);
            console.log('🌐 URL API:', import.meta.env.VITE_API_URL);
            
            // Llamada a API real del backend
            const response = await api.post('/auth/login', credentials);
            console.log('✅ Respuesta exitosa:', response.data);
            
            const { accessToken, user: userData } = response.data;

            setToken(accessToken);
            setUser(userData);
            setUserState(userData);
            
            console.log('✅ Login exitoso, usuario guardado:', userData);
        } catch (error: any) {
            console.error('❌ Error en login:', error);
            console.error('❌ Error response:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const logout = () => {
        setIsLoggingOut(true);
        // Simular delay para mostrar el spinner
        setTimeout(() => {
            clearStorage();
            setUserState(null);
            setIsLoggingOut(false);
        }, 1000);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
        isLoggingIn,
        isLoggingOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};