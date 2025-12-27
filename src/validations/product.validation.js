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

module.exports = {
    queryProducts,
    updateImageAndStatusProduct,
    sendRequestMilestone
}