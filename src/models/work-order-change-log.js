'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class WorkOrderChangeLog extends Model {
        static associate(models){
            WorkOrderChangeLog.belongsTo(models.WorkOrder, {
                foreignKey: 'work_order_id',
                as: 'workOrderChangeLog'
            });
            WorkOrderChangeLog.belongsTo(models.User, {
                foreignKey: 'changed_by',
                as: 'workOrderChangeLogUser'
            })
        }
    }

    WorkOrderChangeLog.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        work_order_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        field_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        old_status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        new_status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        changed_by: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        changed_role: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'WorkOrderChangeLog'
    });
    return WorkOrderChangeLog;
}