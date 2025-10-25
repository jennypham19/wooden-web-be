//model/role-group-action.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserAction extends Model {
        static associate(models){
            UserAction.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'actionUser'
            });
            UserAction.belongsTo(models.MenuAction, {
                foreignKey: 'menu_action_id',
                as: 'menuAction'
            })
        }
    }
    UserAction.init(
        {
            // Cột id: UUID tự sinh, là khóa chính
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4, // dùng thư viện uuid => uuidv4 hoặc Sequelize tự sinh UUID (v4): DataTypes.UUIDV4
                allowNull: false,
                primaryKey: true
            },
            // Cột user_id: khóa ngoại, liên kết bảng User, không được phép null
            user_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            // Cột menu_action_id: khóa ngoại, liên kết bảng MenuAction, không được phép null
            menu_action_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: 'UserAction'
        }
    );
    return UserAction;
}