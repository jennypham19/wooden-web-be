const Joi = require('joi');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().messages({
      'string.empty': 'Email không được để trống.',
      'any.required': 'Email là trường bắt buộc.',
    }),
    fullName: Joi.string().required().messages({
      'string.empty': 'Họ tên không được để trống.',
      'any.required': 'Họ tên là trường bắt buộc.',
    }),
    role: Joi.string().required().messages({
      'string.empty': 'Vai trò không được để trống.',
      'any.required': 'Vai trò là trường bắt buộc.',
    }),
    avatarUrl: Joi.string().required(),
    password: Joi.string().required().messages({
        'string.empty': 'Mật khẩu không được để trống.',
        'any.required': 'Mật khẩu là trường bắt buộc.',
    }),
    phone: Joi.string().required().messages({
        'string.empty': 'Số điện thoại không được để trống.',
        'any.required': 'Số điện thoại là trường bắt buộc.',
    }),
    nameImage: Joi.string().required(),
    dob: Joi.string().required().messages({
        'string.empty': 'Ngày sinh không được để trống.',
        'any.required': 'Ngày sinh là trường bắt buộc.'
    }),
    code: Joi.string().required().messages({
        'string.empty': 'Mã nhân viên không được để trống.',
        'any.required': 'Mã nhân viên là trường bắt buộc.'
    }),
    gender: Joi.string().required().messages({
        'string.empty': 'Giới tính không được để trống.',
        'any.required': 'Giới tính là trường bắt buộc.'
    }),
    work: Joi.string().required().messages({
        'string.empty': 'Công việc không được để trống.',
        'any.required': 'Công việc là trường bắt buộc.'
    }),
    department: Joi.string().required().messages({
        'string.empty': 'Phòng ban không được để trống.',
        'any.required': 'Phòng ban là trường bắt buộc.'
    }),
    address: Joi.string().optional().allow(null),
  }),
};

// Lấy ra danh sách + search
const getQuery = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        searchTerm: Joi.string().optional(),
        role: Joi.string().optional()
    })
}

// Lấy ra danh sách + search
const getQueryDecentralized = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        searchTerm: Joi.string().optional(),
        isPermission: Joi.string().optional()
    })
}


// lấy chi tiết
const getUser = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
    createUser,
    getQuery,
    getQueryDecentralized,
    getUser
}