'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Feedback extends Model{
        static associate(models) {
            Feedback.belongsTo(models.Order, {
                foreignKey: 'order_id',
                as: 'feedbackOrder'
            });
            Feedback.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'feedbackProduct'
            });
            Feedback.belongsTo(models.Customer, {
                foreignKey: 'customer_id',
                as: 'feedbackCustomer'
            });
            Feedback.belongsTo(models.User, {
                foreignKey: 'staff_id',
                as: 'feedbackStaff'
            })
        }
    }

    Feedback.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        order_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        customer_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        staff_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        customer_feedback_text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        staff_note: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        feedback_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('draft', 'confirmed', 'locked'),
            defaultValue: 'draft'
        }

    }, {
        sequelize,
        modelName: 'Feedback'
    });
    return Feedback;
}