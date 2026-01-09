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
                foreignKey: 'worker_order_id',
                as: 'workOrderWorkers'
            }),
            WorkOrder.hasMany(models.WorkMilestone, {
                foreignKey: 'work_order_id',
                as: 'workOrderWorkMilestones'
            }),
            WorkOrder.belongsTo(models.Order, {
                foreignKey: 'order_id',
                as: 'workOrder'
            }),
            WorkOrder.hasOne(models.MilestoneChangeLog, {
                foreignKey: 'work_order_id',
                as: 'workOderMilestoneChangeLog'
            }),
            WorkOrder.hasMany(models.WorkMilestoneHistory, {
                foreignKey: 'work_order_id',
                as: 'workOrderMilestoneHistory'
            }),
            WorkOrder.hasOne(models.WorkOrderChangeLog, {
                foreignKey: 'work_order_id',
                as: 'workOrderChangeLog'
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
        order_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        work_milestone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        evaluated_status: {
            type: DataTypes.ENUM('pending', 'rework', 'approved'),
            defaultValue: 'pending',
            allowNull: false
        },
        evaluation_description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'WorkOrder'
    });

    return WorkOrder
}