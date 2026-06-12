// Simple auth store without external state library
const TOKEN_KEY = 'loyalty_token';
const USER_KEY = 'loyalty_user';

export const authStore = {
    getToken: () => localStorage.getItem(TOKEN_KEY),
    getUser: () => {
        const u = localStorage.getItem(USER_KEY);
        return u ? JSON.parse(u) : null;
    },
    setAuth: (token, user) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
    isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
};