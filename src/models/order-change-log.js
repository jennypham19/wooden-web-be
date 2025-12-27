'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderChangeLog extends Model{
        static associate(models){
            OrderChangeLog.belongsTo(models.User, {
                foreignKey: 'changed_by',
                as: 'orderChangeLogUser'
            });
            OrderChangeLog.belongsTo(models.Order, {
                foreignKey: 'order_id',
                as: 'orderChangeLog'
            })
        }
    }

    OrderChangeLog.init({
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
        // Cột field_name: tên trường thay đổi
        field_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        old_value: {
            type: DataTypes.DATE,
            allowNull: false
        },
        new_value: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Cột changed_by: id người thay đổi
        changed_by: {
            type: DataTypes.UUID,
            allowNull: false
        },
        changed_role: {
            type: DataTypes.STRING,
            allowNull: false
        }        
    }, {
        sequelize,
        modelName: 'OrderChangeLog'
    });
    return OrderChangeLog
}