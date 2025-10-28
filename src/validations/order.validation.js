const Joi = require('joi');
const createOrder = {
    body: Joi.object().keys({
        customerId: Joi.string().required().messages({
           'string.empty': 'Khách hàng không được để trống',
           'any.required': 'Khách hàng là trường bắt buộc' 
        }),
        codeOrder: Joi.string().required().messages({
            'string.empty': 'Mã đơn hàng không được để trống',
            'any.required': 'Mã đơn hàng là trường bắt buộc'
        }),
        name: Joi.string().required().messages({
            'string.empty': 'Tên đơn hàng không được để trống',
            'any.required': 'Tên khách hàng là trường bắt buộc'
        }),
        dateOfReceipt: Joi.string().required().messages({
            'string.empty': 'Ngày nhận đơn không được để trống',
            'any.required': 'Ngày nhận đơn là trường bắt buộc'
        }),
        dateOfPayment: Joi.string().required().messages({
            'string.empty': 'Ngày trả đơn không được để trống',
            'any.required': 'Ngày trả đơn là trường bắt buộc'
        }),
        amount: Joi.number().integer().required().messages({
            'string.empty': 'Số lượng không được để trống',
            'any.required': 'Số lượng là trường bắt buộc'
        }),
        requiredNote: Joi.string().required().messages({
            'string.empty': 'Yêu cầu không được để trống',
            'any.required': 'Yêu cầu là trường bắt buộc'
        }),
        proccess: Joi.string().optional(),
        status: Joi.string().optional(),
    })
}

const queryOrders = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        searchTerm: Joi.string().optional(), 
        status: Joi.string().optional() 
    })
}

const queryOrder = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

module.exports = {
    createOrder,
    queryOrders,
    queryOrder
}