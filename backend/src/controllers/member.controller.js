const memberService = require('../services/member.service');
const { successResponse, paginatedResponse } = require('../utils/response');

const getMembers = async (req, res, next) => {
    try {
        const { page, limit, search, status } = req.query;
        const result = await memberService.getMembers({ page, limit, search, status });
        return paginatedResponse(res, result.data, result.pagination);
    } catch (err) {
        next(err);
    }
};

const getMemberById = async (req, res, next) => {
    try {
        const member = await memberService.getMemberById(req.params.id);
        return successResponse(res, member);
    } catch (err) {
        next(err);
    }
};

const createMember = async (req, res, next) => {
    try {
        const member = await memberService.createMember(req.body, req.user.id);
        return successResponse(res, member, 'Member berhasil ditambahkan', 201);
    } catch (err) {
        next(err);
    }
};

const updateMember = async (req, res, next) => {
    try {
        const member = await memberService.updateMember(req.params.id, req.body, req.user.id);
        return successResponse(res, member, 'Member berhasil diperbarui');
    } catch (err) {
        next(err);
    }
};

const updateMemberStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!['ACTIVE', 'INACTIVE'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status tidak valid' });
        }
        const member = await memberService.updateMemberStatus(req.params.id, status, req.user.id);
        return successResponse(res, member, 'Status member diperbarui');
    } catch (err) {
        next(err);
    }
};

module.exports = { getMembers, getMemberById, createMember, updateMember, updateMemberStatus };