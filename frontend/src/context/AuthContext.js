import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const isTokenExpired = (token) => {
    if (!token) return true;

    const payload = token.split('.')[1];
    if (!payload) return true;

    try {
        const decodedPayload = atob(payload);
        const { exp } = JSON.parse(decodedPayload);

        return Date.now() >= exp * 1000;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const setAuthTokens = useCallback((access, refresh) => {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        setUser({ token: access });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    }, []);

    const refreshToken = useCallback(async () => {
        try {
            const refresh_token = localStorage.getItem('refresh_token');
            const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                refresh: refresh_token,
            });
            const { access } = response.data;
            setAuthTokens(access, refresh_token);
            return access;
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            return null;
        }
    }, [setAuthTokens, logout]);

    useEffect(() => {
        const initializeAuth = async () => {
            const access_token = localStorage.getItem('access_token');
            if (access_token) {
                if (isTokenExpired(access_token)) {
                    // Token has expired, try to refresh
                    const newToken = await refreshToken();
                    if (newToken) {
                        setUser({ token: newToken });
                    }
                } else {
                    setUser({ token: access_token });
                    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, [refreshToken]);

    useEffect(() => {
        let timeoutId;

        const checkTokenExpiration = async () => {
            if (user && isTokenExpired(user.token)) {
                await refreshToken();
            } else if (user) {
                // Schedule next check just before token expires
                const payload = user.token.split('.')[1];
                const decodedPayload = atob(payload);
                const { exp } = JSON.parse(decodedPayload);
                const timeUntilExpiration = exp * 1000 - Date.now();
                const refreshTime = Math.max(timeUntilExpiration - 60000, 0);

                timeoutId = setTimeout(checkTokenExpiration, refreshTime);
            }
        };

        checkTokenExpiration();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [user, refreshToken]);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                username,
                password,
            });
            const { access, refresh } = response.data;
            setAuthTokens(access, refresh);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const register = async (username, email, password, password2) => {
        try {
            const response = await axios.post('http://localhost:8000/api/register/', {
                username,
                email,
                password,
                password2
            });
            const { access, refresh } = response.data;
            setAuthTokens(access, refresh);
            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, register }}>
            {children}
        </AuthContext.Provider>
    );
};