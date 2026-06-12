const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');
const { paginatedResponse } = require('../utils/response');

router.use(authenticate, authorizeAdmin);

router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const [total, logs] = await Promise.all([
            prisma.auditLog.count(),
            prisma.auditLog.findMany({
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { fullName: true, email: true } } },
            }),
        ]);

        return paginatedResponse(res, logs, {
            total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit),
        });
    } catch (err) { next(err); }
});

module.exports = router;