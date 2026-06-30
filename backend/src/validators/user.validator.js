const { body } = require('express-validator');

const createUserValidator = [
    body('fullName').trim().notEmpty().withMessage('Nama lengkap wajib diisi').isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
    body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
    body('role').isIn(['ADMIN', 'STAFF']).withMessage('Role harus ADMIN atau STAFF'),
];

const updateUserValidator = [
    body('fullName').trim().notEmpty().withMessage('Nama lengkap wajib diisi').isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
    body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
    body('role').isIn(['ADMIN', 'STAFF']).withMessage('Role harus ADMIN atau STAFF'),
];

module.exports = { createUserValidator, updateUserValidator };
