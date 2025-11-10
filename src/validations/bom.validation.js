const Joi = require('joi');

const createBom = {
    body: Joi.object().keys({
        code: Joi.string().required().messages({
            'string.empty': 'Mã Bom không được để trống',
            'any.required': 'Mã Bom là trường bắt buộc'
        }),
        orderId: Joi.string().required().messages({
            'string.empty': 'Đơn hàng không được để trống',
            'any.required': 'Đơn hàng là trường bắt buộc'
        }),
        productId: Joi.string().required().messages({
            'string.empty': 'Sản phẩm không được để trống',
            'any.required': 'Sản phẩm là trường bắt buộc'
        }),
        amount: Joi.string().required().messages({
            'string.empty': 'Số lượng vật tư không được để trống',
            'any.required': 'Số lượng vật tư là trường bắt buộc'
        }),
        userId: Joi.string().required().messages({
            'string.empty': 'Người tạo không được để trống',
            'any.required': 'Người tạo là trường bắt buộc'
        }),
        materials: Joi.array().items(
            Joi.object({
                code: Joi.string().required(),
                name: Joi.string().required(),
                unit: Joi.string().required(),
                amount: Joi.string().required(),
                note: Joi.string().allow('', null),
                imageUrl: Joi.string().required(),
                nameUrl: Joi.string().required(),
            })
        )
    })
}

const queryBoms = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        searchTerm: Joi.string().optional(),
    })
}

const queryBom = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

module.exports = {
    createBom,
    queryBoms,
    queryBom
}