const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authLimiter, otpLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validate');
const { loginValidator, registerValidator, verifyOtpValidator, resendOtpValidator } = require('../validators/auth.validator');

router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.post('/register', authLimiter, registerValidator, validate, authController.register);
router.post('/verify-otp', otpLimiter, verifyOtpValidator, validate, authController.verifyOtp);
router.post('/resend-otp', otpLimiter, resendOtpValidator, validate, authController.resendOtp);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);

module.exports = router;