'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class WorkMilestone extends Model{
        static associate(models){
            WorkMilestone.belongsTo(models.WorkOrder, {
                foreignKey: 'work_order_id',
                as: 'workMilestonesWorkOrder'
            }),
            WorkMilestone.hasMany(models.Step, {
                foreignKey: 'work_milestone_id',
                as: 'workMilestoneSteps'
            }),
            WorkMilestone.hasOne(models.MilestoneChangeLog, {
                foreignKey: 'work_milestone_id',
                as: 'workMilestoneChangeLog'
            })
        }
    }

    WorkMilestone.init({
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
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        step: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        target: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        evaluated_status: {
            type: DataTypes.ENUM('pending', 'rework', 'approved', 'overdue'),
            allowNull: false,
            defaultValue: 'pending'
        },
        evaluation_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        rework_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        rework_deadline: {
            type: DataTypes.DATE,
            allowNull: true
        },
        rework_started_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'WorkMilestone'
    });
    return WorkMilestone;
}