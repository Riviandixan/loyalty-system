const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');
const { apiLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validate');
const { createUserValidator, updateUserValidator } = require('../validators/user.validator');

router.use(authenticate, authorizeAdmin, apiLimiter);
router.get('/', userController.getUsers);
router.post('/', createUserValidator, validate, userController.createUser);
router.put('/:id', updateUserValidator, validate, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;