const prisma = require('../config/prisma');

const getDashboard = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
        totalMembers,
        activeMembers,
        totalTransactions,
        pointsData,
        recentTransactions,
        recentRedeems,
        monthlyRevenue,
    ] = await Promise.all([
        prisma.member.count(),
        prisma.member.count({ where: { status: 'ACTIVE' } }),
        prisma.transaction.count(),
        prisma.transaction.aggregate({
            _sum: { totalAmount: true, earnedPoints: true },
        }),
        prisma.transaction.findMany({
            take: 5,
            orderBy: { transactionDate: 'desc' },
            include: { member: { select: { fullName: true, memberCode: true } } },
        }),
        prisma.redeem.findMany({
            take: 5,
            orderBy: { redeemedAt: 'desc' },
            include: {
                member: { select: { fullName: true } },
                reward: { select: { name: true } },
            },
        }),
        // Monthly revenue - last 6 months
        prisma.$queryRaw`
            SELECT 
                TO_CHAR(transaction_date, 'YYYY-MM') as month,
                SUM(total_amount)::bigint as revenue,
                COUNT(*)::bigint as count
            FROM transactions
            WHERE transaction_date >= NOW() - INTERVAL '6 months'
            GROUP BY TO_CHAR(transaction_date, 'YYYY-MM')
            ORDER BY month ASC
            `,
    ]);

    const totalRedeemedPoints = await prisma.redeem.aggregate({
        _sum: { pointsUsed: true },
    });

    return {
        stats: {
            totalMembers,
            activeMembers,
            totalTransactions,
            totalRevenue: pointsData._sum.totalAmount || 0,
            totalIssuedPoints: pointsData._sum.earnedPoints || 0,
            totalRedeemedPoints: totalRedeemedPoints._sum.pointsUsed || 0,
        },
        recentTransactions,
        recentRedeems,
        monthlyRevenue: monthlyRevenue.map((r) => ({
            month: r.month,
            revenue: Number(r.revenue),
            count: Number(r.count),
        })),
    };
};

module.exports = { getDashboard };