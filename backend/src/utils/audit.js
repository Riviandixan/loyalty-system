const prisma = require('../config/prisma');

const createAuditLog = async ({ userId, action, entity, entityId, detail }) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId: userId || null,
                action,
                entity,
                entityId: entityId ? String(entityId) : null,
                detail: detail ? JSON.stringify(detail) : null,
            },
        });
    } catch (err) {
        console.error('Audit log error:', err);
    }
};

module.exports = { createAuditLog };