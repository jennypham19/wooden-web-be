const Joi = require('joi');
const saveFeedbackDraft = {
    body: Joi.object().keys({
        rating: Joi.number().integer().required().messages({
            'string.empty': 'Mức độ hài lòng không được để trống',
            'any.required': 'Mức độ hài lòng là trường bắt buộc'
        }),
        customerFeedbackText: Joi.string().required().messages({
            'string.empty': 'Ý kiến khách hàng không được để trống',
            'any.required': 'Ý kiến khách hàng là trường bắt buộc'
        }),
        staffNote: Joi.string().required().messages({
            'string.empty': 'Ghi chú nội bộ không được để trống',
            'any.required': 'Ghi chú nội bộ là trường bắt buộc'
        }),
        orderId: Joi.string().required(),
        productId: Joi.string().required(),
        customerId: Joi.string().required(),
        staffId: Joi.string().required(),
        feedbackDate: Joi.string().required()
    })
}

const saveFeedbackConfirmed = {
    body: Joi.object().keys({
        rating: Joi.number().integer().required().messages({
            'string.empty': 'Mức độ hài lòng không được để trống',
            'any.required': 'Mức độ hài lòng là trường bắt buộc'
        }),
        customerFeedbackText: Joi.string().required().messages({
            'string.empty': 'Ý kiến khách hàng không được để trống',
            'any.required': 'Ý kiến khách hàng là trường bắt buộc'
        }),
        orderId: Joi.string().required(),
        productId: Joi.string().required(),
        customerId: Joi.string().required(),
        staffId: Joi.string().required(),
        feedbackDate: Joi.string().required(),
        images: Joi.array().required(),
        video: Joi.object().required()
    })
}

const queryFeedbacks = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        orderCode: Joi.string().optional(),
        rating: Joi.number().integer().optional(),
        status: Joi.string().optional()      
    })
}

module.exports = {
    saveFeedbackDraft,
    queryFeedbacks,
    saveFeedbackConfirmed
}