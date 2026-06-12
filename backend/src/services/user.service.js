const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { createAuditLog } = require('../utils/audit');

const getUsers = async () => {
    return prisma.user.findMany({
        select: { id: true, fullName: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
    });
};

const createUser = async (data, userId) => {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: { fullName: data.fullName, email: data.email, password: hashed, role: data.role || 'STAFF' },
        select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    });
    await createAuditLog({ userId, action: 'USER_CREATED', entity: 'User', entityId: user.id, detail: { email: user.email } });
    return user;
};

const updateUser = async (id, data, userId) => {
    const updateData = { fullName: data.fullName, email: data.email, role: data.role };
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.update({
        where: { id: Number(id) },
        data: updateData,
        select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    });
    await createAuditLog({ userId, action: 'USER_UPDATED', entity: 'User', entityId: id });
    return user;
};

const deleteUser = async (id, userId) => {
    if (Number(id) === userId) throw { statusCode: 400, message: 'Tidak bisa menghapus akun sendiri' };
    await prisma.user.delete({ where: { id: Number(id) } });
    await createAuditLog({ userId, action: 'USER_DELETED', entity: 'User', entityId: id });
};

module.exports = { getUsers, createUser, updateUser, deleteUser };