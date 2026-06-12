const prisma = require('../config/prisma');
const { createAuditLog } = require('../utils/audit');

const generateMemberCode = async () => {
    const count = await prisma.member.count();
    const seq = String(count + 1).padStart(6, '0');
    return `MBR-${seq}`;
};

const getMembers = async ({ page = 1, limit = 10, search = '', status = '' }) => {
    const skip = (page - 1) * limit;

    const where = {
        AND: [
            search
                ? {
                    OR: [
                        { fullName: { contains: search } },
                        { email: { contains: search } },
                        { memberCode: { contains: search } },
                        { phone: { contains: search } },
                    ],
                }
                : {},
            status ? { status } : {},
        ],
    };

    const [total, members] = await Promise.all([
        prisma.member.count({ where }),
        prisma.member.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                memberCode: true,
                fullName: true,
                email: true,
                phone: true,
                pointBalance: true,
                status: true,
                createdAt: true,
            },
        }),
    ]);

    return {
        data: members,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getMemberById = async (id) => {
    const member = await prisma.member.findUnique({
        where: { id: Number(id) },
        include: {
            transactions: {
                orderBy: { transactionDate: 'desc' },
                take: 10,
            },
            redeems: {
                orderBy: { redeemedAt: 'desc' },
                take: 10,
                include: { reward: true },
            },
        },
    });
    if (!member) throw { statusCode: 404, message: 'Member tidak ditemukan' };
    return member;
};

const createMember = async (data, userId) => {
    const memberCode = await generateMemberCode();
    const member = await prisma.member.create({
        data: {
            memberCode,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
            status: data.status || 'ACTIVE',
        },
    });

    await createAuditLog({
        userId,
        action: 'MEMBER_CREATED',
        entity: 'Member',
        entityId: member.id,
        detail: { memberCode: member.memberCode, fullName: member.fullName },
    });

    return member;
};

const updateMember = async (id, data, userId) => {
    const member = await prisma.member.update({
        where: { id: Number(id) },
        data: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            status: data.status,
        },
    });

    await createAuditLog({
        userId,
        action: 'MEMBER_UPDATED',
        entity: 'Member',
        entityId: id,
        detail: data,
    });

    return member;
};

const updateMemberStatus = async (id, status, userId) => {
    const member = await prisma.member.update({
        where: { id: Number(id) },
        data: { status },
    });

    await createAuditLog({
        userId,
        action: 'MEMBER_STATUS_UPDATED',
        entity: 'Member',
        entityId: id,
        detail: { status },
    });

    return member;
};

module.exports = { getMembers, getMemberById, createMember, updateMember, updateMemberStatus };