const transactionService = require('../services/transaction.service');
const { successResponse, paginatedResponse } = require('../utils/response');

const getTransactions = async (req, res, next) => {
    try {
        const { page, limit, search, startDate, endDate } = req.query;
        const result = await transactionService.getTransactions({ page, limit, search, startDate, endDate });
        return paginatedResponse(res, result.data, result.pagination);
    } catch (err) {
        next(err);
    }
};

const createTransaction = async (req, res, next) => {
    try {
        const { memberId, totalAmount } = req.body;
        if (!memberId || !totalAmount) {
            return res.status(400).json({ success: false, message: 'memberId dan totalAmount wajib diisi' });
        }
        const trx = await transactionService.createTransaction({ memberId, totalAmount }, req.user.id);
        return successResponse(res, trx, 'Transaksi berhasil dibuat', 201);
    } catch (err) {
        next(err);
    }
};

module.exports = { getTransactions, createTransaction };