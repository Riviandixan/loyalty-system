const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 10,
    message: { success: false, message: 'Terlalu banyak percobaan, coba lagi dalam 15 menit' },
    standardHeaders: true,
    legacyHeaders: false,
});

const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 menit
    max: 5,
    message: { success: false, message: 'Terlalu banyak permintaan OTP, coba lagi dalam 5 menit' },
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 menit
    max: 100,
    message: { success: false, message: 'Terlalu banyak request, coba lagi dalam 1 menit' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { authLimiter, otpLimiter, apiLimiter };
