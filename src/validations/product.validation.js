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

module.exports = {
    queryProducts,
    updateImageAndStatusProduct
}