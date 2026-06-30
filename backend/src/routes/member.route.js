const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { apiLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validate');
const { createMemberValidator, updateMemberValidator, updateStatusValidator } = require('../validators/member.validator');

router.use(authenticate, apiLimiter);

router.get('/', memberController.getMembers);
router.get('/:id', memberController.getMemberById);
router.post('/', createMemberValidator, validate, memberController.createMember);
router.put('/:id', updateMemberValidator, validate, memberController.updateMember);
router.patch('/:id/status', updateStatusValidator, validate, memberController.updateMemberStatus);

module.exports = router;