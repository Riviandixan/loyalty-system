const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { createAuditLog } = require('../utils/audit');

const getProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true,
            _count: {
                select: { auditLogs: true },
            },
        },
    });
    if (!user) throw { statusCode: 404, message: 'User tidak ditemukan' };
    return user;
};

const updateProfile = async (userId, { fullName, email }) => {
    if (!fullName || !email) {
        throw { statusCode: 400, message: 'Nama dan email wajib diisi' };
    }

    const existing = await prisma.user.findFirst({
        where: { email, NOT: { id: userId } },
    });
    if (existing) throw { statusCode: 409, message: 'Email sudah digunakan' };

    const user = await prisma.user.update({
        where: { id: userId },
        data: { fullName, email },
        select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    });

    await createAuditLog({
        userId,
        action: 'PROFILE_UPDATED',
        entity: 'User',
        entityId: userId,
        detail: { fullName, email },
    });

    return user;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
    if (!currentPassword || !newPassword) {
        throw { statusCode: 400, message: 'Password lama dan baru wajib diisi' };
    }
    if (newPassword.length < 6) {
        throw { statusCode: 400, message: 'Password baru minimal 6 karakter' };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw { statusCode: 401, message: 'Password lama tidak sesuai' };

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
    });

    await createAuditLog({
        userId,
        action: 'PASSWORD_CHANGED',
        entity: 'User',
        entityId: userId,
    });

    return { message: 'Password berhasil diubah' };
};

module.exports = { getProfile, updateProfile, changePassword };