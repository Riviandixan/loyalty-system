// reward.routes.js
const express = require('express');
const router = express.Router();
const rewardService = require('../services/reward.service');
const { authenticate } = require('../middlewares/auth.middleware');
const { successResponse } = require('../utils/response');

router.use(authenticate);
router.get('/', async (req, res, next) => {
    try {
        const rewards = await rewardService.getRewards();
        return successResponse(res, rewards);
    } catch (err) { next(err); }
});

module.exports = router;