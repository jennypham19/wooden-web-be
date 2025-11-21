'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DesignRequest extends Model{
        static associate(models){
            DesignRequest.hasMany(models.DesignRequestInputFile, {
                foreignKey: 'design_request_id',
                as: 'designRequestInputFiles'
            });
            DesignRequest.hasMany(models.DesignRequestReferenceLink, {
                foreignKey: 'design_request_id',
                as: 'designRequestReferenceLinks'
            });
            DesignRequest.belongsTo(models.User, {
                foreignKey: 'curator_id',
                as: 'curatorRequest'
            });
            DesignRequest.hasOne(models.TechnicalSpecification, {
                foreignKey: 'design_request_id',
                as: 'requestTechnicalSpecifications'
            });
            DesignRequest.belongsTo(models.Order, {
                foreignKey: 'order_id',
                as: 'designRequestsOrder'
            });
            DesignRequest.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'designRequestProduct'
            });
            DesignRequest.belongsTo(models.Customer, {
                foreignKey: 'customer_id',
                as: 'designRequestCustomer'
            });
            DesignRequest.belongsTo(models.User, {
                foreignKey: 'curator_id',
                as: 'designRequestUser'
            })
        }
    }

    DesignRequest.init({
        // Cột id: UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // Cột request_code: mã yêu cầu
        request_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Mã sản phẩm
        product_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Tiêu đề yêu cầu
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Mô tả yêu cầu thiết kế
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // Mã đơn hàng
        order_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Mã khách hàng
        customer_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Mã người phụ trách + quản lý
        curator_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Trạng thái
        status: {
            type: DataTypes.ENUM('pending', 'done'),
            allowNull: false,
            defaultValue: 'pending'
        },
        // Deadline hoàn thành bản thiết kế
        due_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Ngày hoàn thành bản thiết kế
        completed_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        // Mức độ ưu tiên
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
            allowNull: false,
            defaultValue: 'medium'
        },
        // Yêu cầu đặc biệt từ khách hàng
        special_requirement: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'DesignRequest'
    });
    return DesignRequest;
}