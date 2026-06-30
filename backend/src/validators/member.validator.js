const { body } = require('express-validator');

const createMemberValidator = [
    body('fullName').trim().notEmpty().withMessage('Nama lengkap wajib diisi').isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
    body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
    body('phone').trim().notEmpty().withMessage('Nomor telepon wajib diisi').isMobilePhone('id-ID').withMessage('Format nomor telepon tidak valid'),
    body('dateOfBirth').optional().isISO8601().withMessage('Format tanggal lahir tidak valid (YYYY-MM-DD)'),
];

const updateMemberValidator = [
    body('fullName').trim().notEmpty().withMessage('Nama lengkap wajib diisi').isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
    body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
    body('phone').trim().notEmpty().withMessage('Nomor telepon wajib diisi').isMobilePhone('id-ID').withMessage('Format nomor telepon tidak valid'),
];

const updateStatusValidator = [
    body('status').isIn(['ACTIVE', 'INACTIVE']).withMessage('Status harus ACTIVE atau INACTIVE'),
];

module.exports = { createMemberValidator, updateMemberValidator, updateStatusValidator };
