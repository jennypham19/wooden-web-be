const { StatusCodes } = require('http-status-codes');
const { Order, Customer, Product, User, BOM, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');

const createOrder = async(orderBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { customerId, codeOrder, name, dateOfReceipt, dateOfPayment, proccess, status, amount, requiredNote, products } = orderBody;
        const order = await Order.create({
            customer_id: customerId,
            code_order: codeOrder,
            name,
            date_of_receipt: dateOfReceipt,
            date_of_payment: dateOfPayment,
            proccess,
            status,
            amount,
            required_note: requiredNote
        }, { transaction })
        for(const product of products) {
            await Product.create({
                name: product.name,
                description: product.description,
                target: product.target,
                order_id: order.id,
                manager_id: product.managerId,
                status: product.status,
                proccess: product.proccess
            }, { transaction })
        }
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi xảy ra: ' + error.message)
    }
}

const queryOrders = async(queryOptions) => {
    try {
        const { page, limit, searchTerm, status } = queryOptions;
        const offset = (page - 1) * limit;
        const whereClause = {};
        if(status && status !== 'all'){
            whereClause.status = status;
        }
        if(searchTerm){
            whereClause[Op.or] = [
                { code_order: { [Op.iLike]: `%${searchTerm}%` }},
                { name: { [Op.iLike]: `%${searchTerm}%` }},
            ]
        }
        const { count, rows: ordersDB } = await Order.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Customer,
                    as: 'ordersCustomer'
                },
                {
                    model: Product,
                    as: 'orderProducts',
                    include: [{ model: User, as: 'productsUser' }]
                }
            ],
            limit,
            offset,
            order: [[ 'createdAt', 'DESC']],
            distinct: true
        });
        const totalPages = Math.ceil(count/limit);
        const orders = ordersDB.map((order) => {
            const newOrder = order.toJSON();
            return {
                id: newOrder.id,
                name: newOrder.name,
                customer: {
                    id: newOrder.ordersCustomer.id,
                    name: newOrder.ordersCustomer.name
                },
                codeOrder: newOrder.code_order,
                dateOfReceipt: newOrder.date_of_receipt,
                dateOfPayment: newOrder.date_of_payment,
                proccess: newOrder.proccess,
                status: newOrder.status,
                amount: newOrder.amount,
                requiredNote: newOrder.required_note,
                createdAt: newOrder.createdAt,
                updatedAt: newOrder.updatedAt,
                products: (newOrder.orderProducts ?? [])
                    .filter((el) => el.order_id === newOrder.id)
                    .map((product) => {
                        return {
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            target: product.target,
                            process: product.proccess,
                            status: product.status,
                            manager: {
                                fullName: product.productsUser.full_name,
                                role: product.productsUser.role,
                                phone: product.productsUser.phone
                            }
                        }
                    })
                
            }
        })
        return{
            data: orders,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}
module.exports = {
    createOrder,
    queryOrders
}