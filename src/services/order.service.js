const { StatusCodes } = require('http-status-codes');
const { Order, Customer } = require('../models');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');

const createOrder = async(orderBody) => {
    try {
        const { customerId, codeOrder, name, dateOfReceipt, dateOfPayment, proccess, status, amount, requiredNote } = orderBody;
        await Order.create({
            customer_id: customerId,
            code_order: codeOrder,
            name,
            date_of_receipt: dateOfReceipt,
            date_of_payment: dateOfPayment,
            proccess,
            status,
            amount,
            required_note: requiredNote
        })
    } catch (error) {
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
                nameCustomer: newOrder.ordersCustomer.name,
                codeOrder: newOrder.code_order,
                dateOfReceipt: newOrder.date_of_receipt,
                dateOfPayment: newOrder.date_of_payment,
                proccess: newOrder.proccess,
                status: newOrder.status,
                amount: newOrder.amount,
                requiredNote: newOrder.required_note,
                createdAt: newOrder.createdAt,
                updatedAt: newOrder.updatedAt
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