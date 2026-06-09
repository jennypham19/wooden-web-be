'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DimensionProduct extends Model{
        static associate(models){
            DimensionProduct.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'dimensionProduct'
            })
        }
    }

    DimensionProduct.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        length: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        width: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'DimensionProduct'
    });
    return DimensionProduct;
}