'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderReferenceLink extends Model{
        static associate(models){
            OrderReferenceLink.belongsTo(models.Order, {
                foreignKey: 'order_id',
                as: 'order'
            });
            OrderReferenceLink.belongsTo(models.ReferenceLink, {
                foreignKey: 'reference_link_id',
                as: 'referenceLinks'
            })
        }
    }

    OrderReferenceLink.init({
        // UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // Cột order_id: khóa phụ bảng Orders
        order_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Cột reference_link_id: khóa phụ bảng ReferenceLinks
        reference_link_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'OrderReferenceLink'
    });

    return OrderReferenceLink;
}