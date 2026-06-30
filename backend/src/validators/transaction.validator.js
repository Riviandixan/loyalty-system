const { body } = require('express-validator');

const createTransactionValidator = [
    body('memberId').isInt({ min: 1 }).withMessage('memberId harus berupa angka valid'),
    body('totalAmount').isInt({ min: 1000 }).withMessage('Total amount minimal Rp 1.000'),
];

module.exports = { createTransactionValidator };
