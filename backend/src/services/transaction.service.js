const prisma = require('../config/prisma');
const { createAuditLog } = require('../utils/audit');
const { calculateTier } = require('../utils/tier');

const generateTrxNumber = () => {
    const now = new Date();
    const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const rand = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
    return `TRX-${yyyymm}-${rand}`;
};

const getTransactions = async ({ page = 1, limit = 10, search = '', startDate, endDate }) => {
    const skip = (page - 1) * limit;

    const where = {
        AND: [
            search
                ? {
                    OR: [
                        { transactionNumber: { contains: search } },
                        { member: { fullName: { contains: search } } },
                    ],
                }
                : {},
            startDate ? { transactionDate: { gte: new Date(startDate) } } : {},
            endDate ? { transactionDate: { lte: new Date(endDate) } } : {},
        ],
    };

    const [total, transactions] = await Promise.all([
        prisma.transaction.count({ where }),
        prisma.transaction.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: { transactionDate: 'desc' },
            include: {
                member: { select: { fullName: true, memberCode: true } },
            },
        }),
    ]);

    return {
        data: transactions,
        pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
    };
};

const createTransaction = async ({ memberId, totalAmount }, userId) => {
    const member = await prisma.member.findUnique({ where: { id: Number(memberId) } });
    if (!member) throw { statusCode: 404, message: 'Member tidak ditemukan' };
    if (member.status === 'INACTIVE') throw { statusCode: 400, message: 'Member tidak aktif' };

    const earnedPoints = Math.floor(totalAmount / 10000);
    const transactionNumber = generateTrxNumber();

    // Hitung tier baru berdasarkan total poin lifetime
    const newTotalPoints = member.totalPointsEarned + earnedPoints;
    const newTier = calculateTier(newTotalPoints);

    const [transaction] = await prisma.$transaction([
        prisma.transaction.create({
            data: {
                transactionNumber,
                memberId: Number(memberId),
                totalAmount: Number(totalAmount),
                earnedPoints,
            },
            include: { member: { select: { fullName: true, memberCode: true } } },
        }),
        prisma.member.update({
            where: { id: Number(memberId) },
            data: {
                pointBalance: { increment: earnedPoints },
                totalPointsEarned: { increment: earnedPoints },
                tier: newTier,
            },
        }),
    ]);

    await createAuditLog({
        userId,
        action: 'TRANSACTION_CREATED',
        entity: 'Transaction',
        entityId: transaction.id,
        detail: { transactionNumber, memberId, totalAmount, earnedPoints },
    });

    return transaction;
};

module.exports = { getTransactions, createTransaction };