const Joi = require('joi');

const queryProducts = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

const updateImageAndStatusProduct = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        status: Joi.string().required(),
        nameImage: Joi.string().required(),
        urlImage: Joi.string().required()
    })
}

const sendRequestMilestone = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        evaluatedStatus: Joi.string().required(),
        reworkReason: Joi.string().required(),
        reworkStartedAt: Joi.string().required(),
        reworkDeadline: Joi.string().required(),
        changedBy: Joi.string().required(),
        changedRole: Joi.string().required(),
        carpenters: Joi.array().required(),
    })
}

const sendEvaluationMilestone = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        evaluatedStatus: Joi.string().required(),
        evaluationDescription: Joi.string().required(),
        changedBy: Joi.string().required(),
        changedRole: Joi.string().required(),
        carpenters: Joi.array().required(),
    })
}

const sendEvaluationWorkOrder = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        evaluatedStatusWorkOrder: Joi.string().required(),
        evaluationDescriptionWorkOrder: Joi.string().required(),
        changedBy: Joi.string().required(),
        changedRole: Joi.string().required(),
        carpenters: Joi.array().required(),
    })
}

const evaluationProduct = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        reviews: Joi.object().required(),
        comment: Joi.string().optional().allow(null),
        averageScore: Joi.string().required(),
        orderId: Joi.string().required(),
    })
}

module.exports = {
    queryProducts,
    updateImageAndStatusProduct,
    sendRequestMilestone,
    sendEvaluationMilestone,
    sendEvaluationWorkOrder,
    evaluationProduct
}