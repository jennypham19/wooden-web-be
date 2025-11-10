'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Machine extends Model {
        static associate(models) {

        }
    }

    Machine.init({
        // Cột id: UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV5
        },
        // tên máy
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // mã máy
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // thông số
        specifications: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // thương hiệu
        brand: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // trọng lượng
        weight: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // kích thước
        dimensions: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // công suất
        power: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // phần trăm bảo dưỡng
        maintenance_percentage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // tình trạng
        /*
            1. Đang hoạt động
            2. Tạm dừng
            3. Ngừng hoạt động
            4. Đang bảo trì
            5. Đang sửa chữa
            6. Lỗi/ Hỏng
        */
        status: {
            type: DataTypes.ENUM('operating', 'paused', 'stopped', 'under_maintenance', 'under_repair', 'faulty'),
            allowNull: false,
        },
        // ngày bảo dưỡng
        maintenance_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        // ngày hoàn thành
        completion_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        // ngày mua
        purchase_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // ngày hết hạn bảo hành
        warranty_expiration_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // mô tả
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // lý do
        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        // ngày khởi động lại
        start_again_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        // url của hình ảnh máy
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // name của hình ảnh máy
        name_url: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Machine'
    });
    return Machine;
}