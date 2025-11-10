const { StatusCodes } = require('http-status-codes');
const { Product, Order, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');

// Lấy danh sách sản phẩm theo id đơn hàng
const queryProductsByOrderId = async(orderId) => {
    try {
        const order = await Order.findByPk(orderId);
        if(!order){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại đơn hàng");
        }
        const productsDB = await Product.findAll({
            where: { order_id: orderId },
            include: [{ model: User, as: 'productsUser' }]
        });
        const products = productsDB.map((product) => {
            const newProduct = product.toJSON();
            return{
                id: newProduct.id,
                name: newProduct.name,
                description: newProduct.description,
                target: newProduct.target,
                proccess: newProduct.proccess,
                status: newProduct.status,
                manager: {
                    fullName: newProduct.productsUser.full_name,
                    role: newProduct.productsUser.role,
                    phone: newProduct.productsUser.phone
                },
                createdAt: newProduct.createdAt,
                updatedAt: newProduct.updatedAt
            }
        });
        return products;
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

module.exports = {
    queryProductsByOrderId
}