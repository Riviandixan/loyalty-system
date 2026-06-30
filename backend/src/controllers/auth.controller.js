const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        return successResponse(res, result, 'Login berhasil');
    } catch (err) {
        next(err);
    }
};

const register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        const result = await authService.register({ fullName, email, password });
        return successResponse(res, result, result.message);
    } catch (err) {
        next(err);
    }
};

const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const result = await authService.verifyOtp({ email, otp });
        return successResponse(res, result, 'Akun berhasil dibuat');
    } catch (err) {
        next(err);
    }
};

const resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await authService.resendOtp({ email });
        return successResponse(res, result, result.message);
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

module.exports = { login, register, verifyOtp, resendOtp, logout, me };