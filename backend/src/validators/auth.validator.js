const { body } = require('express-validator');

const loginValidator = [
    body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
    body('password').notEmpty().withMessage('Password wajib diisi'),
];

const registerValidator = [
    body('fullName').trim().notEmpty().withMessage('Nama lengkap wajib diisi').isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
    body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
];

const verifyOtpValidator = [
    body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP harus 6 digit').isNumeric().withMessage('OTP harus berupa angka'),
];

const resendOtpValidator = [
    body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
];

module.exports = { loginValidator, registerValidator, verifyOtpValidator, resendOtpValidator };
