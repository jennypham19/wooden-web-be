'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Action extends Model {
        static associate(models) {
            Action.hasMany(models.MenuAction, {
                foreignKey: 'action_id',
                as: 'actionsMenu'
            });
        }
    }

    Action.init({
        // Cột id: UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // dùng thư viện uuid => uuidv4 hoặc Sequelize tự sinh UUID (v4): DataTypes.UUIDV4
            allowNull: false,
            primaryKey: true
        },
        // Cột code: mã hành động, kiểu chuỗi và không được phép null
        code: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        // Cột name: tên hành động, kiểu chuỗi và không được phép null
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Action'
    });
    return Action;
}