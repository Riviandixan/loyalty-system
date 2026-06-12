const prisma = require('../config/prisma');
const { createAuditLog } = require('../utils/audit');

// REWARDS
const getRewards = async () => {
    return prisma.reward.findMany({ where: { isActive: true }, orderBy: { requiredPoint: 'asc' } });
};

// REDEEMS
const getRedeems = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    const [total, redeems] = await Promise.all([
        prisma.redeem.count(),
        prisma.redeem.findMany({
            skip,
            take: Number(limit),
            orderBy: { redeemedAt: 'desc' },
            include: {
                member: { select: { fullName: true, memberCode: true } },
                reward: { select: { name: true, requiredPoint: true } },
            },
        }),
    ]);
    return {
        data: redeems,
        pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
    };
};

const createRedeem = async ({ memberId, rewardId }, userId) => {
    const [member, reward] = await Promise.all([
        prisma.member.findUnique({ where: { id: Number(memberId) } }),
        prisma.reward.findUnique({ where: { id: Number(rewardId) } }),
    ]);

    if (!member) throw { statusCode: 404, message: 'Member tidak ditemukan' };
    if (!reward) throw { statusCode: 404, message: 'Reward tidak ditemukan' };
    if (member.status === 'INACTIVE') throw { statusCode: 400, message: 'Member tidak aktif' };
    if (member.pointBalance < reward.requiredPoint) {
        throw { statusCode: 400, message: `Poin tidak cukup. Dibutuhkan ${reward.requiredPoint}, saldo ${member.pointBalance}` };
    }

    const [redeem] = await prisma.$transaction([
        prisma.redeem.create({
            data: { memberId: Number(memberId), rewardId: Number(rewardId), pointsUsed: reward.requiredPoint },
            include: {
                member: { select: { fullName: true, memberCode: true } },
                reward: true,
            },
        }),
        prisma.member.update({
            where: { id: Number(memberId) },
            data: { pointBalance: { decrement: reward.requiredPoint } },
        }),
    ]);

    await createAuditLog({
        userId,
        action: 'POINT_REDEEMED',
        entity: 'Redeem',
        entityId: redeem.id,
        detail: { memberId, rewardId, pointsUsed: reward.requiredPoint },
    });

    return redeem;
};

module.exports = { getRewards, getRedeems, createRedeem };