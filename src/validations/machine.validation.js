const Joi = require('joi');
const createMachine = {
    body: Joi.object().keys({
        name: Joi.string().required().messages({
            'string.empty': 'Tên máy móc không được để trống',
            'any.required': 'Tên máy móc là trường bắt buộc'
        }),
        code: Joi.string().required().messages({
            'string.empty': 'Mã máy không được để trống',
            'any.required': 'Mã máy là trường bắt buộc'
        }),
        brand: Joi.string().required().messages({
            'string.empty': 'Thương hiệu không được để trống',
            'any.required': 'Thương hiệu là trường bắt buộc'
        }),
        weight: Joi.string().required().messages({
            'string.empty': 'Trọng lượng không được để trống',
            'any.required': 'Trọng lượng là trường bắt buộc'
        }),
        dimensions: Joi.string().required().messages({
            'string.empty': 'Kích thước không được để trống',
            'any.required': 'Kích thước là trường bắt buộc'
        }),
        power: Joi.string().required().messages({
            'string.empty': 'Công suất không được để trống',
            'any.required': 'Công suất là trường bắt buộc'
        }),
        purchaseDate: Joi.string().required().messages({
            'string.empty': 'Ngày mua không được để trống',
            'any.required': 'Ngày mua là trường bắt buộc'
        }),
        description: Joi.string().required().messages({
            'string.empty': 'Mô tả không được để trống',
            'any.required': 'Mô tả là trường bắt buộc'
        }),
        imageUrl: Joi.string().required(),
        nameUrl: Joi.string().required(),
        status: Joi.string().optional(),
        warrantyExpirationDate: Joi.string().optional()
    })
}

const queryMachines = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        searchTerm: Joi.string().optional(),
        status: Joi.string().optional()
    })
}

const queryMachine = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

const updateMachineByStatus = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        status: Joi.string().required(),
        reason: Joi.string().required().messages({
            'string.empty': 'Lý do hoặc mô tả không được để trống',
            'any.required': 'Lý do hoặc mô tả là trường bắt buộc'
        }),
        startAgainDate: Joi.string().allow('', null),
        repairedDate: Joi.string().allow('', null),
        maintenanceDate: Joi.string().allow('', null),
        maintenancePercentage: Joi.string().allow('', null),
    })
}

const updateMachineCompletionDate = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        status: Joi.string().optional(),
        completionDate: Joi.string().required()
    })
}

module.exports = {
    createMachine,
    queryMachines,
    queryMachine,
    updateMachineByStatus,
    updateMachineCompletionDate
}