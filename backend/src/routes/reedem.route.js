const express = require('express');
const router = express.Router();
const rewardService = require('../services/reward.service');
const { authenticate } = require('../middlewares/auth.middleware');
const { successResponse, paginatedResponse } = require('../utils/response');

router.use(authenticate);

router.get('/', async (req, res, next) => {
    try {
        const result = await rewardService.getRedeems(req.query);
        return paginatedResponse(res, result.data, result.pagination);
    } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
    try {
        const { memberId, rewardId } = req.body;
        if (!memberId || !rewardId) {
            return res.status(400).json({ success: false, message: 'memberId dan rewardId wajib diisi' });
        }
        const redeem = await rewardService.createRedeem({ memberId, rewardId }, req.user.id);
        return successResponse(res, redeem, 'Redeem berhasil', 201);
    } catch (err) { next(err); }
});

module.exports = router;