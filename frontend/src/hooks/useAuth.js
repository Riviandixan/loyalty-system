import { useState, useCallback } from 'react';
import { authApi } from '../services';
import { authStore } from '../store/auth.store';

export const useAuth = () => {
    const [user, setUser] = useState(() => authStore.getUser());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authApi.login({ email, password });
            const { token, user } = res.data.data;
            authStore.setAuth(token, user);
            setUser(user);
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || 'Login gagal';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async ({ fullName, email, password }) => {
        setLoading(true);
        setError(null);
        try {
            await authApi.register({ fullName, email, password });
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || 'Register gagal';
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try { await authApi.logout(); } catch (_) { }
        authStore.clear();
        setUser(null);
    }, []);

    return { user, loading, error, login, register, logout, isAuthenticated: !!user };
};