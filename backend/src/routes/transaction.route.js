const express = require('express');
const router = express.Router();
const trxController = require('../controllers/transaction.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);
router.get('/', trxController.getTransactions);
router.post('/', trxController.createTransaction);

module.exports = router;