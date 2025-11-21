const Joi = require('joi');

const createDesignRequest = {
    body: Joi.object().keys({
        requestCode: Joi.string().required().messages({
            'string.empty': 'Mã không được để trống',
            'any.required': 'Mã là trường bắt buộc'
        }),
        title: Joi.string().required().messages({
            'string.empty': 'Tiêu đề không được để trống',
            'any.required': 'Tiêu đề là trường bắt buộc'
        }),
        orderId: Joi.string().required().messages({
            'string.empty': 'Đơn hàng không được để trống',
            'any.required': 'Đơn hàng là trường bắt buộc'
        }),
        productId: Joi.string().required().messages({
            'string.empty': 'Sản phẩm không được để trống',
            'any.required': 'Sản phẩm là trường bắt buộc'
        }),
        customerId: Joi.string().optional(),
        curatorId: Joi.string().required(),
        priority: Joi.string().required().messages({
            'string.empty': 'Độ ưu tiên không được để trống',
            'any.required': 'Độ ưu tiên là trường bắt buộc'
        }),
        status: Joi.string().optional(),
        dueDate: Joi.string().required().messages({
            'string.empty': 'Deadline hoàn thành không được để trống',
            'any.required': 'Deadline hoàn thành là trường bắt buộc'
        }),
        description: Joi.string().required().messages({
            'string.empty': 'Môt tả không được để trống',
            'any.required': 'Mô tả là trường bắt buộc'
        }),
        specialRequirement: Joi.string().optional(),
        inputFiles: Joi.array().optional(),
        referenceLinks: Joi.array().optional(),
        technicalSpecification: Joi.object({
            length: Joi.number().integer().required(),
            width: Joi.number().integer().required(),
            height: Joi.number().integer().required(),
            weight: Joi.number().integer().required(), 
            material: Joi.string().required(),
            color: Joi.string().required(),
            note: Joi.string().allow('', null)
        }).required()
    })
}

const queryDesignRequests = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        searchTerm: Joi.string().optional(),
    })
}

const queryDesignRequest = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

module.exports = {
    queryDesignRequests,
    queryDesignRequest,
    createDesignRequest
}