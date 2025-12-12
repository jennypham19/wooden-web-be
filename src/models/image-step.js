'use strict';
const { Model } =  require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ImageStep extends Model {
        static associate(models){
            ImageStep.belongsTo(models.Step, {
                foreignKey: 'step_id',
                as: 'imageSteps'
            })
        }
    }

    ImageStep.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        step_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ImageStep'
    });
    return ImageStep
}