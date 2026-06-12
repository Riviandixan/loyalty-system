const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboard.service');
const { authenticate } = require('../middlewares/auth.middleware');
const { successResponse } = require('../utils/response');

router.use(authenticate);
router.get('/', async (req, res, next) => {
    try {
        const data = await dashboardService.getDashboard();
        return successResponse(res, data);
    } catch (err) { next(err); }
});

module.exports = router;