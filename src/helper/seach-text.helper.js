const { Sequelize, Op } = require("sequelize")

const iLikeNumberToText = (column, term) => {
    Sequelize.where(Sequelize.cast(Sequelize.col(column), 'TEXT'), { [Op.iLike]: `%${term}%`})
}

const iLikeText = (column, term) => {
    Sequelize.where(Sequelize.col(column), { [Op.iLike]: `%${term}%`})
}

module.exports = {
    iLikeNumberToText,
    iLikeText
}