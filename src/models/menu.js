'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Menu extends Model {
        static associate(models){
            Menu.hasMany(models.MenuAction, {
                foreignKey: 'menu_id',
                as: 'menusAction'
            });
            Menu.hasMany(models.UserMenu, {
                foreignKey: 'menu_id',
                as: 'menus'
            })
        }
    }

    Menu.init({
        // Cột id: UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // dùng thư viện uuid => uuidv4 hoặc Sequelize tự sinh UUID (v4): DataTypes.UUIDV4
            allowNull: false,
            primaryKey: true
        },
        // Cột code: mã menu, kiểu chuỗi và không được phép null, duy nhất
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { notEmpty: true}
        },
        // Cột name: tên menu, kiểu chuỗi và không được phép null
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột path: đường dẫn của menu, kiểu chuỗi và được phép null
        path: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Cột icon: biểu tượng của menu, kiểu chuỗi và được phép null,
        icon: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Cột parent_code: mã cha của menu, kiểu chuỗi và được phép null,
        parent_code: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Menu'
    });
    return Menu;
}