const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Seed admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@loyaltyos.com' },
        update: {},
        create: {
            fullName: 'Super Admin',
            email: 'admin@loyaltyos.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    // Seed staff user
    const staffPassword = await bcrypt.hash('staff123', 10);
    await prisma.user.upsert({
        where: { email: 'staff@loyaltyos.com' },
        update: {},
        create: {
            fullName: 'Staff User',
            email: 'staff@loyaltyos.com',
            password: staffPassword,
            role: 'STAFF',
        },
    });

    // Seed rewards
    await prisma.reward.createMany({
        skipDuplicates: true,
        data: [
            { name: 'Voucher Rp10.000', requiredPoint: 100, description: 'Voucher belanja senilai Rp10.000' },
            { name: 'Voucher Rp25.000', requiredPoint: 250, description: 'Voucher belanja senilai Rp25.000' },
            { name: 'Voucher Rp50.000', requiredPoint: 500, description: 'Voucher belanja senilai Rp50.000' },
        ],
    });

    // Seed sample members
    const members = [
        { memberCode: 'MBR-000001', fullName: 'Siti Rahayu', email: 'siti@email.com', phone: '08111234567', pointBalance: 250, status: 'ACTIVE' },
        { memberCode: 'MBR-000002', fullName: 'Budi Santoso', email: 'budi@email.com', phone: '08221234567', pointBalance: 120, status: 'ACTIVE' },
        { memberCode: 'MBR-000003', fullName: 'Dewi Putri', email: 'dewi@email.com', phone: '08331234567', pointBalance: 480, status: 'ACTIVE' },
        { memberCode: 'MBR-000004', fullName: 'Agus Wijaya', email: 'agus@email.com', phone: '08441234567', pointBalance: 75, status: 'INACTIVE' },
        { memberCode: 'MBR-000005', fullName: 'Rina Marlina', email: 'rina@email.com', phone: '08551234567', pointBalance: 320, status: 'ACTIVE' },
    ];

    for (const m of members) {
        await prisma.member.upsert({
            where: { memberCode: m.memberCode },
            update: {},
            create: m,
        });
    }

    console.log('✅ Seed complete');
    console.log('');
    console.log('📋 Login credentials:');
    console.log('  Admin → admin@loyaltyos.com / admin123');
    console.log('  Staff → staff@loyaltyos.com / staff123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });