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
        inputFiles: Joi.array().optional(),
        referenceLinks: Joi.array().optional(),
        products: Joi.array().optional(),
        createdBy: Joi.string().required()
    })
}

const queryOrders = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        searchTerm: Joi.string().optional(), 
        status: Joi.string().optional(),
        id: Joi.string().optional()
    })
}

const queryOrder = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

const createOrderWork = {
    body: Joi.object().keys({
        orderId: Joi.string().required().messages({
           'string.empty': 'Đơn hàng không được để trống',
           'any.required': 'Đơn hàng là trường bắt buộc' 
        }),
        managerId: Joi.string().required().messages({
           'string.empty': 'Quản lý không được để trống',
           'any.required': 'Quản lý là trường bắt buộc' 
        }),
        productId: Joi.string().required().messages({
            'string.empty': 'Sản phẩm không được để trống',
            'any.required': 'Sản phẩm là trường bắt buộc'
        }),
        workMilestone: Joi.string().required().messages({
            'string.empty': 'Mốc công việc không được để trống',
            'any.required': 'Mốc công việc là trường bắt buộc'
        }),
        workers: Joi.array().required(),
        workMilestones: Joi.array().required(),
    })
}

const queryOrdersByCarpenterId = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        searchTerm: Joi.string().optional(), 
        status: Joi.string().optional(),
        id: Joi.string().required(), 
    })
}

const updateStep = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        proccess: Joi.string().required().messages({
           'string.empty': 'Trạng thái không được để trống',
           'any.required': 'Trạng thái là trường bắt buộc' 
        }),
        progress: Joi.string().required().messages({
           'string.empty': 'Tiến độ không được để trống',
           'any.required': 'Tiến độ là trường bắt buộc' 
        }),
        images: Joi.array().required()
    })
}

// Thêm mới steps
const createAddStep = {
    body: Joi.object().keys({
        workMilestoneId: Joi.string().required(),
        name: Joi.string().required().messages({
           'string.empty': 'Tên không được để trống',
           'any.required': 'Tên là trường bắt buộc'
        }),
        proccess: Joi.string().required(),
        progress: Joi.string().required(),
    })
}

const updateProccessOrder = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        proccess: Joi.string().required()
    })
}

// update order
const updateOrder = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        dateOfPayment: Joi.string().required(),
        reason: Joi.string().required(),
        manager: Joi.object().required()
    })
}

const queryOrdersWithProccess = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        isEvaluated: Joi.string().optional(),
        searchTerm: Joi.string().optional(),
    })
}

module.exports = {
    createOrder,
    queryOrders,
    queryOrder,
    createOrderWork,
    queryOrdersByCarpenterId,
    updateStep,
    createAddStep,
    updateProccessOrder,
    updateOrder,
    queryOrdersWithProccess
}