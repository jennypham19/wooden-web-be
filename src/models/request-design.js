'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RequestDesign extends Model{
        static associate(models){

        }
    }

    RequestDesign.init({
        // Cột id: UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // Cột code_request: mã yêu cầu
        code_request: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Mã sản phẩm
        product_id: {
            type: DataTypes.UUID,
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
            type: DataTypes.ENUM('in_progress', 'completed'),
            allowNull: false,
            defaultValue: 'in_progress'
        },
        // Hạn nộp
        date_submitted: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'RequestDesign'
    });
    return RequestDesign;
}