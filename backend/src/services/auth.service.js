const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { createAuditLog } = require('../utils/audit');
const { sendOtpEmail } = require('./email.service');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

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
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpVerification.deleteMany({ where: { email } });
    await prisma.otpVerification.create({
        data: { email, fullName, password: hashedPassword, otp, expiresAt },
    });

    await sendOtpEmail(email, otp);
    return { message: 'OTP telah dikirim ke email Anda' };
};

const verifyOtp = async ({ email, otp }) => {
    const record = await prisma.otpVerification.findFirst({
        where: { email },
        orderBy: { createdAt: 'desc' },
    });

    if (!record) throw { statusCode: 404, message: 'OTP tidak ditemukan' };
    if (new Date() > record.expiresAt) throw { statusCode: 400, message: 'OTP sudah kadaluarsa' };
    if (record.otp !== otp) throw { statusCode: 400, message: 'OTP tidak valid' };

    const user = await prisma.user.create({
        data: { fullName: record.fullName, email: record.email, password: record.password, role: 'STAFF' },
    });
    await prisma.otpVerification.deleteMany({ where: { email } });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const resendOtp = async ({ email }) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw { statusCode: 400, message: 'Email sudah terdaftar' };

    const pending = await prisma.otpVerification.findFirst({ where: { email } });
    if (!pending) throw { statusCode: 404, message: 'Tidak ada proses registrasi untuk email ini' };

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpVerification.updateMany({
        where: { email },
        data: { otp, expiresAt },
    });

    await sendOtpEmail(email, otp);
    return { message: 'OTP baru telah dikirim ke email Anda' };
};

module.exports = { login, register, verifyOtp, resendOtp };