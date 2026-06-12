const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
        }
        const result = await authService.login({ email, password });
        return successResponse(res, result, 'Login berhasil');
    } catch (err) {
        next(err);
    }
};

const register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
        }
        const result = await authService.register({ fullName, email, password });
        return successResponse(res, result, 'Register berhasil');
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res) => {
    return res.json({ success: true, message: 'Logout berhasil' });
};

const me = async (req, res) => {
    const { password: _, ...user } = req.user;
    return res.json({ success: true, data: user });
};

module.exports = { login, register, logout, me };