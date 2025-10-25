const Joi = require('joi');

const createCustomer = {
    body: Joi.object().keys({
        name: Joi.string().required().messages({
            'string.empty': 'Tên không được để trống.',
            'any.required': 'Tên là trường bắt buộc.'
        }),
        phone: Joi.string().required().messages({
            'string.empty': 'Số điện thoại không được để trống.',
            'any.required': 'Số điện thoại là trường bắt buộc.'
        }),
        address: Joi.string().required().messages({
            'string.empty': 'Địa chỉ không được để trống.',
            'any.required': 'Địa chỉ là trường bắt buộc'
        })
    })
}

const updateCustomer = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        name: Joi.string().required().messages({
            'string.empty': 'Tên không được để trống.',
            'any.required': 'Tên là trường bắt buộc.'
        }),
        phone: Joi.string().required().messages({
            'string.empty': 'Số điện thoại không được để trống.',
            'any.required': 'Số điện thoại là trường bắt buộc.'
        }),
        address: Joi.string().required().messages({
            'string.empty': 'Địa chỉ không được để trống.',
            'any.required': 'Địa chỉ là trường bắt buộc'
        })
    })
}

const queryCustomer = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

const queryCustomers = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        searchTerm: Joi.string().optional(),  
    })
}

module.exports = {
    createCustomer,
    updateCustomer,
    queryCustomer,
    queryCustomers
}