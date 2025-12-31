'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class WorkMilestoneHistory extends Model{
        static associate(models){
            WorkMilestoneHistory.belongsTo(models.WorkOrder, {
                foreignKey: 'work_order_id',
                as: 'workMilestoneHistoryWorkOrder'
            }),
            WorkMilestoneHistory.belongsTo(models.WorkMilestone, {
                foreignKey: 'work_milestone_id',
                as: 'workMilestoneHistory'
            }),
            WorkMilestoneHistory.hasMany(models.StepHistory, {
                foreignKey: 'work_milestone_history_id',
                as: 'workMilestoneHistorySteps'
            })
        }
    }

    WorkMilestoneHistory.init({
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
        version: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false
        },
        evaluated_status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'WorkMilestoneHistory',
        tableName: 'WorkMilestoneHistorys',
        freezeTableName: true
    });
    return WorkMilestoneHistory;
}