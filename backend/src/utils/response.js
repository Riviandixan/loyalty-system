const successResponse = (res, data, message = 'Berhasil', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

const paginatedResponse = (res, data, pagination, message = 'Berhasil') => {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination,
    });
};

const errorResponse = (res, message = 'Terjadi kesalahan', statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = { successResponse, paginatedResponse, errorResponse };