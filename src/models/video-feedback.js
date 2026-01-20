'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class VideoFeedback extends Model{
        static associate(models){
            VideoFeedback.belongsTo(models.Feedback, {
                foreignKey: 'feedback_id',
                as: 'videoFeedback'
            })
        }
    }

    VideoFeedback.init({
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
        },
        duration: {
            type: DataTypes.FLOAT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'VideoFeedback'
    });
    return VideoFeedback;
}