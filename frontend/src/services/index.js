import api from './api';

// Auth
export const authApi = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    verifyOtp: (data) => api.post('/auth/verify-otp', data),
    resendOtp: (data) => api.post('/auth/resend-otp', data),
    logout: () => api.post('/auth/logout'),
    me: () => api.get('/auth/me'),
};

// Dashboard
export const dashboardApi = {
    get: () => api.get('/dashboard'),
};

// Members
export const memberApi = {
    list: (params) => api.get('/members', { params }),
    get: (id) => api.get(`/members/${id}`),
    create: (data) => api.post('/members', data),
    update: (id, data) => api.put(`/members/${id}`, data),
    updateStatus: (id, status) => api.patch(`/members/${id}/status`, { status }),
};

// Transactions
export const transactionApi = {
    list: (params) => api.get('/transactions', { params }),
    create: (data) => api.post('/transactions', data),
};

// Rewards
export const rewardApi = {
    list: () => api.get('/rewards'),
};

// Redeems
export const redeemApi = {
    list: (params) => api.get('/redeems', { params }),
    create: (data) => api.post('/redeems', data),
};

// Users
export const userApi = {
    list: () => api.get('/users'),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// Audit Logs
export const auditApi = {
    list: (params) => api.get('/audit-logs', { params }),
};

// Profile
export const profileApi = {
    get: () => api.get('/profile'),
    update: (data) => api.put('/profile', data),
    changePassword: (data) => api.put('/profile/change-password', data),
} 