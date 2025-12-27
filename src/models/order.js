'use trict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models){
            Order.belongsTo(models.Customer, {
                foreignKey: 'customer_id',
                as: 'ordersCustomer'
            }),
            Order.hasMany(models.Product, {
                foreignKey: 'order_id',
                as: 'orderProducts'
            }),
            Order.hasMany(models.BOM, {
                foreignKey: 'order_id',
                as: 'orderBoms'
            }),
            Order.hasMany(models.DesignRequest, {
                foreignKey: 'order_id',
                as: 'orderDesignRequests'
            }),
            Order.hasMany(models.OrderInputFile, {
                foreignKey: 'order_id',
                as: 'orderInputFiles'
            }),
            Order.hasMany(models.OrderReferenceLink, {
                foreignKey: 'order_id',
                as: 'orderReferenceLinks'
            }),
            Order.hasOne(models.WorkOrder, {
                foreignKey: 'order_id',
                as: 'orderWorkOrder'
            }),
            Order.hasOne(models.OrderChangeLog, {
                foreignKey: 'order_id',
                as: 'orderChangeLog'
            }),
            Order.belongsTo(models.User, {
                foreignKey: 'created_by',
                as: 'orderCreatedBy'
            })
        }
    }

    Order.init({
        // Cột id: UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // Cột customer_id: UUID, khóa phụ của bảng Customers
        customer_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Cột code_order: mã đơn hàng, kiểu chuỗi, không null
        code_order: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột name: tên đơn hàng, kiểu chuỗi
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột date_of_receipt: ngày nhận đơn, kiểu date
        date_of_receipt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Cột date_of_payment: ngày trả đơn, kiểu date
        date_of_payment: {
            type: DataTypes.DATE,
            allowNull: false
        },
        // Cột proccess: tiến độ đơn hàng, kiểu chuỗi
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
        // Cột status: trạng thái đơn hàng, kiểu chuỗi
        status: {
            type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
            allowNull: false,
        },
        // Cột amount: số lượng đơn hàng, kiểu số
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Cột required_note: yêu cầu của đơn hàng, kiểu text
        required_note: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // Cột is_created_work: trạng thái của đơn hàng khi đã được tạo công việc
        is_created_work: {
            type: DataTypes.BOOLEAN,
            defaultValue: false // false là chưa tạo, true là đã tạo để phục vụ cho bên thợ mộc
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // Cột created_by: id của nhân viên sale
        created_by: {
            type: DataTypes.UUID,
            allowNull: true
        },
        is_evaluated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Order'
    });
    return Order;
}