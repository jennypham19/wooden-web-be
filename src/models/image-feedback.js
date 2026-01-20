'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ImageFeedback extends Model {
        static associate(models){
            ImageFeedback.belongsTo(models.Feedback, {
                foreignKey: 'feedback_id',
                as: 'imagesFeedback'
            })
        }
    }

    ImageFeedback.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        feedback_id: {
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
        modelName: 'ImageFeedback'
    });

    return ImageFeedback;
}