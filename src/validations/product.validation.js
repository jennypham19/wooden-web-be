const Joi = require('joi');

const queryProducts = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
}

module.exports = {
    queryProducts
}