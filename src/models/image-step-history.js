'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ImageStepHistory extends Model{
        static associate(models){
            ImageStepHistory.belongsTo(models.StepHistory, {
                foreignKey: 'step_history_id',
                as: 'imagesStepHistory'
            })
        }
    }

    ImageStepHistory.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        step_history_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ImageStepHistory',
        tableName: 'ImageStepHistorys',
        freezeTableName: true
    });
    return ImageStepHistory;
}