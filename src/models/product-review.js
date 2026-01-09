'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductReview extends Model {
        static associate(models){
            ProductReview.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'productReview'
            })
        }
    }

    ProductReview.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        overall_quality: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        aesthetics: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        customer_requirement: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        satisfaction: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        average_score: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'ProductReview'
    });
    return ProductReview;
}