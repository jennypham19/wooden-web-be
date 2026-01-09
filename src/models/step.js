'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Step extends Model{
        static associate(models){
            Step.belongsTo(models.WorkMilestone, {
                foreignKey: 'work_milestone_id',
                as: 'stepsWorkMilestone'
            });
            Step.hasMany(models.ImageStep, {
                foreignKey: 'step_id',
                as: 'stepImageSteps'
            });
            Step.belongsTo(models.User, {
                foreignKey: 'created_by',
                as: 'stepCreatedByUser'
            })
        }
    }

    Step.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // quá trình
        proccess: {
            type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
            allowNull: false,
            defaultValue: 'pending'
        },
        // tiến độ
        progress:{
            type: DataTypes.ENUM('0%', '20%', '40%', '60%', '80%', '100%'),
            allowNull: false,
            defaultValue: '0%'
        },
        work_milestone_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Step'
    });
    return Step
}