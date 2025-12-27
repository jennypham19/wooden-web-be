'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MilestoneChangeLog extends Model {
        static associate(models){
            MilestoneChangeLog.belongsTo(models.User, {
                foreignKey: 'changed_by',
                as: 'milestoneChangeLogUser'
            }),
            MilestoneChangeLog.belongsTo(models.WorkOrder, {
                foreignKey: 'work_order_id',
                as: 'milestoneChangeLogWorkOrder'
            }),
            MilestoneChangeLog.belongsTo(models.WorkMilestone, {
                foreignKey: 'work_milestone_id',
                as: 'milestoneChangeLogWorkMilestone'
            })
        }
    }

    MilestoneChangeLog.init({
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
        work_milestone_id: {
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
        modelName: 'MilestoneChangeLog'
    });
    return MilestoneChangeLog;
}