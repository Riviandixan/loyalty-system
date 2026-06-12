const userService = require('../services/user.service');
const { successResponse } = require('../utils/response');

const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getUsers();
        return successResponse(res, users);
    } catch (err) { next(err); }
};

const createUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body, req.user.id);
        return successResponse(res, user, 'User berhasil ditambahkan', 201);
    } catch (err) { next(err); }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body, req.user.id);
        return successResponse(res, user, 'User berhasil diperbarui');
    } catch (err) { next(err); }
};

const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id, req.user.id);
        return successResponse(res, null, 'User berhasil dihapus');
    } catch (err) { next(err); }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };