const express = require('express');
const router = express.Router();
const profileService = require('../services/profile.service');
const { authenticate } = require('../middlewares/auth.middleware');
const { successResponse } = require('../utils/response');

router.use(authenticate);

// GET profile saya
router.get('/', async (req, res, next) => {
    try {
        const data = await profileService.getProfile(req.user.id);
        return successResponse(res, data);
    } catch (err) { next(err); }
});

// UPDATE profile
router.put('/', async (req, res, next) => {
    try {
        const { fullName, email } = req.body;
        const data = await profileService.updateProfile(req.user.id, { fullName, email });
        return successResponse(res, data, 'Profil berhasil diperbarui');
    } catch (err) { next(err); }
});

// GANTI PASSWORD
router.put('/change-password', async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const data = await profileService.changePassword(req.user.id, { currentPassword, newPassword });
        return successResponse(res, data, 'Password berhasil diubah');
    } catch (err) { next(err); }
});

module.exports = router;