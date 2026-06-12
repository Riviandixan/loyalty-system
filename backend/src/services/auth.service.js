const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { createAuditLog } = require('../utils/audit');

const login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw { statusCode: 401, message: 'Email atau password salah' };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw { statusCode: 401, message: 'Email atau password salah' };

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    await createAuditLog({
        userId: user.id,
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: user.id,
        detail: { email: user.email },
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};

const register = async ({ fullName, email, password }) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw { statusCode: 400, message: 'Email sudah terdaftar' };

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { fullName, email, password: hashedPassword, role: 'STAFF' },
    });
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

module.exports = { login, register };