'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models){
            Product.belongsTo(models.Order, {
                foreignKey: 'order_id',
                as: 'productsOrder'
            });
            Product.belongsTo(models.User, {
                foreignKey: 'manager_id',
                as: 'productsUser'
            })
        }
    }

    Product.init({
        // Cột id: UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // Cột order_id: UUID, khóa phụ bảng Orders
        order_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Cột manager_id: UUID, khóa phụ bảng Users
        manager_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Cột name: tên sản phẩm, kiểu chuỗi, không null
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột description: mô tả sản phẩm, kiểu văn bản, không null
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // Cột target: mục tiêu sản phẩm, kiểu văn bản, không null
        target: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // Cột proccess: tiến độ sản phẩm, kiểu chuỗi
        /* Các tiến độ
        1. Chưa hoạt động 0% (not_started_0%),
        2. Đang hoạt động 25% (in_progress_25%),
        3. Đang hoạt động 50% (in_progress_50%),
        4. Đang hoạt động 75% (in_progress_75%),
        5. Đã hoàn thành 100% (completed_100%)
        */
        proccess: {
            type: DataTypes.ENUM('not_started_0%', 'in_progress_25%', 'in_progress_50%', 'in_progress_75%', 'completed_100%'),
            allowNull: false,
        },
        // Cột status: trạng thái sản phẩm, kiểu chuỗi
        status: {
            type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Product'
    });
    return Product;
}