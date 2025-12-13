'use strict';
const { v4 } = require('uuid');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.UserAction, {
                foreignKey: 'user_id',
                as: 'userAction'
            });
            User.hasMany(models.UserMenu, {
                foreignKey: 'user_id',
                as: 'userMenu'
            });
            User.hasMany(models.Product, {
                foreignKey: 'manager_id',
                as: 'userProducts'
            });
            User.hasMany(models.BOM, {
                foreignKey: 'user_id',
                as: 'userBOMs'
            });
            User.hasMany(models.DesignRequest, {
                foreignKey: 'curator_id',
                as: 'curatorDesignRequests'
            });
            User.hasMany(models.WorkOrder, {
                foreignKey: 'manager_id',
                as: 'managerWorkOrders'
            });
            User.hasMany(models.Worker, {
                foreignKey: 'worker_id',
                as: 'workers'
            })
        }
    }

    User.init({
        // Cột id: UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // dùng thư viện uuid => uuidv4 hoặc Sequelize tự sinh UUID (v4): DataTypes.UUIDV4
            allowNull: false,
            primaryKey: true
        },
        // Cột email: email của user, kiểu chuỗi, không null, là duy nhất
        email: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            unique: true 
        },
        // Cột password: mật khẩu của user, kiểu chuỗi, không null
        password: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        // Cột full_name: họ tên của user, kiểu chuỗi, không null
        full_name: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        // Cột role: chức vụ của user, không null, mặc định là carpenter (thợ mộc)
        role: {
            type: DataTypes.ENUM('admin', 'factory_manager', 'production_planner', 'production_supervisor', 'carpenter', 'qc', 'inventory_manager', 'technical_design', 'accounting', 'employee'),
            allowNull: false,
            defaultValue: 'carpenter'
        },
        // Cột dob: ngày sinh của user, kiểu ngày tháng, không null
        dob: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Cột code: mã của user, kiểu chuỗi, không null
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột gender: giới tính của user, kiểu chuỗi, không null
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột phone: số điện thoại của user, kiểu chuỗi, không null
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Cột work: công việc của user, kiểu chuỗi, không null
        work: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // Cột department: phòng ban của user, kiểu chuỗi, không null
        department: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột address: địa chỉ quê quán của user, kiểu chuỗi, có thể null
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Cột avatar_url: đường link ảnh đại diện của user, kiểu chuỗi, không null
        avatar_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột name_image: tên ảnh đại diện của user, kiểu chuỗi, không null
        name_image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột is_active: trạng thái kích hoạt của user, kiểu boolean, mặc định là true
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true // true là đã kích hoạt, false là vô hiệu hóa
        },
        // Cột is_reset: trạng thái reset mật khẩu của user, kiểu boolean, mặc định là false
        is_reset: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false // true là đã reset, false là không
        },
        // Cột is_permission: trạng thái phân quyền của user, kiểu boolean, mặc định là false
        is_permission: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        // Cột is_assigned: trạng thái khi được phân công
        is_assigned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'User'
    });
    return User;
}