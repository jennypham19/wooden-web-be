'use strict'

const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model{
        static associate(models){
            Notification.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'notificationUser'
            })
        }
    }

    Notification.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Notification'
    });
    return Notification;
}