'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class StepHistory extends Model{
        static associate(models){
            StepHistory.belongsTo(models.WorkMilestoneHistory, {
                foreignKey: 'work_milestone_history_id',
                as: 'stepsWorkMilestoneHistory'
            }),
            StepHistory.hasMany(models.ImageStepHistory, {
                foreignKey: 'step_history_id',
                as: 'stepHistoryImages'
            })
        }
    }

    StepHistory.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        work_milestone_history_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        proccess: {
            type: DataTypes.STRING,
            allowNull: false
        },
        progress: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'StepHistory',
        tableName: 'StepHistorys',
        freezeTableName: true
    });
    return StepHistory;
}