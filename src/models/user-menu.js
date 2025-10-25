//model/role-group-menu.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserMenu extends Model {
        static associate(models){
            UserMenu.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'menuUser'
            });
            UserMenu.belongsTo(models.Menu, {
                foreignKey: 'menu_id',
                as: 'menu'
            })
        }
    }
    UserMenu.init(
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
            // Cột menu_id: khóa ngoại, liên kết bảng Menu, không được phép null
            menu_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: 'UserMenu'
        }
    );
    return UserMenu;
}