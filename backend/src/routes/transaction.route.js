const express = require('express');
const router = express.Router();
const trxController = require('../controllers/transaction.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { apiLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validate');
const { createTransactionValidator } = require('../validators/transaction.validator');

router.use(authenticate, apiLimiter);
router.get('/', trxController.getTransactions);
router.post('/', createTransactionValidator, validate, trxController.createTransaction);

module.exports = router;