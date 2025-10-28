'use strict';
const { v4 } = require('uuid');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        static associate(models) {
            Customer.hasMany(models.Order, {
                foreignKey: 'customer_id',
                as: 'customerOrders'
            })
        }
    }

    Customer.init({
        // Cột id: UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // dùng thư viện uuid => uuidv4 hoặc Sequelize tự sinh UUID (v4): DataTypes.UUIDV4
            allowNull: false,
            primaryKey: true
        },
        // Cột name: tên của khách hàng, kiểu chuỗi, không null
        name: { 
            type: DataTypes.STRING, 
            allowNull: false, 
        },
        // Cột phone: số điện thoại của khách hàng, kiểu chuỗi, không null
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Cột address: địa chỉ quê quán của user, kiểu chuỗi, không null
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột amount_of_orders: số lượng đơn hàng của khách hàng, kiểu số, không null
        amount_of_orders: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'Customer'
    });
    return Customer;
}