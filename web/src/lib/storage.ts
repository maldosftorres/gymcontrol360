import type { User } from '../types';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

// Token management
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

// User management
export const getUser = (): User | null => {
    const userString = localStorage.getItem(USER_KEY);
    if (userString) {
        try {
            return JSON.parse(userString);
        } catch {
            return null;
        }
    }
    return null;
};

export const setUser = (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = (): void => {
    localStorage.removeItem(USER_KEY);
};

// Clear all stored data
export const clearStorage = (): void => {
    removeToken();
    removeUser();
};