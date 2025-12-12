'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class WorkOrder extends Model {
        static associate(models){
            WorkOrder.belongsTo(models.User, {
                foreignKey: 'manager_id',
                as: 'workOrdersManager'
            }),
            WorkOrder.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'workOrderProduct'
            }),
            WorkOrder.hasMany(models.Worker, {
                foreignKey: 'work_order_id',
                as: 'workOrderWorkers'
            }),
            WorkOrder.hasMany(models.WorkMilestone, {
                foreignKey: 'work_order_id',
                as: 'workOrderWorkMilestones'
            })
        }
    }

    WorkOrder.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        manager_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        work_milestone: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'WorkOrder'
    });

    return WorkOrder
}